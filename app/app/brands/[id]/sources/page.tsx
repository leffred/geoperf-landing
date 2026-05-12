import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TopicSelector } from "@/components/saas/TopicSelector";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { BrandTabBar } from "@/components/saas/v2/BrandTabBar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sources Explorer — Geoperf", robots: { index: false, follow: false } };

const LLM_LABELS: Record<string, string> = {
  "openai/gpt-4o": "GPT-4o",
  "anthropic/claude-sonnet-4-6": "Sonnet 4.6",
  "google/gemini-2.5-pro": "Gemini 2.5",
  "perplexity/sonar-pro": "Sonar Pro",
  "mistralai/mistral-large": "Mistral",
  "x-ai/grok-2": "Grok 2",
};

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ llm?: string; topic?: string }> };

function Header({ id, brandName, subtitle }: { id: string; brandName: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <Eyebrow className="mb-2">
        <Link href={`/app/brands/${id}`} className="hover:underline">{brandName}</Link>
        <span className="opacity-50"> / </span>
        <span>Sources Explorer</span>
      </Eyebrow>
      <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
        Sources Explorer
      </h1>
      {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
    </div>
  );
}

export default async function SourcesPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { llm: llmFilter, topic: topicFilter } = await searchParams;
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

  let snapshotsQuery = sb
    .from("saas_brand_snapshots")
    .select("id, topic_id, created_at")
    .eq("brand_id", id)
    .eq("status", "completed");
  if (topicFilter) snapshotsQuery = snapshotsQuery.eq("topic_id", topicFilter);
  const { data: snapshots } = await snapshotsQuery.order("created_at", { ascending: false }).limit(30);
  const snapshotIds = (snapshots as any[] | null)?.map(s => s.id) ?? [];

  if (snapshotIds.length === 0) {
    return (
      <Section py="md" tone="white">
      <BrandTabBar id={id} />
        <Header id={id} brandName={brand.name} />
        <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-10 text-center text-ink-muted text-sm">
          Aucun snapshot completed. Lance un run pour explorer les sources.
        </div>
      </Section>
    );
  }

  let respQuery = sb
    .from("saas_snapshot_responses")
    .select("snapshot_id, llm, sources_cited")
    .in("snapshot_id", snapshotIds);
  if (llmFilter) respQuery = respQuery.eq("llm", llmFilter);

  const { data: responses } = await respQuery;
  const respList = (responses as any[] | null) ?? [];

  type DomainAgg = { domain: string; count: number; llms: Set<string>; citations: number; topics: Set<string>; example_url: string };
  const domainMap: Record<string, DomainAgg> = {};
  for (const r of respList) {
    const sources = (r.sources_cited ?? []) as Array<{ url?: string; domain?: string }>;
    const seenInThisResponse = new Set<string>();
    for (const s of sources) {
      const dom = (s?.domain || "").toLowerCase();
      if (!dom) continue;
      if (!domainMap[dom]) domainMap[dom] = { domain: dom, count: 0, llms: new Set(), citations: 0, topics: new Set(), example_url: s.url || "" };
      domainMap[dom].llms.add(r.llm);
      domainMap[dom].citations += 1;
      if (!seenInThisResponse.has(dom)) {
        domainMap[dom].count += 1;
        seenInThisResponse.add(dom);
      }
      if (!domainMap[dom].example_url && s.url) domainMap[dom].example_url = s.url;
    }
  }

  const top = Object.values(domainMap).sort((a, b) => b.citations - a.citations).slice(0, 50);
  const totalDomains = Object.keys(domainMap).length;

  const llmsPresent = Array.from(new Set(respList.map(r => r.llm as string))).sort();

  return (
    <Section py="md" tone="white">
      <BrandTabBar id={id} />
      <Header
        id={id}
        brandName={brand.name}
        subtitle={`${totalDomains} domains uniques cités sur ${respList.length} réponses LLM (${snapshotIds.length} snapshots récents). Top 50 ci-dessous.`}
      />

      {topicList.length > 0 && (
        <TopicSelector brandId={id} topics={topicList} currentTopicId={topicFilter ?? null} isOwner={ctx.is_owner} topicLimit={ctx.limits.topics} />
      )}

      <div className="flex flex-wrap gap-2 mb-6 text-xs items-center">
        <span className="font-mono uppercase tracking-eyebrow text-brand-500 shrink-0">Filter LLM</span>
        <Link
          href={`/app/brands/${id}/sources${topicFilter ? `?topic=${topicFilter}` : ""}`}
          className={`px-2.5 py-1 rounded-md transition-colors duration-150 ease-out ${!llmFilter ? "bg-ink text-white" : "bg-white border border-DEFAULT text-ink hover:bg-surface"}`}
        >
          Tous
        </Link>
        {llmsPresent.map(llm => (
          <Link
            key={llm}
            href={`/app/brands/${id}/sources?llm=${encodeURIComponent(llm)}${topicFilter ? `&topic=${topicFilter}` : ""}`}
            className={`px-2.5 py-1 rounded-md transition-colors duration-150 ease-out ${llmFilter === llm ? "bg-ink text-white" : "bg-white border border-DEFAULT text-ink hover:bg-surface"}`}
          >
            {LLM_LABELS[llm] || llm.split("/")[1]}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
            <tr>
              <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">#</th>
              <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Domain</th>
              <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Citations</th>
              <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Réponses uniques</th>
              <th className="text-left py-3 px-3 hidden md:table-cell font-mono uppercase tracking-eyebrow">LLMs</th>
              <th className="text-left py-3 px-3 hidden lg:table-cell font-mono uppercase tracking-eyebrow">Exemple</th>
            </tr>
          </thead>
          <tbody>
            {top.map((d, i) => (
              <tr key={d.domain} className="border-b border-DEFAULT last:border-b-0 hover:bg-surface transition-colors">
                <td className="py-2 px-3 font-mono text-xs text-ink-subtle tabular-nums">{i + 1}</td>
                <td className="py-2 px-3"><span className="font-mono text-ink">{d.domain}</span></td>
                <td className="py-2 px-3 text-right font-mono text-ink tabular-nums">{d.citations}</td>
                <td className="py-2 px-3 text-right font-mono text-ink tabular-nums">{d.count}</td>
                <td className="py-2 px-3 hidden md:table-cell">
                  <span className="text-xs text-ink-muted">{Array.from(d.llms).map(l => LLM_LABELS[l] || l.split("/")[1]).join(", ")}</span>
                </td>
                <td className="py-2 px-3 hidden lg:table-cell">
                  {d.example_url && (
                    <a
                      href={d.example_url}
                      target="_blank"
                      rel="noopener"
                      className="text-xs text-brand-500 hover:underline truncate block max-w-[260px]"
                      title={d.example_url}
                    >
                      {d.example_url}
                    </a>
                  )}
                </td>
              </tr>
            ))}
            {top.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-ink-muted text-sm">Aucune source citée.</td></tr>}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
