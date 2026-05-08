// S30 — Skeleton KPI cards (matches DashboardKpiCard layout).

type Props = { n?: number };

export function KpiCardSkeleton({ n = 4 }: Props) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-${Math.min(n, 5)} gap-3 mb-6`}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-ink/[0.08] p-5 animate-pulse">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="h-3 w-20 bg-surface rounded" />
            <div className="h-5 w-16 bg-surface rounded" />
          </div>
          <div className="h-9 w-24 bg-surface rounded mb-2" />
          <div className="h-3 w-32 bg-surface rounded" />
        </div>
      ))}
    </div>
  );
}
