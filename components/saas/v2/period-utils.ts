// Pure utility functions for period ranges.
// NO "use client" — safe to import from Server Components.
// PeriodToggle.tsx imports from here too so both sides share the same source.

export type PeriodRange = "4w" | "12w" | "1y";

export function parseRange(value: string | undefined | null): PeriodRange {
  if (value === "4w" || value === "12w" || value === "1y") return value;
  return "12w";
}

export function rangeToDays(range: PeriodRange): number {
  if (range === "4w") return 28;
  if (range === "1y") return 365;
  return 84; // 12w
}
