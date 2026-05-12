// V2 — Delta indicator (▲/▼ + value)
// Used in KPI strips, brand cards, sources tables.
// up = good (▲ green), down = bad (▼ red), 0/null = flat dash.
// For metrics where lower = better (rank), invert via `invertColor`.

interface DeltaProps {
  value: number | null | undefined;
  suffix?: string;
  size?: number;
  /** When true, negative values render green (used for "rank decreased = good"). */
  invertColor?: boolean;
}

export function Delta({ value, suffix = "pts", size = 11, invertColor = false }: DeltaProps) {
  if (value === null || value === undefined || value === 0) {
    return (
      <span
        className="font-mono text-ink-subtle"
        style={{ fontSize: size, fontVariantNumeric: "tabular-nums" }}
      >
        —
      </span>
    );
  }
  const positive = value > 0;
  const isGood = invertColor ? !positive : positive;
  return (
    <span
      className={isGood ? "text-success" : "text-danger"}
      style={{
        fontSize: size,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontWeight: 500,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {positive ? "▲" : "▼"} {Math.abs(value).toFixed(1)}
      {suffix}
    </span>
  );
}
