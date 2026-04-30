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
  high:   "bg-red-50 text-red-900 border-red-600",
  medium: "bg-amber/15 text-navy border-amber",
  low:    "bg-cream text-ink border-navy/15",
};

const CAT_LABELS: Record<string, string> = {
  authority_source: "Source autorité",
  content_gap: "Gap contenu",
  competitor_threat: "Concurrent",
  positioning: "Positionnement",
};

export function RecommendationList({ recos }: { recos: Reco[] }) {
  if (recos.length === 0) {
    return (
      <p className="text-sm text-ink-muted italic">Aucune recommandation pour ce snapshot.</p>
    );
  }
  return (
    <div className="space-y-3">
      {recos.map(r => (
        <article key={r.id} className={`border-l-2 p-4 ${PRIO_STYLES[r.priority] || PRIO_STYLES.low}`}>
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">{r.priority}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">· {CAT_LABELS[r.category] || r.category}</span>
            </div>
            <span className="font-mono text-[10px] opacity-60 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
          </div>
          <h3 className="font-serif text-base font-medium mb-1">{r.title}</h3>
          <p className="text-sm leading-relaxed">{r.body}</p>
          {r.authority_sources && r.authority_sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-current/10">
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-70 mb-1">Sources à cibler</p>
              <ul className="space-y-1">
                {r.authority_sources.map((s, i) => (
                  <li key={i} className="text-xs">
                    <span className="font-mono">{s.domain}</span>
                    {s.why && <span className="opacity-70"> — {s.why}</span>}
                    {s.example_url && (
                      <a href={s.example_url} target="_blank" rel="noopener" className="ml-2 underline opacity-80">
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
