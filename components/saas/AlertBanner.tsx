import Link from "next/link";

type Alert = {
  id: string;
  alert_type: string;
  severity: "high" | "medium" | "low";
  title: string;
  body: string;
  brand_id: string;
  created_at: string;
};

const SEV_STYLES: Record<string, string> = {
  high:   "border-l-2 border-red-600 bg-red-50",
  medium: "border-l-2 border-amber bg-amber/10",
  low:    "border-l-2 border-navy/20 bg-cream",
};

const TYPE_LABELS: Record<string, string> = {
  rank_drop: "Rank ↓",
  rank_gain: "Rank ↑",
  competitor_overtake: "Concurrent",
  new_source: "Sources",
  citation_loss: "Citation ↓",
};

export function AlertBanner({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) return null;
  return (
    <div className="space-y-2">
      {alerts.map(a => (
        <Link
          key={a.id}
          href={`/app/brands/${a.brand_id}`}
          className={`block px-4 py-3 hover:opacity-90 transition ${SEV_STYLES[a.severity] || SEV_STYLES.low}`}
        >
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{TYPE_LABELS[a.alert_type] || a.alert_type}</span>
                <span className="font-medium text-sm text-navy">{a.title}</span>
              </div>
              <p className="text-xs text-ink-muted">{a.body}</p>
            </div>
            <span className="font-mono text-[10px] text-ink-muted whitespace-nowrap">{new Date(a.created_at).toLocaleDateString("fr-FR")}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
