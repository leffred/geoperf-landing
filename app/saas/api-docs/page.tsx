import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";

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
    <main className="min-h-screen flex flex-col bg-cream">
      <Header
        rightSlot={
          <div className="flex items-center gap-4 text-sm">
            <Link href="/saas" className="hover:underline text-navy">Geoperf SaaS</Link>
            <Link href="/login" className="hover:underline text-navy">Connexion</Link>
          </div>
        }
      />

      <Section py="lg" tone="cream">
        <div className="max-w-4xl">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">API · v1</p>
          <h1 className="font-serif text-4xl text-navy mb-3">Documentation API REST</h1>
          <p className="text-sm text-ink-muted mb-2 max-w-2xl">
            API REST publique pour intégrer Geoperf à ton stack interne (Looker, Tableau, scripts ETL, etc).
            <strong> Réservée au plan Agency.</strong>
          </p>
          <p className="text-sm text-ink-muted max-w-2xl">
            Génère ta clé API depuis <code className="font-mono">/app/api-keys</code> (visible uniquement si Agency). Format : <code className="font-mono">gp_live_xxxxxxxxxxxxxxxxxxxxxxxx</code> (24 hex).
          </p>
        </div>
      </Section>

      <Section py="md" tone="white">
        <div className="max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Authentication</p>
          <p className="text-sm mb-3">
            Header obligatoire :
          </p>
          <pre className="bg-cream p-4 font-mono text-xs overflow-x-auto">{`Authorization: Bearer gp_live_xxxxxxxxxxxxxxxxxxxxxxxx`}</pre>
          <p className="text-xs text-ink-muted mt-3">
            La clé est hashée SHA-256 en DB. Elle n&apos;est affichée qu&apos;une seule fois lors de la création — stocke-la dans un secret manager. Révoque via /app/api-keys.
          </p>

          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mt-8 mb-3">Rate limit</p>
          <p className="text-sm">60 requêtes / minute / clé. Réponse <code className="font-mono">429</code> avec header <code className="font-mono">Retry-After: 60</code> au-delà.</p>
          <p className="text-xs text-ink-muted mt-2">Headers de réponse : <code className="font-mono">X-RateLimit-Limit</code>, <code className="font-mono">X-RateLimit-Remaining</code>, <code className="font-mono">X-Geoperf-Tier</code>, <code className="font-mono">X-Geoperf-Duration-Ms</code>.</p>

          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mt-8 mb-3">Base URL</p>
          <pre className="bg-cream p-4 font-mono text-xs overflow-x-auto">{BASE}</pre>
        </div>
      </Section>

      <Section py="md" tone="cream">
        <div className="max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Quickstart curl</p>
          <pre className="bg-white p-4 font-mono text-xs overflow-x-auto">{`# Liste des marques accessibles
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

      <Section py="md" tone="white">
        <div className="max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-4">Endpoints</p>
          <div className="space-y-4">
            {ENDPOINTS.map((e, i) => (
              <article key={i} className="border border-navy/10 p-5">
                <div className="flex items-baseline gap-3 mb-3 flex-wrap">
                  <span className={`font-mono text-[10px] px-2 py-0.5 uppercase tracking-widest ${
                    e.method === "POST" ? "bg-amber text-navy" : "bg-navy text-white"
                  }`}>{e.method}</span>
                  <code className="font-mono text-sm text-navy">{e.path}</code>
                  <span className="font-mono text-[10px] text-ink-muted">scope: {e.scope}</span>
                </div>
                <p className="text-sm text-ink mb-3">{e.desc}</p>
                {e.body && (
                  <>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mb-1">Body JSON</p>
                    <pre className="bg-cream p-3 font-mono text-xs mb-3 overflow-x-auto">{e.body}</pre>
                  </>
                )}
                {e.example_resp && (
                  <>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mb-1">Exemple de réponse</p>
                    <pre className="bg-cream p-3 font-mono text-xs overflow-x-auto">{e.example_resp}</pre>
                  </>
                )}
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section py="md" tone="cream">
        <div className="max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Format de réponse</p>
          <p className="text-sm mb-3">Toutes les réponses suivent ce format :</p>
          <pre className="bg-white p-4 font-mono text-xs overflow-x-auto">{`{
  "ok": true | false,
  "data": <result>,        // si ok=true
  "error": "<message>",    // si ok=false
  "hint": "<help text>"    // si applicable
}`}</pre>
          <p className="text-xs text-ink-muted mt-3">
            Codes HTTP : <code className="font-mono">200</code> succès, <code className="font-mono">202</code> snapshot triggered, <code className="font-mono">401</code> auth, <code className="font-mono">403</code> tier ou scope, <code className="font-mono">404</code> not found, <code className="font-mono">429</code> rate limit, <code className="font-mono">500</code> server.
          </p>
        </div>
      </Section>

      <Section py="lg" tone="navy">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-widest text-amber uppercase mb-3">Prêt à intégrer ?</p>
          <h2 className="font-serif text-3xl text-white mb-4">Active ton plan Agency pour ouvrir l&apos;API.</h2>
          <p className="text-sm text-white/85 mb-6">
            L&apos;API REST est une feature exclusive Agency (799€/mois HT). Inclut aussi : 10 marques, 7 LLMs, white-label, support prioritaire.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup?next=/app/billing" className="bg-amber text-navy px-5 py-2.5 text-sm font-medium hover:bg-amber/90 transition">
              Créer un compte
            </Link>
            <Link href="/saas" className="border border-white/40 text-white px-5 py-2.5 text-sm font-medium hover:bg-white/10 transition">
              Voir les plans
            </Link>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
