import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { TopicSelector } from "@/components/saas/TopicSelector";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Prompt Ranking — Geoperf", robots: { index: false, follow: false } };

const LLM_LABELS: Record<string, string> = {
  "openai/gpt-4o": "GPT-4o", "anthropic/claude-sonnet-4-6": "Sonnet 4.6",
  "google/gemini-2.5-pro": "Gemini 2.5", "perplexity/sonar-pro": "Sonar Pro",
  "mistralai/mistral-large": "Mistral", "x-ai/grok-2": "Grok 2",
};

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ topic?: string; sort?: string }> };

type PromptAgg = {
  prompt: string;
  total: number;
  mentioned: number;
  citationRate: number;
  ranks: number[];
  avgRank: number | null;
  byLlm: Record<string, { mentioned: number; total: number }>;
};

export default async function ByPromptPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { topic: topicFilter, sort } = await searchParams;
  const sortBy: "rate_desc" | "rate_asc" | "rank_asc" = sort === "rate_asc" ? "rate_asc" : sort === "rank_asc" ? "rank_asc" : "rate_desc";
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

  // 5 derniers snapshots (pour avoir un peu de signal)
  let snapQ = sb.from("saas_brand_snapshots").select("id").eq("brand_id", id).eq("status", "completed");
  if (topicFilter) snapQ = snapQ.eq("topic_id", topicFilter);
  const { data: snaps } = await snapQ.order("created_at", { ascending: false }).limit(5);
  const snapIds = (snaps as any[] | null)?.map(s => s.id) ?? [];

  if (snapIds.length === 0) {
    return (
      <Section py="md" tone="cream">
        <div className="mb-4">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase"><Link href={`/app/brands/${id}`} className="hover:underline">{brand.name}</Link> / Par prompt</p>
          <h1 className="font-serif text-3xl text-navy">Visibilité par prompt</h1>
        </div>
        <div className="bg-white p-8 text-center text-ink-muted text-sm">Aucun snapshot completed.</div>
      </Section>
    );
  }

  const { data: responses } = await sb
    .from("saas_snapshot_responses")
    .select("prompt_text, llm, brand_mentioned, brand_rank")
    .in("snapshot_id", snapIds);
  const respList = (responses as any[] | null) ?? [];

  // Agg par prompt_text
  const promptMap: Record<string, PromptAgg> = {};
  for (const r of respList) {
    const key = r.prompt_text as string;
    if (!promptMap[key]) promptMap[key] = { prompt: key, total: 0, mentioned: 0, citationRate: 0, ranks: [], avgRank: null, byLlm: {} };
    promptMap[key].total += 1;
    if (r.brand_mentioned) promptMap[key].mentioned += 1;
    if (r.brand_rank !== null && r.brand_rank !== undefined) promptMap[key].ranks.push(Number(r.brand_rank));
    if (!promptMap[key].byLlm[r.llm]) promptMap[key].byLlm[r.llm] = { mentioned: 0, total: 0 };
    promptMap[key].byLlm[r.llm].total += 1;
    if (r.brand_mentioned) promptMap[key].byLlm[r.llm].mentioned += 1;
  }
  const aggs = Object.values(promptMap).map(p => ({
    ...p,
    citationRate: p.total > 0 ? (p.mentioned / p.total) * 100 : 0,
    avgRank: p.ranks.length > 0 ? p.ranks.reduce((a, b) => a + b, 0) / p.ranks.length : null,
  }));

  if (sortBy === "rate_asc") aggs.sort((a, b) => a.citationRate - b.citationRate);
  else if (sortBy === "rank_asc") aggs.sort((a, b) => (a.avgRank ?? 99) - (b.avgRank ?? 99));
  else aggs.sort((a, b) => b.citationRate - a.citationRate);

  const llmsPresent = Array.from(new Set(respList.map(r => r.llm as string))).sort();

  return (
    <Section py="md" tone="cream">
      <div className="mb-4">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
          <Link href={`/app/brands/${id}`} className="hover:underline">{brand.name}</Link> / Par prompt
        </p>
        <h1 className="font-serif text-3xl text-navy">Visibilité par prompt</h1>
        <p className="text-sm text-ink-muted">
          {aggs.length} prompts × {llmsPresent.length} LLMs sur les {snapIds.length} derniers snapshots ({respList.length} réponses).
        </p>
      </div>

      {topicList.length > 0 && (
        <TopicSelector brandId={id} topics={topicList} currentTopicId={topicFilter ?? null} isOwner={ctx.is_owner} topicLimit={ctx.limits.topics} />
      )}

      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <span className="font-mono uppercase tracking-widest text-navy-light shrink-0 self-center">Tri:</span>
        <Link href={`/app/brands/${id}/by-prompt${topicFilter ? `?topic=${topicFilter}` : ""}`} className={`px-2.5 py-1 ${sortBy === "rate_desc" ? "bg-navy text-white" : "bg-white hover:bg-cream"}`}>Citation ↓</Link>
        <Link href={`/app/brands/${id}/by-prompt?sort=rate_asc${topicFilter ? `&topic=${topicFilter}` : ""}`} className={`px-2.5 py-1 ${sortBy === "rate_asc" ? "bg-navy text-white" : "bg-white hover:bg-cream"}`}>Citation ↑</Link>
        <Link href={`/app/brands/${id}/by-prompt?sort=rank_asc${topicFilter ? `&topic=${topicFilter}` : ""}`} className={`px-2.5 py-1 ${sortBy === "rank_asc" ? "bg-navy text-white" : "bg-white hover:bg-cream"}`}>Rang ↑</Link>
      </div>

      <div className="bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-ink-muted border-b border-navy/15">
            <tr>
              <th className="text-left py-2 px-3">Prompt</th>
              <th className="text-right py-2 px-3">Citations</th>
              <th className="text-right py-2 px-3">Citation rate</th>
              <th className="text-right py-2 px-3">Rang moy.</th>
              <th className="text-left py-2 px-3 hidden lg:table-cell">Détail LLMs</th>
            </tr>
          </thead>
          <tbody>
            {aggs.map((p, i) => (
              <tr key={i} className="border-b border-navy/5 hover:bg-cream/30 align-top">
                <td className="py-2 px-3 max-w-[420px]">
                  <p className="text-sm">{p.prompt}</p>
                </td>
                <td className="py-2 px-3 text-right font-mono">{p.mentioned}/{p.total}</td>
                <td className="py-2 px-3 text-right font-mono">
                  <span className={p.citationRate >= 50 ? "text-green-700 font-medium" : p.citationRate >= 20 ? "text-navy" : "text-ink-muted"}>
                    {p.citationRate.toFixed(0)}%
                  </span>
                </td>
                <td className="py-2 px-3 text-right font-mono">{p.avgRank?.toFixed(1) ?? "—"}</td>
                <td className="py-2 px-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                    {Object.entries(p.byLlm).map(([llm, x]) => {
                      const rate = x.total > 0 ? (x.mentioned / x.total) * 100 : 0;
                      const intensity = rate >= 50 ? "bg-amber text-navy" : rate >= 20 ? "bg-amber/30 text-navy" : "bg-cream text-ink-muted";
                      return (
                        <span key={llm} className={`px-1.5 py-0.5 ${intensity}`} title={`${LLM_LABELS[llm] || llm}: ${x.mentioned}/${x.total}`}>
                          {(LLM_LABELS[llm] || llm.split("/")[1]).slice(0, 8)} {rate.toFixed(0)}%
                        </span>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
            {aggs.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-ink-muted text-sm">Aucun prompt.</td></tr>}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
