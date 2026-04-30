import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { requireSaasUser } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Snapshot — Geoperf", robots: { index: false, follow: false } };

type Props = { params: Promise<{ id: string; sid: string }> };

const LLM_LABELS: Record<string, string> = {
  "openai/gpt-4o": "GPT-4o",
  "anthropic/claude-sonnet-4-6": "Sonnet 4.6",
  "google/gemini-2.5-pro": "Gemini 2.5",
  "perplexity/sonar-pro": "Sonar Pro",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function SnapshotDetailPage({ params }: Props) {
  const { id, sid } = await params;
  const user = await requireSaasUser();
  const sb = getServiceClient();

  const [{ data: brand }, { data: snap }, { data: responses }, { data: recos }] = await Promise.all([
    sb.from("saas_tracked_brands").select("id, user_id, name, domain, category_slug").eq("id", id).maybeSingle(),
    sb.from("saas_brand_snapshots").select("id, brand_id, user_id, status, llms_used, prompts_count, visibility_score, avg_rank, citation_rate, share_of_voice, total_cost_usd, raw_response_count, error_message, created_at, completed_at").eq("id", sid).maybeSingle(),
    sb.from("saas_snapshot_responses").select("id, llm, prompt_text, response_text, brand_mentioned, brand_rank, competitors_mentioned, sources_cited, cost_usd, latency_ms").eq("snapshot_id", sid).order("created_at"),
    sb.from("saas_recommendations").select("id, priority, category, title, body, authority_sources").eq("snapshot_id", sid).order("priority"),
  ]);

  if (!brand || !snap || (brand as any).user_id !== user.id || (snap as any).brand_id !== id) notFound();

  const respList = (responses as any[] | null) ?? [];
  const recoList = (recos as any[] | null) ?? [];

  // Cost par LLM
  const costByLLM: Record<string, { count: number; cost: number; mentioned: number; latencyTotal: number }> = {};
  for (const r of respList) {
    const k = r.llm as string;
    costByLLM[k] = costByLLM[k] || { count: 0, cost: 0, mentioned: 0, latencyTotal: 0 };
    costByLLM[k].count += 1;
    costByLLM[k].cost += Number(r.cost_usd || 0);
    if (r.brand_mentioned) costByLLM[k].mentioned += 1;
    costByLLM[k].latencyTotal += Number(r.latency_ms || 0);
  }
  const costRows = Object.entries(costByLLM).map(([llm, x]) => ({
    llm, label: LLM_LABELS[llm] || llm,
    count: x.count, cost: x.cost,
    citation_rate: x.count > 0 ? (x.mentioned / x.count) * 100 : 0,
    avg_latency_ms: x.count > 0 ? Math.round(x.latencyTotal / x.count) : 0,
  })).sort((a, b) => b.cost - a.cost);

  return (
    <Section py="md" tone="cream">
      <div className="mb-4">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
          <Link href="/app/brands" className="hover:underline">Marques</Link>
          {" / "}
          <Link href={`/app/brands/${id}`} className="hover:underline">{brand.name}</Link>
          {" / Snapshot"}
        </p>
        <h1 className="font-serif text-3xl text-navy">Snapshot du {fmtDate(snap.created_at)}</h1>
        <p className="text-sm text-ink-muted">
          {snap.status === "completed" ? "✓" : snap.status === "failed" ? "✗" : "…"} {snap.status} · {snap.prompts_count} prompts × {(snap.llms_used as string[]).length} LLMs · ${Number(snap.total_cost_usd || 0).toFixed(4)}
          {snap.error_message && <span className="block text-red-700 mt-1">{snap.error_message}</span>}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Visibility" value={snap.visibility_score?.toFixed(0) ?? "—"} variant="highlight" />
        <Stat label="Rang moy." value={snap.avg_rank?.toFixed(1) ?? "—"} />
        <Stat label="Citation" value={`${snap.citation_rate?.toFixed(0) ?? 0}%`} />
        <Stat label="Share-of-voice" value={`${snap.share_of_voice?.toFixed(0) ?? 0}%`} />
      </div>

      <div className="bg-white p-5 mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Coût réparti par LLM ({respList.length} responses)</p>
        <table className="w-full text-sm">
          <thead className="text-xs text-ink-muted border-b border-navy/15">
            <tr>
              <th className="text-left py-2">LLM</th>
              <th className="text-right py-2">Calls</th>
              <th className="text-right py-2">Citation</th>
              <th className="text-right py-2 hidden md:table-cell">Latence moy.</th>
              <th className="text-right py-2">Coût</th>
            </tr>
          </thead>
          <tbody>
            {costRows.map(r => (
              <tr key={r.llm} className="border-b border-navy/5">
                <td className="py-2"><span className="font-medium">{r.label}</span><span className="font-mono text-xs text-ink-muted ml-2">{r.llm}</span></td>
                <td className="py-2 text-right font-mono">{r.count}</td>
                <td className="py-2 text-right font-mono">{r.citation_rate.toFixed(0)}%</td>
                <td className="py-2 text-right font-mono hidden md:table-cell text-xs">{r.avg_latency_ms}ms</td>
                <td className="py-2 text-right font-mono">${r.cost.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {recoList.length > 0 && (
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Recommandations ({recoList.length})</p>
          <div className="space-y-2">
            {recoList.map(r => (
              <div key={r.id} className={`bg-white p-4 border-l-2 ${r.priority === "high" ? "border-red-600" : r.priority === "medium" ? "border-amber" : "border-navy/15"}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{r.priority}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">· {r.category}</span>
                </div>
                <h4 className="font-serif text-base font-medium text-navy mb-1">{r.title}</h4>
                <p className="text-sm leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Réponses brutes ({respList.length})</p>
      <div className="space-y-3">
        {respList.map((r, i) => (
          <details key={r.id} className="bg-white p-4 group">
            <summary className="cursor-pointer flex items-baseline justify-between gap-3 list-none">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-navy text-white">{LLM_LABELS[r.llm] || r.llm}</span>
                  {r.brand_mentioned ? (
                    r.brand_rank ? (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 bg-amber text-navy">RANK {r.brand_rank}</span>
                    ) : (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 bg-amber/30 text-navy">CITÉ</span>
                    )
                  ) : (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 bg-cream text-ink-muted border border-navy/10">NON CITÉ</span>
                  )}
                  <span className="font-mono text-[10px] text-ink-muted">{(r.competitors_mentioned as string[] | null)?.length ?? 0} concurrents · {Array.isArray(r.sources_cited) ? (r.sources_cited as any[]).length : 0} sources</span>
                </div>
                <p className="text-sm text-navy truncate">{r.prompt_text}</p>
              </div>
              <span className="font-mono text-xs text-ink-muted whitespace-nowrap">${Number(r.cost_usd || 0).toFixed(4)} · {r.latency_ms}ms</span>
            </summary>
            <div className="mt-3 pt-3 border-t border-navy/5 grid lg:grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-1">Prompt</p>
                <p className="text-xs italic text-ink-muted bg-cream/50 p-2 rounded-sm">{r.prompt_text}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-1">Réponse</p>
                <pre className="text-xs whitespace-pre-wrap font-sans bg-cream/50 p-2 rounded-sm max-h-64 overflow-y-auto">{r.response_text || "(vide)"}</pre>
              </div>
              {((r.competitors_mentioned as string[] | null)?.length ?? 0) > 0 && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-1">Concurrents mentionnés</p>
                  <ul className="text-xs space-y-0.5">
                    {(r.competitors_mentioned as string[]).map((c, j) => <li key={j} className="font-mono">{c}</li>)}
                  </ul>
                </div>
              )}
              {Array.isArray(r.sources_cited) && (r.sources_cited as any[]).length > 0 && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-1">Sources citées</p>
                  <ul className="text-xs space-y-0.5">
                    {(r.sources_cited as any[]).slice(0, 10).map((s, j) => (
                      <li key={j}>
                        <a href={s.url} target="_blank" rel="noopener" className="font-mono text-navy-light hover:underline truncate block max-w-full" title={s.url}>{s.domain || s.url}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </details>
        ))}
        {respList.length === 0 && <div className="bg-white p-6 text-center text-ink-muted text-sm">Aucune réponse pour ce snapshot.</div>}
      </div>

      <div className="mt-6">
        <Link href={`/app/brands/${id}`} className="text-sm text-ink-muted hover:text-navy underline">← Retour à {brand.name}</Link>
      </div>
    </Section>
  );
}
