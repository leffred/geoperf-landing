"use client";

// S27 — Form lead-magnet avec Combobox autocomplete (sous-cat parmi 147 industries Apollo).
// S28 — i18n via prop `i18n` (server component pack les strings, evite useTranslations cote client).

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

export type StudyFormI18n = {
  categoryLabel: string;
  categoryPlaceholder: string;
  subCategoryLabel: string;
  subCategoryPlaceholder: string;
  subCategoryPlaceholderDisabled: string;
  reportAvailable: string;
  comingSoon: string;
  noteAvailable: string;
  noteComingSoon: string;
  emailLabel: string;
  emailPlaceholder: string;
  submit: string;
  submitting: string;
  rgpdNote: string;
  rgpdLink: string;
  errorEmailInvalid: string;
  errorMissingSousCat: string;
};

export function StudyForm({
  parents,
  sousCats,
  initialError,
  initialSousCat,
  i18n,
}: {
  parents: ParentCat[];
  sousCats: SousCat[];
  initialError?: string;
  initialSousCat?: string;
  i18n: StudyFormI18n;
}) {
  const [sousCatSlug, setSousCatSlug] = useState<string>(initialSousCat ?? "");
  const [submitting, setSubmitting] = useState(false);

  // Construction des options Combobox : label = nom de la sous-cat, group = nom du parent
  const parentMap = useMemo(() => {
    const m = new Map<string, string>();
    parents.forEach((p) => m.set(p.id, p.nom));
    return m;
  }, [parents]);

  const options = useMemo<ComboboxOption[]>(() => {
    return sousCats.map((s) => ({
      value: s.slug,
      label: s.has_report ? s.nom : `${s.nom} (${i18n.comingSoon})`,
      group: parentMap.get(s.parent_id) ?? "—",
    }));
  }, [sousCats, parentMap, i18n.comingSoon]);

  const selectedSousCat = useMemo(
    () => sousCats.find((s) => s.slug === sousCatSlug),
    [sousCatSlug, sousCats]
  );

  const errorMsg =
    initialError === "email_invalid"
      ? i18n.errorEmailInvalid
      : initialError === "missing_sous_cat"
      ? i18n.errorMissingSousCat
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

      <div>
        <label
          htmlFor="sous_categorie_slug"
          className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-2"
        >
          {i18n.subCategoryLabel}
        </label>
        <Combobox
          name="sous_categorie_slug"
          options={options}
          placeholder={i18n.subCategoryPlaceholder}
          defaultValue={initialSousCat}
          required
          onChange={setSousCatSlug}
        />
        {selectedSousCat && (
          <p className="mt-2 text-xs text-ink-muted">
            {selectedSousCat.has_report ? i18n.noteAvailable : i18n.noteComingSoon}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-2"
        >
          {i18n.emailLabel}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          placeholder={i18n.emailPlaceholder}
          className="w-full border border-DEFAULT rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-ink text-white px-6 py-3 text-sm font-medium hover:bg-ink/90 transition rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? i18n.submitting : i18n.submit}
      </button>

      <p className="text-xs text-ink-muted leading-relaxed pt-2">
        {i18n.rgpdNote}{" "}
        <a href="/privacy" className="text-brand-500 hover:underline">
          {i18n.rgpdLink}
        </a>
        .
      </p>
    </form>
  );
}
