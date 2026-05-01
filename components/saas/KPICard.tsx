// KPI card. Style design system "Tech crisp".
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type Props = {
  label: string;
  value: number;
  suffix?: string;
  delta?: number | null;
  deltaLabel?: string;
  variant?: "default" | "highlight" | "amber";
  icon?: ReactNode;
  precision?: number;
  tightSuffix?: boolean;
};

const VARIANT_CLASSES: Record<NonNullable<Props["variant"]>, { bg: string; valueColor: string; labelColor: string }> = {
  default:   { bg: "bg-white border border-DEFAULT shadow-card", valueColor: "text-ink",   labelColor: "text-ink-subtle" },
  highlight: { bg: "bg-ink",                                     valueColor: "text-white", labelColor: "text-white/60" },
  amber:     { bg: "bg-brand-50 border border-brand-500/20",     valueColor: "text-brand-600", labelColor: "text-brand-600/80" },
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
      ? "text-success"
      : (delta ?? 0) < 0
        ? "text-danger"
        : cls.labelColor
    : "";
  const deltaArrow = (delta ?? 0) > 0 ? "↑" : (delta ?? 0) < 0 ? "↓" : "·";

  return (
    <div className={`rounded-lg p-5 ${cls.bg} flex flex-col`}>
      {icon && <div className={`mb-2 ${cls.labelColor}`}>{icon}</div>}
      <div className={`font-mono text-[10px] uppercase tracking-eyebrow ${cls.labelColor}`}>{label}</div>
      <div className={`mt-2 text-3xl font-medium leading-none tracking-tightish ${cls.valueColor}`}>
        {v.toFixed(precision)}{tightSuffix ? "" : (suffix ? " " : "")}<span className="text-base">{suffix}</span>
      </div>
      {showDelta && (
        <div className="mt-2 text-[11px] font-mono">
          <span className={deltaColor}>{deltaArrow} {Math.abs(delta!).toFixed(1)}%</span>
          <span className={`ml-1.5 ${cls.labelColor}`}>{deltaLabel}</span>
        </div>
      )}
    </div>
  );
}
