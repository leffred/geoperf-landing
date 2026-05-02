// Onboarding wizard — page d'accueil pour les nouveaux users qui n'ont pas encore de marque.
// Visuellement structurée en 3 étapes (Identité → Concurrents → Lancement) mais soumise en un seul form.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { loadSaasContext, tierLimits } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { createBrand } from "../brands/new/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Bienvenue — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  missing_name: "Le nom de la marque est requis.",
  bad_domain: "Le domaine doit ressembler à \"axa.fr\" ou \"blackrock.com\".",
  missing_category: "La catégorie est requise.",
  limit_reached: "Tu as atteint la limite de marques pour ton plan.",
  cadence_locked: "La cadence hebdomadaire est réservée aux plans Solo et plus.",
  duplicate: "Tu suis déjà ce domaine.",
  unknown: "Une erreur est survenue. Réessaie.",
};

const FIELD_LABEL = "block text-sm font-medium text-ink mb-2";
const FIELD_INPUT = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";

type Props = { searchParams: Promise<{ error?: string; skip?: string }> };

export default async function OnboardingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const ctx = await loadSaasContext();

  // Si user a déjà une marque, redirect vers dashboard (l'onboarding est terminé)
  const sb = getServiceClient();
  const { count } = await sb
    .from("saas_tracked_brands")
    .select("id", { head: true, count: "exact" })
    .eq("user_id", ctx.user.id);
  if ((count ?? 0) > 0 && sp.skip !== "1") {
    redirect("/app/dashboard");
  }

  const { data: cats } = await sb
    .from("categories")
    .select("slug, nom, parent_id")
    .not("parent_id", "is", null)
    .order("nom");
  const categories = (cats as { slug: string; nom: string }[] | null) ?? [];

  const limits = tierLimits(ctx.tier);
  const isFree = ctx.tier === "free";
  const errorMsg = sp.error ? ERROR_LABELS[sp.error] || ERROR_LABELS.unknown : null;
  const firstName = ctx.profile?.full_name?.split(" ")[0] || ctx.user.email?.split("@")[0];

  return (
    <Section py="md" tone="white">
      <div className="max-w-2xl mx-auto">
        <Eyebrow className="mb-3">Onboarding · 3 étapes</Eyebrow>
        <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-ink mb-3 leading-tight">
          Bienvenue {firstName} 👋
        </h1>
        <p className="text-base text-ink-muted mb-10 leading-relaxed">
          Configure ta première marque en 60 secondes. Geoperf lancera automatiquement un 1er snapshot après création — tu verras tes premiers résultats LLM dans 30 secondes.
        </p>

        {/* Stepper visuel */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-DEFAULT">
          {[
            { n: "01", label: "Identité de la marque" },
            { n: "02", label: "Concurrents" },
            { n: "03", label: "Cadence + lancement" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-eyebrow text-brand-500">{s.n}</span>
              <span className="text-xs text-ink hidden sm:inline">{s.label}</span>
              {i < 2 && <span className="text-ink-subtle ml-2 hidden sm:inline">·</span>}
            </div>
          ))}
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
            {errorMsg}
          </div>
        )}

        <form action={createBrand} className="space-y-8">
          {/* Step 1 */}
          <Card variant="default">
            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-mono text-xs uppercase tracking-eyebrow text-brand-500">Step 01</span>
              <h2 className="text-lg font-medium text-ink tracking-tightish">Identité de ta marque</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className={FIELD_LABEL}>Nom officiel <span className="text-danger">*</span></label>
                <input id="name" name="name" type="text" required placeholder="ex: AXA Investment Managers" className={FIELD_INPUT} autoFocus />
                <p className="text-xs text-ink-subtle mt-1.5">
                  Le nom utilisé pour la détection. Préfère le nom officiel exact (BNP Paribas, pas BNP).
                </p>
              </div>
              <div>
                <label htmlFor="domain" className={FIELD_LABEL}>Domaine principal <span className="text-danger">*</span></label>
                <input id="domain" name="domain" type="text" required placeholder="axa.fr" className={`${FIELD_INPUT} font-mono`} />
              </div>
              <div>
                <label htmlFor="category" className={FIELD_LABEL}>Catégorie / secteur <span className="text-danger">*</span></label>
                <input
                  id="category" name="category" type="text" required
                  list="known-categories"
                  placeholder="asset management, banque privée, conseil..."
                  className={FIELD_INPUT}
                />
                <datalist id="known-categories">
                  {categories.map(c => (
                    <option key={c.slug} value={c.nom}>{c.nom}</option>
                  ))}
                </datalist>
                <p className="text-xs text-ink-subtle mt-1.5">
                  Utilisée pour cadrer les prompts adressés aux LLM.
                </p>
              </div>
            </div>
          </Card>

          {/* Step 2 */}
          <Card variant="default">
            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-mono text-xs uppercase tracking-eyebrow text-brand-500">Step 02</span>
              <h2 className="text-lg font-medium text-ink tracking-tightish">2-3 concurrents principaux</h2>
            </div>
            <div>
              <label htmlFor="competitors" className={FIELD_LABEL}>Domaines concurrents (jusqu&apos;à 10)</label>
              <textarea
                id="competitors" name="competitors" rows={3}
                placeholder="amundi.fr, blackrock.com, bnpparibas-am.fr"
                className={`${FIELD_INPUT} font-mono`}
              />
              <p className="text-xs text-ink-subtle mt-1.5">
                Séparés par des virgules ou retours-ligne. Les 2-3 premiers seront utilisés dans les prompts concurrentiels (« Quels sont les meilleurs X face à Y, Z et W ? »).
              </p>
            </div>
          </Card>

          {/* Step 3 */}
          <Card variant="default">
            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-mono text-xs uppercase tracking-eyebrow text-brand-500">Step 03</span>
              <h2 className="text-lg font-medium text-ink tracking-tightish">Cadence + lancement</h2>
            </div>
            <div>
              <label htmlFor="cadence" className={FIELD_LABEL}>Cadence des snapshots</label>
              <select
                id="cadence" name="cadence"
                defaultValue={limits.cadence}
                disabled={isFree}
                className={`${FIELD_INPUT} disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <option value="weekly" disabled={isFree}>Hebdomadaire (Starter+)</option>
                <option value="monthly">Mensuelle</option>
              </select>
              {isFree && (
                <p className="text-xs text-ink-subtle mt-1.5">
                  Le plan Free est limité au mensuel.{" "}
                  <Link href="/app/billing" className="text-brand-500 hover:underline">Upgrade vers Starter</Link>{" "}
                  pour passer à hebdomadaire (4 LLMs aussi).
                </p>
              )}
            </div>
            <p className="text-sm text-ink-muted mt-5 leading-relaxed">
              <strong className="text-ink">Le 1er snapshot tournera dès la création de la marque.</strong> Tu verras tes scores (rang, citation, share-of-voice) dans 30 secondes. Les recommandations Haiku arrivent ~10s après.
            </p>
          </Card>

          <div className="flex flex-wrap gap-3 items-center pt-2">
            <Button type="submit" variant="primary" size="lg" className="flex-1 sm:flex-none">
              Créer ma marque + lancer le 1er snapshot
            </Button>
            <Link href="/app/dashboard" className="text-sm text-ink-muted hover:text-ink underline transition-colors">
              Sauter pour l&apos;instant
            </Link>
          </div>
        </form>

        <p className="mt-8 text-xs text-ink-subtle">
          Plan {ctx.tier.toUpperCase()} : {limits.brands} marque{limits.brands > 1 ? "s" : ""} max, {limits.llms} LLM{limits.llms > 1 ? "s" : ""}, cadence {limits.cadence === "weekly" ? "hebdo" : "mensuelle"}.
          {isFree && (
            <>{" "}<Link href="/app/billing" className="text-brand-500 hover:underline">Voir tous les plans</Link>.</>
          )}
        </p>
      </div>
    </Section>
  );
}
