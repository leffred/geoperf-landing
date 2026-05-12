// V2 — KPI strip : 4 cells in a single bordered rounded card.
// Each cell : mono uppercase label (10px, 0.14em tracking) + value (28px, 600, tabular-nums) + mono sub-line.

import { Delta } from "./Delta";
import type { ReactNode } from "react";

interface KpiCellProps {
  label: string;
  value: ReactNode;
  delta?: number | null;
  deltaSuffix?: string;
  deltaInvert?: boolean;
  hint?: string;
}

export function KpiCell({ label, value, delta, deltaSuffix, deltaInvert, hint }: KpiCellProps) {
  return (
    <div className="px-4 md:px-5 py-4 border-r border-DEFAULT last:border-r-0">
      <div
        className="font-mono uppercase text-ink-subtle"
        style={{ fontSize: 10, letterSpacing: "0.14em" }}
      >
        {label}
      </div>
      <div
        className="flex items-baseline gap-2 mt-2 text-ink"
        style={{
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1.1,
        }}
      >
        {value}
        {delta !== undefined && delta !== null && (
          <Delta value={delta} suffix={deltaSuffix} invertColor={deltaInvert} />
        )}
      </div>
      {hint && (
        <div
          className="mt-1 text-ink-muted font-mono"
          style={{ fontSize: 11 }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

interface KpiStripProps {
  children: ReactNode;
  className?: string;
}

export function KpiStrip({ children, className = "" }: KpiStripProps) {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 bg-white border border-DEFAULT rounded-xl overflow-hidden shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
