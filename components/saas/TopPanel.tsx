// Panel "Top 10" réutilisable. Spec : S8.2
// Liste numérotée 1-10 avec barre de progression colorée.

import Link from "next/link";
import type { ReactNode } from "react";

export type TopRow = {
  /** Identifier unique (key) */
  id: string;
  /** Texte principal de la row */
  label: string;
  /** Sous-titre optionnel (ex: "AXA · axa.fr") */
  sublabel?: string;
  /** Métrique numérique pour la barre + display */
  value: number;
  /** Texte de la métrique affichée (ex: "78%", "12 mentions") */
  display?: string;
  /** Si href fourni, la row devient un Link */
  href?: string;
  /** Couleur de la barre (default = navy) */
  color?: string;
};

type Props = {
  title: string;
  rows: TopRow[];
  /** Nb max de rows affichées (default 10) */
  limit?: number;
  /** Action à droite du title (ex: "Voir tout →") */
  rightSlot?: ReactNode;
  /** Texte affiché si rows vide */
  emptyText?: string;
};

export function TopPanel({ title, rows, limit = 10, rightSlot, emptyText = "Pas encore de données." }: Props) {
  const top = rows.slice(0, limit);
  const max = Math.max(1, ...top.map(r => r.value));

  return (
    <div className="bg-white p-5">
      <div className="flex items-baseline justify-between mb-3 gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-navy-light">{title}</p>
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
                <span className="font-mono text-[10px] text-ink-muted w-5 shrink-0 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="text-xs text-navy truncate">{r.label}</span>
                    <span className="font-mono text-[11px] text-ink-muted shrink-0">{r.display ?? r.value}</span>
                  </div>
                  <div className="h-1.5 bg-cream overflow-hidden rounded-sm">
                    <div
                      className="h-full transition-all duration-300"
                      style={{ width: `${pct.toFixed(1)}%`, background: r.color ?? "#042C53" }}
                    />
                  </div>
                  {r.sublabel && <div className="text-[10px] text-ink-muted mt-0.5 truncate font-mono">{r.sublabel}</div>}
                </div>
              </div>
            );
            return r.href ? (
              <li key={r.id}>
                <Link href={r.href} className="block py-1 hover:bg-cream/50 -mx-2 px-2 rounded-sm">{inner}</Link>
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
