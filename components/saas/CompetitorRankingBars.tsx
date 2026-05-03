// Ranking concurrents par visibility_score (server component).
// Source primaire : v_saas_competitor_visibility (mode "visibility")
// Source fallback : v_saas_competitor_share_of_voice (mode "share_of_voice")
//   utilisée quand competitors_with_rank IS NULL (snapshots pré-S14).

import { Eyebrow } from "@/components/ui/Eyebrow";

export type VisibilityEntry = {
  entity_name: string;
  is_self: boolean;
  visibility_score: number;
  mention_count: number;
  rank: number;
};

export type ShareOfVoiceEntry = {
  entity_name: string;
  is_self: boolean;
  mention_count: number;
  share_pct: number;
  rank: number;
};

type Props = {
  brandName: string;
  /** Entrées principales (visibility) — passées si v_saas_competitor_visibility a des données */
  entries?: VisibilityEntry[];
  /** Entrées fallback (share of voice) — utilisées quand entries est vide ou ne contient que self */
  fallback?: ShareOfVoiceEntry[];
  /** Limite de barres affichées (default 7) */
  limit?: number;
};

export function CompetitorRankingBars({ brandName, entries, fallback, limit = 7 }: Props) {
  const hasVisibility = entries && entries.some(e => !e.is_self);

  if (hasVisibility) {
    return <VisibilityBars brandName={brandName} entries={entries!} limit={limit} />;
  }

  if (fallback && fallback.length > 0) {
    return <ShareOfVoiceBars brandName={brandName} entries={fallback} limit={limit} degraded />;
  }

  return (
    <div className="bg-white rounded-lg border border-ink/[0.08] p-6">
      <Eyebrow className="mb-3">Ranking concurrents</Eyebrow>
      <p className="text-sm text-ink-muted italic">Pas encore assez de données pour comparer la marque à ses concurrents.</p>
    </div>
  );
}

function VisibilityBars({ brandName, entries, limit }: { brandName: string; entries: VisibilityEntry[]; limit: number }) {
  const sorted = [...entries].sort((a, b) => a.rank - b.rank);
  let top = sorted.slice(0, limit);
  const selfRow = sorted.find(e => e.is_self);
  if (selfRow && !top.some(e => e.is_self)) {
    top = [...top.slice(0, limit - 1), selfRow];
  }

  return (
    <div className="bg-white rounded-lg border border-ink/[0.08] p-6">
      <div className="flex items-baseline justify-between mb-1">
        <Eyebrow>Ranking concurrents · visibility</Eyebrow>
        <span className="text-[10px] font-mono uppercase tracking-eyebrow text-ink-subtle">Score 0–100</span>
      </div>
      <h3 className="text-base font-medium text-ink tracking-tight mb-5">
        {brandName} <span className="text-ink-muted">vs concurrents</span>
      </h3>
      <ul className="space-y-3">
        {top.map(e => (
          <li key={e.entity_name} className="grid grid-cols-[minmax(0,9rem)_1fr_3rem] items-center gap-3">
            <span className={`text-sm truncate ${e.is_self ? "font-medium text-ink" : "text-ink-muted"}`}>
              {e.entity_name}
            </span>
            <div className="h-2 bg-surface rounded-sm overflow-hidden">
              <div
                className={`h-full rounded-sm ${e.is_self ? "bg-brand-500" : "bg-ink/30"}`}
                style={{ width: `${Math.max(2, Math.min(100, Number(e.visibility_score)))}%` }}
              />
            </div>
            <span className="text-xs font-mono tabular-nums text-ink text-right">
              {Number(e.visibility_score).toFixed(0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShareOfVoiceBars({ brandName, entries, limit, degraded }: { brandName: string; entries: ShareOfVoiceEntry[]; limit: number; degraded?: boolean }) {
  const sorted = [...entries].sort((a, b) => a.rank - b.rank);
  let top = sorted.slice(0, limit);
  const selfRow = sorted.find(e => e.is_self);
  if (selfRow && !top.some(e => e.is_self)) {
    top = [...top.slice(0, limit - 1), selfRow];
  }

  return (
    <div className="bg-white rounded-lg border border-ink/[0.08] p-6">
      <div className="flex items-baseline justify-between mb-1">
        <Eyebrow>Ranking concurrents · share of voice</Eyebrow>
        <span className="text-[10px] font-mono uppercase tracking-eyebrow text-ink-subtle">% mentions</span>
      </div>
      <h3 className="text-base font-medium text-ink tracking-tight mb-2">
        {brandName} <span className="text-ink-muted">vs concurrents</span>
      </h3>
      {degraded && (
        <p className="text-[11px] text-ink-subtle mb-4">
          Données rangs concurrents disponibles à partir du prochain snapshot.
        </p>
      )}
      <ul className="space-y-3">
        {top.map(e => (
          <li key={e.entity_name} className="grid grid-cols-[minmax(0,9rem)_1fr_3rem] items-center gap-3">
            <span className={`text-sm truncate ${e.is_self ? "font-medium text-ink" : "text-ink-muted"}`}>
              {e.entity_name}
            </span>
            <div className="h-2 bg-surface rounded-sm overflow-hidden">
              <div
                className={`h-full rounded-sm ${e.is_self ? "bg-brand-500" : "bg-ink/30"}`}
                style={{ width: `${Math.max(2, Math.min(100, Number(e.share_pct)))}%` }}
              />
            </div>
            <span className="text-xs font-mono tabular-nums text-ink text-right">
              {Number(e.share_pct).toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
