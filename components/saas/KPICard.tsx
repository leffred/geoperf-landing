// KPI card réutilisable pour dashboard. Spec : SPRINTS_S8_S9_S10_PLAN.md S8.2
//
// Affiche : icon + label + value (count-up animation) + delta% vs période précédente.
// Animation côté client : count from 0 → value sur 600ms à mount.
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type Props = {
  label: string;
  /** Valeur numérique principale */
  value: number;
  /** Suffixe affiché après la valeur (ex: "%", "/100", "€") */
  suffix?: string;
  /** Delta% vs période précédente. >0 = vert, <0 = rouge */
  delta?: number | null;
  /** Texte sous le delta (ex: "vs 30j") */
  deltaLabel?: string;
  /** Variant d'affichage */
  variant?: "default" | "highlight" | "amber";
  /** Icon SVG inline (optionnel) */
  icon?: ReactNode;
  /** Nombre de chiffres après la virgule (default 0) */
  precision?: number;
  /** Afficher le suffixe collé sans espace (ex: "25%" au lieu de "25 %") */
  tightSuffix?: boolean;
};

const VARIANT_CLASSES: Record<NonNullable<Props["variant"]>, { bg: string; valueColor: string; labelColor: string }> = {
  default:   { bg: "bg-white",       valueColor: "text-navy",  labelColor: "text-ink-muted" },
  highlight: { bg: "bg-navy text-white", valueColor: "text-white", labelColor: "text-white/70" },
  amber:     { bg: "bg-amber",       valueColor: "text-navy",  labelColor: "text-navy/70" },
};

function useCountUp(target: number, durationMs = 600): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    let start: number | null = null;
    let raf = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / durationMs);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return val;
}

export function KPICard({
  label,
  value,
  suffix = "",
  delta = null,
  deltaLabel = "vs 30j",
  variant = "default",
  icon,
  precision = 0,
  tightSuffix = false,
}: Props) {
  const v = useCountUp(value);
  const cls = VARIANT_CLASSES[variant];

  const showDelta = delta !== null && delta !== undefined && Number.isFinite(delta);
  const deltaPositive = (delta ?? 0) > 0;
  const deltaColor = showDelta
    ? deltaPositive
      ? "text-emerald-600"
      : (delta ?? 0) < 0
        ? "text-red-600"
        : "text-ink-muted"
    : "";
  const deltaArrow = (delta ?? 0) > 0 ? "↑" : (delta ?? 0) < 0 ? "↓" : "·";

  return (
    <div className={`p-5 ${cls.bg} flex flex-col`}>
      {icon && <div className={`mb-2 ${cls.labelColor}`}>{icon}</div>}
      <div className={`font-serif text-3xl font-medium leading-none ${cls.valueColor}`}>
        {v.toFixed(precision)}{tightSuffix ? "" : (suffix ? " " : "")}<span className="text-base">{suffix}</span>
      </div>
      <div className={`text-xs mt-2 tracking-wide ${cls.labelColor}`}>{label}</div>
      {showDelta && (
        <div className={`mt-1 text-[11px] font-mono ${variant === "highlight" || variant === "amber" ? "" : ""}`}>
          <span className={deltaColor}>{deltaArrow} {Math.abs(delta!).toFixed(1)}%</span>
          <span className={`ml-1.5 ${cls.labelColor}`}>{deltaLabel}</span>
        </div>
      )}
    </div>
  );
}
