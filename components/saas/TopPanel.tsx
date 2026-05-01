// Panel "Top 10". Style DS — Card + barres brand-500.

import Link from "next/link";
import type { ReactNode } from "react";

export type TopRow = {
  id: string;
  label: string;
  sublabel?: string;
  value: number;
  display?: string;
  href?: string;
  /** Classe Tailwind pour la barre — défaut: bg-brand-500 */
  colorClass?: string;
};

type Props = {
  title: string;
  rows: TopRow[];
  limit?: number;
  rightSlot?: ReactNode;
  emptyText?: string;
};

export function TopPanel({ title, rows, limit = 10, rightSlot, emptyText = "Pas encore de données." }: Props) {
  const top = rows.slice(0, limit);
  const max = Math.max(1, ...top.map(r => r.value));

  return (
    <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-5">
      <div className="flex items-baseline justify-between mb-4 gap-3">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500">{title}</p>
        {rightSlot}
      </div>
      {top.length === 0 ? (
        <p className="text-xs text-ink-muted italic py-4">{emptyText}</p>
      ) : (
        <ol className="space-y-2">
          {top.map((r, i) => {
            const pct = (r.value / max) * 100;
            const inner = (
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] text-ink-subtle w-5 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="text-xs text-ink truncate">{r.label}</span>
                    <span className="font-mono text-[11px] text-ink-muted shrink-0 tabular-nums">
                      {r.display ?? r.value}
                    </span>
                  </div>
                  <div className="h-1.5 bg-surface-2 overflow-hidden rounded-full">
                    <div
                      className={`h-full transition-all duration-300 ease-out rounded-full ${r.colorClass ?? "bg-brand-500"}`}
                      style={{ width: `${pct.toFixed(1)}%` }}
                    />
                  </div>
                  {r.sublabel && (
                    <div className="text-[10px] text-ink-subtle mt-0.5 truncate font-mono">
                      {r.sublabel}
                    </div>
                  )}
                </div>
              </div>
            );
            return r.href ? (
              <li key={r.id}>
                <Link
                  href={r.href}
                  className="block py-1 px-2 -mx-2 rounded-md hover:bg-surface transition-colors duration-150 ease-out"
                >
                  {inner}
                </Link>
              </li>
            ) : (
              <li key={r.id} className="py-1">{inner}</li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
