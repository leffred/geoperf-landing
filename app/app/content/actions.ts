"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";
import { CONTENT_PLAN_LIMITS, type ContentTier } from "@/lib/content-plans";

const N8N_BASE = process.env.N8N_WEBHOOK_BASE || "https://fredericlefebvre.app.n8n.cloud/webhook";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export async function generateArticle(formData: FormData) {
  const subject = String(formData.get("subject") ?? "").trim();
  const language = String(formData.get("language") ?? "fr");

  if (!subject) redirect("/app/content/new?error=missing_subject");
  if (!["fr", "en"].includes(language)) redirect("/app/content/new?error=bad_language");

  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  // S35 — Quota check : lit le tier Content réel + compteur de période courante.
  // Free : quota total historique (5 articles, pas renouvelable). Paid : per-period counter
  // resetté par invoice.paid dans le webhook.
  const { data: contentSubRaw } = await sb
    .from("saas_content_subscriptions")
    .select("id, tier, articles_used_this_period")
    .eq("user_id", ctx.user.id)
    .eq("status", "active")
    .maybeSingle();
  const contentSub = contentSubRaw as { id: string; tier: ContentTier; articles_used_this_period: number } | null;

  const tier = (contentSub?.tier ?? "free") as ContentTier;
  const limits = CONTENT_PLAN_LIMITS[tier];

  let usedCount: number;
  if (tier === "free") {
    const { count } = await sb
      .from("geo_articles")
      .select("id", { count: "exact", head: true })
      .eq("client_id", ctx.user.id);
    usedCount = count ?? 0;
  } else {
    usedCount = contentSub?.articles_used_this_period ?? 0;
  }

  if (usedCount >= limits.articles_per_month) {
    redirect(`/app/content?error=quota&tier=${tier}`);
  }

  let ok = false;
  try {
    const resp = await fetch(`${N8N_BASE}/geo-content-generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: ctx.user.id, subject, language }),
      signal: AbortSignal.timeout(60_000),
    });
    if (!resp.ok) {
      console.error("[generateArticle] n8n HTTP", resp.status, (await resp.text()).slice(0, 300));
    } else {
      ok = true;
    }
  } catch (e) {
    console.error("[generateArticle] n8n unreachable:", e instanceof Error ? e.message : String(e));
  }

  if (!ok) redirect("/app/content/new?error=generation_failed");

  // Incrémente le compteur de période sur les tiers payants. Free : le quota se calcule
  // depuis COUNT(geo_articles), pas besoin d'incrémenter le compteur.
  if (contentSub && tier !== "free") {
    await sb
      .from("saas_content_subscriptions")
      .update({ articles_used_this_period: usedCount + 1 })
      .eq("id", contentSub.id);
  }

  revalidatePath("/app/content");
  redirect("/app/content?success=generated");
}

export type SaveArticleState = {
  ok: boolean;
  saved_at?: string;
  error?: string;
};

export async function saveArticle(
  _prev: SaveArticleState | undefined,
  formData: FormData,
): Promise<SaveArticleState> {
  const articleId = String(formData.get("article_id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const bodyHtml = String(formData.get("body_html") ?? "");

  if (!articleId) return { ok: false, error: "missing_article" };
  if (!title) return { ok: false, error: "missing_title" };
  if (!bodyHtml.trim()) return { ok: false, error: "empty_body" };

  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: existing } = await sb
    .from("geo_articles")
    .select("id, status")
    .eq("id", articleId)
    .eq("client_id", ctx.user.id)
    .maybeSingle();
  if (!existing) return { ok: false, error: "not_found" };

  const nowIso = new Date().toISOString();
  const { error: upErr } = await sb
    .from("geo_articles")
    .update({
      title: title.slice(0, 200),
      body_html: bodyHtml,
      updated_at: nowIso,
    })
    .eq("id", articleId)
    .eq("client_id", ctx.user.id);

  if (upErr) {
    console.error("[saveArticle] update failed:", upErr.message);
    return { ok: false, error: "save_failed" };
  }

  revalidatePath(`/app/content/${articleId}`);
  revalidatePath("/app/content");
  return { ok: true, saved_at: nowIso };
}

export async function publishArticle(formData: FormData) {
  const articleId = String(formData.get("article_id") ?? "").trim();
  if (!articleId) redirect("/app/content?error=missing_article");

  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: article } = await sb
    .from("geo_articles")
    .select("id, status")
    .eq("id", articleId)
    .eq("client_id", ctx.user.id)
    .maybeSingle();
  if (!article) redirect("/app/content?error=not_found");
  if ((article as { status?: string }).status === "published") {
    redirect("/app/content?error=already_published");
  }

  // 1ère config CMS active (WordPress / Shopify / Webflow). Dispatch via cms_type
  // sur l'Edge Function correspondante. S35 : ajouter Wix.
  const { data: cms } = await sb
    .from("client_cms_config")
    .select("id, cms_type")
    .eq("client_id", ctx.user.id)
    .eq("is_active", true)
    .in("cms_type", ["wordpress", "shopify", "webflow"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!cms) redirect("/app/content?error=no_cms");

  const cmsType = (cms as { cms_type: string }).cms_type;
  const fnName =
    cmsType === "shopify" ? "saas_publish_to_shopify" :
    cmsType === "webflow" ? "saas_publish_to_webflow" :
    "saas_publish_to_wordpress";

  const ssr = await getSupabaseServerClient();
  const { data: { session } } = await ssr.auth.getSession();
  if (!session) redirect("/app/content?error=auth");

  let ok = false;
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/${fnName}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        article_id: articleId,
        cms_config_id: (cms as { id: string }).id,
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (resp.ok) {
      ok = true;
    } else {
      console.error("[publishArticle] Edge fn HTTP", resp.status, (await resp.text()).slice(0, 400));
    }
  } catch (e) {
    console.error("[publishArticle] Edge fn unreachable:", e instanceof Error ? e.message : String(e));
  }

  if (!ok) redirect("/app/content?error=publish_failed");

  revalidatePath("/app/content");
  redirect("/app/content?success=published");
}
