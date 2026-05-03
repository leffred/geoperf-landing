// Top 10 Cited Domains — server component.
// Source : RPC saas_top_cited_domains(snapshot_id, 10)

import { Eyebrow } from "@/components/ui/Eyebrow";

export type CitedDomainRow = {
  domain: string;
  citation_count: number;
  share_pct: number;
};

type Props = {
  rows: CitedDomainRow[];
};

export function Top10CitedDomains({ rows }: Props) {
  const top = [...rows].sort((a, b) => Number(b.citation_count) - Number(a.citation_count)).slice(0, 10);
  const max = top.reduce((m, r) => Math.max(m, Number(r.share_pct) || 0), 0);

  return (
    <div className="bg-white rounded-lg border border-ink/[0.08] p-6 h-full flex flex-col">
      <div className="mb-1">
        <Eyebrow>Top 10 · Domaines cités</Eyebrow>
      </div>
      <h3 className="text-base font-medium text-ink tracking-tight mb-5">Sources que les LLMs citent</h3>
      {top.length === 0 ? (
        <p className="text-sm text-ink-muted italic">Aucune source citée dans ce snapshot.</p>
      ) : (
        <ul className="space-y-2.5 flex-1">
          {top.map((r, idx) => (
            <li key={r.domain} className="grid grid-cols-[1.25rem_minmax(0,1fr)_3rem] items-center gap-3">
              <span className="text-[10px] font-mono tabular-nums text-ink-subtle">{idx + 1}</span>
              <div className="min-w-0">
                <div className="text-sm font-mono text-ink truncate">{r.domain}</div>
                <div className="h-1.5 bg-surface rounded-sm overflow-hidden mt-1">
                  <div
                    className="h-full rounded-sm bg-brand-500"
                    style={{ width: `${max > 0 ? Math.max(2, (Number(r.share_pct) / max) * 100) : 0}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-mono tabular-nums text-ink text-right">
                {Number(r.share_pct).toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
