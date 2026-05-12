"use client";

// V2 — Evolution multi-line chart. Primary brand = solid + area fill, competitors = dashed.
// Uses Recharts for accessibility, hover tooltip, responsive container.

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from "recharts";

export interface EvolutionSeries {
  name: string;
  color: string;
  /** Same length as labels[]; null = no data point at that index. */
  data: Array<number | null>;
}

interface EvolutionChartProps {
  series: EvolutionSeries[];
  /** X-axis labels, e.g. ["S22", "S23", …] — same length as each series.data */
  labels: string[];
  height?: number;
}

export function EvolutionChart({ series, labels, height = 240 }: EvolutionChartProps) {
  if (!series.length || !labels.length) {
    return <div style={{ height }} className="grid place-items-center text-ink-subtle text-sm">Pas de données</div>;
  }
  const chartData = labels.map((label, i) => {
    const row: Record<string, number | string | null> = { label };
    for (const s of series) row[s.name] = s.data[i] ?? null;
    return row;
  });

  const primary = series[0];

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 12, right: 12, bottom: 12, left: 0 }}>
          <CartesianGrid stroke="rgba(10,14,26,0.08)" strokeDasharray="2 3" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="rgba(10,14,26,0.45)"
            tick={{ fontSize: 10, fontFamily: '"JetBrains Mono", monospace', fill: "#8C94A6" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            stroke="rgba(10,14,26,0.45)"
            tick={{ fontSize: 10, fontFamily: '"JetBrains Mono", monospace', fill: "#8C94A6" }}
            tickLine={false}
            axisLine={false}
            width={28}
          />
          <Tooltip
            cursor={{ stroke: "rgba(10,14,26,0.14)", strokeWidth: 1 }}
            contentStyle={{
              background: "#FFFFFF",
              border: "1px solid rgba(10,14,26,0.14)",
              borderRadius: 8,
              boxShadow: "0 8px 24px rgba(10,14,26,0.08)",
              fontSize: 12,
              fontFamily: "Inter, system-ui",
              padding: "8px 12px",
            }}
            labelStyle={{ fontSize: 11, color: "#5B6478", marginBottom: 4, fontFamily: '"JetBrains Mono", monospace' }}
            itemStyle={{ padding: "1px 0", fontVariantNumeric: "tabular-nums" }}
            formatter={(v: unknown) => (typeof v === "number" ? v.toFixed(1) : "—")}
          />
          {/* Primary brand: area fill 10% + solid line + markers */}
          {primary && (
            <Area
              type="monotone"
              dataKey={primary.name}
              stroke="none"
              fill={primary.color}
              fillOpacity={0.10}
              isAnimationActive={false}
            />
          )}
          {series.map((s, i) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={s.color}
              strokeWidth={i === 0 ? 2 : 1.5}
              strokeDasharray={i === 0 ? undefined : "4 3"}
              dot={i === 0 ? { r: 2.5, fill: "#FFFFFF", stroke: s.color, strokeWidth: 1.5 } : false}
              activeDot={{ r: 4, stroke: s.color, strokeWidth: 2, fill: "#FFFFFF" }}
              isAnimationActive={false}
              connectNulls
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
