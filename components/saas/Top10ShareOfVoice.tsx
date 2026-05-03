// Top 10 Share of Voice — server component.
// Source : v_saas_competitor_share_of_voice WHERE snapshot_id = latest

import { Eyebrow } from "@/components/ui/Eyebrow";

export type ShareOfVoiceRow = {
  entity_name: string;
  is_self: boolean;
  mention_count: number;
  share_pct: number;
  rank: number;
};

type Props = {
  rows: ShareOfVoiceRow[];
};

export function Top10ShareOfVoice({ rows }: Props) {
  const top = [...rows].sort((a, b) => a.rank - b.rank).slice(0, 10);
  const max = top.reduce((m, r) => Math.max(m, Number(r.share_pct) || 0), 0);

  return (
    <div className="bg-white rounded-lg border border-ink/[0.08] p-6 h-full flex flex-col">
      <div className="mb-1">
        <Eyebrow>Top 10 · Share of Voice</Eyebrow>
      </div>
      <h3 className="text-base font-medium text-ink tracking-tight mb-5">Acteurs les plus cités</h3>
      {top.length === 0 ? (
        <p className="text-sm text-ink-muted italic">Pas encore de mentions à comptabiliser.</p>
      ) : (
        <ul className="space-y-2.5 flex-1">
          {top.map(r => (
            <li key={r.entity_name} className="grid grid-cols-[1.25rem_minmax(0,1fr)_4rem] items-center gap-3">
              <span className="text-[10px] font-mono tabular-nums text-ink-subtle">{r.rank}</span>
              <div className="min-w-0">
                <div className={`text-sm truncate ${r.is_self ? "font-medium text-ink" : "text-ink-muted"}`}>
                  {r.entity_name}
                </div>
                <div className="h-1.5 bg-surface rounded-sm overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-sm ${r.is_self ? "bg-brand-500" : "bg-ink/30"}`}
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
