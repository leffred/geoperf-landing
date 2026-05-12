"use client";

// V2 — Period toggle (4S / 12S / 1A). Client component using URL search params.
// Preserves all other query params when switching.
// NOTE: parseRange / rangeToDays / PeriodRange live in period-utils.ts (no "use client")
// so Server Components can import them without triggering RSC boundary errors.

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { type PeriodRange } from "./period-utils";
export type { PeriodRange } from "./period-utils";
export { parseRange, rangeToDays } from "./period-utils";

const RANGES = [
  { key: "4w", label: "4S" },
  { key: "12w", label: "12S" },
  { key: "1y", label: "1A" },
] as const;

export function PeriodToggle({ defaultRange = "12w" }: { defaultRange?: PeriodRange }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const active = (params?.get("range") as PeriodRange | null) ?? defaultRange;

  const hrefs = useMemo(() => {
    const result: Record<string, string> = {};
    for (const r of RANGES) {
      const sp = new URLSearchParams(params?.toString());
      sp.set("range", r.key);
      result[r.key] = `${pathname}?${sp.toString()}`;
    }
    return result;
  }, [pathname, params]);

  return (
    <div
      className="flex items-center rounded-md border border-DEFAULT bg-surface"
      style={{ padding: 2, gap: 0 }}
    >
      {RANGES.map((r) => {
        const isActive = r.key === active;
        return (
          <Link
            key={r.key}
            href={hrefs[r.key]}
            scroll={false}
            className={`no-underline transition-all duration-fast ${isActive ? "shadow-card" : ""}`}
            style={{
              padding: "5px 10px",
              fontSize: 12,
              fontWeight: isActive ? 600 : 500,
              borderRadius: 4,
              background: isActive ? "#FFFFFF" : "transparent",
              color: isActive ? "#0A0E1A" : "#5B6478",
            }}
          >
            {r.label}
          </Link>
        );
      })}
    </div>
  );
}

