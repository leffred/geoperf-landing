// Mini sparkline SVG (pas de Recharts pour rester léger en list). Spec : S8.2
// Trace une ligne simple avec dernier point en évidence.

type Props = {
  /** Tableau des valeurs numériques (chronologique : oldest → newest) */
  values: number[];
  /** Largeur en px (default 80) */
  width?: number;
  /** Hauteur en px (default 22) */
  height?: number;
  /** Couleur de la ligne */
  color?: string;
  /** Range max pour normaliser (default = max des values) */
  maxValue?: number;
  className?: string;
};

export function Sparkline({ values, width = 80, height = 22, color = "#2563EB", maxValue, className = "" }: Props) {
  if (!values || values.length < 2) {
    return <span className={`inline-block text-[10px] font-mono text-ink-muted ${className}`} style={{ width, height }} aria-hidden="true">—</span>;
  }
  const max = Math.max(maxValue ?? 100, ...values, 1);
  const padX = 2;
  const padY = 2;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const stepX = values.length > 1 ? innerW / (values.length - 1) : 0;

  const points = values.map((v, i) => {
    const x = padX + i * stepX;
    const y = padY + innerH - (Math.max(0, v) / max) * innerH;
    return { x, y, v };
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Sparkline last ${values.length} values`}
    >
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r="2" fill={color} />
    </svg>
  );
}
