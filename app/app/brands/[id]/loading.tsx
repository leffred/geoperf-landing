// Skeleton shown while brand page data loads
export default function BrandLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="h-3 w-12 bg-surface rounded" />
        <div className="h-3 w-2 bg-surface rounded" />
        <div className="h-3 w-32 bg-surface rounded" />
      </div>
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-surface shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-6 w-48 bg-surface rounded" />
          <div className="h-3 w-24 bg-surface rounded" />
        </div>
        <div className="h-8 w-28 bg-surface rounded-md" />
      </div>
      {/* Tabs */}
      <div className="flex gap-1 border-b border-DEFAULT pb-0">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-20 bg-surface rounded-t-md" />
        ))}
      </div>
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-DEFAULT bg-white p-4 space-y-2">
            <div className="h-3 w-24 bg-surface rounded" />
            <div className="h-7 w-16 bg-surface rounded" />
          </div>
        ))}
      </div>
      {/* Charts */}
      <div className="grid gap-4 grid-cols-2">
        <div className="rounded-xl border border-DEFAULT bg-white p-5 space-y-3">
          <div className="h-4 w-32 bg-surface rounded" />
          <div className="h-40 bg-surface rounded-lg" />
        </div>
        <div className="rounded-xl border border-DEFAULT bg-white p-5 space-y-3">
          <div className="h-4 w-28 bg-surface rounded" />
          <div className="h-40 bg-surface rounded-lg" />
        </div>
      </div>
    </div>
  );
}
