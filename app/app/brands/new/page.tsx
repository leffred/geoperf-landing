import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { loadSaasContext, TIER_LIMITS } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { createBrand } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Suivre une marque — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  missing_name: "Le nom de la marque est requis.",
  bad_domain: "Le domaine doit ressembler à \"axa.fr\" ou \"blackrock.com\".",
  missing_category: "La catégorie est requise.",
  limit_reached: "Tu as atteint la limite de marques pour ton plan. Upgrade pour en suivre plus.",
  cadence_locked: "La cadence hebdomadaire est réservée aux plans Solo et plus.",
  duplicate: "Tu suis déjà ce domaine.",
  unknown: "Une erreur est survenue. Réessaie.",
};

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewBrandPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const errorMsg = error ? ERROR_LABELS[error] || ERROR_LABELS.unknown : null;

  const ctx = await loadSaasContext();
  const sb = getServiceClient();
  const { data: cats } = await sb
    .from("categories")
    .select("slug, nom, parent_id")
    .not("parent_id", "is", null)
    .order("nom");
  const categories = (cats as { slug: string; nom: string }[] | null) ?? [];

  const limits = TIER_LIMITS[ctx.tier];
  const isFree = ctx.tier === "free";

  return (
    <Section py="md" tone="cream">
      <div className="max-w-xl mx-auto">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">Nouvelle marque</p>
        <h1 className="font-serif text-3xl text-navy mb-2">Suivre une marque</h1>
        <p className="text-sm text-ink-muted mb-6">
          Plan {ctx.tier.toUpperCase()} : {limits.brands} marque{limits.brands > 1 ? "s" : ""}, cadence {limits.cadence === "weekly" ? "hebdomadaire" : "mensuelle"}, {limits.llms} LLM{limits.llms > 1 ? "s" : ""}.
        </p>

        {errorMsg && (
          <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">{errorMsg}</div>
        )}

        <form action={createBrand} className="bg-white p-6 space-y-5">
          <div>
            <label htmlFor="name" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Nom de la marque</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="ex: AXA Investment Managers"
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none"
            />
            <p className="text-xs text-ink-muted mt-1">Le nom officiel utilisé pour la détection (ex: &quot;BNP Paribas&quot;, pas &quot;BNP&quot;).</p>
          </div>

          <div>
            <label htmlFor="domain" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Domaine principal</label>
            <input
              id="domain"
              name="domain"
              type="text"
              required
              placeholder="axa.fr"
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Catégorie / secteur</label>
            <input
              id="category"
              name="category"
              type="text"
              required
              list="known-categories"
              placeholder="asset management, banque privée, conseil..."
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none"
            />
            <datalist id="known-categories">
              {categories.map(c => (
                <option key={c.slug} value={c.nom}>{c.nom}</option>
              ))}
            </datalist>
            <p className="text-xs text-ink-muted mt-1">Utilisée dans les prompts adressés aux LLM pour cadrer le contexte.</p>
          </div>

          <div>
            <label htmlFor="competitors" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Concurrents (jusqu&apos;à 10 domaines)</label>
            <textarea
              id="competitors"
              name="competitors"
              rows={3}
              placeholder="amundi.fr, blackrock.com, bnpparibas-am.fr"
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none font-mono"
            />
            <p className="text-xs text-ink-muted mt-1">Séparés par des virgules ou des espaces. Les 2-3 premiers seront utilisés dans les prompts concurrentiels.</p>
          </div>

          <div>
            <label htmlFor="cadence" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Cadence des snapshots</label>
            <select
              id="cadence"
              name="cadence"
              defaultValue={limits.cadence}
              disabled={isFree}
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none disabled:opacity-60"
            >
              <option value="weekly" disabled={isFree}>Hebdomadaire (Solo+)</option>
              <option value="monthly">Mensuelle</option>
            </select>
            {isFree && <p className="text-xs text-ink-muted mt-1">Le plan Free est limité au mensuel. <Link href="/app/billing" className="underline">Upgrade vers Solo</Link> pour passer à hebdomadaire.</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-navy text-white py-2.5 text-sm font-medium hover:bg-navy-light transition">
              Créer + lancer le 1er snapshot
            </button>
            <Link href="/app/brands" className="px-4 py-2.5 text-sm text-ink-muted hover:text-navy">
              Annuler
            </Link>
          </div>
          <p className="text-xs text-ink-muted">
            Le 1er snapshot est lancé manuellement depuis la page de la marque. Les suivants suivent la cadence choisie automatiquement.
          </p>
        </form>
      </div>
    </Section>
  );
}
