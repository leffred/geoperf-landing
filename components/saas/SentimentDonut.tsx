// Donut Recharts pour distribution sentiment. Style Tech crisp.
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Distribution = {
  positive?: number;
  neutral?: number;
  negative?: number;
  mixed?: number;
  not_mentioned?: number;
};

const COLORS: Record<keyof Distribution, string> = {
  positive: "#059669",     // success
  neutral: "#5B6478",      // ink-muted
  negative: "#DC2626",     // danger
  mixed: "#D97706",        // warning
  not_mentioned: "#EEF1F5", // surface-2
};
const LABELS: Record<keyof Distribution, string> = {
  positive: "Positif",
  neutral: "Neutre",
  negative: "Négatif",
  mixed: "Mixte",
  not_mentioned: "Non cité",
};

type Props = { distribution: Distribution; height?: number };

export function SentimentDonut({ distribution, height = 240 }: Props) {
  const keys = ["positive", "neutral", "negative", "mixed", "not_mentioned"] as const;
  const data = keys
    .map(k => ({ name: LABELS[k], value: Number(distribution[k] ?? 0), key: k, color: COLORS[k] }))
    .filter(d => d.value > 0);
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-6 text-center text-ink-muted text-sm">
        Pas encore de données sentiment.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-5">
      <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-4">Distribution sentiment</p>
      <div className="grid sm:grid-cols-2 gap-4 items-center">
        <div className="relative">
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={95} stroke="#FFFFFF" strokeWidth={1} isAnimationActive={false}>
                {data.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#FFFFFF", border: "1px solid rgba(10,14,26,0.14)", borderRadius: 6, padding: "6px 10px", fontSize: 12, color: "#0A0E1A" }}
                formatter={(v, n) => [`${v ?? 0} réponses`, String(n ?? "")]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl text-ink font-medium tracking-tightish tabular-nums">{total}</span>
            <span className="font-mono text-[8px] text-ink-subtle tracking-eyebrow uppercase mt-0.5">Réponses</span>
          </div>
        </div>
        <div className="space-y-1.5 text-xs">
          {data.map(d => {
            const pct = Math.round((d.value / total) * 100);
            return (
              <div key={d.key} className="flex items-center gap-2">
                <span className="w-3 h-3 inline-block rounded-sm" style={{ background: d.color }} aria-hidden />
                <span className="font-medium text-ink">{d.name}</span>
                <span className="font-mono text-ink-subtle ml-auto tabular-nums">{d.value} · {pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
