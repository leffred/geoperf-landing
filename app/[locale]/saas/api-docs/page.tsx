// /saas/api-docs — Documentation API REST. S28 i18n :
// Hero/sections/labels traduits. ENDPOINTS et code samples restent en const FR
// (technique pour developers — l'audience est anglophone-friendly par défaut).

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "apiDocs" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === "fr" ? "https://geoperf.com/saas/api-docs" : `https://geoperf.com/${locale}/saas/api-docs`,
      languages: {
        fr: "https://geoperf.com/saas/api-docs",
        en: "https://geoperf.com/en/saas/api-docs",
        "x-default": "https://geoperf.com/saas/api-docs",
      },
    },
  };
}

const BASE = "https://qfdvdcvqknoqfxetttch.supabase.co/functions/v1/saas_api_v1_router";

const ENDPOINTS = [
  {
    method: "GET",
    path: "/v1/brands",
    desc: "Liste toutes les marques accessibles à la clé.",
    scope: "read",
    example_resp: `{
  "ok": true,
  "data": [
    {
      "id": "e6497bcb-cfa1-4958-8f9f-4907c05a1d54",
      "name": "AXA Investment Managers",
      "domain": "axa.fr",
      "category_slug": "asset-management",
      "cadence": "weekly",
      "is_active": true,
      "brand_keywords": ["ESG","institutionnels"],
      "brand_value_props": [...]
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/v1/brands/:id",
    desc: "Détail d'une marque + dernier snapshot completed (résumé scores).",
    scope: "read",
    example_resp: `{
  "ok": true,
  "data": {
    "brand": { "id": "...", "name": "...", "competitor_domains": [...] },
    "latest_snapshot": {
      "id": "...",
      "visibility_score": 25,
      "avg_rank": 3.86,
      "citation_rate": 30,
      "share_of_voice": 15,
      "avg_sentiment_score": 0.31,
      "alignment_score": 64.3
    }
  }
}`,
  },
  { method: "GET", path: "/v1/brands/:id/snapshots", desc: "Liste les snapshots récents (limit 50, paramètre `?limit=N` 1-100).", scope: "read" },
  { method: "GET", path: "/v1/brands/:id/snapshots/:sid", desc: "Détail d'un snapshot avec toutes les responses (LLM, prompt, mention, sentiment, sources).", scope: "read" },
  { method: "GET", path: "/v1/brands/:id/recommendations", desc: "Liste les 50 dernières recommandations Haiku pour cette marque.", scope: "read" },
  { method: "GET", path: "/v1/brands/:id/alerts", desc: "Liste les 100 dernières alertes (rank_drop, citation_loss, etc).", scope: "read" },
  { method: "POST", path: "/v1/brands/:id/snapshots", desc: "Déclenche un nouveau snapshot. Retourne 202 + snapshot_id à poller.", scope: "write", body: `{ "topic_id": "uuid-optional" }` },
];

type Props = { params: Promise<{ locale: string }> };

export default async function ApiDocsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("apiDocs");
  const tHeader = await getTranslations("header");

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header
        logo="monitoring"
        rightSlot={
          <div className="flex items-center gap-4 text-sm">
            <Link href="/saas" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">
              Geoperf SaaS
            </Link>
            <Link href="/login" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">
              {tHeader("login")}
            </Link>
          </div>
        }
      />

      <Section py="lg" tone="white">
        <div className="max-w-4xl">
          <Eyebrow className="mb-3">{t("heroEyebrow")}</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4 leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-sm text-ink-muted mb-2 max-w-2xl leading-relaxed">
            {t("heroSubtitleP1Before")}{" "}
            <strong className="text-ink">{t("heroSubtitleP1Strong")}</strong>
          </p>
          <p className="text-sm text-ink-muted max-w-2xl leading-relaxed">
            {t("heroSubtitleP2Before")}{" "}
            <code className="font-mono bg-surface px-1.5 py-0.5 rounded">/app/api-keys</code>{" "}
            {t("heroSubtitleP2Mid")}{" "}
            <code className="font-mono bg-surface px-1.5 py-0.5 rounded">gp_live_xxxxxxxxxxxxxxxxxxxxxxxx</code>{" "}
            {t("heroSubtitleP2After")}
          </p>
        </div>
      </Section>

      <Section py="md" tone="surface">
        <div className="max-w-4xl">
          <Eyebrow className="mb-3">{t("authEyebrow")}</Eyebrow>
          <p className="text-sm text-ink mb-3">{t("authHeader")}</p>
          <pre className="bg-white border border-DEFAULT rounded-lg p-4 font-mono text-xs overflow-x-auto text-ink">
            {`Authorization: Bearer gp_live_xxxxxxxxxxxxxxxxxxxxxxxx`}
          </pre>
          <p className="text-xs text-ink-muted mt-3">{t("authNote")}</p>

          <Eyebrow className="mt-8 mb-3">{t("rateLimitEyebrow")}</Eyebrow>
          <p className="text-sm text-ink">
            {t("rateLimitBody1")}{" "}
            <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-DEFAULT">429</code>{" "}
            {t("rateLimitBody2")}{" "}
            <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-DEFAULT">Retry-After: 60</code>{" "}
            {t("rateLimitBody3")}
          </p>
          <p className="text-xs text-ink-muted mt-2">
            {t("rateLimitHeaders")}{" "}
            <code className="font-mono">X-RateLimit-Limit</code>,{" "}
            <code className="font-mono">X-RateLimit-Remaining</code>,{" "}
            <code className="font-mono">X-Geoperf-Tier</code>,{" "}
            <code className="font-mono">X-Geoperf-Duration-Ms</code>.
          </p>

          <Eyebrow className="mt-8 mb-3">{t("baseUrlEyebrow")}</Eyebrow>
          <pre className="bg-white border border-DEFAULT rounded-lg p-4 font-mono text-xs overflow-x-auto text-ink">{BASE}</pre>
        </div>
      </Section>

      <Section py="md" tone="white">
        <div className="max-w-4xl">
          <Eyebrow className="mb-3">{t("quickstartEyebrow")}</Eyebrow>
          <pre className="bg-surface border border-DEFAULT rounded-lg p-4 font-mono text-xs overflow-x-auto text-ink">{`# Liste des marques accessibles
curl -H "Authorization: Bearer gp_live_xxx" \\
  ${BASE}/v1/brands

# Détail d'un snapshot
curl -H "Authorization: Bearer gp_live_xxx" \\
  ${BASE}/v1/brands/<brand-uuid>/snapshots/<snap-uuid>

# Déclencher un nouveau snapshot (scope=write requis)
curl -X POST -H "Authorization: Bearer gp_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{}' \\
  ${BASE}/v1/brands/<brand-uuid>/snapshots`}</pre>
        </div>
      </Section>

      <Section py="md" tone="surface">
        <div className="max-w-4xl">
          <Eyebrow className="mb-4">{t("endpointsEyebrow")}</Eyebrow>
          <div className="space-y-4">
            {ENDPOINTS.map((e, i) => (
              <article key={i} className="bg-white rounded-lg border border-DEFAULT shadow-card p-5">
                <div className="flex items-baseline gap-3 mb-3 flex-wrap">
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-md uppercase tracking-eyebrow ${
                      e.method === "POST" ? "bg-brand-500 text-white" : "bg-ink text-white"
                    }`}
                  >
                    {e.method}
                  </span>
                  <code className="font-mono text-sm text-ink">{e.path}</code>
                  <span className="font-mono text-[10px] text-ink-subtle">scope: {e.scope}</span>
                </div>
                <p className="text-sm text-ink-muted mb-3 leading-relaxed">{e.desc}</p>
                {e.body && (
                  <>
                    <p className="text-[10px] font-mono uppercase tracking-eyebrow text-ink-subtle mb-1">{t("endpointDescBody")}</p>
                    <pre className="bg-surface border border-DEFAULT rounded-md p-3 font-mono text-xs mb-3 overflow-x-auto text-ink">
                      {e.body}
                    </pre>
                  </>
                )}
                {e.example_resp && (
                  <>
                    <p className="text-[10px] font-mono uppercase tracking-eyebrow text-ink-subtle mb-1">{t("endpointExampleResp")}</p>
                    <pre className="bg-surface border border-DEFAULT rounded-md p-3 font-mono text-xs overflow-x-auto text-ink">
                      {e.example_resp}
                    </pre>
                  </>
                )}
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section py="md" tone="white">
        <div className="max-w-4xl">
          <Eyebrow className="mb-3">{t("responseFormatEyebrow")}</Eyebrow>
          <p className="text-sm text-ink mb-3">{t("responseFormatBody")}</p>
          <pre className="bg-surface border border-DEFAULT rounded-lg p-4 font-mono text-xs overflow-x-auto text-ink">{`{
  "ok": true | false,
  "data": <result>,        // si ok=true
  "error": "<message>",    // si ok=false
  "hint": "<help text>"    // si applicable
}`}</pre>
          <p className="text-xs text-ink-muted mt-3">
            {t("responseHttpCodes")}{" "}
            <code className="font-mono">200</code> · <code className="font-mono">202</code> ·{" "}
            <code className="font-mono">401</code> · <code className="font-mono">403</code> ·{" "}
            <code className="font-mono">404</code> · <code className="font-mono">429</code> ·{" "}
            <code className="font-mono">500</code>.
          </p>
        </div>
      </Section>

      <Section py="lg" tone="dark">
        <div className="max-w-2xl">
          <Eyebrow variant="muted" className="mb-3 text-amber">{t("ctaFinalEyebrow")}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-4 leading-tight">
            {t("ctaFinalTitle")}
          </h2>
          <p className="text-sm text-white/85 mb-6 leading-relaxed">{t("ctaFinalSubtitle")}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/signup?next=/app/billing" variant="primary" size="lg">{t("ctaFinalPrimary")}</Button>
            <Button href="/saas" variant="outline-light" size="lg">{t("ctaFinalSecondary")}</Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
