// S30 — Skeleton Top 10 list (matches Top10ShareOfVoice/Top10CitedDomains/Top10CitedUrls).

type Props = { n?: number };

export function Top10Skeleton({ n = 10 }: Props) {
  return (
    <div className="bg-white rounded-lg border border-ink/[0.08] p-6 h-full flex flex-col animate-pulse">
      <div className="h-3 w-28 bg-surface rounded mb-2" />
      <div className="h-5 w-44 bg-surface rounded mb-5" />
      <ul className="space-y-2">
        {Array.from({ length: n }).map((_, i) => (
          <li key={i} className="flex items-center gap-3">
            <div className="h-3 w-4 bg-surface rounded shrink-0" />
            <div className="flex-1 h-2 bg-surface rounded" style={{ width: `${100 - i * 7}%` }} />
            <div className="h-3 w-10 bg-surface rounded shrink-0" />
          </li>
        ))}
      </ul>
    </div>
  );
}
