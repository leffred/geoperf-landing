// /portal?t=<tracking_token>
// Zone "client" — dashboard personnalisé avec stats, recommandations, comparaison concurrents.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { loadPortalData, buildRecommendations } from "@/lib/portal";
import { logEvent } from "@/lib/tracking";

export const metadata: Metadata = {
  title: "Mon tableau de bord — Geoperf",
  description: "Vos stats de visibilité IA en temps réel.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ t?: string }> };

const LLM_LABELS: Record<string, string> = {
  perplexity: "Perplexity",
  openai: "ChatGPT",
  google: "Gemini",
  anthropic: "Claude",
};

const SATURATION_BADGES: Record<string, { label: string; color: string }> = {
  HOT_OPPORTUNITY: { label: "Forte sous-représentation", color: "bg-amber text-navy" },
  WARM_OPPORTUNITY: { label: "Sous-représentation modérée", color: "bg-orange-200 text-orange-900" },
  BALANCED: { label: "Équilibré", color: "bg-cream text-ink-muted" },
  OVER_INDEXED: { label: "Sur-représenté (avantage)", color: "bg-blue-100 text-blue-900" },
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function fmtDateShort(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export default async function PortalPage({ searchParams }: Props) {
  const { t: token } = await searchParams;
  if (!token) notFound();

  const data = await loadPortalData(token);
  if (!data) notFound();

  const { dashboard: d, activity, competitors, events } = data;
  const recommendations = buildRecommendations(d);
  const sat = SATURATION_BADGES[d.saturation_label] || SATURATION_BADGES.BALANCED;
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/jourdechance/audit-geo";

  // Log la visite portal (fire and forget)
  logEvent({
    prospect_id: d.prospect_id,
    event_type: "landing_visited",
    metadata: { token_used: token, surface: "portal" },
  }).catch(() => {});

  return (
    <main className="min-h-screen flex flex-col">
      <Header rightSlot={<span className="text-xs text-ink-muted font-mono">{d.company_name}</span>} />

      {/* Hero compact */}
      <Section tone="navy" py="md">
        <p className="font-mono text-xs tracking-widest text-amber uppercase mb-3">Tableau de bord — {d.sous_categorie}</p>
        <h1 className="font-serif text-4xl leading-tight">
          {d.first_name ? `Bonjour ${d.first_name}` : "Bonjour"}<span className="text-amber">.</span>
        </h1>
        <p className="text-lg opacity-85 mt-2 font-serif max-w-2xl">
          Vos stats de visibilité IA pour <strong>{d.company_name}</strong>, mises à jour en temps réel.
        </p>
      </Section>

      {/* KPIs principaux */}
      <Section py="md">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">Vos chiffres clés</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label={`Position dans l'étude`} value={`#${d.ranking_position}`} variant="highlight" />
          <Stat label="Score visibilité IA" value={`${d.visibility_score}/4`} />
          <Stat label="LLM qui vous citent" value={Object.values(d.cited_by || {}).filter(Boolean).length} />
          <Stat label="Sources distinctes" value={d.source_count ?? "—"} />
        </div>

        <div className="mt-6 p-5 bg-cream border-l-2 border-amber">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-1">Score saturation IA</p>
              <p className="font-serif text-xl text-navy">
                Rang IA <strong>#{d.ranking_position}</strong> · Rang marché estimé <strong>#{d.market_rank_estimate ?? "?"}</strong>
              </p>
              <p className="text-sm text-ink-muted mt-1">
                {d.ai_saturation_gap != null && (
                  <>Écart : <strong>{Number(d.ai_saturation_gap) >= 0 ? "+" : ""}{Number(d.ai_saturation_gap).toFixed(1)}%</strong></>
                )}
              </p>
            </div>
            <span className={`inline-block px-3 py-1.5 text-sm font-medium ${sat.color}`}>
              {sat.label}
            </span>
          </div>
        </div>
      </Section>

      {/* Détail visibilité par LLM */}
      <Section tone="cream" py="md" eyebrow="Détail par LLM">
        <h2 className="font-serif text-2xl text-navy mb-6">Quels modèles vous citent</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["openai", "anthropic", "perplexity", "google"].map((llm) => {
            const cited = d.cited_by?.[llm];
            return (
              <div
                key={llm}
                className={`p-5 ${cited ? "bg-navy text-white" : "bg-white border-l-2 border-red-300"}`}
              >
                <div className="text-xs font-mono uppercase tracking-widest opacity-70 mb-2">
                  {LLM_LABELS[llm] || llm}
                </div>
                <div className="font-serif text-2xl font-medium">
                  {cited ? "Vous cite" : "Ne vous cite pas"}
                </div>
                {cited ? (
                  <div className="text-xs opacity-70 mt-2">Position moyenne : #{d.avg_position_in_lists ?? "?"}</div>
                ) : (
                  <div className="text-xs text-red-700 mt-2">Opportunité d'amélioration</div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Recommandations actionnables */}
      <Section py="md" eyebrow="Recommandations">
        <h2 className="font-serif text-2xl text-navy mb-6">Vos prochaines actions prioritaires</h2>
        <div className="space-y-4">
          {recommendations.map((r, i) => (
            <div
              key={i}
              className={`p-5 border-l-2 ${
                r.priority === "high"
                  ? "border-amber bg-amber/5"
                  : r.priority === "medium"
                  ? "border-navy bg-cream"
                  : "border-navy/30 bg-white"
              }`}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`font-mono text-xs px-2 py-1 ${
                    r.priority === "high" ? "bg-amber text-navy" : r.priority === "medium" ? "bg-navy text-white" : "bg-cream text-ink-muted"
                  }`}
                >
                  {r.priority === "high" ? "PRIORITÉ" : r.priority === "medium" ? "À CONSIDÉRER" : "PLUS TARD"}
                </span>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-navy mb-1">{r.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{r.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Comparateur concurrents */}
      {competitors.length > 0 && (
        <Section tone="cream" py="md" eyebrow="Comparateur concurrents">
          <h2 className="font-serif text-2xl text-navy mb-6">Top 5 du secteur — qui vous bat (ou pas)</h2>
          <div className="bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-navy text-white text-xs uppercase tracking-widest">
                <tr>
                  <th className="text-left p-3">Rang</th>
                  <th className="text-left p-3">Société</th>
                  <th className="text-left p-3">Pays</th>
                  <th className="text-center p-3">Score IA</th>
                  <th className="text-left p-3">LLM citants</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c) => (
                  <tr key={c.competitor_rank} className="border-b border-navy/10">
                    <td className="p-3 font-serif text-lg text-navy">#{c.competitor_rank}</td>
                    <td className="p-3 font-medium">{c.competitor_name}</td>
                    <td className="p-3 text-ink-muted">{c.competitor_country || "—"}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 text-xs font-mono ${
                        c.competitor_visibility === 4 ? "bg-navy text-white" :
                        c.competitor_visibility === 3 ? "bg-navy-light text-white" :
                        c.competitor_visibility === 2 ? "bg-ink-muted text-white" : "bg-cream text-ink-muted"
                      }`}>
                        {c.competitor_visibility}/4
                      </span>
                    </td>
                    <td className="p-3 text-xs font-mono">
                      {Object.entries(c.competitor_cited_by || {})
                        .filter(([, v]) => v)
                        .map(([k]) => LLM_LABELS[k] || k)
                        .join(", ") || "—"}
                    </td>
                  </tr>
                ))}
                {/* Ligne de la société du prospect, mise en évidence */}
                <tr className="bg-amber/10 border-t-2 border-amber">
                  <td className="p-3 font-serif text-lg text-navy">#{d.ranking_position}</td>
                  <td className="p-3 font-medium text-navy">{d.company_name} <span className="text-xs text-amber font-mono ml-2">— VOUS</span></td>
                  <td className="p-3 text-ink-muted">{d.company_country || "—"}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-0.5 text-xs font-mono ${
                      d.visibility_score === 4 ? "bg-navy text-white" :
                      d.visibility_score === 3 ? "bg-navy-light text-white" :
                      d.visibility_score === 2 ? "bg-ink-muted text-white" : "bg-cream text-ink-muted"
                    }`}>
                      {d.visibility_score}/4
                    </span>
                  </td>
                  <td className="p-3 text-xs font-mono">
                    {Object.entries(d.cited_by || {})
                      .filter(([, v]) => v)
                      .map(([k]) => LLM_LABELS[k] || k)
                      .join(", ") || "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Activité de votre équipe */}
      {activity && activity.team_prospects_count > 1 && (
        <Section py="md" eyebrow="Activité collective">
          <h2 className="font-serif text-2xl text-navy mb-6">Votre équipe sur Geoperf</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Membres identifiés" value={activity.team_prospects_count} />
            <Stat label="Visites totales" value={activity.team_visits} />
            <Stat label="Téléchargements" value={activity.team_downloads} />
            <Stat label="Engagés" value={activity.team_engaged} variant="highlight" />
          </div>
          <p className="text-xs text-ink-muted mt-4">
            Dernière activité de l'équipe : {fmtDate(activity.team_last_activity)}
          </p>
        </Section>
      )}

      {/* Historique perso */}
      <Section tone="cream" py="md" eyebrow="Votre activité">
        <h2 className="font-serif text-2xl text-navy mb-6">Vos derniers événements</h2>
        {events.length === 0 ? (
          <p className="text-ink-muted text-sm">Aucun événement enregistré pour vous.</p>
        ) : (
          <div className="space-y-2">
            {events.slice(0, 8).map((e) => (
              <div key={e.id} className="bg-white px-4 py-3 text-sm flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs px-2 py-0.5 bg-navy text-white mr-3">{e.event_type}</span>
                  <span className="text-ink-muted text-xs">{e.channel || "—"}</span>
                </div>
                <span className="text-xs text-ink-muted font-mono">{fmtDateShort(e.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* CTA audit */}
      <Section tone="navy" py="lg">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="font-mono text-xs tracking-widest text-amber uppercase mb-3">Audit gratuit</p>
            <h2 className="font-serif text-3xl mb-4">
              Allez plus loin avec un audit personnalisé<span className="text-amber">.</span>
            </h2>
            <p className="text-lg opacity-85 leading-relaxed">
              30 minutes pour analyser votre positionnement spécifique et identifier les 3 actions prioritaires
              à mener dans les 6 prochains mois pour améliorer votre score IA.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button href={calendlyUrl} variant="primary" size="lg">Réserver mon audit</Button>
            {d.html_url && (
              <Button href={d.html_url} variant="outline-light" size="md">Re-télécharger l'étude (HTML)</Button>
            )}
            {d.pdf_url && (
              <Button href={d.pdf_url} variant="outline-light" size="md">Re-télécharger l'étude (PDF)</Button>
            )}
          </div>
        </div>
      </Section>

      <Footer
        showLegalLinks={true}
        optOutLine={
          <span className="text-xs text-ink-muted">
            Vous accédez à ce tableau de bord avec votre lien personnalisé. Conservez-le pour revenir consulter vos
            stats à tout moment. Pour vous désinscrire : <a href="mailto:contact@geoperf.com?subject=STOP" className="underline">contact@geoperf.com</a>
          </span>
        }
      />
    </main>
  );
}
