"use client";

// Client component injecté dans le form /app/brands/new pour suggérer 5 prompts via Haiku.
// Lit les inputs name, domain, category, competitors du parent form, les envoie à
// /api/saas/suggest-prompts, affiche les 5 résultats avec checkboxes (default cochés).
// Les prompts cochés sont sérialisés en JSON dans un input caché `suggested_prompts_json`
// que le server action createBrand picke pour merger dans saas_topics.prompts.

import { useState } from "react";

type Suggestion = { category: "direct_search" | "competitive" | "use_case"; template: string };

const CATEGORY_LABEL: Record<Suggestion["category"], string> = {
  direct_search: "Recherche directe",
  competitive: "Comparatif",
  use_case: "Cas d'usage",
};

export function PromptSuggestionPicker() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [checked, setChecked] = useState<boolean[]>([]);

  const checkedSuggestions = suggestions.filter((_, i) => checked[i]);

  async function handleSuggest() {
    setError(null);
    const form = document.querySelector("form") as HTMLFormElement | null;
    if (!form) return;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const domain = String(fd.get("domain") ?? "").trim();
    const category = String(fd.get("category") ?? "").trim();
    const competitors = String(fd.get("competitors") ?? "").split(/[\s,]+/).filter(c => c.includes(".")).slice(0, 5);

    if (!name || !category) {
      setError("Renseigne d'abord nom + catégorie ci-dessus.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch("/api/saas/suggest-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, domain, category, competitors }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        if (resp.status === 429) {
          setError("Trop de demandes — réessaie dans 60 secondes.");
        } else {
          setError(data?.error ?? "Erreur lors de la génération.");
        }
        setLoading(false);
        return;
      }
      const list = (data.prompts ?? []) as Suggestion[];
      setSuggestions(list);
      setChecked(list.map(() => true));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-t border-DEFAULT pt-5 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-1">Prompts personnalisés (optionnel)</p>
          <p className="text-xs text-ink-muted">Haiku peut suggérer 5 prompts en plus du jeu par défaut, selon ta catégorie et tes concurrents.</p>
        </div>
        <button
          type="button"
          onClick={handleSuggest}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium border border-ink/[0.16] rounded-md hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Génération…" : suggestions.length > 0 ? "Régénérer" : "Suggérer 5 prompts"}
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-DEFAULT border-l-2 border-l-danger bg-white px-3 py-2 text-xs text-danger">{error}</div>
      )}

      {suggestions.length > 0 && (
        <ul className="space-y-2">
          {suggestions.map((s, idx) => (
            <li key={idx} className="flex items-start gap-3 bg-surface rounded-md p-3">
              <input
                type="checkbox"
                checked={checked[idx] ?? true}
                onChange={e => {
                  const next = [...checked];
                  next[idx] = e.target.checked;
                  setChecked(next);
                }}
                className="mt-1 w-4 h-4 accent-brand-500 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-eyebrow text-brand-500 mb-0.5">{CATEGORY_LABEL[s.category]}</div>
                <div className="text-sm text-ink leading-snug font-mono">{s.template}</div>
              </div>
            </li>
          ))}
          <li className="text-[11px] text-ink-subtle italic">
            Les prompts cochés ({checkedSuggestions.length}) seront ajoutés au topic par défaut, en plus des 30 standards.
          </li>
        </ul>
      )}

      <input
        type="hidden"
        name="suggested_prompts_json"
        value={JSON.stringify(checkedSuggestions)}
      />
    </div>
  );
}
