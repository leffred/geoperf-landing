// Liste de recommandations Haiku. Style DS : Card border-l-2 par priorité.

type Reco = {
  id: string;
  priority: "high" | "medium" | "low";
  category: "authority_source" | "content_gap" | "competitor_threat" | "positioning";
  title: string;
  body: string;
  authority_sources: Array<{ domain: string; why?: string; example_url?: string }> | null;
  is_read: boolean;
  created_at: string;
};

const PRIO_STYLES: Record<string, string> = {
  high:   "bg-white border-l-danger",
  medium: "bg-white border-l-warning",
  low:    "bg-white border-l-ink/20",
};

const PRIO_LABEL_STYLES: Record<string, string> = {
  high:   "text-danger",
  medium: "text-warning",
  low:    "text-ink-subtle",
};

const CAT_LABELS: Record<string, string> = {
  authority_source: "Source autorité",
  content_gap: "Gap contenu",
  competitor_threat: "Concurrent",
  positioning: "Positionnement",
};

export function RecommendationList({ recos }: { recos: Reco[] }) {
  if (recos.length === 0) {
    return <p className="text-sm text-ink-muted italic">Aucune recommandation pour ce snapshot.</p>;
  }
  return (
    <div className="space-y-3">
      {recos.map(r => (
        <article
          key={r.id}
          className={`rounded-lg border border-DEFAULT border-l-2 p-5 shadow-card ${PRIO_STYLES[r.priority] || PRIO_STYLES.low}`}
        >
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-mono text-[10px] uppercase tracking-eyebrow ${PRIO_LABEL_STYLES[r.priority] || PRIO_LABEL_STYLES.low}`}>
                {r.priority}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-subtle">
                · {CAT_LABELS[r.category] || r.category}
              </span>
            </div>
            <span className="font-mono text-[10px] text-ink-subtle whitespace-nowrap">
              {new Date(r.created_at).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <h3 className="text-base font-medium text-ink mb-1 tracking-tightish">{r.title}</h3>
          <p className="text-sm text-ink-muted leading-relaxed">{r.body}</p>
          {r.authority_sources && r.authority_sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-DEFAULT">
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-subtle mb-1.5">
                Sources à cibler
              </p>
              <ul className="space-y-1">
                {r.authority_sources.map((s, i) => (
                  <li key={i} className="text-xs text-ink">
                    <span className="font-mono">{s.domain}</span>
                    {s.why && <span className="text-ink-muted"> — {s.why}</span>}
                    {s.example_url && (
                      <a href={s.example_url} target="_blank" rel="noopener" className="ml-2 text-brand-500 hover:underline">
                        ex.
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
