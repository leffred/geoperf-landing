import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EmptyState } from "@/components/saas/EmptyState";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { BrandTabBar } from "@/components/saas/v2/BrandTabBar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Concurrents — Geoperf", robots: { index: false, follow: false } };

type Props = { params: Promise<{ id: string }> };

type SnapshotSummary = {
  id: string;
  created_at: string;
  share_of_voice: number | null;
  visibility_score: number | null;
  competitorsMentioned: string[];
};

type CompetitorStat = {
  name: string;
  mention_count: number;
  avg_rank: number;
  snapshots_mentioned: number;
};

function SoVBar({ value }: { value: number }) {
  const w = Math.max(0, Math.min(100, value));
  const color = w >= 35 ? "#16A34A" : w >= 20 ? "#D97706" : "#DC2626";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 rounded-full bg-surface-2 flex-1 overflow-hidden" style={{ minWidth: 60 }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${w}%`, background: color }} />
      </div>
      <span className="font-mono text-xs text-ink" style={{ minWidth: 38, textAlign: "right" }}>
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

export default async function CompetitorsPage({ params }: Props) {
  const { id } = await params;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  // Auth check
  const { data: brand } = await sb
    .from("saas_brands")
    .select("id, name, user_id")
    .eq("id", id)
    .maybeSingle();

  if (!brand || brand.user_id !== ctx.user.id) notFound();

  // 1. Load completed snapshots
  const { data: snapshotsRaw } = await sb
    .from("saas_brand_snapshots")
    .select("id, created_at, share_of_voice, visibility_score")
    .eq("brand_id", id)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(12);

  const snapshots = snapshotsRaw ?? [];
  const snapshotIds = snapshots.map((s) => s.id);

  if (snapshotIds.length === 0) {
    return (
      <Section py="md" tone="white">
        <div className="max-w-4xl mx-auto">
          <BrandTabBar id={id} />
          <div className="mb-6">
            <Eyebrow className="mb-2">
              <Link href={`/app/brands/${id}`} className="hover:underline">{brand.name}</Link>
              <span className="opacity-50"> / </span>Concurrents
            </Eyebrow>
            <h1 className="text-2xl font-medium tracking-tight text-ink">Analyse concurrentielle</h1>
          </div>
          <EmptyState
            title="Aucun snapshot complété"
            body="Lance un premier snapshot pour voir apparaître les données concurrentielles."
            action={{ label: "Voir les réglages", href: `/app/brands/${id}/setup` }}
          />
        </div>
      </Section>
    );
  }

  // 2. Batch-load all responses for these snapshots
  const { data: responsesRaw } = await sb
    .from("saas_snapshot_responses")
    .select("snapshot_id, competitors_mentioned, competitors_with_rank")
    .in("snapshot_id", snapshotIds);

  const responses = responsesRaw ?? [];

  // 3. Build per-snapshot competitor lists
  const snapshotCompMap = new Map<string, Set<string>>();
  for (const sid of snapshotIds) snapshotCompMap.set(sid, new Set());
  for (const r of responses) {
    if (Array.isArray(r.competitors_mentioned)) {
      const set = snapshotCompMap.get(r.snapshot_id);
      if (set) r.competitors_mentioned.forEach((c: string) => set.add(c));
    }
  }

  const snapshotSummaries: SnapshotSummary[] = snapshots.map((s) => ({
    id: s.id,
    created_at: s.created_at,
    share_of_voice: s.share_of_voice != null ? Number(s.share_of_voice) : null,
    visibility_score: s.visibility_score != null ? Number(s.visibility_score) : null,
    competitorsMentioned: [...(snapshotCompMap.get(s.id) ?? [])],
  }));

  // 4. Build per-competitor aggregate stats
  const compAgg = new Map<string, { name: string; mentions: number; ranks: number[]; snaps: Set<string> }>();
  for (const r of responses) {
    const arr = r.competitors_with_rank as { name: string; rank: number }[] | null;
    if (!Array.isArray(arr)) continue;
    for (const c of arr) {
      if (!c?.name) continue;
      const key = c.name.toLowerCase();
      if (!compAgg.has(key)) compAgg.set(key, { name: c.name, mentions: 0, ranks: [], snaps: new Set() });
      const entry = compAgg.get(key)!;
      entry.mentions++;
      entry.ranks.push(Number(c.rank));
      entry.snaps.add(r.snapshot_id);
    }
  }

  const stats: CompetitorStat[] = [...compAgg.values()]
    .map((v) => ({
      name: v.name,
      mention_count: v.mentions,
      avg_rank: v.ranks.length ? Math.round((v.ranks.reduce((a, b) => a + b, 0) / v.ranks.length) * 10) / 10 : 0,
      snapshots_mentioned: v.snaps.size,
    }))
    .sort((a, b) => b.mention_count - a.mention_count)
    .slice(0, 15);

  const totalSnapshots = snapshotIds.length;

  return (
    <Section py="md" tone="white">
      <div className="max-w-4xl mx-auto">
        <BrandTabBar id={id} />

        <div className="mb-6 flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <Eyebrow className="mb-2">
              <Link href={`/app/brands/${id}`} className="hover:underline">{brand.name}</Link>
              <span className="opacity-50"> / </span>Concurrents
            </Eyebrow>
            <h1 className="text-2xl font-medium tracking-tight text-ink">Analyse concurrentielle</h1>
          </div>
          <span className="text-xs font-mono text-ink-subtle">{totalSnapshots} snapshot{totalSnapshots > 1 ? "s" : ""} analysé{totalSnapshots > 1 ? "s" : ""}</span>
        </div>

        <div className="space-y-8">

          {/* Competitor leaderboard */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-3">
              Concurrents les plus cités
            </h2>
            <div className="border border-DEFAULT rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface border-b border-DEFAULT">
                    <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-ink-subtle">#</th>
                    <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-ink-subtle">Concurrent</th>
                    <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-ink-subtle">Mentions</th>
                    <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-ink-subtle">Rang moy.</th>
                    <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-ink-subtle hidden sm:table-cell">Snapshots</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-ink-muted">
                        Aucune donnée de rang concurrent disponible.
                      </td>
                    </tr>
                  ) : stats.map((c, i) => (
                    <tr key={c.name} className={i % 2 === 0 ? "bg-white" : "bg-surface/40"}>
                      <td className="px-4 py-2.5 font-mono text-xs text-ink-subtle">{i + 1}</td>
                      <td className="px-4 py-2.5 font-medium text-ink">{c.name}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-ink">{c.mention_count}</td>
                      <td className="px-4 py-2.5 text-right font-mono">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          c.avg_rank <= 2 ? "bg-danger/10 text-danger" :
                          c.avg_rank <= 3.5 ? "bg-warning/10 text-warning" :
                          "bg-surface text-ink-muted"
                        }`}>
                          #{c.avg_rank.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-ink-subtle hidden sm:table-cell">
                        {c.snapshots_mentioned}/{totalSnapshots}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-ink-subtle mt-2">
              Rang moyen = position dans la liste de citations LLM (1 = premier cité). Un rang faible (rouge) indique que le concurrent est systématiquement mentionné avant votre marque.
            </p>
          </div>

          {/* SoV per snapshot */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-3">
              Share of Voice par snapshot
            </h2>
            <div className="border border-DEFAULT rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface border-b border-DEFAULT">
                    <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-ink-subtle">Date</th>
                    <th className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-ink-subtle text-left">SoV</th>
                    <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-ink-subtle hidden sm:table-cell">Visib.</th>
                    <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-ink-subtle hidden md:table-cell">Concurrents cités</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshotSummaries.map((s, i) => (
                    <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-surface/40"}>
                      <td className="px-4 py-2.5 font-mono text-xs text-ink-muted whitespace-nowrap">
                        {new Date(s.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3" style={{ minWidth: 160 }}>
                        {s.share_of_voice !== null
                          ? <SoVBar value={s.share_of_voice} />
                          : <span className="text-ink-muted text-xs font-mono">—</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-ink hidden sm:table-cell">
                        {s.visibility_score !== null ? s.visibility_score.toFixed(2) : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-ink-muted hidden md:table-cell">
                        {s.competitorsMentioned.length > 0
                          ? s.competitorsMentioned.slice(0, 5).join(", ") +
                            (s.competitorsMentioned.length > 5 ? ` +${s.competitorsMentioned.length - 5}` : "")
                          : <span className="opacity-40">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-ink-subtle mt-2">
              SoV = % des réponses LLM où la marque est mentionnée parmi ses concurrents sur l&apos;ensemble du snapshot.
            </p>
          </div>

        </div>
      </div>
    </Section>
  );
}
