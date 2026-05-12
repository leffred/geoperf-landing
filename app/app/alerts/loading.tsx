export default function AlertsLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-7 w-24 bg-surface rounded" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-DEFAULT bg-white p-4 space-y-2">
          <div className="h-4 w-32 bg-surface rounded" />
          <div className="h-3 w-full bg-surface rounded" />
          <div className="h-3 w-2/3 bg-surface rounded" />
        </div>
      ))}
    </div>
  );
}
