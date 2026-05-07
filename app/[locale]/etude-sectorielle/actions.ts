"use server";

// S19 §4.1.b — Server action requestStudy.
// Pipeline :
//   1. Validation email + sous_categorie_slug
//   2. Anti-abus : 1 sous-cat differente / 30j par email (la meme rapport reste OK)
//   3. Lookup report par slug_public (status=ready, recent)
//   4a. Cas A : report dispo → insert tracking + dispatch email + CRM hook → /sent
//   4b. Cas B : report pas dispo → insert tracking pending=true + trigger Phase 1 → /pending
// Aucun envoi outbound bypassed garde-fou Sequence A : c'est un opt-in de l'utilisateur.

import { headers } from "next/headers";
import { getServiceClient } from "@/lib/supabase";
// S28 : redirect locale-aware (preserve la locale URL active du form)
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

async function getLocaleFromHeaders(): Promise<Locale> {
  const h = await headers();
  // x-locale set par le middleware next-intl, fallback sur referer parsing
  const fromHeader = h.get("x-next-intl-locale");
  if (fromHeader && routing.locales.includes(fromHeader as Locale)) {
    return fromHeader as Locale;
  }
  const referer = h.get("referer") || "";
  for (const loc of routing.locales) {
    if (referer.includes(`/${loc}/`) || referer.endsWith(`/${loc}`)) return loc;
  }
  return routing.defaultLocale;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const PHASE1_WEBHOOK_URL =
  process.env.N8N_PHASE1_WEBHOOK_URL ||
  "https://fredericlefebvre.app.n8n.cloud/webhook/geoperf-extract";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function requestStudy(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const sousCategorySlug = String(formData.get("sous_categorie_slug") || "").trim().toLowerCase();
  const sourcePath = String(formData.get("source_path") || "/etude-sectorielle");

  const locale = await getLocaleFromHeaders();

  // 1. Validation
  if (!email || !EMAIL_RE.test(email)) {
    redirect({ href: "/etude-sectorielle?error=email_invalid", locale });
  }
  if (!sousCategorySlug) {
    redirect({ href: "/etude-sectorielle?error=missing_sous_cat", locale });
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const ua = h.get("user-agent") || null;

  const sb = getServiceClient();

  // 2. Anti-abus : 30 jours rolling
  const oneMonthAgoIso = new Date(Date.now() - 30 * 86400_000).toISOString();
  const { data: recentDownloads } = await sb
    .from("lead_magnet_downloads")
    .select("id, sous_categorie_slug, downloaded_at, report_id")
    .eq("email", email)
    .gte("downloaded_at", oneMonthAgoIso);

  const sameRapport = (recentDownloads ?? []).find(
    (d) => d.sous_categorie_slug === sousCategorySlug
  );
  const otherRapport = (recentDownloads ?? []).some(
    (d) => d.sous_categorie_slug !== sousCategorySlug
  );

  if (otherRapport && !sameRapport) {
    redirect({ href: "/etude-sectorielle/limit-reached", locale });
  }

  // 3. Lookup report par slug_public
  const { data: report } = await sb
    .from("reports")
    .select("id, sous_categorie, slug_public, status, pdf_url")
    .eq("slug_public", sousCategorySlug)
    .eq("status", "ready")
    .not("pdf_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // 4a. Cas A : report dispo
  if (report?.pdf_url) {
    await sb.from("lead_magnet_downloads").insert({
      email,
      ip,
      user_agent: ua,
      sous_categorie_slug: sousCategorySlug,
      report_id: report.id,
      pdf_url_at_request: report.pdf_url,
      pending: false,
      source_path: sourcePath,
      metadata: { same_rapport_re_request: !!sameRapport },
    });

    // Dispatch fire-and-forget : email PDF + CRM hook (parallèle, errors swallowed)
    fireAndForget(`${SUPABASE_URL}/functions/v1/saas_send_lead_magnet_email`, {
      email,
      report_id: report.id,
    });
    fireAndForget(`${SUPABASE_URL}/functions/v1/saas_lead_magnet_crm_hook`, {
      email,
      sous_categorie_slug: sousCategorySlug,
      report_id: report.id,
      ip,
      user_agent: ua,
      source_path: sourcePath,
    });

    redirect({
      href: `/etude-sectorielle/sent?email=${encodeURIComponent(email)}&sous_cat=${encodeURIComponent(report.sous_categorie)}`,
      locale,
    });
  }

  // 4b. Cas B : report pas dispo → trigger Phase 1
  await sb.from("lead_magnet_downloads").insert({
    email,
    ip,
    user_agent: ua,
    sous_categorie_slug: sousCategorySlug,
    report_id: null,
    pending: true,
    source_path: sourcePath,
  });

  // CRM hook quand même (capture l'intent)
  fireAndForget(`${SUPABASE_URL}/functions/v1/saas_lead_magnet_crm_hook`, {
    email,
    sous_categorie_slug: sousCategorySlug,
    report_id: null,
    ip,
    user_agent: ua,
    source_path: sourcePath,
  });

  // Trigger Phase 1 n8n workflow (fire & forget — le report sera notifié quand prêt)
  fetch(PHASE1_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sous_categorie: sousCategorySlug,
      category_slug: sousCategorySlug,
      top_n: 30,
      year: 2026,
      owner_email: email,
      source: "lead_magnet",
    }),
  }).catch((e) => console.warn("[lead_magnet] Phase 1 trigger failed:", e));

  redirect({
    href: `/etude-sectorielle/pending?email=${encodeURIComponent(email)}&sous_cat=${encodeURIComponent(sousCategorySlug)}`,
    locale,
  });
}

function fireAndForget(url: string, body: Record<string, unknown>) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify(body),
  }).catch((e) => console.warn(`[lead_magnet] dispatch ${url}:`, e));
}
