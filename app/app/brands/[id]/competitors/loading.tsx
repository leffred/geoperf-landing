export default function CompetitorsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-DEFAULT mb-5 pb-1">
        {[80, 90, 130, 70, 110, 80, 90].map((w, i) => (
          <div key={i} className="h-4 bg-surface rounded" style={{ width: w }} />
        ))}
      </div>
      {/* Header */}
      <div className="h-3 w-28 bg-surface rounded mb-3" />
      <div className="h-7 w-64 bg-surface rounded mb-8" />
      {/* Leaderboard table */}
      <div className="h-3 w-40 bg-surface rounded mb-3" />
      <div className="border border-DEFAULT rounded-lg overflow-hidden mb-8">
        <div className="h-9 bg-surface border-b border-DEFAULT" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-2.5 border-b border-DEFAULT last:border-0">
            <div className="h-4 w-4 bg-surface rounded" />
            <div className="h-4 flex-1 bg-surface rounded" />
            <div className="h-4 w-12 bg-surface rounded" />
            <div className="h-4 w-10 bg-surface rounded" />
          </div>
        ))}
      </div>
      {/* SoV table */}
      <div className="h-3 w-48 bg-surface rounded mb-3" />
      <div className="border border-DEFAULT rounded-lg overflow-hidden">
        <div className="h-9 bg-surface border-b border-DEFAULT" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b border-DEFAULT last:border-0">
            <div className="h-4 w-20 bg-surface rounded" />
            <div className="h-2 flex-1 bg-surface rounded-full" />
            <div className="h-4 w-10 bg-surface rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
