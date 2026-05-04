"use client";

// Toggle horizontal 1m / 3m / 6m / 12m. Géré via URL param ?period=...
// Default = 3m si pas de param.

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export type Period = "1m" | "3m" | "6m" | "12m";

const OPTIONS: { value: Period; label: string }[] = [
  { value: "1m", label: "1 mois" },
  { value: "3m", label: "3 mois" },
  { value: "6m", label: "6 mois" },
  { value: "12m", label: "12 mois" },
];

export function PeriodToggle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current: Period = (() => {
    const p = searchParams.get("period");
    return p === "1m" || p === "3m" || p === "6m" || p === "12m" ? p : "3m";
  })();

  function buildHref(period: Period): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", period);
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="inline-flex items-center gap-1 bg-surface rounded-md p-1 mb-6 text-xs">
      <span className="font-mono uppercase tracking-eyebrow text-brand-500 px-2">Période</span>
      {OPTIONS.map(opt => {
        const active = opt.value === current;
        return (
          <Link
            key={opt.value}
            href={buildHref(opt.value)}
            scroll={false}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              active
                ? "bg-white text-ink shadow-sm font-medium"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}

// Helper côté server pour résoudre la période en days depuis searchParams.
export function periodToDays(p: string | undefined): { days: number; label: string; period: Period } {
  const period: Period = (p === "1m" || p === "3m" || p === "6m" || p === "12m") ? (p as Period) : "3m";
  const days = period === "1m" ? 30 : period === "3m" ? 90 : period === "6m" ? 180 : 365;
  const label = period === "1m" ? "1 mois" : period === "3m" ? "3 mois" : period === "6m" ? "6 mois" : "12 mois";
  return { days, label, period };
}
