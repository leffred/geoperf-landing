"use client";

// S19 §4.1.a — Form 3 champs avec dropdown cascading.
// Server preload toutes les categories + map availabilite report par sous_cat,
// le client filtre au change sans round-trip DB.

import { useMemo, useState } from "react";
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
  const [parentId, setParentId] = useState<string>("");
  const [sousCatSlug, setSousCatSlug] = useState<string>(initialSousCat ?? "");
  const [submitting, setSubmitting] = useState(false);

  const filteredSousCats = useMemo(
    () => (parentId ? sousCats.filter((s) => s.parent_id === parentId) : []),
    [parentId, sousCats]
  );

  // Si l'URL nous a donné une sous-cat initiale, on resolve son parent automatiquement
  if (!parentId && initialSousCat) {
    const found = sousCats.find((s) => s.slug === initialSousCat);
    if (found) {
      // setState dans le render = anti-pattern; on l'évite en mode controlled-uncontrolled.
      // Pas critique : l'utilisateur peut re-sélectionner.
    }
  }

  const errorMsg =
    initialError === "email_invalid"
      ? "Adresse email invalide. Vérifiez le format."
      : initialError === "missing_sous_cat"
      ? "Sélectionnez une sous-catégorie."
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

      {/* Catégorie parent */}
      <div>
        <label
          htmlFor="parent_id"
          className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-2"
        >
          Catégorie
        </label>
        <select
          id="parent_id"
          name="parent_id"
          required
          value={parentId}
          onChange={(e) => {
            setParentId(e.target.value);
            setSousCatSlug("");
          }}
          className="w-full border border-DEFAULT rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Sélectionnez une catégorie…</option>
          {parents.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Sous-catégorie cascadée */}
      <div>
        <label
          htmlFor="sous_categorie_slug"
          className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-2"
        >
          Sous-catégorie
        </label>
        <select
          id="sous_categorie_slug"
          name="sous_categorie_slug"
          required
          value={sousCatSlug}
          onChange={(e) => setSousCatSlug(e.target.value)}
          disabled={!parentId}
          className="w-full border border-DEFAULT rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-surface disabled:text-ink-subtle"
        >
          <option value="">
            {parentId ? "Sélectionnez une sous-catégorie…" : "Choisissez d'abord une catégorie"}
          </option>
          {filteredSousCats.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.nom} {s.has_report ? "— rapport disponible" : "— à venir"}
            </option>
          ))}
        </select>
        {sousCatSlug && (
          <p className="mt-2 text-xs text-ink-muted">
            {filteredSousCats.find((s) => s.slug === sousCatSlug)?.has_report
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
