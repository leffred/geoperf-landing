// S30 — Skeleton brand rows (matches BrandOverviewRow grid layout).

type Props = { n?: number };

export function BrandRowSkeleton({ n = 3 }: Props) {
  return (
    <div className="bg-white rounded-lg border border-ink/[0.08]">
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[minmax(0,2fr)_4rem_5rem_minmax(0,1fr)_1.5rem] items-center gap-4 px-5 py-3 border-b border-ink/[0.06] last:border-b-0 animate-pulse"
        >
          <div className="min-w-0 space-y-1.5">
            <div className="h-4 w-32 bg-surface rounded" />
            <div className="h-3 w-24 bg-surface rounded" />
          </div>
          <div className="h-5 w-10 bg-surface rounded justify-self-end" />
          <div className="h-4 w-16 bg-surface rounded" />
          <div className="h-3 w-24 bg-surface rounded" />
          <div className="h-3 w-3 bg-surface rounded" />
        </div>
      ))}
    </div>
  );
}
