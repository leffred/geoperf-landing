// Ligne compacte pour multi-brand overview (server component).
// Format : [name + domain] [visibility%] [sparkline 6 sem] [Top concurrent] [→]

import Link from "next/link";
import { Sparkline } from "./Sparkline";

type Props = {
  brandId: string;
  name: string;
  domain: string;
  visibilityScore: number | null;
  topCompetitor?: string | null;
  sparkValues: number[];
  unreadAlerts?: number;
};

export function BrandOverviewRow({ brandId, name, domain, visibilityScore, topCompetitor, sparkValues, unreadAlerts }: Props) {
  return (
    <Link
      href={`/app/brands/${brandId}`}
      className="grid grid-cols-[minmax(0,2fr)_4rem_5rem_minmax(0,1fr)_1.5rem] items-center gap-4 px-5 py-3 hover:bg-surface transition-colors border-b border-ink/[0.06] last:border-b-0"
    >
      <div className="min-w-0">
        <div className="text-sm text-ink font-medium truncate">{name}</div>
        <div className="text-[11px] font-mono text-ink-muted truncate">{domain}</div>
      </div>
      <div className="text-right">
        <div className="text-base text-ink font-medium tabular-nums">
          {visibilityScore !== null ? Number(visibilityScore).toFixed(0) : "—"}
        </div>
        <div className="text-[10px] font-mono text-ink-subtle uppercase tracking-eyebrow">/100</div>
      </div>
      <div className="flex justify-center">
        <Sparkline values={sparkValues} width={70} height={22} color="#2563EB" />
      </div>
      <div className="min-w-0">
        {topCompetitor ? (
          <>
            <div className="text-[10px] font-mono uppercase tracking-eyebrow text-ink-subtle">Top concurrent</div>
            <div className="text-xs text-ink-muted truncate">{topCompetitor}</div>
          </>
        ) : (
          <div className="text-xs text-ink-subtle italic">Pas encore mesuré</div>
        )}
      </div>
      <div className="text-right">
        {unreadAlerts && unreadAlerts > 0 ? (
          <span className="text-[10px] font-mono text-warning">{unreadAlerts}!</span>
        ) : (
          <span className="text-ink-subtle">→</span>
        )}
      </div>
    </Link>
  );
}
