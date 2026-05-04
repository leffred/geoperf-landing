import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PromptSuggestionPicker } from "@/components/saas/PromptSuggestionPicker";
import { CompetitorSuggestionPicker } from "@/components/saas/CompetitorSuggestionPicker";
import { loadSaasContext, tierLimits } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { createBrand } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Suivre une marque — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  missing_name: "Le nom de la marque est requis.",
  bad_domain: "Le domaine doit ressembler à \"axa.fr\" ou \"blackrock.com\".",
  missing_category: "La catégorie est requise.",
  limit_reached: "Tu as atteint la limite de marques pour ton plan. Upgrade pour en suivre plus.",
  cadence_locked: "La cadence hebdomadaire est réservée aux plans Starter et plus.",
  duplicate: "Tu suis déjà ce domaine.",
  unknown: "Une erreur est survenue. Réessaie.",
};

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1.5";
const FIELD_INPUT = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";

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

  const limits = tierLimits(ctx.tier);
  const isFree = ctx.tier === "free";

  return (
    <Section py="md" tone="white">
      <div className="max-w-xl mx-auto">
        <Eyebrow className="mb-3">+ Nouvelle marque</Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3 leading-tight">
          Suivre une marque
        </h1>
        <p className="text-sm text-ink-muted mb-8 leading-relaxed">
          Plan {ctx.tier.toUpperCase()} : {limits.brands} marque{limits.brands > 1 ? "s" : ""}, cadence {limits.cadence === "weekly" ? "hebdomadaire" : "mensuelle"}, {limits.llms} LLM{limits.llms > 1 ? "s" : ""}.
        </p>

        {errorMsg && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
            {errorMsg}
          </div>
        )}

        <Card variant="default">
          <form action={createBrand} className="space-y-5">
            <div>
              <label htmlFor="name" className={FIELD_LABEL}>Nom de la marque</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="ex: AXA Investment Managers"
                className={FIELD_INPUT}
              />
              <p className="text-xs text-ink-subtle mt-1.5">Le nom officiel utilisé pour la détection (ex: &quot;BNP Paribas&quot;, pas &quot;BNP&quot;).</p>
            </div>

            <div>
              <label htmlFor="domain" className={FIELD_LABEL}>Domaine principal</label>
              <input
                id="domain"
                name="domain"
                type="text"
                required
                placeholder="axa.fr"
                className={FIELD_INPUT}
              />
            </div>

            <div>
              <label htmlFor="category" className={FIELD_LABEL}>Catégorie / secteur</label>
              <input
                id="category"
                name="category"
                type="text"
                required
                list="known-categories"
                placeholder="asset management, banque privée, conseil..."
                className={FIELD_INPUT}
              />
              <datalist id="known-categories">
                {categories.map(c => (
                  <option key={c.slug} value={c.nom}>{c.nom}</option>
                ))}
              </datalist>
              <p className="text-xs text-ink-subtle mt-1.5">Utilisée dans les prompts adressés aux LLM pour cadrer le contexte.</p>
            </div>

            <CompetitorSuggestionPicker />

            <div>
              <label htmlFor="competitors" className={FIELD_LABEL}>Concurrents (jusqu&apos;à 10 domaines)</label>
              <textarea
                id="competitors"
                name="competitors"
                rows={3}
                placeholder="amundi.fr, blackrock.com, bnpparibas-am.fr"
                className={`${FIELD_INPUT} font-mono`}
              />
              <p className="text-xs text-ink-subtle mt-1.5">Séparés par des virgules ou des espaces. Les 2-3 premiers seront utilisés dans les prompts concurrentiels.</p>
            </div>

            <div>
              <label htmlFor="cadence" className={FIELD_LABEL}>Cadence des snapshots</label>
              {/* S16.1 fix #1.2 : on ne disable plus le <select> entier (sinon HTML
                  n'envoie pas la valeur dans le FormData côté Free). On disable
                  juste l'option "weekly" qui reste non-sélectionnable. */}
              <select
                id="cadence"
                name="cadence"
                defaultValue={limits.cadence}
                className={FIELD_INPUT}
              >
                <option value="weekly" disabled={isFree}>Hebdomadaire {isFree ? "(Starter+)" : ""}</option>
                <option value="monthly">Mensuelle</option>
              </select>
              {isFree && (
                <p className="text-xs text-ink-subtle mt-1.5">
                  Le plan Free est limité au mensuel.{" "}
                  <Link href="/app/billing" className="text-brand-500 hover:underline">Upgrade vers Starter</Link>{" "}
                  pour passer à hebdomadaire.
                </p>
              )}
            </div>

            <PromptSuggestionPicker />

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" size="md" className="flex-1">
                Créer + lancer le 1er snapshot
              </Button>
              <Link href="/app/brands" className="px-4 py-2.5 text-sm text-ink-muted hover:text-ink transition-colors">
                Annuler
              </Link>
            </div>
            <p className="text-xs text-ink-subtle">
              Le 1er snapshot est lancé manuellement depuis la page de la marque. Les suivants suivent la cadence choisie automatiquement.
            </p>
          </form>
        </Card>
      </div>
    </Section>
  );
}
