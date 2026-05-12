// V2 — Snapshot Detail. Reading view : qualitative inspection of one run's raw LLM responses.
// Breadcrumb · header · KPI strip (vs N-1) · client SnapshotInspector (filters + prompt list + LLM cards).

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Download, RefreshCw } from "lucide-react";
import { requireSaasUser } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { KpiStrip, KpiCell } from "@/components/saas/v2/KpiStrip";
import { SnapshotInspector, type SnapshotPrompt, type SnapshotResponseRow } from "./SnapshotInspector";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Snapshot — Geoperf", robots: { index: false, follow: false } };

type Props = { params: Promise<{ id: string; sid: string }> };

interface SnapshotData {
  id: string;
  brand_id: string;
  user_id: string;
  status: string;
  llms_used: string[];
  prompts_count: number;
  visibility_score: number | null;
  avg_rank: number | null;
  citation_rate: number | null;
  brand_mention_count: number | null;
  total_mention_count: number | null;
  raw_response_count: number;
  total_cost_usd: number | null;
  created_at: string;
  completed_at: string | null;
}

interface ResponseDB {
  id: string;
  llm: string;
  prompt_text: string;
  response_text: string | null;
  brand_mentioned: boolean;
  brand_rank: number | null;
  competitors_mentioned: string[];
  sources_cited: unknown;
  cost_usd: number | null;
  latency_ms: number | null;
}

export default async function SnapshotDetailPage({ params }: Props) {
  const { id, sid } = await params;
  const user = await requireSaasUser();
  const sb = getServiceClient();

  const [brandRes, snapRes, respRes] = await Promise.all([
    sb.from("saas_tracked_brands")
      .select("id, user_id, name, domain")
      .eq("id", id)
      .maybeSingle(),
    sb.from("saas_brand_snapshots")
      .select("id, brand_id, user_id, status, llms_used, prompts_count, visibility_score, avg_rank, citation_rate, brand_mention_count, total_mention_count, raw_response_count, total_cost_usd, created_at, completed_at")
      .eq("id", sid)
      .maybeSingle(),
    sb.from("saas_snapshot_responses")
      .select("id, llm, prompt_text, response_text, brand_mentioned, brand_rank, competitors_mentioned, sources_cited, cost_usd, latency_ms")
      .eq("snapshot_id", sid)
      .order("created_at", { ascending: true }),
  ]);

  const brand = brandRes.data as { id: string; user_id: string; name: string; domain: string } | null;
  const snap = snapRes.data as SnapshotData | null;
  const responses = (respRes.data as ResponseDB[] | null) ?? [];

  if (!brand || !snap || brand.user_id !== user.id || snap.brand_id !== id) notFound();

  // Previous snapshot for delta KPI
  const { data: prevData } = await sb
    .from("saas_brand_snapshots")
    .select("id, visibility_score, avg_rank, citation_rate, brand_mention_count, raw_response_count, created_at")
    .eq("brand_id", id)
    .eq("status", "completed")
    .lt("created_at", snap.created_at)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const prev = prevData as { visibility_score: number | null; avg_rank: number | null; citation_rate: number | null; brand_mention_count: number | null; raw_response_count: number; created_at: string } | null;

  // Snapshot duration
  const duration = snap.completed_at ? Math.round((new Date(snap.completed_at).getTime() - new Date(snap.created_at).getTime()) / 1000) : null;

  // Group responses by prompt → SnapshotPrompt[]
  const prompts = groupResponsesByPrompt(responses);

  // Unique sources count
  const sourceDomains = new Set<string>();
  const prevSourceDomains = new Set<string>();
  for (const r of responses) {
    const sources = Array.isArray(r.sources_cited) ? (r.sources_cited as Array<{ domain?: string; url?: string }>) : [];
    for (const s of sources) {
      const d = s?.domain || safeDomain(s?.url);
      if (d) sourceDomains.add(d.toLowerCase());
    }
  }
  // Approx delta vs N-1 : query the prev snapshot's response sources count too.
  let prevUniqueSourcesCount: number | null = null;
  if (prev) {
    const { data: prevRespData } = await sb
      .from("saas_snapshot_responses")
      .select("sources_cited")
      .eq("snapshot_id", (prevData as { id: string }).id);
    const prevResps = (prevRespData as Array<{ sources_cited: unknown }> | null) ?? [];
    for (const r of prevResps) {
      const sources = Array.isArray(r.sources_cited) ? (r.sources_cited as Array<{ domain?: string; url?: string }>) : [];
      for (const s of sources) {
        const d = s?.domain || safeDomain(s?.url);
        if (d) prevSourceDomains.add(d.toLowerCase());
      }
    }
    prevUniqueSourcesCount = prevSourceDomains.size;
  }

  const citedPromptsCount = prompts.filter((p) => p.responses.some((r) => r.brandMentioned)).length;
  const prevCitedCount = prev?.brand_mention_count !== undefined && prev?.brand_mention_count !== null && prev?.raw_response_count > 0
    ? Math.round(((prev.brand_mention_count as number) / Math.max(1, prev.raw_response_count)) * snap.prompts_count)
    : null;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-ink-muted mb-3.5" style={{ fontSize: 12 }}>
        <Link href="/app/dashboard" className="hover:text-ink no-underline transition-colors duration-fast">Dashboard</Link>
        <ChevronRight size={10} strokeWidth={2} />
        <Link href={`/app/brands/${brand.id}`} className="hover:text-ink no-underline transition-colors duration-fast">{brand.name}</Link>
        <ChevronRight size={10} strokeWidth={2} />
        <span className="text-ink" style={{ fontWeight: 500 }}>Snapshot {shortDate(snap.created_at)}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <div className="font-mono uppercase text-brand-500" style={{ fontSize: 10, letterSpacing: "0.16em" }}>
            // Snapshot du {fmtDateTime(snap.created_at)}{duration !== null ? ` · ${formatDuration(duration)}` : ""}
          </div>
          <h1 className="text-ink leading-tight mt-1.5" style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Snapshot · {brand.name}
          </h1>
          <div className="text-ink-muted mt-1" style={{ fontSize: 13 }}>
            {snap.prompts_count} prompts × {snap.llms_used.length} LLMs · {responses.length} réponses{prev && " · vs snapshot précédent"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/api/saas/export-snapshot/${snap.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-strong bg-white text-ink hover:bg-surface transition-colors duration-fast no-underline"
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            <Download size={12} strokeWidth={1.8} /> CSV
          </a>
          <Link
            href={`/app/brands/${brand.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-500 text-white hover:bg-brand-600 transition-colors duration-fast no-underline"
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            <RefreshCw size={12} strokeWidth={1.8} /> Re-run
          </Link>
        </div>
      </div>

      {/* KPI strip */}
      <div className="mb-5">
        <KpiStrip>
          <KpiCell
            label="Score de visibilité"
            value={snap.visibility_score !== null ? Math.round(Number(snap.visibility_score)) : "—"}
            delta={deltaOrNull(snap.visibility_score, prev?.visibility_score)}
            hint={prev ? `vs ${prev.visibility_score !== null ? Math.round(Number(prev.visibility_score)) : "—"} · ${shortDate(prev.created_at)}` : "1er snapshot"}
          />
          <KpiCell
            label="Brand cited"
            value={
              <>
                {citedPromptsCount}
                <span className="text-ink-muted ml-0.5" style={{ fontSize: 14 }}>/{snap.prompts_count}</span>
              </>
            }
            delta={prevCitedCount !== null ? citedPromptsCount - prevCitedCount : null}
            deltaSuffix=""
            hint={`${snap.prompts_count > 0 ? Math.round((citedPromptsCount / snap.prompts_count) * 100) : 0}% citation rate`}
          />
          <KpiCell
            label="Rang moyen"
            value={snap.avg_rank !== null ? Number(snap.avg_rank).toFixed(1) : "—"}
            delta={deltaOrNull(snap.avg_rank, prev?.avg_rank)}
            deltaSuffix=""
            deltaInvert
            hint="moyenne quand cité"
          />
          <KpiCell
            label="Sources uniques"
            value={sourceDomains.size}
            delta={prevUniqueSourcesCount !== null ? sourceDomains.size - prevUniqueSourcesCount : null}
            deltaSuffix=""
            hint={prev ? `dont ${countNewSources(sourceDomains, prevSourceDomains)} nouvelles ce run` : "1er snapshot"}
          />
        </KpiStrip>
      </div>

      {/* Inspector (client) */}
      {prompts.length === 0 ? (
        <div className="bg-surface border border-DEFAULT rounded-xl text-ink-subtle text-center" style={{ padding: 40, fontSize: 13 }}>
          Aucune réponse pour ce snapshot.
        </div>
      ) : (
        <SnapshotInspector
          brandName={brand.name}
          llms={snap.llms_used}
          prompts={prompts}
        />
      )}
    </div>
  );
}

// ─────────── Helpers ───────────

function groupResponsesByPrompt(responses: ResponseDB[]): SnapshotPrompt[] {
  const map = new Map<string, SnapshotPrompt>();
  for (const r of responses) {
    if (!map.has(r.prompt_text)) {
      map.set(r.prompt_text, {
        key: r.prompt_text,
        category: derivePromptCategory(r.prompt_text),
        text: r.prompt_text,
        responses: [],
      });
    }
    const p = map.get(r.prompt_text)!;
    const sources = Array.isArray(r.sources_cited) ? (r.sources_cited as Array<{ url?: string; domain?: string; title?: string }>) : [];
    const resp: SnapshotResponseRow = {
      llm: r.llm,
      brandMentioned: r.brand_mentioned,
      brandRank: r.brand_rank,
      responseText: r.response_text,
      competitorsMentioned: r.competitors_mentioned ?? [],
      sourcesCited: sources,
      costUsd: r.cost_usd !== null ? Number(r.cost_usd) : null,
      latencyMs: r.latency_ms,
    };
    p.responses.push(resp);
  }
  return Array.from(map.values());
}

function derivePromptCategory(text: string): "direct" | "usecase" | "comp" {
  const t = text.toLowerCase();
  if (/\b(compare|comparer|comparatif|versus|\svs\s|alternativ|différence)\b/.test(t)) return "comp";
  if (/\b(quel|quelle|laquelle|conseille|conseiller|recommand|cherche|besoin|comment|aide-moi|aidez)\b/.test(t)) return "usecase";
  return "direct";
}

function deltaOrNull(now: number | null | undefined, then: number | null | undefined): number | null {
  if (now === null || now === undefined || then === null || then === undefined) return null;
  return Number(now) - Number(then);
}

function countNewSources(now: Set<string>, then: Set<string>): number {
  let c = 0;
  for (const d of now) if (!then.has(d)) c += 1;
  return c;
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function safeDomain(url: string | undefined): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
