// V2 — Brands × LLM heatmap. Each cell : color-mix accent at v% opacity, score in mono.
// Cells with v > 55 flip text to white.

interface LLMHeatmapProps {
  rows: string[];
  cols: string[];
  /** 2D matrix [row][col] of numeric scores 0-100. null/undefined = empty cell. */
  values: Array<Array<number | null | undefined>>;
  accent?: string;
}

export function LLMHeatmap({ rows, cols, values, accent = "#2563EB" }: LLMHeatmapProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse" style={{ fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ width: 110 }} />
            {cols.map((c) => (
              <th
                key={c}
                className="font-mono text-ink-subtle font-medium uppercase text-center px-2 py-2"
                style={{ fontSize: 10, letterSpacing: "0.1em" }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={r}>
              <td
                className="text-right pr-3 text-ink whitespace-nowrap"
                style={{ fontSize: 12, fontWeight: 500 }}
              >
                {r}
              </td>
              {cols.map((c, ci) => {
                const v = values[ri]?.[ci];
                if (v === null || v === undefined) {
                  return (
                    <td key={c} style={{ padding: 2 }}>
                      <div
                        className="grid place-items-center text-ink-subtle"
                        style={{
                          width: 38,
                          height: 34,
                          background: "#F7F8FA",
                          borderRadius: 4,
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: 10,
                        }}
                      >
                        —
                      </div>
                    </td>
                  );
                }
                const opacity = Math.max(0, Math.min(100, v)) / 100;
                const bg = `color-mix(in srgb, ${accent} ${Math.round(opacity * 100)}%, #F7F8FA)`;
                const textColor = opacity > 0.55 ? "#FFFFFF" : "#0A0E1A";
                return (
                  <td key={c} style={{ padding: 2 }}>
                    <div
                      className="grid place-items-center"
                      style={{
                        width: 38,
                        height: 34,
                        background: bg,
                        borderRadius: 4,
                        color: textColor,
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 10,
                        fontWeight: 500,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {Math.round(v)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
