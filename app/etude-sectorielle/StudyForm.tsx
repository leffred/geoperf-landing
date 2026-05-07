"use client";

// S27 — Form lead-magnet avec Combobox autocomplete (sous-cat parmi 147 industries Apollo).
// Plus de cascading dropdown parent → sous-cat : un seul Combobox qui filtre tout,
// avec les industries groupees par macro-categorie (parent) dans la liste deroulante.

import { useMemo, useState } from "react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { requestStudy } from "./actions";

export type ParentCat = { id: string; slug: string; nom: string };
export type SousCat = {
  id: string;
  slug: string;
  nom: string;
  parent_id: string;
  has_report: boolean;
};

export function StudyForm({
  parents,
  sousCats,
  initialError,
  initialSousCat,
}: {
  parents: ParentCat[];
  sousCats: SousCat[];
  initialError?: string;
  initialSousCat?: string;
}) {
  const [sousCatSlug, setSousCatSlug] = useState<string>(initialSousCat ?? "");
  const [submitting, setSubmitting] = useState(false);

  // Construction des options Combobox : label = nom de la sous-cat, group = nom du parent
  const parentMap = useMemo(() => {
    const m = new Map<string, string>();
    parents.forEach(p => m.set(p.id, p.nom));
    return m;
  }, [parents]);

  const options = useMemo<ComboboxOption[]>(() => {
    return sousCats.map(s => ({
      value: s.slug,
      label: s.has_report ? s.nom : `${s.nom} (à venir)`,
      group: parentMap.get(s.parent_id) ?? "Autre",
    }));
  }, [sousCats, parentMap]);

  const selectedSousCat = useMemo(
    () => sousCats.find(s => s.slug === sousCatSlug),
    [sousCatSlug, sousCats]
  );

  const errorMsg =
    initialError === "email_invalid"
      ? "Adresse email invalide. Vérifiez le format."
      : initialError === "missing_sous_cat"
      ? "Sélectionnez un secteur."
      : null;

  return (
    <form
      action={requestStudy}
      onSubmit={() => setSubmitting(true)}
      className="space-y-5"
    >
      <input type="hidden" name="source_path" value="/etude-sectorielle" />

      {errorMsg && (
        <div
          role="alert"
          className="border border-red-300 bg-red-50 text-red-800 text-sm p-3 rounded-md"
        >
          {errorMsg}
        </div>
      )}

      {/* Combobox autocomplete sur 147 industries */}
      <div>
        <label
          htmlFor="sous_categorie_slug"
          className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-2"
        >
          Secteur d&apos;activité
        </label>
        <Combobox
          name="sous_categorie_slug"
          options={options}
          placeholder="Tapez votre secteur (ex: software, banking, marketing...)"
          defaultValue={initialSousCat}
          required
          onChange={setSousCatSlug}
        />
        {selectedSousCat && (
          <p className="mt-2 text-xs text-ink-muted">
            {selectedSousCat.has_report
              ? "Vous recevrez le PDF par email immédiatement."
              : "Cette étude n'est pas encore publiée. Nous lancerons sa génération à votre demande (24-48h)."}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-2"
        >
          Email professionnel
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          placeholder="vous@entreprise.com"
          className="w-full border border-DEFAULT rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-ink text-white px-6 py-3 text-sm font-medium hover:bg-ink/90 transition rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Envoi en cours…" : "Recevoir le rapport"}
      </button>

      <p className="text-xs text-ink-muted leading-relaxed pt-2">
        Vos données sont stockées sur Supabase Frankfurt (UE). Aucun envoi commercial sans
        votre consentement explicite. Limite anti-abus : 1 rapport différent / 30 jours par
        adresse. Voir notre{" "}
        <a href="/privacy" className="text-brand-500 hover:underline">
          politique de confidentialité
        </a>
        .
      </p>
    </form>
  );
}
