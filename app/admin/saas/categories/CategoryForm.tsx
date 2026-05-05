"use client";

import { useState } from "react";
import { createCategory } from "./actions";

type ParentOption = { id: string; nom: string; slug: string };

function slugify(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function CategoryForm({ parents }: { parents: ParentOption[] }) {
  const [nom, setNom] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  function onNomChange(v: string) {
    setNom(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  return (
    <form action={createCategory} className="space-y-4 bg-surface p-5 rounded-lg border border-DEFAULT">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-1.5">
            Nom (affiché)
          </label>
          <input
            type="text"
            name="nom"
            required
            value={nom}
            onChange={(e) => onNomChange(e.target.value)}
            className="w-full border border-DEFAULT rounded-md px-3 py-2 text-sm bg-white"
            placeholder="Ex : Cybersécurité"
          />
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-1.5">
            Slug (auto-suggéré)
          </label>
          <input
            type="text"
            name="slug"
            required
            value={slug}
            onChange={(e) => { setSlug(e.target.value.toLowerCase()); setSlugTouched(true); }}
            pattern="[a-z0-9][a-z0-9-]{1,80}"
            className="w-full border border-DEFAULT rounded-md px-3 py-2 text-sm font-mono bg-white"
            placeholder="cybersecurite"
          />
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-1.5">
            Catégorie parente
          </label>
          <select
            name="parent_id"
            defaultValue=""
            className="w-full border border-DEFAULT rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">Aucune (catégorie racine)</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>{p.nom} ({p.slug})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-1.5">
            Ordre (défaut 100)
          </label>
          <input
            type="number"
            name="ordre"
            defaultValue={100}
            min={0}
            max={999}
            className="w-full border border-DEFAULT rounded-md px-3 py-2 text-sm bg-white"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-ink text-white px-5 py-2.5 text-sm font-medium rounded-md hover:bg-ink/90"
      >
        Créer la catégorie
      </button>
    </form>
  );
}
