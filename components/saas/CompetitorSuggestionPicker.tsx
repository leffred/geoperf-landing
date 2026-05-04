"use client";

// Client component injecté dans /app/brands/new + /app/onboarding pour suggérer
// 5 concurrents directs via Haiku (#1.6 BUGS_AND_FEEDBACK, S17 §4.6).
//
// Pattern identique à PromptSuggestionPicker (S15 + refonte S16.1).
// Particularité : les concurrents cochés sont injectés directement dans le textarea
// "competitors" du form parent (au lieu d'un input hidden séparé).

import { useState } from "react";

type Suggestion = { name: string; domain: string };

export function CompetitorSuggestionPicker() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [injected, setInjected] = useState(false);

  const checkedSuggestions = suggestions.filter((_, i) => checked[i]);

  async function handleSuggest() {
    setError(null);
    setInjected(false);
    const form = document.querySelector("form") as HTMLFormElement | null;
    if (!form) return;
    const fd = new FormData(form);
    const brand_name = String(fd.get("name") ?? "").trim();
    const domain = String(fd.get("domain") ?? "").trim();
    const category = String(fd.get("category") ?? "").trim();

    if (!brand_name || !category) {
      setError("Renseigne d'abord le nom de la marque et la catégorie ci-dessus.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch("/api/saas/suggest-competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_name, domain, category }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        if (resp.status === 429) {
          setError("Trop de demandes — réessaie dans 60 secondes.");
        } else if (resp.status === 401) {
          setError("Tu n'es plus connecté. Recharge la page.");
        } else {
          const detail = data?.error ?? "Erreur lors de la génération.";
          setError(`${detail}${data?.hint ? ` — ${data.hint}` : ""}`);
        }
        setLoading(false);
        return;
      }
      const list = (data.suggestions ?? []) as Suggestion[];
      if (list.length === 0) {
        setError("Aucun concurrent généré. Précise la catégorie ou réessaie.");
      } else {
        setSuggestions(list);
        setChecked(list.map(() => true));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  function handleInject() {
    if (checkedSuggestions.length === 0) return;
    const form = document.querySelector("form") as HTMLFormElement | null;
    if (!form) return;
    const competitorsField = form.querySelector('textarea[name="competitors"], input[name="competitors"]') as
      HTMLTextAreaElement | HTMLInputElement | null;
    if (!competitorsField) return;

    const existing = competitorsField.value.trim();
    const existingDomains = new Set(
      existing.split(/[\s,]+/).map(d => d.trim().toLowerCase()).filter(Boolean)
    );
    const newDomains = checkedSuggestions
      .map(s => s.domain)
      .filter(d => !existingDomains.has(d.toLowerCase()));

    competitorsField.value = existing
      ? `${existing}, ${newDomains.join(", ")}`
      : newDomains.join(", ");
    // Trigger React onChange si controlled
    competitorsField.dispatchEvent(new Event("input", { bubbles: true }));
    setInjected(true);
  }

  return (
    <div className="bg-surface rounded-lg p-5 border border-ink/[0.08] space-y-3">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-1">Concurrents auto-suggérés (recommandé)</p>
          <h3 className="text-base font-medium text-ink tracking-tight">5 concurrents directs identifiés par Haiku</h3>
          <p className="text-xs text-ink-muted mt-1 leading-snug">
            Pas sûr de qui sont vos concurrents directs ? Haiku propose 5 marques de votre catégorie. Cochez celles à suivre, puis injectez-les dans le champ ci-dessous.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSuggest}
          disabled={loading}
          className="shrink-0 px-4 py-2 text-sm font-medium bg-ink text-white rounded-md hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Recherche…" : suggestions.length > 0 ? "Régénérer" : "Suggérer 5 concurrents"}
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-DEFAULT border-l-2 border-l-danger bg-white px-3 py-2 text-xs text-danger">{error}</div>
      )}

      {suggestions.length > 0 && (
        <>
          <ul className="space-y-2">
            {suggestions.map((s, idx) => (
              <li key={idx} className="flex items-center gap-3 bg-white rounded-md p-3 border border-ink/[0.06]">
                <input
                  type="checkbox"
                  checked={checked[idx] ?? true}
                  onChange={e => {
                    const next = [...checked];
                    next[idx] = e.target.checked;
                    setChecked(next);
                    setInjected(false);
                  }}
                  className="w-4 h-4 accent-brand-500 shrink-0"
                />
                <div className="min-w-0 flex-1 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3">
                  <span className="text-sm text-ink truncate">{s.name}</span>
                  <span className="text-xs font-mono text-ink-muted truncate">{s.domain}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              onClick={handleInject}
              disabled={checkedSuggestions.length === 0}
              className="text-xs px-3 py-1.5 rounded-md bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Injecter {checkedSuggestions.length} concurrent{checkedSuggestions.length !== 1 ? "s" : ""} dans le champ ↓
            </button>
            {injected && (
              <span className="text-xs font-mono text-success">
                ✓ {checkedSuggestions.length} domaine{checkedSuggestions.length !== 1 ? "s" : ""} injecté{checkedSuggestions.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
