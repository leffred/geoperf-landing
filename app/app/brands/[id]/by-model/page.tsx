import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { TopicSelector } from "@/components/saas/TopicSelector";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Visibility by Model — Geoperf", robots: { index: false, follow: false } };

const LLM_LABELS: Record<string, string> = {
  "openai/gpt-4o": "GPT-4o",
  "anthropic/claude-sonnet-4-6": "Claude Sonnet",
  "google/gemini-2.5-pro": "Gemini 2.5",
  "perplexity/sonar-pro": "Sonar Pro",
  "mistralai/mistral-large": "Mistral",
  "x-ai/grok-2": "Grok 2",
};
const LLM_COLORS: Record<string, string> = {
  "openai/gpt-4o": "#10A37F",
  "anthropic/claude-sonnet-4-6": "#D97706",
  "google/gemini-2.5-pro": "#1A73E8",
  "perplexity/sonar-pro": "#1FB8CD",
  "mistralai/mistral-large": "#FF7000",
  "x-ai/grok-2": "#000000",
};

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ topic?: string }> };

type LlmAgg = {
  llm: string;
  total: number;
  mentioned: number;
  citationRate: number;
  avgRank: number | null;
  rankCount: number;
};

export default async function ByModelPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { topic: topicFilter } = await searchParams;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: brand } = await sb.from("saas_tracked_brands").select("id, user_id, name, domain").eq("id", id).maybeSingle();
  if (!brand || (brand as any).user_id !== ctx.account_owner_id) notFound();

  const { data: topicsData } = await sb
    .from("saas_topics")
    .select("id, name, slug, is_default")
    .eq("brand_id", id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });
  const topicList = (topicsData as any[] | null) ?? [];

  // Last completed snapshot
  let snapQ = sb.from("saas_brand_snapshots").select("id, created_at, llms_used").eq("brand_id", id).eq("status", "completed");
  if (topicFilter) snapQ = snapQ.eq("topic_id", topicFilter);
  const { data: latest } = await snapQ.order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!latest) {
    return (
      <Section py="md" tone="cream">
        <div className="mb-4">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase"><Link href={`/app/brands/${id}`} className="hover:underline">{brand.name}</Link> / Par LLM</p>
          <h1 className="font-serif text-3xl text-navy">Visibilité par LLM</h1>
        </div>
        <div className="bg-white p-8 text-center text-ink-muted text-sm">Aucun snapshot completed.</div>
      </Section>
    );
  }

  const { data: responses } = await sb
    .from("saas_snapshot_responses")
    .select("llm, brand_mentioned, brand_rank")
    .eq("snapshot_id", (latest as any).id);
  const respList = (responses as any[] | null) ?? [];

  // Agg par LLM
  const aggMap: Record<string, LlmAgg> = {};
  for (const r of respList) {
    const llm = r.llm as string;
    if (!aggMap[llm]) aggMap[llm] = { llm, total: 0, mentioned: 0, citationRate: 0, avgRank: null, rankCount: 0 };
    aggMap[llm].total += 1;
    if (r.brand_mentioned) aggMap[llm].mentioned += 1;
    if (r.brand_rank !== null && r.brand_rank !== undefined) {
      aggMap[llm].rankCount += 1;
      aggMap[llm].avgRank = aggMap[llm].avgRank === null
        ? Number(r.brand_rank)
        : aggMap[llm].avgRank! + Number(r.brand_rank);
    }
  }
  const aggs = Object.values(aggMap).map(a => ({
    ...a,
    citationRate: a.total > 0 ? (a.mentioned / a.total) * 100 : 0,
    avgRank: a.avgRank !== null && a.rankCount > 0 ? a.avgRank / a.rankCount : null,
  })).sort((a, b) => b.citationRate - a.citationRate);

  const maxRate = Math.max(1, ...aggs.map(a => a.citationRate));

  return (
    <Section py="md" tone="cream">
      <div className="mb-4">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
          <Link href={`/app/brands/${id}`} className="hover:underline">{brand.name}</Link> / Visibilité par LLM
        </p>
        <h1 className="font-serif text-3xl text-navy">Visibilité par LLM</h1>
        <p className="text-sm text-ink-muted">
          Snapshot du {new Date((latest as any).created_at).toLocaleDateString("fr-FR")} · {respList.length} réponses · {aggs.length} LLMs
        </p>
      </div>

      {topicList.length > 0 && (
        <TopicSelector brandId={id} topics={topicList} currentTopicId={topicFilter ?? null} isOwner={ctx.is_owner} topicLimit={ctx.limits.topics} />
      )}

      <div className="bg-white p-6 mb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-4">Citation rate par LLM</p>
        <div className="space-y-3">
          {aggs.map(a => (
            <div key={a.llm}>
              <div className="flex items-baseline justify-between mb-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 inline-block" style={{ background: LLM_COLORS[a.llm] || "#5F5E5A" }} />
                  <span className="font-medium text-navy">{LLM_LABELS[a.llm] || a.llm.split("/")[1]}</span>
                  <span className="font-mono text-xs text-ink-muted">{a.llm}</span>
                </div>
                <div className="font-mono text-xs">
                  <span className="text-navy font-medium">{a.citationRate.toFixed(0)}%</span>
                  <span className="text-ink-muted ml-2">{a.mentioned}/{a.total}</span>
                  {a.avgRank !== null && <span className="text-ink-muted ml-2">rang moy. {a.avgRank.toFixed(1)}</span>}
                </div>
              </div>
              <div className="h-3 bg-cream rounded-sm overflow-hidden">
                <div
                  className="h-full"
                  style={{ width: `${(a.citationRate / maxRate) * 100}%`, background: LLM_COLORS[a.llm] || "#042C53" }}
                />
              </div>
            </div>
          ))}
          {aggs.length === 0 && <p className="text-sm text-ink-muted">Aucune donnée.</p>}
        </div>
      </div>

      <div className="bg-white p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Détail tabulaire</p>
        <table className="w-full text-sm">
          <thead className="text-xs text-ink-muted border-b border-navy/15">
            <tr>
              <th className="text-left py-2">LLM</th>
              <th className="text-right py-2">Réponses</th>
              <th className="text-right py-2">Cité</th>
              <th className="text-right py-2">Citation rate</th>
              <th className="text-right py-2">Rang moy.</th>
            </tr>
          </thead>
          <tbody>
            {aggs.map(a => (
              <tr key={a.llm} className="border-b border-navy/5">
                <td className="py-2"><span className="font-medium">{LLM_LABELS[a.llm] || a.llm.split("/")[1]}</span></td>
                <td className="py-2 text-right font-mono">{a.total}</td>
                <td className="py-2 text-right font-mono">{a.mentioned}</td>
                <td className="py-2 text-right font-mono">{a.citationRate.toFixed(1)}%</td>
                <td className="py-2 text-right font-mono">{a.avgRank?.toFixed(1) ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
