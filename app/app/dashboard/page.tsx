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

export default async function DashboardPage() {
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const sevenDaysAgoIso = new Date(Date.now() - SEVEN_DAYS_MS).toISOString();
  const startOfMonthIso = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1, 0, 0, 0, 0)).toISOString();

  const [
    { data: brands },
    { data: alerts },
    { data: evolution },
    { data: snapshots7d },
    { data: monthSnapshotsCount },
    { data: topReco },
  ] = await Promise.all([
    sb.from("v_saas_brand_latest")
      .select("id, name, domain, category_slug, visibility_score, avg_rank, citation_rate, share_of_voice, last_snapshot_at, unread_alerts, unread_recos")
      .eq("user_id", ctx.user.id),
    sb.from("saas_alerts")
      .select("id, alert_type, severity, title, body, brand_id, created_at")
      .eq("user_id", ctx.user.id)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(5),
    sb.from("v_saas_brand_evolution")
      .select("brand_id, name, snapshot_date, visibility_score, citation_rate, avg_rank")
      .eq("user_id", ctx.user.id)
      .order("snapshot_date", { ascending: false })
      .limit(50),
    sb.from("saas_brand_snapshots")
      .select("id, brand_id, status, visibility_score, citation_rate, brand_mention_count, total_mention_count, created_at, completed_at")
      .eq("user_id", ctx.user.id)
      .eq("status", "completed")
      .gte("created_at", sevenDaysAgoIso)
      .order("created_at", { ascending: false }),
    sb.from("saas_brand_snapshots")
      .select("id", { count: "exact", head: false })
      .eq("user_id", ctx.user.id)
      .gte("created_at", startOfMonthIso)
      .limit(1),
    sb.from("saas_recommendations")
      .select("id, title, priority, brand_id, created_at, snapshot_id")
      .eq("user_id", ctx.user.id)
      .eq("is_read", false)
      .order("priority", { ascending: true })
      .limit(1),
  ]);

  const brandList = (brands as BrandLatest[] | null) ?? [];
  const alertList = (alerts as any[] | null) ?? [];
  const evolutionRows = (evolution as any[] | null) ?? [];
  const snaps7d = (snapshots7d as any[] | null) ?? [];
  const topRecoRow = ((topReco as any[] | null) ?? [])[0] ?? null;
  const monthCount = await (async () => {
    const { count } = await sb
      .from("saas_brand_snapshots")
      .select("id", { count: "exact", head: true })
      .eq("user_id", ctx.user.id)
      .gte("created_at", startOfMonthIso);
    return count ?? 0;
  })();

  // ============== Auto-redirect §4.2 ==============
  if (
    brandList.length === 1 &&
    alertList.length === 0 &&
    brandList[0].last_snapshot_at &&
    Date.now() - new Date(brandList[0].last_snapshot_at).getTime() < SEVEN_DAYS_MS
  ) {
    redirect(`/app/brands/${brandList[0].id}`);
  }

  // ============== KPIs §4.1 ROW 1 ==============
  const limits = tierLimits(ctx.tier);
  const firstName = ctx.profile?.full_name?.split(" ")[0] || ctx.user.email?.split("@")[0];

  const visScores = brandList.map(b => b.visibility_score).filter(v => v !== null) as number[];
  const visAvgNow = visScores.length > 0 ? visScores.reduce((a, b) => a + Number(b), 0) / visScores.length : null;

  const citationScores = brandList.map(b => b.citation_rate).filter(v => v !== null) as number[];
  const citationAvgNow = citationScores.length > 0 ? citationScores.reduce((a, b) => a + Number(b), 0) / citationScores.length : null;

  // Delta vs 7j : on regarde l'evolution row la plus ancienne dans la fenêtre 7-14j
  const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000).toISOString();
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const evoOlderWindow = evolutionRows.filter(e => e.snapshot_date < sevenDaysAgo && e.snapshot_date >= fourteenDaysAgo);
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

  const totalMentions7d = snaps7d.reduce((acc, s) => acc + (Number(s.total_mention_count) || 0), 0);

  const distinctCompetitors = new Set<string>();
  for (const b of brandList) {
    const ctx_b = (b as any).competitor_domains as string[] | undefined;
    if (Array.isArray(ctx_b)) for (const c of ctx_b) distinctCompetitors.add(c);
  }
  // Fallback : on n'a pas competitor_domains dans v_saas_brand_latest, on récupère via une mini query
  let competitorsCount = distinctCompetitors.size;
  if (competitorsCount === 0 && brandList.length > 0) {
    const { data: brandCompetitorRows } = await sb
      .from("saas_tracked_brands")
      .select("competitor_domains")
      .eq("user_id", ctx.user.id);
    const set = new Set<string>();
    for (const row of (brandCompetitorRows as any[] | null) ?? []) {
      for (const c of (row.competitor_domains as string[] | null) ?? []) set.add(c);
    }
    competitorsCount = set.size;
  }

  // ============== Sparklines + topCompetitor par brand ==============
  const evoByBrand: Record<string, Array<{ snapshot_date: string; visibility: number | null }>> = {};
  for (const e of evolutionRows) {
    (evoByBrand[e.brand_id] ||= []).push({ snapshot_date: e.snapshot_date, visibility: e.visibility_score });
  }

  // Top competitor par brand : on prend la marque la plus citée dans le dernier snapshot
  const latestSnapshotIds = brandList
    .map(b => snaps7d.find(s => s.brand_id === b.id)?.id)
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
      const sid = snaps7d.find(s => s.brand_id === b.id)?.id;
      if (!sid || !counts[sid]) { topCompetitorByBrand[b.id] = null; continue; }
      const top = Object.entries(counts[sid]).sort((a, b) => b[1] - a[1])[0];
      topCompetitorByBrand[b.id] = top ? top[0] : null;
    }
  }

  // ============== Activity Timeline ==============
  const [{ data: recentRecos }, { data: recentBrands }] = await Promise.all([
    sb.from("saas_recommendations")
      .select("id, title, priority, brand_id, created_at")
      .eq("user_id", ctx.user.id)
      .gte("created_at", sevenDaysAgoIso)
      .order("created_at", { ascending: false })
      .limit(10),
    sb.from("saas_tracked_brands")
      .select("id, name, created_at")
      .eq("user_id", ctx.user.id)
      .gte("created_at", sevenDaysAgoIso)
      .order("created_at", { ascending: false }),
  ]);

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
  for (const r of (recentRecos as any[] | null) ?? []) {
    activity.push({
      kind: "reco",
      brandId: r.brand_id,
      brandName: brandNameById[r.brand_id] ?? "—",
      title: r.title,
      createdAt: r.created_at,
    });
  }
  for (const b of (recentBrands as any[] | null) ?? []) {
    activity.push({
      kind: "brand_created",
      brandId: b.id,
      brandName: b.name,
      title: `Marque ajoutée`,
      createdAt: b.created_at,
    });
  }
  activity.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // ============== Suggestion contextuelle (rule-based) ==============
  // S15 implem rule-based ; S16+ pourra la remplacer par un appel Haiku cached 1 fois/jour.
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
          {/* ROW 1 — 5 KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <DashboardKpiCard
              eyebrow="Visibility moy."
              value={visAvgNow !== null ? visAvgNow.toFixed(0) : "—"}
              delta={visDelta}
              hint="vs il y a 7 jours"
              sparkValues={(() => {
                // Aggregate: moyenne par snapshot_date sur tous les brands
                const byDate: Record<string, number[]> = {};
                for (const e of evolutionRows) {
                  if (e.visibility_score !== null) (byDate[e.snapshot_date] ||= []).push(Number(e.visibility_score));
                }
                return Object.entries(byDate)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .slice(-12)
                  .map(([, vals]) => vals.reduce((a, b) => a + b, 0) / vals.length);
              })()}
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
              hint={`Plan ${ctx.tier.toUpperCase()}`}
            />
          </div>

          {/* ROW 2 — 3 actions */}
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

          {/* ROW 3 — Multi-brand overview (si N > 1, sinon redirect déjà fait) */}
          {brandList.length > 1 && (
            <div className="mb-8">
              <Eyebrow className="mb-3">Mes marques</Eyebrow>
              <div className="bg-white rounded-lg border border-ink/[0.08]">
                {brandList.map(b => {
                  const evo = (evoByBrand[b.id] ?? []).slice(0, 6).reverse(); // 6 derniers chronologique
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
          )}

          {/* ROW 3 (mono-brand) — si l'auto-redirect ne s'est pas fait (alertes ou snapshot ancien) */}
          {brandList.length === 1 && (
            <div className="mb-8">
              <Eyebrow className="mb-3">Ma marque</Eyebrow>
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
          )}

          {/* ROW 4 — Activity Timeline */}
          <div className="mb-10">
            <ActivityTimeline items={activity} />
          </div>

          {/* Footer plan */}
          <div className="text-xs text-ink-muted text-center pt-6 border-t border-ink/[0.06]">
            Plan {ctx.tier.toUpperCase()} — {brandList.length}/{limits.brands} marque{limits.brands > 1 ? "s" : ""} ·{" "}
            <Link href="/app/billing" className="text-brand-500 hover:underline">Gérer mon plan</Link>
          </div>
        </>
      )}
    </Section>
  );
}
