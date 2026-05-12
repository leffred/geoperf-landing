// Skeleton shown while dashboard data loads (Next.js Suspense via loading.tsx)
export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-DEFAULT bg-white p-4 space-y-2">
            <div className="h-3 w-24 bg-surface rounded" />
            <div className="h-7 w-16 bg-surface rounded" />
            <div className="h-3 w-12 bg-surface rounded" />
          </div>
        ))}
      </div>
      {/* Main grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1.7fr 1fr" }}>
        {/* Evolution chart */}
        <div className="rounded-xl border border-DEFAULT bg-white p-5 space-y-3">
          <div className="h-4 w-36 bg-surface rounded" />
          <div className="h-48 bg-surface rounded-lg" />
        </div>
        {/* Brand cards */}
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-DEFAULT bg-white p-4 space-y-2">
              <div className="h-4 w-32 bg-surface rounded" />
              <div className="h-3 w-20 bg-surface rounded" />
            </div>
          ))}
        </div>
      </div>
      {/* LLM heatmap */}
      <div className="rounded-xl border border-DEFAULT bg-white p-5 space-y-3">
        <div className="h-4 w-28 bg-surface rounded" />
        <div className="h-24 bg-surface rounded-lg" />
      </div>
    </div>
  );
}
