// S30 — Skeleton donut chart (matches SentimentDonut card).

type Props = { size?: number };

export function DonutSkeleton({ size = 200 }: Props) {
  return (
    <div className="bg-white rounded-lg border border-ink/[0.08] p-5 animate-pulse">
      <div className="h-3 w-32 bg-surface rounded mb-5" />
      <div className="flex items-center justify-center" style={{ height: `${size + 40}px` }}>
        <div
          className="rounded-full bg-surface relative"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            mask: "radial-gradient(circle, transparent 38%, black 39%)",
            WebkitMask: "radial-gradient(circle, transparent 38%, black 39%)",
          }}
        />
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-3 bg-surface rounded" />
        ))}
      </div>
    </div>
  );
}
