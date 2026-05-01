import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "API Geoperf — Documentation",
  description: "Référence REST de l'API Geoperf v1 (plan Agency). Endpoints brands, snapshots, recommendations, alerts.",
  alternates: { canonical: "https://geoperf.com/saas/api-docs" },
};

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
  {
    method: "GET",
    path: "/v1/brands/:id/snapshots",
    desc: "Liste les snapshots récents (limit 50, paramètre `?limit=N` 1-100).",
    scope: "read",
  },
  {
    method: "GET",
    path: "/v1/brands/:id/snapshots/:sid",
    desc: "Détail d'un snapshot avec toutes les responses (LLM, prompt, mention, sentiment, sources).",
    scope: "read",
  },
  {
    method: "GET",
    path: "/v1/brands/:id/recommendations",
    desc: "Liste les 50 dernières recommandations Haiku pour cette marque.",
    scope: "read",
  },
  {
    method: "GET",
    path: "/v1/brands/:id/alerts",
    desc: "Liste les 100 dernières alertes (rank_drop, citation_loss, etc).",
    scope: "read",
  },
  {
    method: "POST",
    path: "/v1/brands/:id/snapshots",
    desc: "Déclenche un nouveau snapshot. Retourne 202 + snapshot_id à poller.",
    scope: "write",
    body: `{ "topic_id": "uuid-optional" }`,
  },
];

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header
        rightSlot={
          <div className="flex items-center gap-4 text-sm">
            <Link href="/saas" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">
              Geoperf SaaS
            </Link>
            <Link href="/login" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">
              Connexion
            </Link>
          </div>
        }
      />

      <Section py="lg" tone="white">
        <div className="max-w-4xl">
          <Eyebrow className="mb-3">API · v1</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4 leading-tight">
            Documentation API REST
          </h1>
          <p className="text-sm text-ink-muted mb-2 max-w-2xl leading-relaxed">
            API REST publique pour intégrer Geoperf à ton stack interne (Looker, Tableau, scripts ETL, etc).
            <strong className="text-ink"> Réservée au plan Agency.</strong>
          </p>
          <p className="text-sm text-ink-muted max-w-2xl leading-relaxed">
            Génère ta clé API depuis <code className="font-mono bg-surface px-1.5 py-0.5 rounded">/app/api-keys</code>{" "}
            (visible uniquement si Agency). Format :{" "}
            <code className="font-mono bg-surface px-1.5 py-0.5 rounded">gp_live_xxxxxxxxxxxxxxxxxxxxxxxx</code> (24 hex).
          </p>
        </div>
      </Section>

      <Section py="md" tone="surface">
        <div className="max-w-4xl">
          <Eyebrow className="mb-3">Authentication</Eyebrow>
          <p className="text-sm text-ink mb-3">Header obligatoire :</p>
          <pre className="bg-white border border-DEFAULT rounded-lg p-4 font-mono text-xs overflow-x-auto text-ink">
            {`Authorization: Bearer gp_live_xxxxxxxxxxxxxxxxxxxxxxxx`}
          </pre>
          <p className="text-xs text-ink-muted mt-3">
            La clé est hashée SHA-256 en DB. Elle n&apos;est affichée qu&apos;une seule fois lors de la création — stocke-la dans un secret manager. Révoque via /app/api-keys.
          </p>

          <Eyebrow className="mt-8 mb-3">Rate limit</Eyebrow>
          <p className="text-sm text-ink">
            60 requêtes / minute / clé. Réponse <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-DEFAULT">429</code>{" "}
            avec header <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-DEFAULT">Retry-After: 60</code> au-delà.
          </p>
          <p className="text-xs text-ink-muted mt-2">
            Headers de réponse : <code className="font-mono">X-RateLimit-Limit</code>, <code className="font-mono">X-RateLimit-Remaining</code>, <code className="font-mono">X-Geoperf-Tier</code>, <code className="font-mono">X-Geoperf-Duration-Ms</code>.
          </p>

          <Eyebrow className="mt-8 mb-3">Base URL</Eyebrow>
          <pre className="bg-white border border-DEFAULT rounded-lg p-4 font-mono text-xs overflow-x-auto text-ink">{BASE}</pre>
        </div>
      </Section>

      <Section py="md" tone="white">
        <div className="max-w-4xl">
          <Eyebrow className="mb-3">Quickstart curl</Eyebrow>
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
          <Eyebrow className="mb-4">Endpoints</Eyebrow>
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
                    <p className="text-[10px] font-mono uppercase tracking-eyebrow text-ink-subtle mb-1">Body JSON</p>
                    <pre className="bg-surface border border-DEFAULT rounded-md p-3 font-mono text-xs mb-3 overflow-x-auto text-ink">
                      {e.body}
                    </pre>
                  </>
                )}
                {e.example_resp && (
                  <>
                    <p className="text-[10px] font-mono uppercase tracking-eyebrow text-ink-subtle mb-1">Exemple de réponse</p>
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
          <Eyebrow className="mb-3">Format de réponse</Eyebrow>
          <p className="text-sm text-ink mb-3">Toutes les réponses suivent ce format :</p>
          <pre className="bg-surface border border-DEFAULT rounded-lg p-4 font-mono text-xs overflow-x-auto text-ink">{`{
  "ok": true | false,
  "data": <result>,        // si ok=true
  "error": "<message>",    // si ok=false
  "hint": "<help text>"    // si applicable
}`}</pre>
          <p className="text-xs text-ink-muted mt-3">
            Codes HTTP : <code className="font-mono">200</code> succès, <code className="font-mono">202</code> snapshot triggered,{" "}
            <code className="font-mono">401</code> auth, <code className="font-mono">403</code> tier ou scope,{" "}
            <code className="font-mono">404</code> not found, <code className="font-mono">429</code> rate limit,{" "}
            <code className="font-mono">500</code> server.
          </p>
        </div>
      </Section>

      <Section py="lg" tone="dark">
        <div className="max-w-2xl">
          <Eyebrow variant="muted" className="mb-3 text-amber">Prêt à intégrer ?</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-4 leading-tight">
            Active ton plan Agency pour ouvrir l&apos;API.
          </h2>
          <p className="text-sm text-white/85 mb-6 leading-relaxed">
            L&apos;API REST est une feature exclusive Agency (799€/mois HT). Inclut aussi : 10 marques, 7 LLMs, white-label, support prioritaire.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/signup?next=/app/billing" variant="primary" size="lg">Créer un compte</Button>
            <Button href="/saas" variant="outline-light" size="lg">Voir les plans</Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
