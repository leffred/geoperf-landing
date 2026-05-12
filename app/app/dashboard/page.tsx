// V2 — Dashboard : multi-brand overview.
// KPI strip (4) + Evolution chart (1.7fr) + Brand cards (1fr) +
// LLM Heatmap + Alerts panel + Recommendations row.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUp, ArrowDown, Sparkles, RefreshCw, Download, Flag } from "lucide-react";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { KpiStrip, KpiCell } from "@/components/saas/v2/KpiStrip";
import { Delta } from "@/components/saas/v2/Delta";
import { EvolutionChart, type EvolutionSeries } from "@/components/saas/v2/EvolutionChart";
import { Sparkline } from "@/components/saas/v2/Sparkline";
import { LLMHeatmap } from "@/components/saas/v2/LLMHeatmap";
import { llmColor } from "@/components/saas/v2/LLMPill";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard — Geoperf", robots: { index: false, follow: false } };

const SEVEN_DAYS_MS = 7 * 86400000;

const SERIES_COLORS = [
  "#2563EB", // primary brand
  "#7A5AE0",
  "#10A37F",
  "#C77D2C",
  "#D97706",
  "#20808D",
];

interface BrandLatestRow {
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
}

interface EvolutionRow {
  brand_id: string;
  name: string;
  snapshot_date: string;
  visibility_score: number | null;
  citation_rate: number | null;
  avg_rank: number | null;
}

interface AlertRow {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  body: string | null;
  brand_id: string | null;
  created_at: string;
}

interface RecoRow {
  id: string;
  title: string;
  body: string | null;
  category: string;
  priority: string;
  brand_id: string | null;
  created_at: string;
}

export default async function DashboardPage() {
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const [brandRes, evolutionRes, alertsRes, recosRes] = await Promise.all([
    sb.from("v_saas_brand_latest")
      .select("id, name, domain, category_slug, visibility_score, avg_rank, citation_rate, share_of_voice, last_snapshot_at, unread_alerts, unread_recos")
      .eq("user_id", ctx.user.id),
    sb.from("v_saas_brand_evolution")
      .select("brand_id, name, snapshot_date, visibility_score, citation_rate, avg_rank")
      .eq("user_id", ctx.user.id)
      .order("snapshot_date", { ascending: true })
      .limit(120),
    sb.from("saas_alerts")
      .select("id, alert_type, severity, title, body, brand_id, created_at")
      .eq("user_id", ctx.user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    sb.from("saas_recommendations")
      .select("id, title, body, category, priority, brand_id, created_at")
      .eq("user_id", ctx.user.id)
      .eq("is_read", false)
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const brandList = (brandRes.data as BrandLatestRow[] | null) ?? [];
  const evolutionRows = (evolutionRes.data as EvolutionRow[] | null) ?? [];
  const alerts = (alertsRes.data as AlertRow[] | null) ?? [];
  const recos = (recosRes.data as RecoRow[] | null) ?? [];

  // Empty state — keep simple. No brands yet → redirect to onboarding.
  if (brandList.length === 0) {
    redirect("/app/onboarding");
  }

  // ──────────────── KPI aggregates ────────────────
  const visScores = brandList.map((b) => b.visibility_score).filter((v) => v !== null) as number[];
  const visAvgNow = visScores.length > 0 ? visScores.reduce((a, b) => a + b, 0) / visScores.length : null;

  const citScores = brandList.map((b) => b.citation_rate).filter((v) => v !== null) as number[];
  const citAvgNow = citScores.length > 0 ? citScores.reduce((a, b) => a + b, 0) / citScores.length : null;

  const rankScores = brandList.map((b) => b.avg_rank).filter((v) => v !== null) as number[];
  const rankAvgNow = rankScores.length > 0 ? rankScores.reduce((a, b) => a + b, 0) / rankScores.length : null;

  const sovScores = brandList.map((b) => b.share_of_voice).filter((v) => v !== null) as number[];
  const sovAvgNow = sovScores.length > 0 ? sovScores.reduce((a, b) => a + b, 0) / sovScores.length : null;

  // Deltas vs window [now-14d, now-7d]
  const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS);
  const fourteenDaysAgo = new Date(Date.now() - 2 * SEVEN_DAYS_MS);

  const evoOldWindow = evolutionRows.filter((e) => {
    const d = new Date(e.snapshot_date);
    return d >= fourteenDaysAgo && d < sevenDaysAgo;
  });
  const visOldByBrand: Record<string, number> = {};
  const citOldByBrand: Record<string, number> = {};
  const rankOldByBrand: Record<string, number> = {};
  for (const e of evoOldWindow) {
    if (visOldByBrand[e.brand_id] === undefined && e.visibility_score !== null) visOldByBrand[e.brand_id] = Number(e.visibility_score);
    if (citOldByBrand[e.brand_id] === undefined && e.citation_rate !== null) citOldByBrand[e.brand_id] = Number(e.citation_rate);
    if (rankOldByBrand[e.brand_id] === undefined && e.avg_rank !== null) rankOldByBrand[e.brand_id] = Number(e.avg_rank);
  }
  const visOldVals = Object.values(visOldByBrand);
  const citOldVals = Object.values(citOldByBrand);
  const rankOldVals = Object.values(rankOldByBrand);
  const visAvgOld = visOldVals.length ? visOldVals.reduce((a, b) => a + b, 0) / visOldVals.length : null;
  const citAvgOld = citOldVals.length ? citOldVals.reduce((a, b) => a + b, 0) / citOldVals.length : null;
  const rankAvgOld = rankOldVals.length ? rankOldVals.reduce((a, b) => a + b, 0) / rankOldVals.length : null;

  const visDelta = visAvgNow !== null && visAvgOld !== null ? visAvgNow - visAvgOld : null;
  const citDelta = citAvgNow !== null && citAvgOld !== null ? citAvgNow - citAvgOld : null;
  const rankDelta = rankAvgNow !== null && rankAvgOld !== null ? rankAvgNow - rankAvgOld : null;
  const sovDelta = null; // No historical SoV in v_saas_brand_evolution yet.

  // ──────────────── Evolution chart data ────────────────
  // Group rows by snapshot_date (limit to 12 most recent dates), assign series per brand (max 3).
  const allDatesSet = new Set<string>();
  for (const e of evolutionRows) allDatesSet.add(e.snapshot_date);
  const allDates = Array.from(allDatesSet).sort().slice(-12);

  const topBrands = brandList.slice(0, 3); // primary + 2 competitors

  const series: EvolutionSeries[] = topBrands.map((b, i) => ({
    name: b.name,
    color: SERIES_COLORS[i] ?? SERIES_COLORS[0],
    data: allDates.map((d) => {
      const row = evolutionRows.find((e) => e.brand_id === b.id && e.snapshot_date === d);
      return row?.visibility_score ?? null;
    }),
  }));

  const labels = allDates.map((d) => {
    // ISO date → week label "SXX"
    const dt = new Date(d);
    const week = getWeekNumber(dt);
    return `S${week}`;
  });

  // ──────────────── Brand cards (top 3) ────────────────
  const brandCardsData = topBrands.map((b, i) => {
    const sparkValues: number[] = allDates
      .map((d) => evolutionRows.find((e) => e.brand_id === b.id && e.snapshot_date === d)?.visibility_score)
      .filter((v): v is number => v !== null && v !== undefined);
    const oldVis = visOldByBrand[b.id];
    const delta = b.visibility_score !== null && oldVis !== undefined ? Number(b.visibility_score) - oldVis : null;
    return {
      id: b.id,
      name: b.name,
      domain: b.domain,
      color: SERIES_COLORS[i] ?? SERIES_COLORS[0],
      score: b.visibility_score,
      delta,
      rank: b.avg_rank,
      sparkValues,
    };
  });

  // ──────────────── LLM heatmap ────────────────
  // Use latest snapshot per brand → join saas_snapshot_responses → mean visibility_score per brand × LLM.
  const heatmap = await buildLLMHeatmap(sb, ctx.user.id, brandList);

  // ──────────────── Page render ────────────────
  return (
    <div>
      {/* Page header */}
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="font-mono uppercase text-brand-500" style={{ fontSize: 10, letterSpacing: "0.16em" }}>
            // Monitoring · Semaine {getWeekNumber(new Date())}
          </div>
          <h1 className="text-ink leading-tight mt-1.5" style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Dashboard
          </h1>
          <div className="text-ink-muted mt-1" style={{ fontSize: 13 }}>
            {brandList.length} marque{brandList.length > 1 ? "s" : ""} suivie{brandList.length > 1 ? "s" : ""} · Dernier snapshot {fmtLastSnapshot(brandList)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/app/brands/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-strong bg-white text-ink hover:bg-surface transition-colors duration-fast"
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            <RefreshCw size={12} strokeWidth={1.8} />
            Lancer un snapshot
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-strong bg-white text-ink hover:bg-surface transition-colors duration-fast"
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            <Download size={12} strokeWidth={1.8} />
            Export
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="mb-4">
        <KpiStrip>
          <KpiCell
            label="Score de visibilité"
            value={visAvgNow !== null ? visAvgNow.toFixed(1) : "—"}
            delta={visDelta}
            hint={`moyenne pondérée · ${brandList.length} marque${brandList.length > 1 ? "s" : ""}`}
          />
          <KpiCell
            label="Rang moyen"
            value={rankAvgNow !== null ? rankAvgNow.toFixed(1) : "—"}
            delta={rankDelta}
            deltaSuffix=""
            deltaInvert
            hint="rang quand cité · plus bas = mieux"
          />
          <KpiCell
            label="Taux de citation"
            value={
              <>
                {citAvgNow !== null ? citAvgNow.toFixed(0) : "—"}
                <span className="text-ink-muted ml-0.5" style={{ fontSize: 14 }}>%</span>
              </>
            }
            delta={citDelta}
            deltaSuffix="%"
            hint="prompts où ≥1 marque suivie est citée"
          />
          <KpiCell
            label="Part de voix LLM"
            value={
              <>
                {sovAvgNow !== null ? sovAvgNow.toFixed(0) : "—"}
                <span className="text-ink-muted ml-0.5" style={{ fontSize: 14 }}>%</span>
              </>
            }
            delta={sovDelta}
            deltaSuffix="%"
            hint="vs concurrents directs · top 5 catégorie"
          />
        </KpiStrip>
      </div>

      {/* Row 1 : evolution chart + brand cards */}
      <div className="grid mb-4 gap-4" style={{ gridTemplateColumns: "minmax(0, 1.7fr) minmax(0, 1fr)" }}>
        <Card>
          <CardHeader
            title="Évolution hebdo"
            sub={`Score de visibilité agrégé · 12 dernières semaines`}
            right={
              <div className="flex items-center gap-3">
                {series.map((s) => (
                  <span key={s.name} className="inline-flex items-center gap-1.5 text-ink-muted" style={{ fontSize: 11 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                    {s.name}
                  </span>
                ))}
              </div>
            }
          />
          <EvolutionChart series={series} labels={labels} height={240} />
        </Card>

        <div className="flex flex-col gap-3 min-w-0">
          {brandCardsData.map((b) => (
            <Link
              key={b.id}
              href={`/app/brands/${b.id}`}
              className="block bg-white border border-DEFAULT rounded-xl shadow-card hover:shadow-cardHover transition-shadow duration-fast"
              style={{ padding: 14 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: b.color, flexShrink: 0 }} />
                    <div className="text-ink truncate" style={{ fontSize: 14, fontWeight: 600 }}>{b.name}</div>
                    <span className="font-mono text-ink-subtle truncate" style={{ fontSize: 11 }}>{b.domain}</span>
                  </div>
                  <div className="flex items-center gap-5 mt-2.5">
                    <div>
                      <div className="font-mono text-ink-subtle uppercase" style={{ fontSize: 10, letterSpacing: "0.1em" }}>Score</div>
                      <div className="font-mono text-ink" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.1, marginTop: 1, fontVariantNumeric: "tabular-nums" }}>
                        {b.score !== null ? Math.round(b.score) : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-ink-subtle uppercase" style={{ fontSize: 10, letterSpacing: "0.1em" }}>Δ 7j</div>
                      <div style={{ marginTop: 4 }}><Delta value={b.delta} /></div>
                    </div>
                    <div>
                      <div className="font-mono text-ink-subtle uppercase" style={{ fontSize: 10, letterSpacing: "0.1em" }}>Rang</div>
                      <div className="font-mono text-ink" style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.1, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
                        {b.rank !== null ? Number(b.rank).toFixed(1) : "—"}
                      </div>
                    </div>
                  </div>
                </div>
                <Sparkline data={b.sparkValues.length >= 2 ? b.sparkValues : [b.sparkValues[0] ?? 0, b.sparkValues[0] ?? 0]} color={b.color} width={84} height={36} area />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Row 2 : heatmap + alerts */}
      <div className="grid mb-4 gap-4" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)" }}>
        <Card>
          <CardHeader
            title="Matrice marques × LLM"
            sub="Score de citation par modèle, dernière semaine"
            right={
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-DEFAULT text-ink-muted" style={{ fontSize: 11 }}>
                {heatmap.rows.length} marques · {heatmap.cols.length} modèles
              </span>
            }
          />
          {heatmap.rows.length === 0 ? (
            <div className="text-ink-subtle text-center py-8" style={{ fontSize: 13 }}>
              Pas encore de snapshot completed.
            </div>
          ) : (
            <LLMHeatmap rows={heatmap.rows} cols={heatmap.cols} values={heatmap.values} />
          )}
        </Card>

        <Card>
          <CardHeader
            title="Alertes récentes"
            right={
              <Link href="/app/alerts" className="font-mono text-ink-subtle hover:text-brand-500 transition-colors duration-fast no-underline" style={{ fontSize: 11 }}>
                Voir tout →
              </Link>
            }
          />
          <div className="flex flex-col gap-2.5">
            {alerts.length === 0 ? (
              <div className="text-ink-subtle py-6 text-center" style={{ fontSize: 13 }}>
                Pas d&apos;alerte cette semaine.
              </div>
            ) : (
              alerts.map((a, i) => <AlertRow key={a.id} alert={a} last={i === alerts.length - 1} />)
            )}
          </div>
        </Card>
      </div>

      {/* Row 3 : recommendations */}
      <Card>
        <CardHeader
          title="Recommandations prioritaires"
          sub="Générées par Claude Haiku · snapshot du dernier run"
          right={
            <Link href="/app/brands" className="inline-flex items-center px-2.5 py-1 rounded-md border border-strong bg-white text-ink hover:bg-surface transition-colors duration-fast" style={{ fontSize: 12, fontWeight: 500 }}>
              Tout afficher
            </Link>
          }
        />
        {recos.length === 0 ? (
          <div className="text-ink-subtle text-center py-6" style={{ fontSize: 13 }}>
            Aucune recommandation active.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recos.map((r) => (
              <Link
                key={r.id}
                href={r.brand_id ? `/app/brands/${r.brand_id}` : "/app/brands"}
                className="block hover:bg-surface transition-colors duration-fast"
                style={{
                  padding: 14,
                  border: "1px solid rgba(10,14,26,0.08)",
                  borderRadius: 10,
                  borderLeft: `2px solid ${prioColor(r.priority)}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      background: prioChipBg(r.priority),
                      color: prioChipColor(r.priority),
                      borderColor: prioChipBorder(r.priority),
                    }}
                  >
                    <Flag size={10} strokeWidth={1.8} />
                    {prioLabel(r.priority)}
                  </span>
                  <span className="font-mono text-ink-subtle uppercase" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
                    {r.category.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="text-ink mb-1.5" style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35 }}>{r.title}</div>
                {r.body && (
                  <div className="text-ink-muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
                    {r.body.slice(0, 200)}
                    {r.body.length > 200 ? "…" : ""}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ──────────────── Helpers ────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-DEFAULT rounded-xl shadow-card" style={{ padding: 18 }}>
      {children}
    </div>
  );
}

function CardHeader({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3.5 gap-3 flex-wrap">
      <div className="min-w-0">
        <div className="text-ink" style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
        {sub && <div className="text-ink-muted truncate" style={{ fontSize: 12, marginTop: 1 }}>{sub}</div>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

function AlertRow({ alert, last }: { alert: AlertRow; last: boolean }) {
  const meta = alertMeta(alert.alert_type);
  return (
    <div
      className="flex items-start gap-3"
      style={{
        paddingBottom: last ? 0 : 10,
        borderBottom: last ? "none" : "1px solid rgba(10,14,26,0.08)",
      }}
    >
      <div
        className="grid place-items-center rounded-md shrink-0"
        style={{
          width: 22,
          height: 22,
          background: meta.bg,
          color: meta.color,
        }}
      >
        {meta.icon === "up" && <ArrowUp size={11} strokeWidth={2.2} />}
        {meta.icon === "down" && <ArrowDown size={11} strokeWidth={2.2} />}
        {meta.icon === "source" && <Sparkles size={11} strokeWidth={1.8} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-ink" style={{ fontSize: 13, fontWeight: 500 }}>{alert.title}</div>
        {alert.body && (
          <div className="text-ink-muted" style={{ fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>
            {alert.body.slice(0, 140)}
            {alert.body.length > 140 ? "…" : ""}
          </div>
        )}
      </div>
      <div className="font-mono text-ink-subtle whitespace-nowrap" style={{ fontSize: 10 }}>
        {relativeTime(alert.created_at)}
      </div>
    </div>
  );
}

function alertMeta(type: string): { icon: "up" | "down" | "source"; bg: string; color: string } {
  if (["rank_gain", "citation_gain"].includes(type)) {
    return { icon: "up", bg: "color-mix(in srgb, #059669 14%, transparent)", color: "#059669" };
  }
  if (["rank_drop", "citation_loss", "competitor_overtake"].includes(type)) {
    return { icon: "down", bg: "color-mix(in srgb, #DC2626 14%, transparent)", color: "#DC2626" };
  }
  return { icon: "source", bg: "color-mix(in srgb, #2563EB 14%, transparent)", color: "#2563EB" };
}

function prioColor(p: string): string {
  if (p === "high") return "#DC2626";
  if (p === "medium") return "#D97706";
  return "#8C94A6";
}

function prioChipBg(p: string): string {
  if (p === "high") return "color-mix(in srgb, #DC2626 12%, transparent)";
  if (p === "medium") return "color-mix(in srgb, #D97706 12%, transparent)";
  return "#F7F8FA";
}

function prioChipColor(p: string): string {
  if (p === "high") return "#DC2626";
  if (p === "medium") return "#D97706";
  return "#5B6478";
}

function prioChipBorder(p: string): string {
  if (p === "high") return "color-mix(in srgb, #DC2626 24%, transparent)";
  if (p === "medium") return "color-mix(in srgb, #D97706 24%, transparent)";
  return "rgba(10,14,26,0.08)";
}

function prioLabel(p: string): string {
  if (p === "high") return "Haute";
  if (p === "medium") return "Moyenne";
  return "Basse";
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 60) return `${min}min`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `il y a ${days}j`;
}

function fmtLastSnapshot(brands: BrandLatestRow[]): string {
  const latest = brands
    .map((b) => b.last_snapshot_at)
    .filter((x): x is string => Boolean(x))
    .sort()
    .pop();
  if (!latest) return "aucun snapshot encore";
  return new Date(latest).toLocaleString("fr-FR", { weekday: "long", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function getWeekNumber(d: Date): number {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

// ──────────────── LLM Heatmap data fetch ────────────────

async function buildLLMHeatmap(
  sb: ReturnType<typeof getServiceClient>,
  userId: string,
  brandList: BrandLatestRow[],
): Promise<{ rows: string[]; cols: string[]; values: Array<Array<number | null>> }> {
  if (brandList.length === 0) {
    return { rows: [], cols: [], values: [] };
  }
  // Get the latest completed snapshot per brand (limit cap = 7 rows for V2 spec).
  const limitedBrands = brandList.slice(0, 7);
  const { data: snapRows } = await sb
    .from("saas_brand_snapshots")
    .select("id, brand_id")
    .eq("user_id", userId)
    .eq("status", "completed")
    .in("brand_id", limitedBrands.map((b) => b.id))
    .order("completed_at", { ascending: false });

  const snapList = (snapRows as Array<{ id: string; brand_id: string }> | null) ?? [];
  const latestSnapByBrand: Record<string, string> = {};
  for (const s of snapList) {
    if (!latestSnapByBrand[s.brand_id]) latestSnapByBrand[s.brand_id] = s.id;
  }
  const snapshotIds = Object.values(latestSnapByBrand);
  if (snapshotIds.length === 0) return { rows: [], cols: [], values: [] };

  const { data: respRows } = await sb
    .from("saas_snapshot_responses")
    .select("snapshot_id, llm, brand_mentioned, brand_rank")
    .in("snapshot_id", snapshotIds);

  type R = { snapshot_id: string; llm: string; brand_mentioned: boolean; brand_rank: number | null };
  const responses = (respRows as R[] | null) ?? [];

  // Aggregate per brand × llm : citation rate × 100 (% prompts where brand was mentioned).
  const accum: Record<string, Record<string, { mentioned: number; total: number }>> = {};
  const llmSet = new Set<string>();
  for (const r of responses) {
    // Find brand_id from snapshot_id
    const brandId = Object.entries(latestSnapByBrand).find(([, sid]) => sid === r.snapshot_id)?.[0];
    if (!brandId) continue;
    llmSet.add(r.llm);
    (accum[brandId] ||= {});
    (accum[brandId][r.llm] ||= { mentioned: 0, total: 0 });
    accum[brandId][r.llm].total += 1;
    if (r.brand_mentioned) accum[brandId][r.llm].mentioned += 1;
  }

  const cols = Array.from(llmSet).sort();
  const rows = limitedBrands.map((b) => b.name);
  const values = limitedBrands.map((b) =>
    cols.map((c) => {
      const cell = accum[b.id]?.[c];
      if (!cell || cell.total === 0) return null;
      return Math.round((cell.mentioned / cell.total) * 100);
    }),
  );

  // Friendly LLM column labels — strip provider prefix.
  const friendlyCols = cols.map(humanLLMLabel);

  return { rows, cols: friendlyCols, values };
}

function humanLLMLabel(llm: string): string {
  const key = llm.toLowerCase();
  if (key.includes("gpt-4o-mini")) return "GPT-4o mini";
  if (key.includes("gpt-4o")) return "GPT-4o";
  if (key.includes("haiku")) return "Claude H";
  if (key.includes("sonnet")) return "Claude S";
  if (key.includes("claude")) return "Claude";
  if (key.includes("gemini") && key.includes("flash")) return "Gemini F";
  if (key.includes("gemini")) return "Gemini";
  if (key.includes("perplexity") || key.includes("sonar")) return "Perplexity";
  return llm.split("/").pop() ?? llm;
}

// Suppress unused color helper warning
void llmColor;
