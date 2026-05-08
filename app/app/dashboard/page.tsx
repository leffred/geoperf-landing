import { Suspense, cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { AlertBanner } from "@/components/saas/AlertBanner";
import { EmptyState } from "@/components/saas/EmptyState";
import { TierBadge } from "@/components/saas/TierBadge";
import { DashboardKpiCard } from "@/components/saas/DashboardKpiCard";
import { SuggestionCard } from "@/components/saas/SuggestionCard";
import { BrandOverviewRow } from "@/components/saas/BrandOverviewRow";
import { ActivityTimeline, type ActivityItem } from "@/components/saas/ActivityTimeline";
import { KpiCardSkeleton } from "@/components/saas/skeletons/KpiCardSkeleton";
import { BrandRowSkeleton } from "@/components/saas/skeletons/BrandRowSkeleton";
import { TimelineSkeleton } from "@/components/saas/skeletons/TimelineSkeleton";
import { loadSaasContext, tierLimits } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard — Geoperf", robots: { index: false, follow: false } };

type BrandLatest = {
  id: string;
  name: string;
  domain: string;
  category_slug: string;
  visibility_score: number | null;
  avg_rank: number | null;
  citation_rate: number | null;
  share_of_voice: number | null;
  last_snapshot_at: string | null;
  unread_alerts: number;
  unread_recos: number;
};

const SEVEN_DAYS_MS = 7 * 86400000;

// ============== Cached fetchers (request-scoped dedup) ==============

const getBrandList = cache(async (userId: string): Promise<BrandLatest[]> => {
  const sb = getServiceClient();
  const { data } = await sb
    .from("v_saas_brand_latest")
    .select("id, name, domain, category_slug, visibility_score, avg_rank, citation_rate, share_of_voice, last_snapshot_at, unread_alerts, unread_recos")
    .eq("user_id", userId);
  return (data as BrandLatest[] | null) ?? [];
});

const getAlerts = cache(async (userId: string) => {
  const sb = getServiceClient();
  const { data } = await sb
    .from("saas_alerts")
    .select("id, alert_type, severity, title, body, brand_id, created_at")
    .eq("user_id", userId)
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(5);
  return (data as any[] | null) ?? [];
});

const getSnapshots7d = cache(async (userId: string) => {
  const sb = getServiceClient();
  const sevenDaysAgoIso = new Date(Date.now() - SEVEN_DAYS_MS).toISOString();
  const { data } = await sb
    .from("saas_brand_snapshots")
    .select("id, brand_id, status, visibility_score, citation_rate, brand_mention_count, total_mention_count, created_at, completed_at")
    .eq("user_id", userId)
    .eq("status", "completed")
    .gte("created_at", sevenDaysAgoIso)
    .order("created_at", { ascending: false });
  return (data as any[] | null) ?? [];
});

const getEvolution = cache(async (userId: string) => {
  const sb = getServiceClient();
  const { data } = await sb
    .from("v_saas_brand_evolution")
    .select("brand_id, name, snapshot_date, visibility_score, citation_rate, avg_rank")
    .eq("user_id", userId)
    .order("snapshot_date", { ascending: false })
    .limit(50);
  return (data as any[] | null) ?? [];
});

// ============== Page (sync shell) ==============

export default async function DashboardPage() {
  const ctx = await loadSaasContext();
  const brandList = await getBrandList(ctx.user.id);

  // Auto-redirect §4.2 — must happen before render starts
  if (
    brandList.length === 1 &&
    brandList[0].last_snapshot_at &&
    Date.now() - new Date(brandList[0].last_snapshot_at).getTime() < SEVEN_DAYS_MS
  ) {
    // Vérif rapide qu'il n'y a pas d'alertes (sinon on ne redirige pas)
    const alerts = await getAlerts(ctx.user.id);
    if (alerts.length === 0) {
      redirect(`/app/brands/${brandList[0].id}`);
    }
  }

  const limits = tierLimits(ctx.tier);
  const firstName = ctx.profile?.full_name?.split(" ")[0] || ctx.user.email?.split("@")[0];

  return (
    <Section py="md" tone="white">
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
        <div>
          <Eyebrow className="mb-2">Tableau de bord</Eyebrow>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
            Bonjour {firstName}
          </h1>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <TierBadge tier={ctx.tier} />
            <span className="text-xs text-ink-muted">
              {brandList.length}/{limits.brands} marque{limits.brands > 1 ? "s" : ""} suivie{brandList.length > 1 ? "s" : ""} · cadence {limits.cadence === "weekly" ? "hebdo" : "mensuelle"} · {limits.llms} LLM{limits.llms > 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <Button href="/app/brands/new" variant="primary" size="md">+ Suivre une marque</Button>
      </div>

      {brandList.length === 0 ? (
        <EmptyState
          icon="brands"
          eyebrow="Onboarding · 60 secondes"
          title="Bienvenue sur Geoperf"
          body="Configure ta première marque pour voir comment les LLM la perçoivent. Le 1er snapshot tourne en 30 secondes après création."
          ctaLabel="Créer ma première marque"
          ctaHref="/app/onboarding"
        />
      ) : (
        <>
          <Suspense fallback={<KpiCardSkeleton n={5} />}>
            <AsyncDashboardKpis userId={ctx.user.id} brandList={brandList} tier={ctx.tier} />
          </Suspense>

          <Suspense fallback={<KpiCardSkeleton n={3} />}>
            <AsyncDashboardActions userId={ctx.user.id} brandList={brandList} />
          </Suspense>

          <Suspense fallback={<BrandRowSkeleton n={Math.max(1, Math.min(brandList.length, 3))} />}>
            <AsyncDashboardBrandRows userId={ctx.user.id} brandList={brandList} />
          </Suspense>

          <Suspense fallback={<TimelineSkeleton n={5} />}>
            <AsyncDashboardActivity userId={ctx.user.id} brandList={brandList} />
          </Suspense>

          <div className="text-xs text-ink-muted text-center pt-6 border-t border-ink/[0.06]">
            Plan {ctx.tier.toUpperCase()} — {brandList.length}/{limits.brands} marque{limits.brands > 1 ? "s" : ""} ·{" "}
            <Link href="/app/billing" className="text-brand-500 hover:underline">Gérer mon plan</Link>
          </div>
        </>
      )}
    </Section>
  );
}

// ============== Async sub-components ==============

async function AsyncDashboardKpis({
  userId,
  brandList,
  tier,
}: {
  userId: string;
  brandList: BrandLatest[];
  tier: string;
}) {
  const sb = getServiceClient();
  const startOfMonthIso = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1, 0, 0, 0, 0)).toISOString();

  const [evolutionRows, snaps7d, monthCountRes] = await Promise.all([
    getEvolution(userId),
    getSnapshots7d(userId),
    sb.from("saas_brand_snapshots")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfMonthIso),
  ]);
  const monthCount = (monthCountRes as any).count ?? 0;

  // Visibility / citation deltas vs 7j
  const visScores = brandList.map(b => b.visibility_score).filter(v => v !== null) as number[];
  const visAvgNow = visScores.length > 0 ? visScores.reduce((a, b) => a + Number(b), 0) / visScores.length : null;
  const citationScores = brandList.map(b => b.citation_rate).filter(v => v !== null) as number[];
  const citationAvgNow = citationScores.length > 0 ? citationScores.reduce((a, b) => a + Number(b), 0) / citationScores.length : null;

  const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000).toISOString();
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const evoOlderWindow = evolutionRows.filter((e: any) => e.snapshot_date < sevenDaysAgo && e.snapshot_date >= fourteenDaysAgo);
  const visOldByBrand: Record<string, number> = {};
  const citOldByBrand: Record<string, number> = {};
  for (const e of evoOlderWindow) {
    if (visOldByBrand[e.brand_id] === undefined && e.visibility_score !== null) visOldByBrand[e.brand_id] = Number(e.visibility_score);
    if (citOldByBrand[e.brand_id] === undefined && e.citation_rate !== null) citOldByBrand[e.brand_id] = Number(e.citation_rate);
  }
  const visOldVals = Object.values(visOldByBrand);
  const visAvg7d = visOldVals.length > 0 ? visOldVals.reduce((a, b) => a + b, 0) / visOldVals.length : null;
  const citOldVals = Object.values(citOldByBrand);
  const citAvg7d = citOldVals.length > 0 ? citOldVals.reduce((a, b) => a + b, 0) / citOldVals.length : null;
  const visDelta = (visAvgNow !== null && visAvg7d !== null) ? visAvgNow - visAvg7d : null;
  const citDelta = (citationAvgNow !== null && citAvg7d !== null) ? citationAvgNow - citAvg7d : null;

  const totalMentions7d = snaps7d.reduce((acc: number, s: any) => acc + (Number(s.total_mention_count) || 0), 0);

  // Concurrents (récupère competitor_domains via mini query)
  const distinctCompetitors = new Set<string>();
  for (const b of brandList) {
    const ctx_b = (b as any).competitor_domains as string[] | undefined;
    if (Array.isArray(ctx_b)) for (const c of ctx_b) distinctCompetitors.add(c);
  }
  let competitorsCount = distinctCompetitors.size;
  if (competitorsCount === 0 && brandList.length > 0) {
    const { data: brandCompetitorRows } = await sb
      .from("saas_tracked_brands")
      .select("competitor_domains")
      .eq("user_id", userId);
    const set = new Set<string>();
    for (const row of (brandCompetitorRows as any[] | null) ?? []) {
      for (const c of (row.competitor_domains as string[] | null) ?? []) set.add(c);
    }
    competitorsCount = set.size;
  }

  const sparkValues = (() => {
    const byDate: Record<string, number[]> = {};
    for (const e of evolutionRows) {
      if (e.visibility_score !== null) (byDate[e.snapshot_date] ||= []).push(Number(e.visibility_score));
    }
    return Object.entries(byDate)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([, vals]) => vals.reduce((a, b) => a + b, 0) / vals.length);
  })();

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      <DashboardKpiCard
        eyebrow="Visibility moy."
        value={visAvgNow !== null ? visAvgNow.toFixed(0) : "—"}
        delta={visDelta}
        hint="vs il y a 7 jours"
        sparkValues={sparkValues}
      />
      <DashboardKpiCard
        eyebrow="Citation moy."
        value={citationAvgNow !== null ? `${citationAvgNow.toFixed(0)}%` : "—"}
        delta={citDelta}
        deltaUnit="%"
        hint="vs il y a 7 jours"
      />
      <DashboardKpiCard
        eyebrow="Mentions 7j"
        value={String(totalMentions7d)}
        hint="brand + concurrents"
      />
      <DashboardKpiCard
        eyebrow="Concurrents"
        value={String(competitorsCount)}
        hint="distincts trackés"
      />
      <DashboardKpiCard
        eyebrow="Snapshots ce mois"
        value={String(monthCount)}
        hint={`Plan ${tier.toUpperCase()}`}
      />
    </div>
  );
}

async function AsyncDashboardActions({
  userId,
  brandList,
}: {
  userId: string;
  brandList: BrandLatest[];
}) {
  const sb = getServiceClient();
  const [alertList, topRecoRes] = await Promise.all([
    getAlerts(userId),
    sb.from("saas_recommendations")
      .select("id, title, priority, brand_id, created_at, snapshot_id")
      .eq("user_id", userId)
      .eq("is_read", false)
      .order("priority", { ascending: true })
      .limit(1),
  ]);
  const topRecoRow = ((topRecoRes.data as any[] | null) ?? [])[0] ?? null;

  // Suggestion contextuelle (rule-based)
  const suggestion = (() => {
    if (brandList.length === 0) return null;
    const stale = brandList.find(b => b.last_snapshot_at && (Date.now() - new Date(b.last_snapshot_at).getTime()) > SEVEN_DAYS_MS);
    if (stale) {
      const days = Math.floor((Date.now() - new Date(stale.last_snapshot_at!).getTime()) / 86400000);
      return {
        title: `Lance un snapshot sur ${stale.name}`,
        body: `Dernier snapshot il y a ${days}j — il est temps de revoir où tu en es.`,
        href: `/app/brands/${stale.id}`,
      };
    }
    return {
      title: "Tout est sous contrôle",
      body: "Pas d'action urgente cette semaine. Continue de surveiller les évolutions.",
      href: undefined,
    };
  })();

  return (
    <>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <SuggestionCard
          variant={alertList.length > 0 ? "alerts" : "idle"}
          eyebrow="Alertes"
          title={alertList.length > 0 ? `${alertList.length} alerte${alertList.length > 1 ? "s" : ""} non lue${alertList.length > 1 ? "s" : ""}` : "Tout est sous contrôle"}
          body={alertList.length > 0 ? "Variations significatives détectées sur tes marques." : "Aucun mouvement majeur cette semaine."}
          href={alertList.length > 0 ? "/app/alerts" : undefined}
          count={alertList.length}
        />
        <SuggestionCard
          variant={topRecoRow ? "recos" : "idle"}
          eyebrow="Recommandations"
          title={topRecoRow ? topRecoRow.title : "Aucune action urgente"}
          body={topRecoRow ? "Action prioritaire détectée par l'analyse Haiku." : "Toutes les recommandations ont été traitées."}
          href={topRecoRow ? `/app/brands/${topRecoRow.brand_id}` : undefined}
        />
        {suggestion && (
          <SuggestionCard
            variant="context"
            eyebrow="Action suggérée"
            title={suggestion.title}
            body={suggestion.body}
            href={suggestion.href}
          />
        )}
      </div>

      {alertList.length > 0 && (
        <div className="mb-8">
          <Eyebrow className="mb-3">Alertes non lues</Eyebrow>
          <AlertBanner alerts={alertList} />
        </div>
      )}
    </>
  );
}

async function AsyncDashboardBrandRows({
  userId,
  brandList,
}: {
  userId: string;
  brandList: BrandLatest[];
}) {
  if (brandList.length === 0) return null;

  const sb = getServiceClient();
  const [evolutionRows, snaps7d] = await Promise.all([
    getEvolution(userId),
    getSnapshots7d(userId),
  ]);

  const evoByBrand: Record<string, Array<{ snapshot_date: string; visibility: number | null }>> = {};
  for (const e of evolutionRows) {
    (evoByBrand[e.brand_id] ||= []).push({ snapshot_date: e.snapshot_date, visibility: e.visibility_score });
  }

  const latestSnapshotIds = brandList
    .map(b => snaps7d.find((s: any) => s.brand_id === b.id)?.id)
    .filter(Boolean) as string[];
  const topCompetitorByBrand: Record<string, string | null> = {};
  if (latestSnapshotIds.length > 0) {
    const { data: respRows } = await sb
      .from("saas_snapshot_responses")
      .select("snapshot_id, competitors_mentioned")
      .in("snapshot_id", latestSnapshotIds);
    const counts: Record<string, Record<string, number>> = {};
    for (const r of (respRows as any[] | null) ?? []) {
      const sid = r.snapshot_id as string;
      const comps = (r.competitors_mentioned ?? []) as string[];
      for (const c of comps) {
        (counts[sid] ||= {})[c] = (counts[sid][c] ?? 0) + 1;
      }
    }
    for (const b of brandList) {
      const sid = snaps7d.find((s: any) => s.brand_id === b.id)?.id;
      if (!sid || !counts[sid]) { topCompetitorByBrand[b.id] = null; continue; }
      const top = Object.entries(counts[sid]).sort((a, b) => b[1] - a[1])[0];
      topCompetitorByBrand[b.id] = top ? top[0] : null;
    }
  }

  return (
    <div className="mb-8">
      <Eyebrow className="mb-3">{brandList.length > 1 ? "Mes marques" : "Ma marque"}</Eyebrow>
      <div className="bg-white rounded-lg border border-ink/[0.08]">
        {brandList.map(b => {
          const evo = (evoByBrand[b.id] ?? []).slice(0, 6).reverse();
          const sparkValues = evo.map(e => Number(e.visibility ?? 0)).filter(v => !isNaN(v));
          return (
            <BrandOverviewRow
              key={b.id}
              brandId={b.id}
              name={b.name}
              domain={b.domain}
              visibilityScore={b.visibility_score}
              topCompetitor={topCompetitorByBrand[b.id] ?? null}
              sparkValues={sparkValues}
              unreadAlerts={b.unread_alerts}
            />
          );
        })}
      </div>
    </div>
  );
}

async function AsyncDashboardActivity({
  userId,
  brandList,
}: {
  userId: string;
  brandList: BrandLatest[];
}) {
  const sb = getServiceClient();
  const sevenDaysAgoIso = new Date(Date.now() - SEVEN_DAYS_MS).toISOString();

  const [snaps7d, alertList, recosRes, brandsRes] = await Promise.all([
    getSnapshots7d(userId),
    getAlerts(userId),
    sb.from("saas_recommendations")
      .select("id, title, priority, brand_id, created_at")
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgoIso)
      .order("created_at", { ascending: false })
      .limit(10),
    sb.from("saas_tracked_brands")
      .select("id, name, created_at")
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgoIso)
      .order("created_at", { ascending: false }),
  ]);

  const recentRecos = (recosRes.data as any[] | null) ?? [];
  const recentBrands = (brandsRes.data as any[] | null) ?? [];
  const brandNameById: Record<string, string> = {};
  for (const b of brandList) brandNameById[b.id] = b.name;

  const activity: ActivityItem[] = [];
  for (const s of snaps7d) {
    activity.push({
      kind: "snapshot",
      brandId: s.brand_id,
      brandName: brandNameById[s.brand_id] ?? "—",
      title: `Snapshot completed`,
      hint: s.visibility_score !== null ? `visibility ${Number(s.visibility_score).toFixed(0)}` : undefined,
      createdAt: s.created_at,
    });
  }
  for (const a of alertList) {
    activity.push({
      kind: "alert",
      brandId: a.brand_id,
      brandName: brandNameById[a.brand_id] ?? "—",
      title: a.title,
      createdAt: a.created_at,
    });
  }
  for (const r of recentRecos) {
    activity.push({
      kind: "reco",
      brandId: r.brand_id,
      brandName: brandNameById[r.brand_id] ?? "—",
      title: r.title,
      createdAt: r.created_at,
    });
  }
  for (const b of recentBrands) {
    activity.push({
      kind: "brand_created",
      brandId: b.id,
      brandName: b.name,
      title: `Marque ajoutée`,
      createdAt: b.created_at,
    });
  }
  activity.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mb-10">
      <ActivityTimeline items={activity} />
    </div>
  );
}
