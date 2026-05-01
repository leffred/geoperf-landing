import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
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
const LLM_COLOR: Record<string, string> = {
  "openai/gpt-4o": "bg-emerald-500",
  "anthropic/claude-sonnet-4-6": "bg-warning",
  "google/gemini-2.5-pro": "bg-brand-500",
  "perplexity/sonar-pro": "bg-cyan-500",
  "mistralai/mistral-large": "bg-orange-500",
  "x-ai/grok-2": "bg-ink",
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

function Header({ id, brandName, subtitle }: { id: string; brandName: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <Eyebrow className="mb-2">
        <Link href={`/app/brands/${id}`} className="hover:underline">{brandName}</Link>
        <span className="opacity-50"> / </span>
        <span>Par LLM</span>
      </Eyebrow>
      <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
        Visibilité par LLM
      </h1>
      {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
    </div>
  );
}

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

  let snapQ = sb.from("saas_brand_snapshots").select("id, created_at, llms_used").eq("brand_id", id).eq("status", "completed");
  if (topicFilter) snapQ = snapQ.eq("topic_id", topicFilter);
  const { data: latest } = await snapQ.order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!latest) {
    return (
      <Section py="md" tone="white">
        <Header id={id} brandName={brand.name} />
        <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-10 text-center text-ink-muted text-sm">
          Aucun snapshot completed.
        </div>
      </Section>
    );
  }

  const { data: responses } = await sb
    .from("saas_snapshot_responses")
    .select("llm, brand_mentioned, brand_rank")
    .eq("snapshot_id", (latest as any).id);
  const respList = (responses as any[] | null) ?? [];

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
    <Section py="md" tone="white">
      <Header
        id={id}
        brandName={brand.name}
        subtitle={`Snapshot du ${new Date((latest as any).created_at).toLocaleDateString("fr-FR")} · ${respList.length} réponses · ${aggs.length} LLMs`}
      />

      {topicList.length > 0 && (
        <TopicSelector brandId={id} topics={topicList} currentTopicId={topicFilter ?? null} isOwner={ctx.is_owner} topicLimit={ctx.limits.topics} />
      )}

      <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-6 mb-6">
        <Eyebrow className="mb-5">Citation rate par LLM</Eyebrow>
        <div className="space-y-4">
          {aggs.map(a => {
            const colorClass = LLM_COLOR[a.llm] || "bg-ink";
            return (
              <div key={a.llm}>
                <div className="flex items-baseline justify-between mb-1.5 text-sm flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 inline-block rounded-sm ${colorClass}`} />
                    <span className="font-medium text-ink">{LLM_LABELS[a.llm] || a.llm.split("/")[1]}</span>
                    <span className="font-mono text-xs text-ink-subtle">{a.llm}</span>
                  </div>
                  <div className="font-mono text-xs">
                    <span className="text-ink font-medium">{a.citationRate.toFixed(0)}%</span>
                    <span className="text-ink-subtle ml-2">{a.mentioned}/{a.total}</span>
                    {a.avgRank !== null && <span className="text-ink-subtle ml-2">rang moy. {a.avgRank.toFixed(1)}</span>}
                  </div>
                </div>
                <div className="h-3 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ease-out rounded-full ${colorClass}`}
                    style={{ width: `${(a.citationRate / maxRate) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
          {aggs.length === 0 && <p className="text-sm text-ink-muted">Aucune donnée.</p>}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-5">
        <Eyebrow className="mb-4">Détail tabulaire</Eyebrow>
        <table className="w-full text-sm">
          <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
            <tr>
              <th className="text-left py-2 font-mono uppercase tracking-eyebrow">LLM</th>
              <th className="text-right py-2 font-mono uppercase tracking-eyebrow">Réponses</th>
              <th className="text-right py-2 font-mono uppercase tracking-eyebrow">Cité</th>
              <th className="text-right py-2 font-mono uppercase tracking-eyebrow">Citation rate</th>
              <th className="text-right py-2 font-mono uppercase tracking-eyebrow">Rang moy.</th>
            </tr>
          </thead>
          <tbody>
            {aggs.map(a => (
              <tr key={a.llm} className="border-b border-DEFAULT last:border-b-0">
                <td className="py-2"><span className="font-medium text-ink">{LLM_LABELS[a.llm] || a.llm.split("/")[1]}</span></td>
                <td className="py-2 text-right font-mono text-ink tabular-nums">{a.total}</td>
                <td className="py-2 text-right font-mono text-ink tabular-nums">{a.mentioned}</td>
                <td className="py-2 text-right font-mono text-ink tabular-nums">{a.citationRate.toFixed(1)}%</td>
                <td className="py-2 text-right font-mono text-ink tabular-nums">{a.avgRank?.toFixed(1) ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
