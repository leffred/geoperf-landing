// Top 10 Cited URLs — server component.
// Source : RPC saas_top_cited_urls(snapshot_id, 10)

import { Eyebrow } from "@/components/ui/Eyebrow";

export type CitedUrlRow = {
  url: string;
  domain: string | null;
  citation_count: number;
  share_pct: number;
};

type Props = {
  rows: CitedUrlRow[];
};

function shortenUrl(u: string, max = 48): string {
  if (!u) return "";
  try {
    const parsed = new URL(u);
    const path = parsed.pathname === "/" ? "" : parsed.pathname;
    const compact = parsed.hostname + path;
    return compact.length <= max ? compact : compact.slice(0, max - 1) + "…";
  } catch {
    return u.length <= max ? u : u.slice(0, max - 1) + "…";
  }
}

export function Top10CitedUrls({ rows }: Props) {
  const top = [...rows].sort((a, b) => Number(b.citation_count) - Number(a.citation_count)).slice(0, 10);
  const max = top.reduce((m, r) => Math.max(m, Number(r.share_pct) || 0), 0);

  return (
    <div className="bg-white rounded-lg border border-ink/[0.08] p-6 h-full flex flex-col">
      <div className="mb-1">
        <Eyebrow>Top 10 · URLs citées</Eyebrow>
      </div>
      <h3 className="text-base font-medium text-ink tracking-tight mb-5">Pages exactes en réponse</h3>
      {top.length === 0 ? (
        <p className="text-sm text-ink-muted italic">Aucune URL citée dans ce snapshot.</p>
      ) : (
        <ul className="space-y-2.5 flex-1">
          {top.map((r, idx) => (
            <li key={r.url} className="grid grid-cols-[1.25rem_minmax(0,1fr)_3rem] items-center gap-3">
              <span className="text-[10px] font-mono tabular-nums text-ink-subtle">{idx + 1}</span>
              <div className="min-w-0">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-ink truncate block hover:text-brand-500 transition-colors"
                  title={r.url}
                >
                  {shortenUrl(r.url)}
                </a>
                <div className="h-1.5 bg-surface rounded-sm overflow-hidden mt-1">
                  <div
                    className="h-full rounded-sm bg-brand-500"
                    style={{ width: `${max > 0 ? Math.max(2, (Number(r.share_pct) / max) * 100) : 0}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-mono tabular-nums text-ink text-right">
                {Number(r.share_pct).toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
