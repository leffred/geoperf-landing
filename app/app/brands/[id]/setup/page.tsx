import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { updateBrandSetup } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Brand Setup — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  forbidden: "Action réservée au propriétaire ou admin du compte.",
  update_failed: "Impossible de sauvegarder. Réessaie ou contacte le support.",
  not_found: "Marque introuvable.",
};

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1.5";
const FIELD_INPUT = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> };

export default async function BrandSetupPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { saved, error } = await searchParams;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: brand } = await sb
    .from("saas_tracked_brands")
    .select("id, user_id, name, domain, brand_description, brand_keywords, brand_value_props")
    .eq("id", id).maybeSingle();
  if (!brand || (brand as any).user_id !== ctx.account_owner_id) notFound();

  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;
  const keywords = ((brand as any).brand_keywords ?? []) as string[];
  const valueProps = ((brand as any).brand_value_props ?? []) as string[];
  const alignmentReady = ((brand as any).brand_description?.length ?? 0) > 0 || keywords.length > 0 || valueProps.length > 0;

  return (
    <Section py="md" tone="white">
      <div className="max-w-2xl">
        <Eyebrow className="mb-2">
          <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link>
          <span className="opacity-50"> / </span>
          <span>Brand Setup</span>
        </Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3 leading-tight">
          Configuration de la marque
        </h1>
        <p className="text-sm text-ink-muted mb-8 leading-relaxed">
          Décris ta marque pour activer le score d&apos;<strong className="text-ink">alignement</strong> entre ce que tu dis et ce que les LLM disent. Sans setup, l&apos;analyse Brand Alignment ne tourne pas.
        </p>

        {saved === "1" && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
            Setup mis à jour. L&apos;analyse alignment sera recalculée au prochain snapshot.
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
            {errorMsg}
          </div>
        )}
        {!alignmentReady && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-warning bg-white px-4 py-3 text-xs text-ink-muted">
            Aucune description ni keyword pour l&apos;instant. <strong className="text-ink">Brand Alignment</strong> est skippé tant que cette page est vide.
          </div>
        )}

        <Card variant="default">
          <form action={updateBrandSetup} className="space-y-5">
            <input type="hidden" name="brand_id" value={id} />

            <div>
              <label htmlFor="brand_description" className={FIELD_LABEL}>Description de la marque</label>
              <textarea
                id="brand_description"
                name="brand_description"
                rows={4}
                defaultValue={(brand as any).brand_description ?? ""}
                maxLength={1000}
                placeholder="Ex: Asset manager européen spécialisé ESG, focus institutionnels et grandes entreprises. Engagement actionnariat actif depuis 2010."
                className={FIELD_INPUT}
              />
              <p className="text-xs text-ink-subtle mt-1.5">2-4 phrases. Comment tu décris ta marque à un nouveau prospect.</p>
            </div>

            <div>
              <label htmlFor="brand_keywords" className={FIELD_LABEL}>Keywords ciblés (max 20)</label>
              <textarea
                id="brand_keywords"
                name="brand_keywords"
                rows={3}
                defaultValue={keywords.join(", ")}
                placeholder="ESG, institutionnels, durabilité, France, performance long-terme"
                className={`${FIELD_INPUT} font-mono`}
              />
              <p className="text-xs text-ink-subtle mt-1.5">Séparés par virgules ou retours ligne. Le score alignment compte combien apparaissent dans les réponses LLM.</p>
            </div>

            <div>
              <label htmlFor="brand_value_props" className={FIELD_LABEL}>Propositions de valeur (max 10)</label>
              <textarea
                id="brand_value_props"
                name="brand_value_props"
                rows={4}
                defaultValue={valueProps.join("\n")}
                placeholder={"Performance long-terme à travers les cycles\nEngagement actionnaires actif\nReporting transparent à fréquence trimestrielle"}
                className={FIELD_INPUT}
              />
              <p className="text-xs text-ink-subtle mt-1.5">1 par ligne. Ce que tu veux que les LLM disent de toi.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" size="md" className="flex-1">Sauvegarder</Button>
              <Link href={`/app/brands/${id}`} className="px-4 py-2.5 text-sm text-ink-muted hover:text-ink transition-colors">
                Retour à la marque
              </Link>
            </div>
          </form>
        </Card>

        <p className="mt-6 text-xs text-ink-muted">
          Voir le score :{" "}
          <Link href={`/app/brands/${id}/alignment`} className="text-brand-500 hover:underline">
            /app/brands/{id.slice(0, 8)}…/alignment
          </Link>
        </p>
      </div>
    </Section>
  );
}
