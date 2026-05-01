import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
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
    <Section py="md" tone="cream">
      <div className="max-w-2xl">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
          <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link> / Brand Setup
        </p>
        <h1 className="font-serif text-3xl text-navy mb-2">Configuration de la marque</h1>
        <p className="text-sm text-ink-muted mb-6">
          Décris ta marque pour activer le score d&apos;<strong>alignement</strong> entre ce que tu dis et ce que les LLM disent. Sans setup, l&apos;analyse Brand Alignment ne tourne pas.
        </p>

        {saved === "1" && <div className="mb-4 px-4 py-3 bg-amber/20 border-l-2 border-amber text-sm text-navy">Setup mis à jour. L&apos;analyse alignment sera recalculée au prochain snapshot.</div>}
        {errorMsg && <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">{errorMsg}</div>}

        {!alignmentReady && (
          <div className="mb-4 px-4 py-3 bg-cream border-l-2 border-navy/20 text-xs text-ink-muted">
            Aucune description ni keyword pour l&apos;instant. <strong>Brand Alignment</strong> est skippé tant que cette page est vide.
          </div>
        )}

        <form action={updateBrandSetup} className="bg-white p-6 space-y-5">
          <input type="hidden" name="brand_id" value={id} />

          <div>
            <label htmlFor="brand_description" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Description de la marque</label>
            <textarea
              id="brand_description"
              name="brand_description"
              rows={4}
              defaultValue={(brand as any).brand_description ?? ""}
              maxLength={1000}
              placeholder="Ex: Asset manager européen spécialisé ESG, focus institutionnels et grandes entreprises. Engagement actionnariat actif depuis 2010."
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none"
            />
            <p className="text-xs text-ink-muted mt-1">2-4 phrases. Comment tu décris ta marque à un nouveau prospect.</p>
          </div>

          <div>
            <label htmlFor="brand_keywords" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Keywords ciblés (max 20)</label>
            <textarea
              id="brand_keywords"
              name="brand_keywords"
              rows={3}
              defaultValue={keywords.join(", ")}
              placeholder="ESG, institutionnels, durabilité, France, performance long-terme"
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none font-mono"
            />
            <p className="text-xs text-ink-muted mt-1">Séparés par virgules ou retours ligne. Le score alignment compte combien apparaissent dans les réponses LLM.</p>
          </div>

          <div>
            <label htmlFor="brand_value_props" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Propositions de valeur (max 10)</label>
            <textarea
              id="brand_value_props"
              name="brand_value_props"
              rows={4}
              defaultValue={valueProps.join("\n")}
              placeholder={"Performance long-terme à travers les cycles\nEngagement actionnaires actif\nReporting transparent à fréquence trimestrielle"}
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none"
            />
            <p className="text-xs text-ink-muted mt-1">1 par ligne. Ce que tu veux que les LLM disent de toi.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-navy text-white py-2.5 text-sm font-medium hover:bg-navy-light transition">
              Sauvegarder
            </button>
            <Link href={`/app/brands/${id}`} className="px-4 py-2.5 text-sm text-ink-muted hover:text-navy">Retour à la marque</Link>
          </div>
        </form>

        <div className="mt-6 text-xs text-ink-muted">
          <p>Voir le score : <Link href={`/app/brands/${id}/alignment`} className="underline hover:text-navy">/app/brands/{id.slice(0, 8)}…/alignment</Link></p>
        </div>
      </div>
    </Section>
  );
}
