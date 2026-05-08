// S30 — Skeleton competitor matrix (5×5 grid card).

export function MatrixSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-ink/[0.08] p-6 animate-pulse">
      <div className="h-3 w-40 bg-surface rounded mb-2" />
      <div className="h-5 w-56 bg-surface rounded mb-5" />
      <div className="grid grid-cols-6 gap-1">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="h-10 bg-surface rounded" />
        ))}
      </div>
    </div>
  );
}
