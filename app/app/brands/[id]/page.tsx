import { Suspense, cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { BrandEvolutionChart, type Point } from "@/components/saas/BrandEvolutionChart";
import { AlertBanner } from "@/components/saas/AlertBanner";
import { RecommendationList } from "@/components/saas/RecommendationList";
import { CompetitorMatrix } from "@/components/saas/CompetitorMatrix";
import { TopicSelector } from "@/components/saas/TopicSelector";
import {
  CompetitorRankingBars,
  type VisibilityEntry,
  type ShareOfVoiceEntry,
} from "@/components/saas/CompetitorRankingBars";
import { Top10ShareOfVoice, type ShareOfVoiceRow } from "@/components/saas/Top10ShareOfVoice";
import { Top10CitedDomains, type CitedDomainRow } from "@/components/saas/Top10CitedDomains";
import { Top10CitedUrls, type CitedUrlRow } from "@/components/saas/Top10CitedUrls";
import { PeriodToggle } from "@/components/saas/PeriodToggle";
import { ChartSkeleton } from "@/components/saas/skeletons/ChartSkeleton";
import { MatrixSkeleton } from "@/components/saas/skeletons/MatrixSkeleton";
import { Top10Skeleton } from "@/components/saas/skeletons/Top10Skeleton";
import { TimelineSkeleton } from "@/components/saas/skeletons/TimelineSkeleton";
import { BrandRowSkeleton } from "@/components/saas/skeletons/BrandRowSkeleton";
import { periodToDays } from "@/lib/period";

type PeriodSpec = ReturnType<typeof periodToDays>;
import { loadSaasContext, relativeVisibility } from "@/lib/saas-auth";
import { isDemoMode } from "@/lib/demo-mode";
import { getServiceClient } from "@/lib/supabase";
import { refreshBrand, markAlertsRead } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Marque — Geoperf", robots: { index: false, follow: false } };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ refreshed?: string; error?: string; period?: string }>;
};

const ERROR_LABELS: Record<string, string> = {
  refresh_failed: "Le snapshot manuel a échoué. Vérifie les logs Supabase.",
  not_found: "Marque introuvable.",
  confirm_required: "Tape DELETE pour confirmer la suppression.",
};

const STATUS_BADGE: Record<string, string> = {
  completed: "bg-emerald-50 text-success",
  failed: "bg-red-50 text-danger",
  running: "bg-brand-50 text-brand-600",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function humanizeDomain(d: string): string {
  const root = d.split(".")[0];
  return root.split("-").map(w => w.length === 0 ? "" : w[0].toUpperCase() + w.slice(1)).join(" ");
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-eyebrow text-ink-subtle mb-1">{label}</div>
      <div className="text-xl font-medium text-ink tabular-nums tracking-tight">{value}</div>
    </div>
  );
}

// ============== Cached fetchers (request-scoped dedup) ==============

const getBrand = cache(async (id: string) => {
  const sb = getServiceClient();
  const { data } = await sb
    .from("saas_tracked_brands")
    .select("id, user_id, name, domain, category_slug, competitor_domains, cadence, is_active, created_at")
    .eq("id", id)
    .maybeSingle();
  return data as any | null;
});

const getLatestSnapshot = cache(async (brandId: string) => {
  const sb = getServiceClient();
  const { data } = await sb
    .from("saas_brand_snapshots")
    .select("id, status, visibility_score, avg_rank, citation_rate, share_of_voice, total_cost_usd, raw_response_count, prompts_count, brand_mention_count, total_mention_count, error_message, created_at, completed_at")
    .eq("brand_id", brandId)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as any | null;
});

const getSnapshotList = cache(async (brandId: string) => {
  const sb = getServiceClient();
  const { data } = await sb
    .from("saas_brand_snapshots")
    .select("id, status, visibility_score, avg_rank, citation_rate, share_of_voice, total_cost_usd, raw_response_count, prompts_count, brand_mention_count, total_mention_count, error_message, created_at, completed_at")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false })
    .limit(20);
  return (data as any[] | null) ?? [];
});

const getAlerts = cache(async (brandId: string) => {
  const sb = getServiceClient();
  const { data } = await sb
    .from("saas_alerts")
    .select("id, alert_type, severity, title, body, brand_id, is_read, created_at")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false })
    .limit(10);
  return (data as any[] | null) ?? [];
});

// ============== Page (sync shell) ==============

export default async function BrandDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { refreshed, error, period: periodParam } = await searchParams;
  const period = periodToDays(periodParam);
  const ctx = await loadSaasContext();
  const brand = await getBrand(id);
  if (!brand || brand.user_id !== ctx.user.id) notFound();

  const demo = await isDemoMode();
  const matrixUnlocked = ctx.tier === "pro" || ctx.tier === "agency";
  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;
  const competitorHumans = ((brand.competitor_domains as string[] | null) ?? []).map(humanizeDomain);

  return (
    <Section py="md" tone="white">
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
        <div>
          <Eyebrow className="mb-2">
            <Link href="/app/brands" className="hover:underline">Marques</Link>
            <span className="opacity-50"> / </span>
            <span>{brand.name}</span>
          </Eyebrow>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
            {brand.name}
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            <span className="font-mono">{brand.domain}</span>
            <span className="mx-2 text-ink-subtle">·</span>
            {(brand.category_slug as string).replace(/-/g, " ")}
            <span className="mx-2 text-ink-subtle">·</span>
            {brand.cadence === "weekly" ? "Hebdo" : "Mensuel"}
          </p>
        </div>
        {!demo && (
          <form action={refreshBrand}>
            <input type="hidden" name="brand_id" value={id} />
            <Button type="submit" variant="primary" size="md">Lancer un snapshot</Button>
          </form>
        )}
      </div>

      <Suspense fallback={<div className="mb-6 h-9 bg-surface rounded-lg animate-pulse" />}>
        <AsyncBrandTopicSelector brandId={id} ctx={ctx} />
      </Suspense>

      <PeriodToggle />

      <Suspense fallback={null}>
        <AsyncBrandAlertBanner brandId={id} />
      </Suspense>

      {refreshed === "1" && (
        <div className="mb-6 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
          Snapshot lancé. Le résultat apparaît ci-dessous (les recommandations Haiku peuvent prendre 10-20s de plus).
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      <Suspense fallback={
        <div className="grid lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-3"><ChartSkeleton height={280} /></div>
          <div className="lg:col-span-2"><ChartSkeleton height={280} /></div>
        </div>
      }>
        <AsyncBrandHero brandId={id} brandName={brand.name} period={period} />
      </Suspense>

      <Suspense fallback={
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Top10Skeleton />
          <Top10Skeleton />
          <Top10Skeleton />
        </div>
      }>
        <AsyncBrandTop10 brandId={id} />
      </Suspense>

      <div className="bg-white rounded-lg border border-ink/[0.08] p-4 mb-6 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono uppercase tracking-eyebrow text-brand-500 shrink-0">Drill-down</span>
        <Link href={`/app/brands/${id}/sources`} className="px-2.5 py-1 rounded-md text-ink hover:bg-surface transition-colors">Sources →</Link>
        <Link href={`/app/brands/${id}/by-model`} className="px-2.5 py-1 rounded-md text-ink hover:bg-surface transition-colors">Par LLM →</Link>
        <Link href={`/app/brands/${id}/by-prompt`} className="px-2.5 py-1 rounded-md text-ink hover:bg-surface transition-colors">Par prompt →</Link>
        <Link href={`/app/brands/${id}/citations-flow`} className="px-2.5 py-1 rounded-md text-ink hover:bg-surface transition-colors">Citations flow →</Link>
        <Link href={`/app/brands/${id}/sentiment`} className="px-2.5 py-1 rounded-md text-ink hover:bg-surface transition-colors">Sentiment →</Link>
        <Link href={`/app/brands/${id}/topics`} className="px-2.5 py-1 rounded-md text-ink hover:bg-surface transition-colors">Topics →</Link>
      </div>

      <Suspense fallback={<MatrixSkeleton />}>
        <AsyncCompetitorMatrixBlock
          brandId={id}
          brandName={brand.name}
          competitorHumans={competitorHumans}
          matrixUnlocked={matrixUnlocked}
        />
      </Suspense>

      <Suspense fallback={
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <TimelineSkeleton n={4} />
          <TimelineSkeleton n={4} />
        </div>
      }>
        <AsyncRecosAndAlerts brandId={id} pageId={id} />
      </Suspense>

      <Suspense fallback={<BrandRowSkeleton n={5} />}>
        <AsyncSnapshotsHistory brandId={id} />
      </Suspense>

      <div className="mt-10 pt-8 border-t border-DEFAULT">
        <Eyebrow className="mb-3">Concurrents suivis</Eyebrow>
        <ul className="space-y-1">
          {(brand.competitor_domains as string[] | null)?.length ? (
            (brand.competitor_domains as string[]).map((c: string) => (
              <li key={c} className="font-mono text-xs text-ink-muted">{c}</li>
            ))
          ) : (
            <li className="text-xs text-ink-subtle italic">Aucun concurrent configuré. Édite la marque pour en ajouter.</li>
          )}
        </ul>
      </div>
    </Section>
  );
}

// ============== Async sub-components ==============

async function AsyncBrandTopicSelector({ brandId, ctx }: { brandId: string; ctx: any }) {
  const sb = getServiceClient();
  const { data: topicsData } = await sb
    .from("saas_topics")
    .select("id, name, slug, is_default")
    .eq("brand_id", brandId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });
  const topicList = (topicsData as any[] | null) ?? [];
  if (topicList.length === 0) return null;
  return (
    <TopicSelector
      brandId={brandId}
      topics={topicList}
      currentTopicId={null}
      isOwner={ctx.is_owner}
      topicLimit={ctx.limits.topics}
    />
  );
}

async function AsyncBrandAlertBanner({ brandId }: { brandId: string }) {
  const alerts = await getAlerts(brandId);
  const unread = alerts.filter((a: any) => !a.is_read);
  if (unread.length === 0) return null;
  return (
    <div className="mb-6">
      <AlertBanner alerts={unread} />
    </div>
  );
}

async function AsyncBrandHero({
  brandId,
  brandName,
  period,
}: {
  brandId: string;
  brandName: string;
  period: PeriodSpec;
}) {
  const sb = getServiceClient();
  const periodCutoff = new Date(Date.now() - period.days * 86400000).toISOString();

  const [latestSnapshot, snapshotList, evolutionRes] = await Promise.all([
    getLatestSnapshot(brandId),
    getSnapshotList(brandId),
    sb.from("v_saas_brand_evolution")
      .select("snapshot_date, visibility_score, citation_rate, avg_rank")
      .eq("brand_id", brandId)
      .gte("snapshot_date", periodCutoff)
      .order("snapshot_date", { ascending: true }),
  ]);

  if (!latestSnapshot) {
    return (
      <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-10 text-center mb-8">
        {snapshotList.some((s: any) => s.status === "running") ? (
          <p className="text-ink-muted">Un snapshot est en cours… revisite cette page dans 30 secondes.</p>
        ) : snapshotList.some((s: any) => s.status === "failed") ? (
          <>
            <p className="text-danger mb-2 font-medium">Le dernier snapshot a échoué :</p>
            <p className="text-xs text-ink-muted font-mono">{snapshotList[0].error_message}</p>
            <p className="text-sm text-ink-muted mt-3">Relance ci-dessus, ou contacte le support si l&apos;erreur persiste.</p>
          </>
        ) : (
          <>
            <p className="text-ink-muted mb-4">Aucun snapshot encore généré.</p>
            <form action={refreshBrand}>
              <input type="hidden" name="brand_id" value={brandId} />
              <Button type="submit" variant="primary" size="md">Lancer le 1er snapshot</Button>
            </form>
          </>
        )}
      </div>
    );
  }

  const evolutionList = (evolutionRes.data as any[] | null) ?? [];
  const points: Point[] = evolutionList.map((e: any) => ({
    snapshot_date: e.snapshot_date,
    visibility_score: e.visibility_score,
    citation_rate: e.citation_rate,
    avg_rank: e.avg_rank,
  }));

  const [{ data: visibilityData }, { data: sovData }] = await Promise.all([
    sb.from("v_saas_competitor_visibility")
      .select("entity_name, is_self, visibility_score, mention_count, rank")
      .eq("snapshot_id", latestSnapshot.id)
      .order("rank", { ascending: true })
      .limit(20),
    sb.from("v_saas_competitor_share_of_voice")
      .select("entity_name, is_self, mention_count, share_pct, rank")
      .eq("snapshot_id", latestSnapshot.id)
      .order("rank", { ascending: true })
      .limit(20),
  ]);
  const visibilityEntries = (visibilityData as VisibilityEntry[] | null) ?? [];
  const sovEntries = (sovData as ShareOfVoiceEntry[] | null) ?? [];

  const llmsCount = (latestSnapshot.raw_response_count && latestSnapshot.prompts_count)
    ? Math.max(1, Math.round(latestSnapshot.raw_response_count / latestSnapshot.prompts_count))
    : 0;

  const periodDelta = (() => {
    if (points.length < 2) return null;
    const oldest = points[0];
    const newest = points[points.length - 1];
    if (oldest.visibility_score === null || newest.visibility_score === null) return null;
    return Number(newest.visibility_score) - Number(oldest.visibility_score);
  })();

  return (
    <div className="grid lg:grid-cols-5 gap-6 mb-6">
      <div className="lg:col-span-3 bg-white rounded-lg border border-ink/[0.08] p-6">
        <Eyebrow className="mb-2">Visibility Score</Eyebrow>
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-5xl md:text-6xl font-medium tracking-tight text-brand-500 tabular-nums">
            {Number(latestSnapshot.visibility_score).toFixed(0)}
          </span>
          <span className="text-2xl text-ink-subtle">/100</span>
        </div>
        <p className="text-xs text-ink-muted font-mono mb-1">
          Basé sur {latestSnapshot.raw_response_count ?? 0} réponses · {latestSnapshot.prompts_count ?? 0} prompts × {llmsCount} LLMs
        </p>
        {periodDelta !== null && (
          <p className="text-[11px] text-ink-subtle mb-1">
            <span className={periodDelta >= 0 ? "text-success" : "text-danger"}>
              {periodDelta >= 0 ? "+" : ""}{periodDelta.toFixed(1)} pt
            </span>{" "}
            vs il y a {period.label}
          </p>
        )}
        {(() => {
          const rv = relativeVisibility(latestSnapshot.visibility_score, latestSnapshot.citation_rate);
          if (rv === null) return null;
          return (
            <p className="text-[11px] text-ink-subtle mb-5">
              Performance quand cité : <span className="text-ink font-medium tabular-nums">{rv.toFixed(0)}/100</span> (visibility absolue normalisée par citation rate {latestSnapshot.citation_rate?.toFixed(0)}%)
            </p>
          );
        })()}

        <div className="grid grid-cols-3 gap-3 mb-6 pt-4 border-t border-ink/[0.06]">
          <MiniStat label="Rang moy." value={latestSnapshot.avg_rank?.toFixed(1) ?? "—"} />
          <MiniStat label="Citation" value={`${latestSnapshot.citation_rate?.toFixed(0) ?? 0}%`} />
          <MiniStat label="Share of Voice" value={`${latestSnapshot.share_of_voice?.toFixed(0) ?? 0}%`} />
        </div>

        <CompetitorRankingBars
          brandName={brandName}
          entries={visibilityEntries}
          fallback={sovEntries}
          limit={7}
        />
      </div>

      <div className="lg:col-span-2 bg-white rounded-lg border border-ink/[0.08] p-6">
        <Eyebrow className="mb-2">Visibility Evolution</Eyebrow>
        <h3 className="text-base font-medium text-ink tracking-tight mb-4">Trajectoire dans le temps</h3>
        {points.length > 0 ? (
          <BrandEvolutionChart points={points} brandName={brandName} />
        ) : (
          <p className="text-sm text-ink-muted italic">Le graph apparaîtra après le 2e snapshot.</p>
        )}
      </div>
    </div>
  );
}

async function AsyncBrandTop10({ brandId }: { brandId: string }) {
  const latestSnapshot = await getLatestSnapshot(brandId);
  if (!latestSnapshot) return null;

  const sb = getServiceClient();
  const [{ data: sovData }, { data: domainsData }, { data: urlsData }] = await Promise.all([
    sb.from("v_saas_competitor_share_of_voice")
      .select("entity_name, is_self, mention_count, share_pct, rank")
      .eq("snapshot_id", latestSnapshot.id)
      .order("rank", { ascending: true })
      .limit(10),
    sb.rpc("saas_top_cited_domains", { p_snapshot_id: latestSnapshot.id, p_limit: 10 }),
    sb.rpc("saas_top_cited_urls", { p_snapshot_id: latestSnapshot.id, p_limit: 10 }),
  ]);
  const topSov = (sovData as ShareOfVoiceRow[] | null) ?? [];
  const topDomains = (domainsData as CitedDomainRow[] | null) ?? [];
  const topUrls = (urlsData as CitedUrlRow[] | null) ?? [];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <Top10ShareOfVoice rows={topSov} />
      <Top10CitedDomains rows={topDomains} />
      <Top10CitedUrls rows={topUrls} />
    </div>
  );
}

async function AsyncCompetitorMatrixBlock({
  brandId,
  brandName,
  competitorHumans,
  matrixUnlocked,
}: {
  brandId: string;
  brandName: string;
  competitorHumans: string[];
  matrixUnlocked: boolean;
}) {
  const latestSnapshot = await getLatestSnapshot(brandId);
  if (!latestSnapshot) return null;

  const sb = getServiceClient();
  const { data: respData } = await sb
    .from("saas_snapshot_responses")
    .select("llm, brand_mentioned, competitors_mentioned")
    .eq("snapshot_id", latestSnapshot.id);
  const matrixResponses = (respData as any[] | null) ?? [];
  if (matrixResponses.length === 0) return null;

  return (
    <div className="mb-6">
      <CompetitorMatrix
        responses={matrixResponses}
        brandName={brandName}
        competitorHumans={competitorHumans}
        totalPromptsPerLlm={latestSnapshot.prompts_count ?? undefined}
        locked={!matrixUnlocked}
      />
    </div>
  );
}

async function AsyncRecosAndAlerts({ brandId, pageId }: { brandId: string; pageId: string }) {
  const [latestSnapshot, alertList] = await Promise.all([
    getLatestSnapshot(brandId),
    getAlerts(brandId),
  ]);

  let recos: any[] = [];
  if (latestSnapshot) {
    const sb = getServiceClient();
    const { data } = await sb
      .from("saas_recommendations")
      .select("id, priority, category, title, body, authority_sources, is_read, created_at")
      .eq("snapshot_id", latestSnapshot.id)
      .order("priority", { ascending: true });
    recos = (data as any[] | null) ?? [];
  }

  // Si pas de snapshot, on n'affiche pas la section recos+alerts
  if (!latestSnapshot) return null;

  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <Eyebrow>Recommandations</Eyebrow>
          <span className="text-xs text-ink-subtle font-mono">{recos.length}</span>
        </div>
        <RecommendationList recos={recos} />
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-4">
          <Eyebrow>Alertes</Eyebrow>
          {alertList.some((a: any) => !a.is_read) && (
            <form action={markAlertsRead}>
              <input type="hidden" name="brand_id" value={pageId} />
              <button type="submit" className="text-xs text-ink-muted hover:text-ink underline transition-colors">
                Marquer toutes lues
              </button>
            </form>
          )}
        </div>
        {alertList.length === 0 ? (
          <p className="text-sm text-ink-muted italic">Aucune alerte pour cette marque.</p>
        ) : (
          <AlertBanner alerts={alertList} />
        )}
      </div>
    </div>
  );
}

async function AsyncSnapshotsHistory({ brandId }: { brandId: string }) {
  const snapshotList = await getSnapshotList(brandId);

  return (
    <div>
      <Eyebrow className="mb-4">Historique des snapshots</Eyebrow>
      <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
            <tr>
              <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">Date</th>
              <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">Status</th>
              <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">Score</th>
              <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">Rang</th>
              <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">Cit.%</th>
              <th className="text-right py-3 px-4 hidden md:table-cell font-mono uppercase tracking-eyebrow">Réponses</th>
            </tr>
          </thead>
          <tbody>
            {snapshotList.map((s: any) => (
              <tr key={s.id} className="border-b border-DEFAULT last:border-b-0 hover:bg-surface transition-colors">
                <td className="py-3 px-4 font-mono text-xs">
                  <Link href={`/app/brands/${brandId}/snapshots/${s.id}`} className="hover:text-brand-500 transition-colors">
                    {fmtDate(s.created_at)}
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono uppercase tracking-eyebrow ${STATUS_BADGE[s.status] || "bg-surface text-ink-muted"}`}>
                    {s.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono text-ink tabular-nums">{s.visibility_score?.toFixed(0) ?? "—"}</td>
                <td className="py-3 px-4 text-right font-mono text-ink tabular-nums">{s.avg_rank?.toFixed(1) ?? "—"}</td>
                <td className="py-3 px-4 text-right font-mono text-ink tabular-nums">{s.citation_rate?.toFixed(0) ?? "—"}</td>
                <td className="py-3 px-4 text-right font-mono hidden md:table-cell text-xs text-ink-muted">{s.raw_response_count}</td>
              </tr>
            ))}
            {snapshotList.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-center text-ink-muted text-sm">Aucun snapshot.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
