"use client";

// Client component injecté dans le form /app/brands/new + /app/onboarding pour
// suggérer 5 prompts personnalisés via Haiku, en plus des 30 prompts standards.
//
// Lit les inputs name, domain, category, competitors du parent form, les envoie
// à /api/saas/suggest-prompts, affiche les 5 résultats avec checkboxes (cochés
// par défaut). Au submit du form parent, les prompts cochés sont sérialisés en
// JSON dans un input caché `suggested_prompts_json` que le server action
// createBrand picke pour merger dans saas_topics.prompts.
//
// S16.1 fix #1.1 : refonte UX visibility — card dédiée au lieu de border-t
// discret, bouton primary, feedback succès/erreur clair.

import { useRef, useState } from "react";

type Suggestion = { category: "direct_search" | "competitive" | "use_case"; template: string };

const CATEGORY_LABEL: Record<Suggestion["category"], string> = {
  direct_search: "Recherche directe",
  competitive: "Comparatif",
  use_case: "Cas d'usage",
};

export function PromptSuggestionPicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [checked, setChecked] = useState<boolean[]>([]);

  const checkedSuggestions = suggestions.filter((_, i) => checked[i]);

  async function handleSuggest() {
    setError(null);
    const form = containerRef.current?.closest("form") as HTMLFormElement | null;
    if (!form) return;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const domain = String(fd.get("domain") ?? "").trim();
    const category = String(fd.get("category") ?? "").trim();
    const competitors = String(fd.get("competitors") ?? "").split(/[\s,]+/).filter(c => c.includes(".")).slice(0, 5);

    if (!name || !category) {
      setError("Renseigne d'abord le nom de la marque et la catégorie ci-dessus.");
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
        } else if (resp.status === 401) {
          setError("Tu n'es plus connecté. Recharge la page.");
        } else {
          // Affiche l'erreur Edge Function (ex: OPENROUTER_API_KEY missing)
          // pour faciliter le diagnostic côté admin / Fred.
          const detail = data?.error ?? "Erreur lors de la génération.";
          setError(`${detail}${data?.hint ? ` — ${data.hint}` : ""}`);
        }
        setLoading(false);
        return;
      }
      const list = (data.prompts ?? []) as Suggestion[];
      if (list.length === 0) {
        setError("Aucun prompt généré. Essaie d'enrichir la catégorie ou les concurrents puis régénère.");
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

  return (
    <div ref={containerRef} className="bg-surface rounded-lg p-5 border border-ink/[0.08] space-y-3">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-1">Prompts personnalisés (recommandé)</p>
          <h3 className="text-base font-medium text-ink tracking-tight">Booste les 30 prompts standards avec 5 prompts custom Haiku</h3>
          <p className="text-xs text-ink-muted mt-1 leading-snug">
            Haiku génère 5 prompts spécifiques à ta catégorie et à tes concurrents. Cliquer pour les voir, décocher ceux qui ne te plaisent pas avant de créer la marque.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSuggest}
          disabled={loading}
          className="shrink-0 px-4 py-2 text-sm font-medium bg-ink text-white rounded-md hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Génération…" : suggestions.length > 0 ? "Régénérer" : "Suggérer 5 prompts"}
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-DEFAULT border-l-2 border-l-danger bg-white px-3 py-2 text-xs text-danger">{error}</div>
      )}

      {suggestions.length > 0 && (
        <>
          <ul className="space-y-2">
            {suggestions.map((s, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-white rounded-md p-3 border border-ink/[0.06]">
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
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-mono uppercase tracking-eyebrow text-brand-500 mb-0.5">{CATEGORY_LABEL[s.category]}</div>
                  <div className="text-sm text-ink leading-snug font-mono">{s.template}</div>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs font-mono text-success">
            ✓ {checkedSuggestions.length} prompt{checkedSuggestions.length !== 1 ? "s" : ""} personnalisé{checkedSuggestions.length !== 1 ? "s" : ""} {checkedSuggestions.length !== 1 ? "seront ajoutés" : "sera ajouté"} au topic par défaut, en plus des 30 standards.
          </p>
        </>
      )}

      <input
        type="hidden"
        name="suggested_prompts_json"
        value={JSON.stringify(checkedSuggestions)}
      />
    </div>
  );
}
