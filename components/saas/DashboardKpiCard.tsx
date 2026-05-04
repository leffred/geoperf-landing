// KPI card pour le dashboard synthétique (server component).
// Tech crisp : value 4xl/5xl tabular-nums, eyebrow JetBrains Mono, delta optionnel + sparkline mini.

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Sparkline } from "./Sparkline";

type Props = {
  eyebrow: string;
  value: string;
  /** Sub-line affichée sous la valeur, ex "vs il y a 7 jours" */
  hint?: string;
  /** Delta numérique (en pts ou %), affiche couleur + flèche */
  delta?: number | null;
  deltaUnit?: string;
  /** Mini sparkline si historique disponible */
  sparkValues?: number[];
  sparkColor?: string;
};

export function DashboardKpiCard({ eyebrow, value, hint, delta, deltaUnit = "pt", sparkValues, sparkColor }: Props) {
  return (
    <div className="bg-white rounded-lg border border-ink/[0.08] p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <Eyebrow>{eyebrow}</Eyebrow>
        {sparkValues && sparkValues.length >= 2 && (
          <Sparkline values={sparkValues} width={64} height={20} color={sparkColor ?? "#2563EB"} />
        )}
      </div>
      <div className="text-3xl md:text-4xl font-medium tracking-tight text-ink tabular-nums">
        {value}
      </div>
      {(delta !== undefined && delta !== null) && (
        <div className="mt-1 text-xs font-mono">
          <span className={delta > 0 ? "text-success" : delta < 0 ? "text-danger" : "text-ink-subtle"}>
            {delta > 0 ? "↑" : delta < 0 ? "↓" : "→"} {delta >= 0 ? "+" : ""}{delta.toFixed(1)} {deltaUnit}
          </span>
          {hint && <span className="text-ink-subtle ml-2">{hint}</span>}
        </div>
      )}
      {(delta === undefined || delta === null) && hint && (
        <div className="mt-1 text-xs text-ink-muted">{hint}</div>
      )}
    </div>
  );
}
