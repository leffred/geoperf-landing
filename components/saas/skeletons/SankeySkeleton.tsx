// S30 — Skeleton Sankey diagram (4 columns of stacked bars).

type Props = { height?: number };

export function SankeySkeleton({ height = 520 }: Props) {
  const cols = [3, 5, 2, 5];
  return (
    <div
      className="bg-white rounded-lg border border-ink/[0.08] p-6 animate-pulse"
      style={{ minHeight: `${height + 40}px` }}
    >
      <div className="grid grid-cols-4 gap-8 h-full" style={{ minHeight: `${height}px` }}>
        {cols.map((n, ci) => (
          <div key={ci} className="flex flex-col gap-3 justify-around">
            {Array.from({ length: n }).map((_, i) => (
              <div
                key={i}
                className="bg-surface rounded"
                style={{ height: `${80 - i * 8}px`, opacity: 0.7 - i * 0.08 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
