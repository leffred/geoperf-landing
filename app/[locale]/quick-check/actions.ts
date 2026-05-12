"use server";

// S31 Session 1 — Server actions pour Quick LLM Check.
// quickCheck : POST { domain, category } → edge function quick_check_brand → result.
// captureEmail : INSERT saas_quick_check_leads + (optional) Apollo trigger.
// Pas de redirect : on retourne le JSON pour affichage in-place dans le client component.

import { headers } from "next/headers";
import { getServiceClient } from "@/lib/supabase";
import { readUtmFromCookie } from "@/lib/utm";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOMAIN_RE = /^[a-z0-9.-]+\.[a-z]{2,}$/i;

export interface QuickCheckLlmResult {
  llm: string;
  label: string;
  model: string;
  mentioned: boolean;
  context: string;
  sources: string[];
  cost_usd: number;
  latency_ms: number;
  error?: string;
}

export interface QuickCheckResult {
  ok: boolean;
  domain?: string;
  category?: string;
  results?: QuickCheckLlmResult[];
  mentioned_count?: number;
  total_llms?: number;
  total_cost_usd?: number;
  total_latency_ms?: number;
  error?: string;
  message?: string;
}

export async function quickCheck(formData: FormData): Promise<QuickCheckResult> {
  const rawDomain = String(formData.get("domain") ?? "").trim().toLowerCase();
  const domain = rawDomain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const category = String(formData.get("category") ?? "").trim();

  if (!domain || !DOMAIN_RE.test(domain)) {
    return { ok: false, error: "invalid_domain", message: "Domaine invalide. Exemple : amundi.com" };
  }
  if (!category || category.length < 2) {
    return { ok: false, error: "invalid_category", message: "Catégorie obligatoire" };
  }

  // Appel edge function avec service_role bearer (auth tolérante côté edge function).
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/quick_check_brand`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_KEY}`,
        // Forward le header IP pour rate limit côté backend
        "x-forwarded-for": (await headers()).get("x-forwarded-for") ?? "0.0.0.0",
      },
      body: JSON.stringify({ domain, category }),
    });

    if (resp.status === 429) {
      const data = await resp.json().catch(() => ({}));
      return {
        ok: false,
        error: "rate_limit_exceeded",
        message: data.message ?? "Limite de 5 checks gratuits sur 24h atteinte. Créez un compte pour 50 checks/mois.",
      };
    }
    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      return {
        ok: false,
        error: "edge_function_error",
        message: `Erreur serveur (${resp.status}). ${errText.slice(0, 100)}`,
      };
    }
    const data = await resp.json();
    return { ok: true, ...data };
  } catch (e) {
    return {
      ok: false,
      error: "fetch_failed",
      message: e instanceof Error ? e.message : "Erreur réseau",
    };
  }
}

export interface CaptureEmailResult {
  ok: boolean;
  error?: string;
  message?: string;
}

export async function captureEmail(formData: FormData): Promise<CaptureEmailResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const domain = String(formData.get("domain") ?? "").trim().toLowerCase();
  const category = String(formData.get("category") ?? "").trim();
  const optIn = formData.get("opt_in") === "on";

  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "invalid_email", message: "Email invalide" };
  }
  if (!optIn) {
    return { ok: false, error: "opt_in_required", message: "Vous devez accepter le traitement de vos données pour recevoir l'audit" };
  }
  if (!domain || !DOMAIN_RE.test(domain)) {
    return { ok: false, error: "invalid_domain", message: "Domaine manquant" };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  // S32 Ticket 4 — attribution paid : lit le cookie _geoperf_utm (30j first-touch)
  // posé par le middleware. Si nouveau lead → on stocke ; si re-soumission → on
  // garde le first-touch existant via `ignoreDuplicates` sur les colonnes UTM
  // (le upsert ci-dessous écrase tout sauf si on filtre).
  const utm = await readUtmFromCookie();

  const sb = getServiceClient();
  // Stratégie 2 étapes pour préserver le first-touch UTM :
  //   1. Cherche si email existe déjà
  //   2a. Si existe → UPDATE seulement des fields mutables (domain, category, ip)
  //   2b. Sinon   → INSERT avec acquisition_* (first-touch).
  const { data: existing } = await sb
    .from("saas_quick_check_leads")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  let error: Error | { message: string } | null = null;
  if (existing) {
    const { error: updErr } = await sb
      .from("saas_quick_check_leads")
      .update({
        domain,
        category_slug: category || null,
        ip_address: ip,
      })
      .eq("email", email);
    error = updErr;
  } else {
    const insertRow: Record<string, string | null> = {
      email,
      domain,
      category_slug: category || null,
      ip_address: ip,
    };
    if (utm) {
      insertRow.acquisition_source = utm.utm_source || null;
      insertRow.acquisition_medium = utm.utm_medium || null;
      insertRow.acquisition_campaign = utm.utm_campaign || null;
      insertRow.acquisition_content = utm.utm_content || null;
      insertRow.acquisition_term = utm.utm_term || null;
      insertRow.acquisition_first_touch_at = utm.first_touch_at;
    }
    const { error: insErr } = await sb.from("saas_quick_check_leads").insert(insertRow);
    error = insErr;
  }

  if (error) {
    return { ok: false, error: "db_insert_failed", message: error.message };
  }

  // Apollo trigger : fire-and-forget, swallows errors. À brancher plus tard.
  // const APOLLO_SEQUENCE_URL = process.env.APOLLO_QUICK_CHECK_SEQUENCE_WEBHOOK;
  // if (APOLLO_SEQUENCE_URL) { fireAndForget(APOLLO_SEQUENCE_URL, { email, domain, category }); }

  return { ok: true };
}
