// Tableau Heatmap : LLM × (brand + concurrents). Tech crisp palette.

import Link from "next/link";

const LLM_LABELS: Record<string, string> = {
  "openai/gpt-4o": "GPT-4o",
  "anthropic/claude-sonnet-4-6": "Claude Sonnet 4.6",
  "google/gemini-2.5-pro": "Gemini 2.5 Pro",
  "perplexity/sonar-pro": "Perplexity Sonar",
};

type Response = {
  llm: string;
  brand_mentioned: boolean;
  competitors_mentioned: string[] | null;
};

type Props = {
  responses: Response[];
  brandName: string;
  competitorHumans: string[];
  totalPromptsPerLlm?: number;
  locked?: boolean;
};

function intensityClass(ratio: number): { bg: string; fg: string } {
  if (ratio >= 0.6) return { bg: "bg-ink", fg: "text-white" };
  if (ratio >= 0.35) return { bg: "bg-brand-500", fg: "text-white" };
  if (ratio >= 0.15) return { bg: "bg-brand-500/50", fg: "text-white" };
  if (ratio > 0) return { bg: "bg-brand-50", fg: "text-brand-600" };
  return { bg: "bg-surface", fg: "text-ink-subtle" };
}

export function CompetitorMatrix({ responses, brandName, competitorHumans, totalPromptsPerLlm, locked = false }: Props) {
  const llmSet = new Set<string>();
  for (const r of responses) llmSet.add(r.llm);
  const llms = Array.from(llmSet).sort();

  const entities = [brandName, ...competitorHumans];

  const cells: Record<string, Record<string, number>> = {};
  for (const llm of llms) {
    cells[llm] = {};
    for (const e of entities) cells[llm][e] = 0;
    const llmResponses = responses.filter(r => r.llm === llm);
    for (const r of llmResponses) {
      if (r.brand_mentioned) cells[llm][brandName] += 1;
      for (const c of (r.competitors_mentioned ?? [])) {
        if (entities.includes(c)) cells[llm][c] += 1;
      }
    }
  }

  const totalByLlm: Record<string, number> = {};
  for (const llm of llms) {
    if (totalPromptsPerLlm !== undefined) {
      totalByLlm[llm] = totalPromptsPerLlm;
    } else {
      totalByLlm[llm] = responses.filter(r => r.llm === llm).length;
    }
  }

  if (locked) {
    return (
      <div className="relative bg-white rounded-lg border border-DEFAULT shadow-card p-6">
        <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center text-center px-6 z-10 rounded-lg">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-3">Pro / Agency</p>
          <h3 className="text-xl font-medium text-ink mb-2 tracking-tightish">Matrice concurrentielle</h3>
          <p className="text-sm text-ink-muted mb-5 max-w-md leading-relaxed">
            Compare ta marque face à tes concurrents sur les 4 LLMs : qui est cité, par lequel, à quelle fréquence.
          </p>
          <Link href="/app/billing" className="bg-brand-500 text-white px-5 py-2.5 text-sm font-medium rounded-md hover:bg-brand-600 transition-colors duration-150 ease-out shadow-card">
            Upgrade vers Pro
          </Link>
        </div>
        <div aria-hidden className="opacity-30 select-none pointer-events-none">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-3">Matrice concurrentielle</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-DEFAULT">
                  <th className="text-left py-2 px-2"></th>
                  {["GPT-4o", "Sonnet 4.6", "Gemini 2.5", "Sonar Pro"].map(l => (
                    <th key={l} className="text-center py-2 px-2 font-mono uppercase">{l}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[brandName, ...competitorHumans.slice(0, 3)].map(e => (
                  <tr key={e} className="border-b border-DEFAULT">
                    <td className="py-2 px-2 text-ink">{e}</td>
                    {[1, 2, 3, 4].map(j => (
                      <td key={j} className="text-center py-1.5 px-2">
                        <span className="inline-block w-10 h-6 bg-ink/30 text-white rounded-md">—</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (llms.length === 0 || entities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-6 text-center text-ink-muted text-sm">
        Pas assez de données pour la matrice (1 snapshot completed avec ≥1 LLM requis).
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-5">
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500">Matrice concurrentielle</p>
        <p className="text-xs text-ink-muted">Mentions par LLM sur le dernier snapshot</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-DEFAULT">
              <th className="text-left py-2 px-2 sticky left-0 bg-white"></th>
              {llms.map(l => (
                <th key={l} className="text-center py-2 px-2 font-mono uppercase tracking-eyebrow text-[10px] text-ink-subtle">
                  {LLM_LABELS[l] || l.split("/")[1] || l}
                </th>
              ))}
              <th className="text-center py-2 px-2 font-mono uppercase tracking-eyebrow text-[10px] text-ink-subtle">Total</th>
            </tr>
          </thead>
          <tbody>
            {entities.map((e, i) => {
              const isBrand = i === 0;
              const total = llms.reduce((s, llm) => s + (cells[llm][e] || 0), 0);
              const grandTotal = llms.reduce((s, llm) => s + totalByLlm[llm], 0);
              return (
                <tr key={e} className={`border-b border-DEFAULT last:border-b-0 ${isBrand ? "bg-brand-50" : ""}`}>
                  <td className={`py-2 px-2 sticky left-0 ${isBrand ? "bg-brand-50" : "bg-white"} ${isBrand ? "font-medium text-ink" : "text-ink"}`}>
                    {isBrand && <span className="font-mono text-[9px] uppercase tracking-eyebrow text-brand-500 mr-1">★</span>}
                    {e}
                  </td>
                  {llms.map(llm => {
                    const count = cells[llm][e] || 0;
                    const total = totalByLlm[llm] || 1;
                    const ratio = count / total;
                    const { bg, fg } = intensityClass(ratio);
                    return (
                      <td key={llm} className="text-center py-1.5 px-2">
                        <div
                          className={`inline-flex items-baseline justify-center min-w-[2.5rem] py-1 px-2 rounded-md ${bg} ${fg} font-mono text-xs tabular-nums`}
                          title={`${count} sur ${total} prompts (${(ratio * 100).toFixed(0)}%)`}
                        >
                          {count}
                        </div>
                      </td>
                    );
                  })}
                  <td className="text-center py-1.5 px-2 font-mono text-xs text-ink-muted tabular-nums">
                    {total} <span className="text-[9px] text-ink-subtle">/ {grandTotal}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 mt-3 text-[10px] text-ink-subtle font-mono flex-wrap">
        <span>Heatmap :</span>
        <span className="bg-surface text-ink-subtle px-2 py-0.5 rounded-md">0%</span>
        <span className="bg-brand-50 text-brand-600 px-2 py-0.5 rounded-md">&lt;15%</span>
        <span className="bg-brand-500/50 text-white px-2 py-0.5 rounded-md">15-35%</span>
        <span className="bg-brand-500 text-white px-2 py-0.5 rounded-md">35-60%</span>
        <span className="bg-ink text-white px-2 py-0.5 rounded-md">≥60%</span>
      </div>
    </div>
  );
}
