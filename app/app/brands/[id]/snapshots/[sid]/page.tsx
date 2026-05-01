import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
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

const PRIO_BORDER: Record<string, string> = {
  high: "border-l-danger",
  medium: "border-l-warning",
  low: "border-l-ink/15",
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
    <Section py="md" tone="white">
      <div className="mb-6">
        <Eyebrow className="mb-2">
          <Link href="/app/brands" className="hover:underline">Marques</Link>
          <span className="opacity-50"> / </span>
          <Link href={`/app/brands/${id}`} className="hover:underline">{brand.name}</Link>
          <span className="opacity-50"> / </span>
          <span>Snapshot</span>
        </Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
          Snapshot du {fmtDate(snap.created_at)}
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          {snap.status === "completed" ? "✓" : snap.status === "failed" ? "✗" : "…"} {snap.status} · {snap.prompts_count} prompts × {(snap.llms_used as string[]).length} LLMs · ${Number(snap.total_cost_usd || 0).toFixed(4)}
          {snap.error_message && <span className="block text-danger mt-1">{snap.error_message}</span>}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat label="Visibility" value={snap.visibility_score?.toFixed(0) ?? "—"} variant="dark" />
        <Stat label="Rang moy." value={snap.avg_rank?.toFixed(1) ?? "—"} />
        <Stat label="Citation" value={`${snap.citation_rate?.toFixed(0) ?? 0}%`} />
        <Stat label="Share-of-voice" value={`${snap.share_of_voice?.toFixed(0) ?? 0}%`} />
      </div>

      <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-5 mb-8">
        <Eyebrow className="mb-4">Coût réparti par LLM ({respList.length} responses)</Eyebrow>
        <table className="w-full text-sm">
          <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
            <tr>
              <th className="text-left py-2 font-mono uppercase tracking-eyebrow">LLM</th>
              <th className="text-right py-2 font-mono uppercase tracking-eyebrow">Calls</th>
              <th className="text-right py-2 font-mono uppercase tracking-eyebrow">Citation</th>
              <th className="text-right py-2 hidden md:table-cell font-mono uppercase tracking-eyebrow">Latence moy.</th>
              <th className="text-right py-2 font-mono uppercase tracking-eyebrow">Coût</th>
            </tr>
          </thead>
          <tbody>
            {costRows.map(r => (
              <tr key={r.llm} className="border-b border-DEFAULT last:border-b-0">
                <td className="py-2">
                  <span className="font-medium text-ink">{r.label}</span>
                  <span className="font-mono text-xs text-ink-subtle ml-2">{r.llm}</span>
                </td>
                <td className="py-2 text-right font-mono text-ink tabular-nums">{r.count}</td>
                <td className="py-2 text-right font-mono text-ink tabular-nums">{r.citation_rate.toFixed(0)}%</td>
                <td className="py-2 text-right font-mono hidden md:table-cell text-xs text-ink-muted tabular-nums">{r.avg_latency_ms}ms</td>
                <td className="py-2 text-right font-mono text-ink tabular-nums">${r.cost.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {recoList.length > 0 && (
        <div className="mb-8">
          <Eyebrow className="mb-4">Recommandations ({recoList.length})</Eyebrow>
          <div className="space-y-2">
            {recoList.map(r => (
              <div
                key={r.id}
                className={`bg-white rounded-lg border border-DEFAULT border-l-2 p-5 shadow-card ${PRIO_BORDER[r.priority] || PRIO_BORDER.low}`}
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-subtle">{r.priority}</span>
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-subtle">· {r.category}</span>
                </div>
                <h4 className="text-base font-medium text-ink mb-1 tracking-tightish">{r.title}</h4>
                <p className="text-sm text-ink-muted leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Eyebrow className="mb-4">Réponses brutes ({respList.length})</Eyebrow>
      <div className="space-y-3">
        {respList.map(r => (
          <details key={r.id} className="bg-white rounded-lg border border-DEFAULT shadow-card p-4 group">
            <summary className="cursor-pointer flex items-baseline justify-between gap-3 list-none">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-ink text-white">{LLM_LABELS[r.llm] || r.llm}</span>
                  {r.brand_mentioned ? (
                    r.brand_rank ? (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-brand-500 text-white">RANK {r.brand_rank}</span>
                    ) : (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-brand-50 text-brand-600">CITÉ</span>
                    )
                  ) : (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-surface text-ink-subtle border border-DEFAULT">NON CITÉ</span>
                  )}
                  <span className="font-mono text-[10px] text-ink-subtle">
                    {(r.competitors_mentioned as string[] | null)?.length ?? 0} concurrents · {Array.isArray(r.sources_cited) ? (r.sources_cited as any[]).length : 0} sources
                  </span>
                </div>
                <p className="text-sm text-ink truncate">{r.prompt_text}</p>
              </div>
              <span className="font-mono text-xs text-ink-subtle whitespace-nowrap">${Number(r.cost_usd || 0).toFixed(4)} · {r.latency_ms}ms</span>
            </summary>
            <div className="mt-3 pt-3 border-t border-DEFAULT grid lg:grid-cols-2 gap-4">
              <div>
                <Eyebrow variant="muted" className="mb-1">Prompt</Eyebrow>
                <p className="text-xs italic text-ink-muted bg-surface p-2 rounded-md">{r.prompt_text}</p>
              </div>
              <div>
                <Eyebrow variant="muted" className="mb-1">Réponse</Eyebrow>
                <pre className="text-xs whitespace-pre-wrap font-sans bg-surface p-2 rounded-md max-h-64 overflow-y-auto text-ink">{r.response_text || "(vide)"}</pre>
              </div>
              {((r.competitors_mentioned as string[] | null)?.length ?? 0) > 0 && (
                <div>
                  <Eyebrow variant="muted" className="mb-1">Concurrents mentionnés</Eyebrow>
                  <ul className="text-xs space-y-0.5">
                    {(r.competitors_mentioned as string[]).map((c, j) => <li key={j} className="font-mono text-ink">{c}</li>)}
                  </ul>
                </div>
              )}
              {Array.isArray(r.sources_cited) && (r.sources_cited as any[]).length > 0 && (
                <div>
                  <Eyebrow variant="muted" className="mb-1">Sources citées</Eyebrow>
                  <ul className="text-xs space-y-0.5">
                    {(r.sources_cited as any[]).slice(0, 10).map((s, j) => (
                      <li key={j}>
                        <a href={s.url} target="_blank" rel="noopener" className="font-mono text-brand-500 hover:underline truncate block max-w-full" title={s.url}>
                          {s.domain || s.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </details>
        ))}
        {respList.length === 0 && (
          <div className="bg-white rounded-lg border border-DEFAULT p-8 text-center text-ink-muted text-sm">
            Aucune réponse pour ce snapshot.
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link href={`/app/brands/${id}`} className="text-sm text-ink-muted hover:text-ink underline transition-colors">
          ← Retour à {brand.name}
        </Link>
      </div>
    </Section>
  );
}
