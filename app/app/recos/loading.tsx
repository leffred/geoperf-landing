// Skeleton shown while recommendations load
export default function RecosLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-7 w-40 bg-surface rounded" />
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-DEFAULT bg-white p-4 space-y-2 border-l-4 border-l-surface">
            <div className="flex items-center gap-3">
              <div className="h-4 w-24 bg-surface rounded" />
              <div className="h-4 w-16 bg-surface rounded" />
            </div>
            <div className="h-3 w-full bg-surface rounded" />
            <div className="h-3 w-3/4 bg-surface rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
