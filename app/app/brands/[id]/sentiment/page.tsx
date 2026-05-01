import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EmptyState } from "@/components/saas/EmptyState";
import { SentimentDonut } from "@/components/saas/SentimentDonut";
import { loadSaasContext, tierLabel } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sentiment — Geoperf", robots: { index: false, follow: false } };

const SENT_STYLES: Record<string, string> = {
  positive: "border-l-success bg-emerald-50/50",
  neutral: "border-l-ink/15 bg-surface",
  negative: "border-l-danger bg-red-50/50",
  mixed: "border-l-warning bg-white",
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

function PageHeader({ id, brandName, subtitle }: { id: string; brandName: string; subtitle?: string }) {
  return (
    <div className="mb-8 flex items-baseline justify-between flex-wrap gap-3">
      <div>
        <Eyebrow className="mb-2">
          <Link href={`/app/brands/${id}`} className="hover:underline">{brandName}</Link>
          <span className="opacity-50"> / </span>
          <span>Sentiment</span>
        </Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
          Brand Health · Sentiment
        </h1>
        {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

export default async function SentimentPage({ params }: Props) {
  const { id } = await params;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: brand } = await sb.from("saas_tracked_brands").select("id, user_id, name, domain").eq("id", id).maybeSingle();
  if (!brand || (brand as any).user_id !== ctx.account_owner_id) notFound();

  if (!ALLOWED.has(ctx.tier)) {
    return (
      <Section py="md" tone="white">
        <PageHeader id={id} brandName={(brand as any).name} />
        <EmptyState
          icon="calm"
          eyebrow="Tier verrouillé"
          title="Sentiment réservé aux plans Growth et plus"
          body={`Tu es actuellement en ${tierLabel(ctx.tier)}. La classification automatique du sentiment des mentions LLM (positif / neutre / négatif / mixte) est incluse à partir du plan Growth.`}
          ctaLabel="Voir les plans"
          ctaHref="/app/billing"
        />
      </Section>
    );
  }

  const { data: latest } = await sb
    .from("saas_brand_snapshots")
    .select("id, created_at, avg_sentiment_score, sentiment_distribution, sentiment_analyzed_at, raw_response_count")
    .eq("brand_id", id).eq("status", "completed")
    .not("sentiment_analyzed_at", "is", null)
    .order("created_at", { ascending: false }).limit(1).maybeSingle();

  if (!latest) {
    const { data: pending } = await sb
      .from("saas_brand_snapshots").select("id, status, sentiment_analyzed_at")
      .eq("brand_id", id).eq("status", "completed")
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    return (
      <Section py="md" tone="white">
        <PageHeader id={id} brandName={(brand as any).name} />
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

  const { data: history } = await sb
    .from("saas_brand_snapshots")
    .select("id, created_at, avg_sentiment_score, sentiment_distribution")
    .eq("brand_id", id).eq("status", "completed")
    .not("sentiment_analyzed_at", "is", null)
    .order("created_at", { ascending: false }).limit(20);
  const histList = ((history as any[] | null) ?? []).reverse();

  return (
    <Section py="md" tone="white">
      <PageHeader
        id={id}
        brandName={(brand as any).name}
        subtitle={`Snapshot du ${new Date((latest as any).created_at).toLocaleDateString("fr-FR")} · ${(latest as any).raw_response_count} réponses analysées`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat label="Score sentiment / 100" value={score.toFixed(0)} variant="dark" />
        <Stat label="Positives" value={String(dist.positive ?? 0)} />
        <Stat label="Négatives" value={String(dist.negative ?? 0)} />
        <Stat label="Mixed/Neutral" value={String((dist.mixed ?? 0) + (dist.neutral ?? 0))} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <SentimentDonut distribution={dist} />
        <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-5">
          <Eyebrow className="mb-4">Évolution score sentiment</Eyebrow>
          {histList.length < 2 ? (
            <p className="text-xs text-ink-muted italic">Plus d&apos;historique disponible après le 2e snapshot.</p>
          ) : (
            <ul className="space-y-2">
              {histList.slice(-10).map(h => {
                const s = score100(h.avg_sentiment_score);
                const w = Math.max(2, s);
                const colorClass = s >= 60 ? "bg-success" : s >= 45 ? "bg-warning" : "bg-danger";
                return (
                  <li key={h.id} className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-ink-subtle w-20 shrink-0">
                      {new Date(h.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                    </span>
                    <div className="flex-1 h-2 bg-surface-2 overflow-hidden rounded-full">
                      <div className={`h-full transition-all duration-300 ${colorClass}`} style={{ width: `${w}%` }} />
                    </div>
                    <span className="font-mono text-xs text-ink w-12 text-right tabular-nums">{s.toFixed(0)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <Eyebrow className="mb-4">Top 5 mentions positives</Eyebrow>
          {topPositives.length === 0 ? (
            <p className="text-xs text-ink-muted italic">Aucune mention positive dans ce snapshot.</p>
          ) : (
            <div className="space-y-2">
              {topPositives.map(r => (
                <article key={r.id} className={`rounded-lg border border-DEFAULT border-l-2 p-3 text-sm ${SENT_STYLES.positive}`}>
                  <div className="flex items-baseline justify-between mb-1 gap-2 flex-wrap">
                    <span className="font-mono text-[10px] uppercase tracking-eyebrow text-success">
                      {SENT_LABEL[r.sentiment] ?? r.sentiment} · score {Number(r.sentiment_score ?? 0).toFixed(2)}
                    </span>
                    <span className="font-mono text-[10px] text-ink-subtle">{r.llm}</span>
                  </div>
                  <p className="text-xs text-ink-muted italic mb-1 truncate">{r.prompt_text}</p>
                  {r.sentiment_summary && <p className="text-xs text-ink">{r.sentiment_summary}</p>}
                </article>
              ))}
            </div>
          )}
        </div>
        <div>
          <Eyebrow className="mb-4">Top 5 mentions négatives</Eyebrow>
          {topNegatives.length === 0 ? (
            <p className="text-xs text-ink-muted italic">Aucune mention négative dans ce snapshot.</p>
          ) : (
            <div className="space-y-2">
              {topNegatives.map(r => (
                <article key={r.id} className={`rounded-lg border border-DEFAULT border-l-2 p-3 text-sm ${SENT_STYLES.negative}`}>
                  <div className="flex items-baseline justify-between mb-1 gap-2 flex-wrap">
                    <span className="font-mono text-[10px] uppercase tracking-eyebrow text-danger">
                      {SENT_LABEL[r.sentiment] ?? r.sentiment} · score {Number(r.sentiment_score ?? 0).toFixed(2)}
                    </span>
                    <span className="font-mono text-[10px] text-ink-subtle">{r.llm}</span>
                  </div>
                  <p className="text-xs italic mb-1 truncate text-ink-muted">{r.prompt_text}</p>
                  {r.sentiment_summary && <p className="text-xs text-ink">{r.sentiment_summary}</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
