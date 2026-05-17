"use server";

import { revalidatePath } from "next/cache";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export type RescanState = {
  ok: boolean;
  appeared_count?: number;
  results_count?: number;
  error?: string;
};

export async function rescanLlmVisibility(
  _prev: RescanState | undefined,
  formData: FormData,
): Promise<RescanState> {
  const articleId = String(formData.get("article_id") ?? "").trim();
  if (!articleId) return { ok: false, error: "missing_article" };

  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  // Vérifier ownership
  const { data: article } = await sb
    .from("geo_articles")
    .select("id, status, cms_url")
    .eq("id", articleId)
    .eq("client_id", ctx.user.id)
    .maybeSingle();
  if (!article) return { ok: false, error: "not_found" };
  if (!(article as any).cms_url) return { ok: false, error: "not_published" };

  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/saas_check_article_llm_visibility`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "apikey": ANON_KEY,
      },
      body: JSON.stringify({ article_id: articleId, client_id: ctx.user.id }),
      signal: AbortSignal.timeout(60_000),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error("[rescanLlmVisibility] Edge Function error:", detail.slice(0, 300));
      return { ok: false, error: "scan_failed" };
    }

    const json = await resp.json() as { appeared_count?: number; results_count?: number };
    revalidatePath(`/app/content/${articleId}`);
    return {
      ok: true,
      appeared_count: json.appeared_count ?? 0,
      results_count: json.results_count ?? 0,
    };
  } catch (e) {
    console.error("[rescanLlmVisibility] error:", e instanceof Error ? e.message : String(e));
    return { ok: false, error: "scan_failed" };
  }
}
