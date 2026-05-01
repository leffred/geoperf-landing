import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { EmptyState } from "@/components/saas/EmptyState";
import { SentimentDonut } from "@/components/saas/SentimentDonut";
import { loadSaasContext, tierLabel } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sentiment — Geoperf", robots: { index: false, follow: false } };

const SENT_STYLES: Record<string, string> = {
  positive: "bg-emerald-50 border-emerald-600 text-emerald-900",
  neutral: "bg-cream border-navy/20 text-ink",
  negative: "bg-red-50 border-red-600 text-red-900",
  mixed: "bg-amber/10 border-amber text-navy",
};
const SENT_LABEL: Record<string, string> = {
  positive: "Positif", neutral: "Neutre", negative: "Négatif", mixed: "Mixte",
};

const ALLOWED = new Set(["growth", "pro", "agency"]);

type Props = { params: Promise<{ id: string }> };

function score100(avg: number | null | undefined): number {
  if (avg === null || avg === undefined) return 50;
  return Math.round((Number(avg) * 50 + 50) * 10) / 10;
}

export default async function SentimentPage({ params }: Props) {
  const { id } = await params;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: brand } = await sb.from("saas_tracked_brands").select("id, user_id, name, domain").eq("id", id).maybeSingle();
  if (!brand || (brand as any).user_id !== ctx.account_owner_id) notFound();

  // Tier-gate Growth+
  if (!ALLOWED.has(ctx.tier)) {
    return (
      <Section py="md" tone="cream">
        <div className="mb-4">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
            <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link> / Sentiment
          </p>
          <h1 className="font-serif text-3xl text-navy">Brand Health · Sentiment</h1>
        </div>
        <EmptyState
          icon="calm"
          title="Sentiment réservé aux plans Growth et plus"
          body={`Tu es actuellement en ${tierLabel(ctx.tier)}. La classification automatique du sentiment des mentions LLM (positif / neutre / négatif / mixte) est incluse à partir du plan Growth.`}
          ctaLabel="Voir les plans"
          ctaHref="/app/billing"
        />
      </Section>
    );
  }

  // Charge le dernier snapshot completed avec sentiment_analyzed_at != null
  const { data: latest } = await sb
    .from("saas_brand_snapshots")
    .select("id, created_at, avg_sentiment_score, sentiment_distribution, sentiment_analyzed_at, raw_response_count")
    .eq("brand_id", id).eq("status", "completed")
    .not("sentiment_analyzed_at", "is", null)
    .order("created_at", { ascending: false }).limit(1).maybeSingle();

  if (!latest) {
    // Vérifier s'il y a un snapshot completed mais pas encore analysé
    const { data: pending } = await sb
      .from("saas_brand_snapshots").select("id, status, sentiment_analyzed_at")
      .eq("brand_id", id).eq("status", "completed")
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    return (
      <Section py="md" tone="cream">
        <div className="mb-4">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
            <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link> / Sentiment
          </p>
          <h1 className="font-serif text-3xl text-navy">Brand Health · Sentiment</h1>
        </div>
        <EmptyState
          icon={pending ? "snapshot" : "calm"}
          title={pending ? "Analyse sentiment en cours" : "Pas encore de données sentiment"}
          body={pending
            ? "Le snapshot le plus récent a été complété mais l'analyse Haiku tourne encore. Reviens dans 30s à 1 minute."
            : "Lance un snapshot pour cette marque. L'analyse sentiment se déclenche automatiquement post-snapshot pour les plans Growth+."}
          ctaLabel="Retour à la marque"
          ctaHref={`/app/brands/${id}`}
        />
      </Section>
    );
  }

  const dist = ((latest as any).sentiment_distribution ?? {}) as Record<string, number>;
  const score = score100((latest as any).avg_sentiment_score);

  // Top 5 positives + top 5 negatives (avec excerpt)
  const [{ data: tops }, { data: tons }] = await Promise.all([
    sb.from("saas_snapshot_responses")
      .select("id, llm, prompt_text, response_text, sentiment_score, sentiment_summary, sentiment")
      .eq("snapshot_id", (latest as any).id).eq("sentiment", "positive")
      .order("sentiment_score", { ascending: false }).limit(5),
    sb.from("saas_snapshot_responses")
      .select("id, llm, prompt_text, response_text, sentiment_score, sentiment_summary, sentiment")
      .eq("snapshot_id", (latest as any).id).eq("sentiment", "negative")
      .order("sentiment_score", { ascending: true }).limit(5),
  ]);
  const topPositives = (tops as any[] | null) ?? [];
  const topNegatives = (tons as any[] | null) ?? [];

  // Évolution dans le temps
  const { data: history } = await sb
    .from("saas_brand_snapshots")
    .select("id, created_at, avg_sentiment_score, sentiment_distribution")
    .eq("brand_id", id).eq("status", "completed")
    .not("sentiment_analyzed_at", "is", null)
    .order("created_at", { ascending: false }).limit(20);
  const histList = ((history as any[] | null) ?? []).reverse();

  return (
    <Section py="md" tone="cream">
      <div className="mb-6 flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
            <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link> / Sentiment
          </p>
          <h1 className="font-serif text-3xl text-navy">Brand Health · Sentiment</h1>
          <p className="text-sm text-ink-muted">
            Snapshot du {new Date((latest as any).created_at).toLocaleDateString("fr-FR")} ·{" "}
            {(latest as any).raw_response_count} réponses analysées
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Score sentiment / 100" value={score.toFixed(0)} variant="highlight" />
        <Stat label="Positives" value={String(dist.positive ?? 0)} />
        <Stat label="Négatives" value={String(dist.negative ?? 0)} />
        <Stat label="Mixed/Neutral" value={String((dist.mixed ?? 0) + (dist.neutral ?? 0))} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <SentimentDonut distribution={dist} />
        <div className="bg-white p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Évolution score sentiment</p>
          {histList.length < 2 ? (
            <p className="text-xs text-ink-muted italic">Plus d&apos;historique disponible après le 2e snapshot.</p>
          ) : (
            <ul className="space-y-2">
              {histList.slice(-10).map(h => {
                const s = score100(h.avg_sentiment_score);
                const w = Math.max(2, s);
                const color = s >= 60 ? "#1D9E75" : s >= 45 ? "#5F5E5A" : "#B91C1C";
                return (
                  <li key={h.id} className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-ink-muted w-20 shrink-0">
                      {new Date(h.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                    </span>
                    <div className="flex-1 h-2 bg-cream overflow-hidden rounded-sm">
                      <div className="h-full" style={{ width: `${w}%`, background: color }} />
                    </div>
                    <span className="font-mono text-xs text-navy w-12 text-right">{s.toFixed(0)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Top 5 mentions positives</p>
          {topPositives.length === 0 ? (
            <p className="text-xs text-ink-muted italic">Aucune mention positive dans ce snapshot.</p>
          ) : (
            <div className="space-y-2">
              {topPositives.map(r => (
                <article key={r.id} className={`border-l-2 p-3 text-sm ${SENT_STYLES.positive}`}>
                  <div className="flex items-baseline justify-between mb-1 gap-2 flex-wrap">
                    <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">{SENT_LABEL[r.sentiment] ?? r.sentiment} · score {Number(r.sentiment_score ?? 0).toFixed(2)}</span>
                    <span className="font-mono text-[10px] opacity-60">{r.llm}</span>
                  </div>
                  <p className="text-xs text-ink-muted italic mb-1 truncate">{r.prompt_text}</p>
                  {r.sentiment_summary && <p className="text-xs">{r.sentiment_summary}</p>}
                </article>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Top 5 mentions négatives</p>
          {topNegatives.length === 0 ? (
            <p className="text-xs text-ink-muted italic">Aucune mention négative dans ce snapshot.</p>
          ) : (
            <div className="space-y-2">
              {topNegatives.map(r => (
                <article key={r.id} className={`border-l-2 p-3 text-sm ${SENT_STYLES.negative}`}>
                  <div className="flex items-baseline justify-between mb-1 gap-2 flex-wrap">
                    <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">{SENT_LABEL[r.sentiment] ?? r.sentiment} · score {Number(r.sentiment_score ?? 0).toFixed(2)}</span>
                    <span className="font-mono text-[10px] opacity-60">{r.llm}</span>
                  </div>
                  <p className="text-xs italic mb-1 truncate opacity-90">{r.prompt_text}</p>
                  {r.sentiment_summary && <p className="text-xs">{r.sentiment_summary}</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
