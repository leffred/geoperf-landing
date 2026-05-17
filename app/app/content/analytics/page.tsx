// S36-C — Analytics dashboard GEO Content Writer
// Server Component : aggrège données articles + visibilité LLM pour un user donné.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { KpiStrip, KpiCell } from "@/components/saas/v2/KpiStrip";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Analytics Content — Geoperf", robots: { index: false, follow: false } };

const LLM_META: Record<string, { label: string; color: string }> = {
  "perplexity-sonar": { label: "Perplexity",  color: "#2563EB" },
  "gpt-4o":           { label: "GPT-4o",       color: "#1D9E75" },
  "gemini-flash":     { label: "Gemini",        color: "#F59E0B" },
  "claude-sonnet":    { label: "Claude",        color: "#D97706" },
};
const LLM_ORDER = ["perplexity-sonar", "gpt-4o", "gemini-flash", "claude-sonnet"];

interface VisRow { llm_name: string; appeared: boolean; article_id: string; checked_at: string; }
interface ArticleRow { id: string; title: string | null; status: string; }

export default async function ContentAnalyticsPage() {
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const [articlesRes, visRes] = await Promise.all([
    sb.from("geo_articles")
      .select("id, title, status")
      .eq("client_id", ctx.user.id)
      .order("created_at", { ascending: false })
      .limit(200),
    sb.from("geo_article_llm_visibility")
      .select("llm_name, appeared, article_id, checked_at")
      .eq("client_id", ctx.user.id)
      .order("checked_at", { ascending: false }),
  ]);

  const articles = (articlesRes.data as ArticleRow[] | null) ?? [];
  const visRows = (visRes.data as VisRow[] | null) ?? [];

  const totalArticles = articles.length;
  const published = articles.filter(a => a.status === "published").length;
  const drafts = articles.filter(a => a.status === "draft" || a.status === "review").length;

  // Aggregate by LLM
  const byLlm = new Map<string, { total: number; appeared: number }>();
  for (const r of visRows) {
    const cur = byLlm.get(r.llm_name) ?? { total: 0, appeared: 0 };
    cur.total++;
    if (r.appeared) cur.appeared++;
    byLlm.set(r.llm_name, cur);
  }

  // Global citation rate (average across LLMs, on unique article×LLM pairs)
  const totalChecks = visRows.length;
  const totalAppeared = visRows.filter(r => r.appeared).length;
  const globalRate = totalChecks > 0 ? Math.round((totalAppeared / totalChecks) * 100) : null;

  // Last scan date
  const lastScan = visRows[0]?.checked_at ?? null;

  // Heatmap: last 8 published articles that have visibility data
  const publishedIds = new Set(articles.filter(a => a.status === "published").map(a => a.id));
  const scannedIds = new Set(visRows.map(r => r.article_id));
  const heatmapArticleIds = [...publishedIds].filter(id => scannedIds.has(id)).slice(0, 8);
  const heatmapArticles = heatmapArticleIds
    .map(id => articles.find(a => a.id === id))
    .filter(Boolean) as ArticleRow[];

  // Build heatmap matrix: article_id → llm_name → appeared?
  const matrix = new Map<string, Map<string, boolean>>();
  for (const r of visRows) {
    if (!matrix.has(r.article_id)) matrix.set(r.article_id, new Map());
    // Keep first (most recent) result per article×llm
    if (!matrix.get(r.article_id)!.has(r.llm_name)) {
      matrix.get(r.article_id)!.set(r.llm_name, r.appeared);
    }
  }

  return (
    <div className="px-6 md:px-8 py-6 md:py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <Link
            href="/app/content"
            className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink mb-3 transition-colors"
            style={{ fontSize: 12 }}
          >
            <ArrowLeft size={12} strokeWidth={2} /> Mes articles
          </Link>
          <div className="font-mono uppercase text-brand-500 mb-1" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
            // GEO Content Writer
          </div>
          <h1 className="text-ink tracking-tight" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Analytics
          </h1>
          <p className="text-ink-muted mt-1" style={{ fontSize: 13 }}>
            Visibilité de vos articles dans les LLM : Perplexity, GPT-4o, Gemini, Claude.
          </p>
        </div>
        <BarChart3 size={28} strokeWidth={1.5} className="text-ink-subtle mt-1 shrink-0" />
      </div>

      {/* KPI strip */}
      <KpiStrip className="mb-8">
        <KpiCell label="Articles totaux" value={totalArticles} hint="générés" />
        <KpiCell label="Publiés" value={published} hint={`${drafts} brouillon${drafts !== 1 ? "s" : ""}`} />
        <KpiCell
          label="Taux de citation"
          value={globalRate !== null ? `${globalRate}%` : "—"}
          hint={totalChecks > 0 ? `sur ${totalChecks} réponses LLM` : "aucun scan"}
        />
        <KpiCell
          label="Dernier scan"
          value={lastScan ? fmtDate(lastScan) : "—"}
          hint="hebdo auto (lundi 8h)"
        />
      </KpiStrip>

      {/* Per-LLM breakdown */}
      <section className="mb-8">
        <h2 className="text-ink mb-3" style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>
          Taux de citation par LLM
        </h2>
        {totalChecks === 0 ? (
          <EmptyState message="Aucun scan LLM. Publiez un article pour déclencher le premier scan automatique." />
        ) : (
          <div className="bg-white border border-DEFAULT rounded-xl shadow-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface border-b border-DEFAULT">
                <tr>
                  <Th>LLM</Th>
                  <Th align="right">Réponses analysées</Th>
                  <Th align="right">Cités</Th>
                  <Th align="right">Taux</Th>
                  <Th align="right">Barre</Th>
                </tr>
              </thead>
              <tbody>
                {LLM_ORDER.map(key => {
                  const meta = LLM_META[key]!;
                  const stats = byLlm.get(key) ?? { total: 0, appeared: 0 };
                  const rate = stats.total > 0 ? Math.round((stats.appeared / stats.total) * 100) : 0;
                  const barColor = rate >= 50 ? "#1D9E75" : rate > 0 ? "#D97706" : "#E2E6EF";
                  return (
                    <tr key={key} className="border-b border-DEFAULT last:border-b-0">
                      <Td>
                        <span className="font-mono text-ink font-semibold" style={{ fontSize: 13, color: meta.color }}>
                          {meta.label}
                        </span>
                      </Td>
                      <Td align="right"><Mono>{stats.total}</Mono></Td>
                      <Td align="right"><Mono>{stats.appeared}</Mono></Td>
                      <Td align="right">
                        <Mono color={rate >= 50 ? "#1D9E75" : rate > 0 ? "#D97706" : "#B91C1C"}>
                          {stats.total > 0 ? `${rate}%` : "—"}
                        </Mono>
                      </Td>
                      <Td align="right">
                        <div className="flex items-center justify-end">
                          <div className="h-2 rounded-full bg-surface overflow-hidden" style={{ width: 80 }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${rate}%`, background: barColor }} />
                          </div>
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Heatmap articles × LLMs */}
      {heatmapArticles.length > 0 && (
        <section>
          <h2 className="text-ink mb-3" style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Visibilité par article
          </h2>
          <div className="bg-white border border-DEFAULT rounded-xl shadow-card overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface border-b border-DEFAULT">
                <tr>
                  <Th>Article</Th>
                  {LLM_ORDER.map(k => (
                    <Th key={k} align="right" style={{ color: LLM_META[k]!.color }}>
                      {LLM_META[k]!.label}
                    </Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapArticles.map(art => (
                  <tr key={art.id} className="border-b border-DEFAULT last:border-b-0">
                    <Td>
                      <Link
                        href={`/app/content/${art.id}`}
                        className="text-ink hover:text-brand-500 transition-colors"
                        style={{ fontSize: 13, fontWeight: 500 }}
                      >
                        {(art.title || "(sans titre)").slice(0, 55)}{(art.title?.length ?? 0) > 55 ? "…" : ""}
                      </Link>
                    </Td>
                    {LLM_ORDER.map(k => {
                      const appeared = matrix.get(art.id)?.get(k);
                      const cell = appeared === true ? "✓" : appeared === false ? "✗" : "⏳";
                      const col = appeared === true ? "#1D9E75" : appeared === false ? "#B91C1C" : "#8C94A6";
                      return (
                        <Td key={k} align="right">
                          <span className="font-mono font-semibold" style={{ fontSize: 14, color: col }}>{cell}</span>
                        </Td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-ink-subtle font-mono mt-2" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
            ✓ cité · ✗ absent · ⏳ non scanné — derniers {heatmapArticles.length} articles publiés
          </p>
        </section>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white border border-DEFAULT rounded-xl shadow-card px-6 py-8 text-center">
      <p className="text-ink-muted" style={{ fontSize: 13 }}>{message}</p>
    </div>
  );
}
function Th({ children, align = "left", style }: { children: React.ReactNode; align?: "left" | "right"; style?: React.CSSProperties }) {
  return (
    <th className="font-mono uppercase text-ink-subtle px-4 py-2.5 border-b border-DEFAULT" style={{ fontSize: 10, letterSpacing: "0.14em", textAlign: align, fontWeight: 600, ...style }}>
      {children}
    </th>
  );
}
function Td({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return <td className="px-4 py-3 align-middle" style={{ textAlign: align }}>{children}</td>;
}
function Mono({ children, color }: { children: React.ReactNode; color?: string }) {
  return <span className="font-mono" style={{ fontSize: 12, color: color ?? "inherit" }}>{children}</span>;
}
function fmtDate(iso: string): string {
  try { return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }); }
  catch { return iso.slice(0, 10); }
}
