// S30 — Skeleton activity timeline (matches ActivityTimeline rows).

type Props = { n?: number };

export function TimelineSkeleton({ n = 5 }: Props) {
  return (
    <div className="bg-white rounded-lg border border-ink/[0.08] p-6 animate-pulse">
      <div className="h-3 w-32 bg-surface rounded mb-5" />
      <ul className="space-y-3">
        {Array.from({ length: n }).map((_, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="h-4 w-4 bg-surface rounded-full shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-3/4 bg-surface rounded" />
              <div className="h-3 w-1/3 bg-surface rounded" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
