"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loadSaasContext, tierLimits } from "@/lib/saas-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function normalizeDomain(input: string): string {
  return input.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

function slugify(input: string): string {
  return input.trim().toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createBrand(formData: FormData) {
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const name = String(formData.get("name") || "").trim();
  const domainRaw = String(formData.get("domain") || "").trim();
  const categoryRaw = String(formData.get("category") || "").trim();
  const brandDescriptionRaw = String(formData.get("brand_description") || "").trim();
  const competitorsRaw = String(formData.get("competitors") || "").trim();

  if (!name) redirect("/app/brands/new?error=missing_name");
  const domain = normalizeDomain(domainRaw);
  if (!domain || !domain.includes(".")) redirect("/app/brands/new?error=bad_domain");
  if (!categoryRaw) redirect("/app/brands/new?error=missing_category");

  // S16.1 fix #1.2 : si le <select> est disabled côté UI (plan Free), HTML ne
  // soumet PAS la valeur dans le FormData — `formData.get("cadence")` retourne null.
  // On fallback alors sur le default du tier (limits.cadence) au lieu de "weekly"
  // hardcodé, ce qui causait un redirect cadence_locked en boucle pour Free.
  const limits = tierLimits(ctx.tier);
  const cadenceRaw = formData.get("cadence");
  const cadence: "weekly" | "monthly" = cadenceRaw === "monthly" ? "monthly"
    : cadenceRaw === "weekly" ? "weekly"
    : limits.cadence;

  if (limits.cadence === "monthly" && cadence === "weekly") {
    redirect("/app/brands/new?error=cadence_locked");
  }

  const { count } = await sb
    .from("saas_tracked_brands")
    .select("id", { count: "exact", head: true })
    .eq("user_id", ctx.user.id);
  if ((count ?? 0) >= limits.brands) {
    redirect("/app/brands/new?error=limit_reached");
  }

  const competitor_domains = competitorsRaw
    .split(/[\s,]+/)
    .map(normalizeDomain)
    .filter(d => d.length > 0 && d.includes("."))
    .slice(0, 10);

  const category_slug = slugify(categoryRaw);

  const { data, error } = await sb
    .from("saas_tracked_brands")
    .insert({
      user_id: ctx.user.id,
      name,
      domain,
      category_slug,
      brand_description: brandDescriptionRaw || null,
      competitor_domains,
      cadence,
      is_active: true,
    })
    .select("id")
    .single();

  if (error) {
    if (error.message.toLowerCase().includes("duplicate")) {
      redirect("/app/brands/new?error=duplicate");
    }
    redirect(`/app/brands/new?error=unknown`);
  }

  // Si l'user a coché des prompts suggérés (PromptSuggestionPicker), on les
  // ajoute au topic par défaut (créé automatiquement par trigger DB).
  // Format DB : saas_topics.prompts JSONB array de {id, category, uses_brand, template}.
  const suggestedJson = String(formData.get("suggested_prompts_json") || "").trim();
  if (suggestedJson && suggestedJson !== "[]") {
    try {
      const suggestions = JSON.parse(suggestedJson) as Array<{ category: string; template: string }>;
      if (Array.isArray(suggestions) && suggestions.length > 0) {
        const promptsToInsert = suggestions
          .filter(s => s && typeof s.template === "string" && s.template.trim().length > 0)
          .slice(0, 5)
          .map((s, idx) => ({
            id: `suggested_${Date.now()}_${idx}`,
            category: s.category || "direct_search",
            uses_brand: false,
            template: s.template,
          }));

        if (promptsToInsert.length > 0) {
          // Attendre brièvement que le trigger crée le default topic, puis update
          // (le trigger handle_brand_default_topic est synchrone à l'insert brand).
          const { data: defaultTopic } = await sb
            .from("saas_topics")
            .select("id, prompts")
            .eq("brand_id", data!.id)
            .eq("is_default", true)
            .maybeSingle();

          if (defaultTopic) {
            const existing = Array.isArray((defaultTopic as any).prompts) ? (defaultTopic as any).prompts : [];
            const merged = [...existing, ...promptsToInsert];
            await sb.from("saas_topics").update({ prompts: merged }).eq("id", (defaultTopic as any).id);
          }
        }
      }
    } catch (e) {
      // Silencieux : si parse fail, on ne bloque pas la création de la marque.
      console.warn("[createBrand] suggested_prompts_json parse fail:", e);
    }
  }

  // S16.2 fix #1.8 : déclencher automatiquement le 1er snapshot.
  // L'UI onboarding promet "le 1er snapshot tournera dès la création" mais
  // ce n'était pas le cas — l'user devait cliquer manuellement.
  // Pattern : on dispatche l'Edge Function avec un timeout de 2.5s pour garantir
  // que le HTTP request part bien du serveur Vercel avant que le container
  // soit GC'd au redirect, sans attendre la complétion (~30-60s).
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/saas_run_brand_snapshot`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ brand_id: data!.id, mode: "auto-onboarding" }),
        signal: controller.signal,
      });
    } catch (e) {
      // Timeout ou erreur réseau attendu — l'Edge Function continue en background.
      const msg = e instanceof Error ? e.message : String(e);
      if (!msg.includes("aborted")) {
        console.warn("[createBrand] auto-snapshot dispatch warning:", msg);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (e) {
    console.warn("[createBrand] auto-snapshot setup failed:", e);
  }

  revalidatePath("/app/dashboard");
  revalidatePath("/app/brands");
  redirect(`/app/brands/${data!.id}?refreshed=1`);
}
