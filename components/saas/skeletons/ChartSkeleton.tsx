// S30 — Skeleton chart (matches BrandEvolutionChart card frame).

type Props = { height?: number };

export function ChartSkeleton({ height = 200 }: Props) {
  return (
    <div className="bg-white rounded-lg border border-ink/[0.08] p-6 animate-pulse">
      <div className="h-3 w-32 bg-surface rounded mb-2" />
      <div className="h-5 w-44 bg-surface rounded mb-4" />
      <div
        className="w-full bg-surface rounded"
        style={{ height: `${height}px` }}
      />
    </div>
  );
}
