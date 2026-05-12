"use client";

// V2 — Sparkline. Tiny inline trend line with optional area fill + endpoint dot.

import { LineChart, Line, Area, ComposedChart, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: number[];
  color?: string;
  area?: boolean;
  width?: number;
  height?: number;
}

export function Sparkline({ data, color = "#2563EB", area = true, width = 84, height = 36 }: SparklineProps) {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} />;
  }
  const series = data.map((v, i) => ({ i, v }));
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={series} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          {area && (
            <Area
              type="monotone"
              dataKey="v"
              stroke="none"
              fill={color}
              fillOpacity={0.12}
              isAnimationActive={false}
            />
          )}
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          {/* Endpoint dot — render as a tiny line with a single dot at the last index */}
          <Line
            type="monotone"
            dataKey="v"
            stroke="transparent"
            dot={(props: { cx?: number; cy?: number; index?: number }) => {
              const last = series.length - 1;
              if (props.index !== last) return <g />;
              return <circle cx={props.cx} cy={props.cy} r={2.5} fill={color} />;
            }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
