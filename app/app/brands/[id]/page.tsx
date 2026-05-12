// V2 — Brand Detail page. Overview tab (full layout) — other tabs navigate to existing sub-routes.
// Breadcrumb · header avatar · 6 tabs · KPI strip · evolution + per-LLM bars · SoV + recos · sources + snapshots table.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Filter, Settings, RefreshCw, ChevronRight as ChevR, Flag } from "lucide-react";
import { requireSaasUser } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { KpiStrip, KpiCell } from "@/components/saas/v2/KpiStrip";
import { Delta } from "@/components/saas/v2/Delta";
import { EvolutionChart, type EvolutionSeries } from "@/components/saas/v2/EvolutionChart";
import { LLMPill } from "@/components/saas/v2/LLMPill";
import { refreshBrand } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Marque — Geoperf", robots: { index: false, follow: false } };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ refreshed?: string; error?: string; tab?: string }>;
};

const SERIES_COLORS = ["#2563EB", "#7A5AE0", "#10A37F", "#C77D2C", "#D97706", "#20808D"];

interface BrandRow {
  id: string;
  user_id: string;
  name: string;
  domain: string;
  category_slug: string;
  competitor_domains: string[];
  cadence: string;
  created_at: string;
}

interface SnapshotRow {
  id: string;
  brand_id: string;
  user_id: string;
  status: string;
  llms_used: string[];
  prompts_count: number;
  visibility_score: number | null;
  avg_rank: number | null;
  citation_rate: number | null;
  share_of_voice: number | null;
  total_cost_usd: number | null;
  raw_response_count: number;
  created_at: string;
  completed_at: string | null;
}

interface ResponseRow {
  llm: string;
  brand_mentioned: boolean;
  brand_rank: number | null;
  competitors_mentioned: string[];
  sources_cited: Array<{ url?: string; domain?: string; title?: string }> | null;
  cost_usd: number | null;
}

interface RecoRow {
  id: string;
  priority: string;
  category: string;
  title: string;
  body: string;
  created_at: string;
}

interface EvolutionRow {
  brand_id: string;
  name: string;
  snapshot_date: string;
  visibility_score: number | null;
}

export default async function BrandDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await requireSaasUser();
  const sb = getServiceClient();

  const [brandRes, snapRes, allSnapshotsRes] = await Promise.all([
    sb.from("saas_tracked_brands")
      .select("id, user_id, name, domain, category_slug, competitor_domains, cadence, is_active, created_at")
      .eq("id", id)
      .maybeSingle(),
    sb.from("saas_brand_snapshots")
      .select("id, brand_id, user_id, status, llms_used, prompts_count, visibility_score, avg_rank, citation_rate, share_of_voice, total_cost_usd, raw_response_count, created_at, completed_at")
      .eq("brand_id", id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    sb.from("saas_brand_snapshots")
      .select("id, brand_id, status, llms_used, prompts_count, visibility_score, avg_rank, total_cost_usd, created_at, completed_at")
      .eq("brand_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const brand = brandRes.data as BrandRow | null;
  const latest = snapRes.data as SnapshotRow | null;
  const allSnapshots = (allSnapshotsRes.data as Partial<SnapshotRow>[] | null) ?? [];

  if (!brand || brand.user_id !== user.id) notFound();

  // Previous snapshot for deltas
  const prevSnap = allSnapshots.find((s) => s.id !== latest?.id && s.status === "completed");

  // Latest snapshot responses (for per-LLM, SoV, sources)
  let responses: ResponseRow[] = [];
  if (latest) {
    const { data } = await sb
      .from("saas_snapshot_responses")
      .select("llm, brand_mentioned, brand_rank, competitors_mentioned, sources_cited, cost_usd")
      .eq("snapshot_id", latest.id);
    responses = (data as ResponseRow[] | null) ?? [];
  }

  // Recos for this brand
  const { data: recosData } = await sb
    .from("saas_recommendations")
    .select("id, priority, category, title, body, created_at")
    .eq("brand_id", id)
    .order("priority", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(5);
  const recos = (recosData as RecoRow[] | null) ?? [];

  // Evolution (12 weeks) - brand + 2 top competitors (best-effort, no comp evolution rows so we use brand only series for now + competitor SoV bars below)
  const { data: evoData } = await sb
    .from("v_saas_brand_evolution")
    .select("brand_id, name, snapshot_date, visibility_score")
    .eq("user_id", user.id)
    .order("snapshot_date", { ascending: true })
    .limit(120);
  const evolutionRows = (evoData as EvolutionRow[] | null) ?? [];

  // ─── Per-LLM aggregation
  const perLlm = aggregatePerLlm(responses, latest?.llms_used ?? []);

  // ─── Share of voice bars
  const sov = aggregateShareOfVoice(responses, brand);

  // ─── Sources
  const sources = aggregateSources(responses);

  // ─── Tabs
  const activeTab = sp.tab ?? "overview";

  // ─── Page render
  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-ink-muted mb-3.5" style={{ fontSize: 12 }}>
        <Link href="/app/dashboard" className="hover:text-ink transition-colors duration-fast no-underline">Dashboard</Link>
        <ChevronRight size={10} strokeWidth={2} />
        <span className="text-ink" style={{ fontWeight: 500 }}>{brand.name}</span>
      </div>

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-start gap-3.5">
          <div
            className="grid place-items-center text-white shrink-0"
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "linear-gradient(135deg, #2563EB, #7A5AE0)",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {brand.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-ink leading-tight" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>{brand.name}</h1>
              <Chip>{brand.domain}</Chip>
              <Chip>{humanizeSlug(brand.category_slug)} · {brand.cadence === "weekly" ? "hebdo" : "mensuel"}</Chip>
            </div>
            <div className="text-ink-muted mt-1" style={{ fontSize: 13 }}>
              {brand.competitor_domains.length} concurrent{brand.competitor_domains.length > 1 ? "s" : ""} suivi{brand.competitor_domains.length > 1 ? "s" : ""}
              {latest && (
                <>
                  {" · "}
                  {latest.prompts_count} prompts × {latest.llms_used.length} LLMs · {allSnapshots.filter((s) => s.status === "completed").length} snapshot{allSnapshots.length > 1 ? "s" : ""}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-strong bg-white text-ink hover:bg-surface transition-colors duration-fast"
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            <Filter size={12} strokeWidth={1.8} />
            Filtrer
          </button>
          <Link
            href={`/app/brands/${brand.id}/setup`}
            title="Réglages"
            className="grid place-items-center rounded-md border border-strong bg-white text-ink hover:bg-surface transition-colors duration-fast"
            style={{ width: 30, height: 30 }}
          >
            <Settings size={13} strokeWidth={1.8} />
          </Link>
          <form action={refreshBrand}>
            <input type="hidden" name="brand_id" value={brand.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-500 text-white hover:bg-brand-600 transition-colors duration-fast"
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              <RefreshCw size={12} strokeWidth={1.8} />
              Lancer un snapshot
            </button>
          </form>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-DEFAULT mb-5">
        <TabLink href={`/app/brands/${id}`} active={activeTab === "overview"}>Overview</TabLink>
        <TabLink href={`/app/brands/${id}?tab=snapshots`} active={activeTab === "snapshots"}>Snapshots</TabLink>
        <TabLink href={`/app/brands/${id}?tab=recos`} active={activeTab === "recos"}>Recommandations</TabLink>
        <TabLink href={`/app/brands/${id}/sources`} active={activeTab === "sources"}>Sources</TabLink>
        <TabLink href={`/app/brands/${id}/alignment`} active={activeTab === "competitors"}>Concurrents</TabLink>
        <TabLink href={`/app/brands/${id}/setup`} active={activeTab === "settings"}>Réglages</TabLink>
      </div>

      {sp.refreshed && (
        <div className="mb-4 px-3 py-2 rounded-md text-success" style={{ background: "color-mix(in srgb, #059669 12%, transparent)", fontSize: 13 }}>
          ✓ Snapshot lancé. Refresh dans 30s.
        </div>
      )}
      {sp.error && (
        <div className="mb-4 px-3 py-2 rounded-md text-danger" style={{ background: "color-mix(in srgb, #DC2626 12%, transparent)", fontSize: 13 }}>
          Erreur : {sp.error}
        </div>
      )}

      {/* KPI strip */}
      <div className="mb-4">
        <KpiStrip>
          <KpiCell
            label="Score de visibilité"
            value={latest?.visibility_score !== null && latest?.visibility_score !== undefined ? Math.round(Number(latest.visibility_score)) : "—"}
            delta={deltaOrNull(latest?.visibility_score, prevSnap?.visibility_score)}
            hint={prevSnap?.created_at ? `vs snapshot ${shortDate(prevSnap.created_at)}` : "—"}
          />
          <KpiCell
            label="Rang moyen"
            value={latest?.avg_rank !== null && latest?.avg_rank !== undefined ? Number(latest.avg_rank).toFixed(1) : "—"}
            delta={deltaOrNull(latest?.avg_rank, prevSnap?.avg_rank)}
            deltaSuffix=""
            deltaInvert
            hint="quand cité · plus bas = mieux"
          />
          <KpiCell
            label="Taux de citation"
            value={
              <>
                {latest?.citation_rate !== null && latest?.citation_rate !== undefined ? Math.round(Number(latest.citation_rate)) : "—"}
                <span className="text-ink-muted ml-0.5" style={{ fontSize: 14 }}>%</span>
              </>
            }
            delta={deltaOrNull(latest?.citation_rate, prevSnap?.citation_rate)}
            deltaSuffix="%"
            hint={latest ? `${responses.filter((r) => r.brand_mentioned).length}/${responses.length} réponses citent ${brand.name}` : "—"}
          />
          <KpiCell
            label="Part de voix LLM"
            value={
              <>
                {latest?.share_of_voice !== null && latest?.share_of_voice !== undefined ? Math.round(Number(latest.share_of_voice)) : "—"}
                <span className="text-ink-muted ml-0.5" style={{ fontSize: 14 }}>%</span>
              </>
            }
            delta={deltaOrNull(latest?.share_of_voice, prevSnap?.share_of_voice)}
            deltaSuffix="%"
            hint={`vs ${brand.competitor_domains.length} concurrents`}
          />
        </KpiStrip>
      </div>

      {/* Row 1 : Evolution + Per-LLM */}
      <div className="grid mb-4 gap-4" style={{ gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)" }}>
        <Card>
          <CardHeader
            title="Évolution hebdo"
            sub={`Score ${brand.name} · 12 dernières semaines`}
            right={
              <div className="flex items-center gap-3">
                <Legend color={SERIES_COLORS[0]} label={brand.name} solid />
              </div>
            }
          />
          <EvolutionChart
            series={buildBrandEvolutionSeries(brand, evolutionRows)}
            labels={buildEvolutionLabels(evolutionRows)}
            height={240}
          />
        </Card>

        <Card>
          <CardHeader title="Performance par LLM" sub={latest ? `Snapshot du ${shortDate(latest.created_at)}` : "Pas encore de snapshot"} />
          <div className="flex flex-col gap-3">
            {perLlm.length === 0 ? (
              <div className="text-ink-subtle py-4 text-center" style={{ fontSize: 13 }}>
                Pas de réponses.
              </div>
            ) : (
              perLlm.map((l) => (
                <div key={l.name} className="flex items-center gap-3">
                  <div style={{ width: 100 }}><LLMPill name={l.name} size="sm" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="rounded-full overflow-hidden bg-surface-2" style={{ height: 6 }}>
                      <div className="rounded-full bg-brand-500" style={{ height: "100%", width: `${Math.min(100, Math.max(0, l.score))}%` }} />
                    </div>
                  </div>
                  <div className="font-mono text-ink text-right tabular-nums" style={{ fontSize: 13, fontWeight: 600, width: 30 }}>{Math.round(l.score)}</div>
                  <div style={{ width: 50, textAlign: "right" }}>
                    <Delta value={l.delta} suffix="" />
                  </div>
                </div>
              ))
            )}
          </div>
          {latest && (
            <div className="mt-3.5 pt-3.5 border-t border-DEFAULT flex items-center justify-between text-ink-muted" style={{ fontSize: 11 }}>
              <span>Citation moyenne : <strong className="text-ink">{Math.round(perLlm.reduce((acc, l) => acc + l.score, 0) / Math.max(1, perLlm.length))}%</strong></span>
              <Link href={`/app/brands/${id}/snapshots/${latest.id}`} className="font-mono text-brand-500 no-underline hover:underline" style={{ fontSize: 11 }}>
                Détail snapshot →
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Row 2 : SoV + recos */}
      <div className="grid mb-4 gap-4" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)" }}>
        <Card>
          <CardHeader title="Part de voix" sub={`${brand.name} vs concurrents · dernier snapshot`} />
          {sov.length === 0 ? (
            <div className="text-ink-subtle py-4 text-center" style={{ fontSize: 13 }}>—</div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {sov.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="truncate" style={{ width: 110, fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? "#0A0E1A" : "#5B6478" }}>
                    {s.name}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="rounded-full overflow-hidden bg-surface-2" style={{ height: 8 }}>
                      <div className="rounded-full" style={{ height: "100%", width: `${Math.min(100, s.percent)}%`, background: SERIES_COLORS[i % SERIES_COLORS.length], opacity: i === 0 ? 1 : 0.7 }} />
                    </div>
                  </div>
                  <div className="font-mono text-ink text-right tabular-nums" style={{ fontSize: 13, fontWeight: i === 0 ? 600 : 500, width: 40 }}>{s.percent.toFixed(0)}%</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Recommandations actionnables"
            sub={recos.length > 0 ? `${recos.length} priorisées · générées au dernier snapshot` : "Aucune recommandation"}
            right={<span className="font-mono uppercase text-ink-subtle" style={{ fontSize: 10, letterSpacing: "0.1em" }}>Claude Haiku 4.5</span>}
          />
          {recos.length === 0 ? (
            <div className="text-ink-subtle py-4 text-center" style={{ fontSize: 13 }}>Aucune reco active.</div>
          ) : (
            <div className="flex flex-col">
              {recos.map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-stretch gap-3"
                  style={{
                    paddingTop: i === 0 ? 0 : 12,
                    paddingBottom: i === recos.length - 1 ? 0 : 12,
                    borderBottom: i === recos.length - 1 ? "none" : "1px solid rgba(10,14,26,0.08)",
                  }}
                >
                  <div style={{ width: 3, borderRadius: 2, background: prioColor(r.priority) }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-ink" style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</span>
                      <span className="font-mono uppercase text-ink-subtle" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
                        {r.category.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="text-ink-muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
                      {r.body.slice(0, 200)}
                      {r.body.length > 200 ? "…" : ""}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Flag size={10} strokeWidth={1.8} color={prioColor(r.priority)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Row 3 : Sources + snapshots history */}
      <div className="grid mb-4 gap-4" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.3fr)" }}>
        <Card>
          <CardHeader title="Sources d'autorité" sub="Domaines cités par les LLMs · dernier snapshot" />
          {sources.length === 0 ? (
            <div className="text-ink-subtle py-4 text-center" style={{ fontSize: 13 }}>Pas de sources extraites.</div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {sources.slice(0, 6).map((s) => (
                <div key={s.domain} className="flex items-center gap-2.5">
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-ink-muted border border-DEFAULT bg-surface whitespace-nowrap"
                    style={{ fontSize: 11 }}
                  >
                    <span className="rounded-sm" style={{ width: 10, height: 10, background: "#2563EB" }} />
                    {s.domain}
                  </span>
                  <div className="flex-1" />
                  <div className="flex items-center gap-1">
                    {s.llms.slice(0, 4).map((llm) => (
                      <span
                        key={llm}
                        className="font-mono uppercase text-ink-muted rounded bg-surface"
                        style={{ fontSize: 9, padding: "1px 5px", letterSpacing: "0.05em" }}
                      >
                        {shortLlm(llm)}
                      </span>
                    ))}
                  </div>
                  <div className="font-mono text-ink text-right tabular-nums" style={{ fontSize: 13, fontWeight: 600, width: 24 }}>{s.count}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Historique des snapshots"
            sub={allSnapshots.length > 0 ? `${allSnapshots.length} runs · ${allSnapshots.filter((s) => s.status === "completed").length} completed` : "Pas encore de snapshot"}
          />
          {allSnapshots.length === 0 ? (
            <div className="text-ink-subtle py-4 text-center" style={{ fontSize: 13 }}>Pas encore de run.</div>
          ) : (
            <table className="w-full" style={{ fontSize: 13, borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th numeric>Score</Th>
                  <Th numeric>Δ</Th>
                  <Th numeric>LLMs</Th>
                  <Th numeric>Prompts</Th>
                  <Th numeric>Coût</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {allSnapshots.map((s, i) => {
                  const prev = allSnapshots[i + 1];
                  const delta = deltaOrNull(s.visibility_score, prev?.visibility_score);
                  const path = `/app/brands/${id}/snapshots/${s.id}`;
                  return (
                    <tr key={s.id} className="hover:bg-surface cursor-pointer">
                      <Td>
                        <Link href={path} className="font-mono text-ink no-underline" style={{ fontSize: 12 }}>
                          {shortDate(s.created_at!)}
                        </Link>
                      </Td>
                      <Td numeric><Link href={path} className="text-ink no-underline" style={{ fontWeight: 600 }}>{s.visibility_score !== null && s.visibility_score !== undefined ? Math.round(Number(s.visibility_score)) : "—"}</Link></Td>
                      <Td numeric><Link href={path} className="no-underline"><Delta value={delta} /></Link></Td>
                      <Td numeric><Link href={path} className="text-ink no-underline">{(s.llms_used ?? []).length}</Link></Td>
                      <Td numeric><Link href={path} className="text-ink no-underline">{s.prompts_count}</Link></Td>
                      <Td numeric><Link href={path} className="text-ink-muted no-underline">{s.total_cost_usd !== null && s.total_cost_usd !== undefined ? `${Number(s.total_cost_usd).toFixed(2)}€` : "—"}</Link></Td>
                      <Td><Link href={path} className="no-underline"><ChevR size={12} strokeWidth={1.8} color="#8C94A6" /></Link></Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      </div>
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

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-DEFAULT text-ink-muted"
      style={{ fontSize: 11, fontWeight: 500 }}
    >
      {children}
    </span>
  );
}

function TabLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`no-underline ${active ? "text-ink" : "text-ink-muted"} transition-colors duration-fast`}
      style={{
        padding: "10px 14px",
        fontSize: 13,
        fontWeight: 500,
        borderBottom: active ? "2px solid #2563EB" : "2px solid transparent",
        marginBottom: -1,
      }}
    >
      {children}
    </Link>
  );
}

function Th({ children, numeric }: { children?: React.ReactNode; numeric?: boolean }) {
  return (
    <th
      className="font-mono uppercase text-ink-subtle text-left bg-white"
      style={{
        fontSize: 10,
        letterSpacing: "0.14em",
        fontWeight: 500,
        padding: "10px 12px",
        borderBottom: "1px solid rgba(10,14,26,0.08)",
        textAlign: numeric ? "right" : "left",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, numeric }: { children?: React.ReactNode; numeric?: boolean }) {
  return (
    <td
      style={{
        padding: "11px 12px",
        borderBottom: "1px solid rgba(10,14,26,0.08)",
        textAlign: numeric ? "right" : "left",
        fontVariantNumeric: numeric ? "tabular-nums" : undefined,
        fontFamily: numeric ? '"JetBrains Mono", monospace' : undefined,
        verticalAlign: "middle",
      }}
    >
      {children}
    </td>
  );
}

function Legend({ color, label, solid }: { color: string; label: string; solid?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-muted" style={{ fontSize: 11 }}>
      <span style={{ width: 8, height: solid ? 8 : 2, borderRadius: solid ? 2 : 0, background: color }} />
      {label}
    </span>
  );
}

function aggregatePerLlm(responses: ResponseRow[], llmsUsed: string[]): Array<{ name: string; score: number; delta: number | null }> {
  const byLlm = new Map<string, { mentioned: number; total: number; rankSum: number; rankCount: number }>();
  for (const r of responses) {
    if (!byLlm.has(r.llm)) byLlm.set(r.llm, { mentioned: 0, total: 0, rankSum: 0, rankCount: 0 });
    const x = byLlm.get(r.llm)!;
    x.total += 1;
    if (r.brand_mentioned) {
      x.mentioned += 1;
      if (r.brand_rank !== null) {
        x.rankSum += r.brand_rank;
        x.rankCount += 1;
      }
    }
  }
  const all = (llmsUsed.length ? llmsUsed : Array.from(byLlm.keys()));
  return all.map((name) => {
    const x = byLlm.get(name);
    const score = x && x.total > 0 ? (x.mentioned / x.total) * 100 : 0;
    return { name, score, delta: null };
  }).sort((a, b) => b.score - a.score);
}

function aggregateShareOfVoice(responses: ResponseRow[], brand: BrandRow): Array<{ name: string; percent: number }> {
  const brandLower = brand.name.toLowerCase();
  let brandMentions = 0;
  const compCounts: Record<string, number> = {};
  let totalMentions = 0;
  for (const r of responses) {
    if (r.brand_mentioned) {
      brandMentions += 1;
      totalMentions += 1;
    }
    for (const c of r.competitors_mentioned ?? []) {
      if (!c) continue;
      if (c.toLowerCase() === brandLower) continue;
      compCounts[c] = (compCounts[c] ?? 0) + 1;
      totalMentions += 1;
    }
  }
  if (totalMentions === 0) return [];
  const rows: Array<{ name: string; percent: number }> = [
    { name: brand.name, percent: (brandMentions / totalMentions) * 100 },
  ];
  Object.entries(compCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([name, n]) => rows.push({ name, percent: (n / totalMentions) * 100 }));
  return rows;
}

function aggregateSources(responses: ResponseRow[]): Array<{ domain: string; count: number; llms: string[] }> {
  const acc = new Map<string, { count: number; llms: Set<string> }>();
  for (const r of responses) {
    const sources = Array.isArray(r.sources_cited) ? r.sources_cited : [];
    for (const s of sources) {
      const dom = (s?.domain || (s?.url ? safeDomain(s.url) : "")).toLowerCase();
      if (!dom) continue;
      if (!acc.has(dom)) acc.set(dom, { count: 0, llms: new Set() });
      const x = acc.get(dom)!;
      x.count += 1;
      x.llms.add(r.llm);
    }
  }
  return Array.from(acc.entries())
    .map(([domain, x]) => ({ domain, count: x.count, llms: Array.from(x.llms) }))
    .sort((a, b) => b.count - a.count);
}

function safeDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function buildBrandEvolutionSeries(brand: BrandRow, rows: EvolutionRow[]): EvolutionSeries[] {
  const allDatesSet = new Set<string>();
  for (const r of rows) allDatesSet.add(r.snapshot_date);
  const allDates = Array.from(allDatesSet).sort().slice(-12);
  return [
    {
      name: brand.name,
      color: SERIES_COLORS[0],
      data: allDates.map((d) => {
        const row = rows.find((e) => e.brand_id === brand.id && e.snapshot_date === d);
        return row?.visibility_score ?? null;
      }),
    },
  ];
}

function buildEvolutionLabels(rows: EvolutionRow[]): string[] {
  const allDatesSet = new Set<string>();
  for (const r of rows) allDatesSet.add(r.snapshot_date);
  const allDates = Array.from(allDatesSet).sort().slice(-12);
  return allDates.map((d) => `S${getWeekNumber(new Date(d))}`);
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

function deltaOrNull(now: number | null | undefined, then: number | null | undefined): number | null {
  if (now === null || now === undefined || then === null || then === undefined) return null;
  return Number(now) - Number(then);
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

function humanizeSlug(slug: string): string {
  return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function shortLlm(llm: string): string {
  const k = llm.toLowerCase();
  if (k.includes("gpt")) return "GPT";
  if (k.includes("claude")) return "CLA";
  if (k.includes("gemini")) return "GEM";
  if (k.includes("perplexity") || k.includes("sonar")) return "PER";
  return llm.slice(0, 3).toUpperCase();
}

function prioColor(p: string): string {
  if (p === "high") return "#DC2626";
  if (p === "medium") return "#D97706";
  return "#8C94A6";
}
