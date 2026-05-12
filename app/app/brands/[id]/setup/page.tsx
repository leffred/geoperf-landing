import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { loadSaasContext, tierLimits } from "@/lib/saas-auth";
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
    .select("id, user_id, name, domain, category_slug, competitor_domains, cadence, brand_description, brand_keywords, brand_value_props")
    .eq("id", id)
    .maybeSingle();
  if (!brand || (brand as any).user_id !== ctx.account_owner_id) notFound();

  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;
  const keywords = ((brand as any).brand_keywords ?? []) as string[];
  const valueProps = ((brand as any).brand_value_props ?? []) as string[];
  const competitors = ((brand as any).competitor_domains ?? []) as string[];
  const limits = tierLimits(ctx.tier);
  const isFree = ctx.tier === "free";

  return (
    <Section py="md" tone="white">
      <div className="max-w-2xl">
        <Eyebrow className="mb-2">
          <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link>
          <span className="opacity-50"> / </span>
          <span>Setup</span>
        </Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3 leading-tight">
          Configuration de la marque
        </h1>
        <p className="text-sm text-ink-muted mb-8 leading-relaxed">
          Modifie les concurrents, la catégorie, la cadence et les paramètres d&apos;alignement de <strong className="text-ink">{(brand as any).name}</strong>.
        </p>

        {saved === "1" && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
            Paramètres mis à jour. L&apos;alignement sera recalculé au prochain snapshot.
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
            {errorMsg}
          </div>
        )}

        <Card variant="default">
          <BrandSetupForm
            brandId={id}
            brandName={(brand as any).name}
            initialCategory={(brand as any).category_slug ?? ""}
            initialCompetitors={competitors}
            initialCadence={(brand as any).cadence ?? limits.cadence}
            isFree={isFree}
            initialDescription={(brand as any).brand_description ?? ""}
            initialKeywords={keywords}
            initialValueProps={valueProps}
          />
        </Card>

        <p className="mt-6 text-xs text-ink-muted">
          Score alignment :{" "}
          <Link href={`/app/brands/${id}/alignment`} className="text-brand-500 hover:underline">
            voir le rapport
          </Link>
        </p>
      </div>
    </Section>
  );
}
