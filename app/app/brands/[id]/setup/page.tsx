import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { BrandSetupForm } from "./BrandSetupForm";

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
          <BrandSetupForm
            brandId={id}
            brandName={(brand as any).name}
            initialDescription={(brand as any).brand_description ?? ""}
            initialKeywords={keywords}
            initialValueProps={valueProps}
          />
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
