// Charts SVG inline pour /admin/saas. Pas de dépendance externe.
// - SignupsBarChart : bar chart quotidien sur 30j
// - TierDonut : donut tier distribution

type DailyPoint = { day: string; signups: number };
type TierSlice = { tier: string; n: number };

const TIER_COLORS: Record<string, string> = {
  free: "#888780",
  solo: "#042C53",
  pro: "#EF9F27",
  agency: "#0C447C",
};
const TIER_LABEL: Record<string, string> = { free: "Free", solo: "Solo", pro: "Pro", agency: "Agency" };

export function SignupsBarChart({ points }: { points: DailyPoint[] }) {
  if (points.length === 0) {
    return <div className="bg-white p-6 text-center text-ink-muted text-sm">Aucun signup les 30 derniers jours.</div>;
  }
  const W = 600, H = 180, padL = 32, padR = 12, padT = 12, padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.max(1, ...points.map(p => p.signups));
  const barW = innerW / points.length * 0.7;
  const stepX = innerW / Math.max(1, points.length);
  const total = points.reduce((s, p) => s + p.signups, 0);

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

  return (
    <div className="bg-white p-5">
      <div className="flex items-baseline justify-between mb-3">
        <p className="font-mono text-xs uppercase tracking-widest text-navy-light">Signups (30j)</p>
        <span className="font-serif text-xl text-navy">{total} <span className="text-xs text-ink-muted">total</span></span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        {points.map((p, i) => {
          const h = (p.signups / max) * innerH;
          const x = padL + i * stepX + (stepX - barW) / 2;
          const y = padT + innerH - h;
          return (
            <g key={p.day}>
              <rect x={x} y={y} width={barW} height={h} fill="#042C53" />
              {p.signups > 0 && (
                <text x={x + barW / 2} y={y - 4} fontSize="9" fill="#042C53" fontFamily="monospace" textAnchor="middle">{p.signups}</text>
              )}
              {(i === 0 || i === points.length - 1 || i === Math.floor(points.length / 2)) && (
                <text x={x + barW / 2} y={H - 8} fontSize="9" fill="#5F5E5A" fontFamily="monospace" textAnchor="middle">{fmtDate(p.day)}</text>
              )}
            </g>
          );
        })}
        <line x1={padL} y1={padT + innerH} x2={W - padR} y2={padT + innerH} stroke="#5F5E5A" strokeWidth="0.5" opacity="0.3" />
      </svg>
    </div>
  );
}

export function TierDonut({ slices }: { slices: TierSlice[] }) {
  const total = slices.reduce((s, x) => s + x.n, 0);
  if (total === 0) {
    return <div className="bg-white p-6 text-center text-ink-muted text-sm">Aucune subscription active.</div>;
  }
  const cx = 100, cy = 100, rOuter = 80, rInner = 50;
  let cumul = 0;
  const paths: Array<{ d: string; color: string; tier: string; n: number; pct: number }> = [];
  for (const s of slices) {
    const frac = s.n / total;
    const a1 = cumul * 2 * Math.PI - Math.PI / 2;
    const a2 = (cumul + frac) * 2 * Math.PI - Math.PI / 2;
    const x1o = cx + rOuter * Math.cos(a1), y1o = cy + rOuter * Math.sin(a1);
    const x2o = cx + rOuter * Math.cos(a2), y2o = cy + rOuter * Math.sin(a2);
    const x1i = cx + rInner * Math.cos(a2), y1i = cy + rInner * Math.sin(a2);
    const x2i = cx + rInner * Math.cos(a1), y2i = cy + rInner * Math.sin(a1);
    const large = frac > 0.5 ? 1 : 0;
    const d = `M ${x1o.toFixed(2)} ${y1o.toFixed(2)} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2o.toFixed(2)} ${y2o.toFixed(2)} L ${x1i.toFixed(2)} ${y1i.toFixed(2)} A ${rInner} ${rInner} 0 ${large} 0 ${x2i.toFixed(2)} ${y2i.toFixed(2)} Z`;
    paths.push({ d, color: TIER_COLORS[s.tier] || "#5F5E5A", tier: s.tier, n: s.n, pct: Math.round(frac * 100) });
    cumul += frac;
  }

  return (
    <div className="bg-white p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Distribution tier</p>
      <div className="grid grid-cols-2 gap-4 items-center">
        <svg viewBox="0 0 200 200" className="w-full max-w-[180px] mx-auto" xmlns="http://www.w3.org/2000/svg">
          {paths.map(p => <path key={p.tier} d={p.d} fill={p.color} stroke="#FFFFFF" strokeWidth="1" />)}
          <text x="100" y="98" fontFamily="serif" fontSize="22" fontWeight="500" fill="#042C53" textAnchor="middle">{total}</text>
          <text x="100" y="115" fontFamily="monospace" fontSize="8" fill="#5F5E5A" textAnchor="middle" letterSpacing="1">USERS ACTIFS</text>
        </svg>
        <div className="space-y-1.5 text-xs">
          {paths.map(p => (
            <div key={p.tier} className="flex items-center gap-2">
              <span className="w-3 h-3 inline-block" style={{ background: p.color }} />
              <span className="font-medium">{TIER_LABEL[p.tier] || p.tier}</span>
              <span className="font-mono text-ink-muted ml-auto">{p.n} · {p.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
