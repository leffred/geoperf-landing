// Inline SVG line chart pour visibility_score over time. Tech crisp.

export type Point = {
  snapshot_date: string;
  visibility_score: number | null;
  citation_rate?: number | null;
  avg_rank?: number | null;
};

type Props = {
  points: Point[];
  brandName: string;
};

export function BrandEvolutionChart({ points, brandName }: Props) {
  const sorted = [...points]
    .filter(p => p.visibility_score !== null)
    .sort((a, b) => a.snapshot_date.localeCompare(b.snapshot_date));

  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-8 text-center text-ink-muted text-sm">
        Pas encore d&apos;historique. Le graph apparaîtra après le 2e snapshot.
      </div>
    );
  }
  if (sorted.length === 1) {
    return (
      <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-8 text-center text-sm">
        <div className="text-3xl font-medium text-ink mb-2 tracking-tightish tabular-nums">
          {Number(sorted[0].visibility_score).toFixed(0)}
        </div>
        <div className="text-ink-muted">Snapshot du {new Date(sorted[0].snapshot_date).toLocaleDateString("fr-FR")}</div>
        <div className="text-xs text-ink-subtle mt-2">Le graph d&apos;évolution s&apos;affichera dès le prochain snapshot.</div>
      </div>
    );
  }

  const W = 600, H = 200, padL = 32, padR = 12, padT = 16, padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const n = sorted.length;
  const stepX = n > 1 ? innerW / (n - 1) : 0;

  const xy = sorted.map((p, i) => {
    const x = padL + i * stepX;
    const y = padT + innerH - (Number(p.visibility_score ?? 0) / 100) * innerH;
    return { x, y, p };
  });

  const linePath = xy.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${xy[xy.length - 1].x.toFixed(1)},${(padT + innerH).toFixed(1)} L ${xy[0].x.toFixed(1)},${(padT + innerH).toFixed(1)} Z`;

  const gridY = [0, 25, 50, 75, 100];
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

  return (
    <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-5">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500">Visibility score</p>
          <p className="text-xs text-ink-muted mt-0.5">{brandName} · {n} snapshots</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-medium text-ink tracking-tightish tabular-nums">
            {Number(sorted[sorted.length - 1].visibility_score).toFixed(0)}
          </span>
          <span className="text-xs text-ink-subtle ml-1">/ 100</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        {gridY.map(g => {
          const y = padT + innerH - (g / 100) * innerH;
          return (
            <g key={g}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#1D4ED8" strokeWidth="0.5" strokeDasharray="2,3" opacity="0.15" />
              <text x={padL - 6} y={y + 3} fontSize="9" fill="#5B6478" fontFamily="JetBrains Mono, monospace" textAnchor="end">{g}</text>
            </g>
          );
        })}
        <path d={areaPath} fill="#2563EB" opacity="0.10" />
        <path d={linePath} fill="none" stroke="#2563EB" strokeWidth="1.5" />
        {xy.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="3" fill="#2563EB" />
            {i === 0 || i === xy.length - 1 || i === Math.floor(xy.length / 2) ? (
              <text x={pt.x} y={H - 8} fontSize="9" fill="#5B6478" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
                {fmtDate(pt.p.snapshot_date)}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  );
}
