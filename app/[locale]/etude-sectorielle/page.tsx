// S19 §4.1.a — Page lead-magnet /etude-sectorielle.
// Server component : preload categories + map availabilité reports → passe au client.
// S28 — i18n complet (hero + cards + StudyForm).

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getServiceClient } from "@/lib/supabase";
import { StudyForm, type ParentCat, type SousCat, type StudyFormI18n } from "./StudyForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com";
  return {
    title: t("etudeSectorielleTitle"),
    description: t("etudeSectorielleDescription"),
    alternates: {
      canonical: locale === "fr" ? `${siteUrl}/etude-sectorielle` : `${siteUrl}/${locale}/etude-sectorielle`,
      languages: {
        fr: `${siteUrl}/etude-sectorielle`,
        en: `${siteUrl}/en/etude-sectorielle`,
        "x-default": `${siteUrl}/etude-sectorielle`,
      },
    },
  };
}

// Force dynamique : la liste de reports change quand on lance Phase 1
export const dynamic = "force-dynamic";

async function loadCatalog(locale: string): Promise<{ parents: ParentCat[]; sousCats: SousCat[] }> {
  const sb = getServiceClient();

  // Parents (catégories racine)
  const { data: rawCats } = await sb
    .from("categories")
    .select("id, slug, nom, nom_en, parent_id, ordre, is_active")
    .order("ordre", { ascending: true });

  const cats = (rawCats ?? []) as Array<{
    id: string;
    slug: string;
    nom: string;
    nom_en: string | null;
    parent_id: string | null;
    ordre: number;
    is_active: boolean;
  }>;

  // S28a : `nom` = FR, `nom_en` = EN. Fallback FR si nom_en NULL.
  const pickName = (c: { nom: string; nom_en: string | null }) =>
    locale === "en" && c.nom_en ? c.nom_en : c.nom;

  const parents: ParentCat[] = cats
    .filter((c) => c.parent_id === null && c.is_active !== false)
    .map((c) => ({ id: c.id, slug: c.slug, nom: pickName(c) }));

  // Map availabilité : tous les slug_public de reports status=ready avec pdf_url
  const { data: ready } = await sb
    .from("reports")
    .select("slug_public")
    .eq("status", "ready")
    .not("pdf_url", "is", null);
  const readySlugs = new Set((ready ?? []).map((r) => (r.slug_public ?? "").toLowerCase()));

  const sousCats: SousCat[] = cats
    .filter((c) => c.parent_id !== null && c.is_active !== false)
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      nom: pickName(c),
      parent_id: c.parent_id as string,
      has_report: readySlugs.has(c.slug.toLowerCase()),
    }));

  return { parents, sousCats };
}

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; sous_cat?: string }>;
};

export default async function EtudeSectoriellePage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const { parents, sousCats } = await loadCatalog(locale);

  const t = await getTranslations("etudeSectorielle");
  const tForm = await getTranslations("etudeSectorielle.form");

  // Pack i18n strings consumed by client component (StudyForm)
  const formI18n: StudyFormI18n = {
    categoryLabel: tForm("categoryLabel"),
    categoryPlaceholder: tForm("categoryPlaceholder"),
    subCategoryLabel: tForm("subCategoryLabel"),
    subCategoryPlaceholder: tForm("subCategoryPlaceholder"),
    subCategoryPlaceholderDisabled: tForm("subCategoryPlaceholderDisabled"),
    reportAvailable: tForm("subCategoryReportAvailable"),
    comingSoon: tForm("subCategoryComingSoon"),
    noteAvailable: tForm("noteAvailable"),
    noteComingSoon: tForm("noteComingSoon"),
    emailLabel: tForm("emailLabel"),
    emailPlaceholder: tForm("emailPlaceholder"),
    submit: tForm("submit"),
    submitting: tForm("submitting"),
    rgpdNote: tForm("rgpdNote"),
    rgpdLink: tForm("rgpdLink"),
    errorEmailInvalid: tForm("errorEmailInvalid"),
    errorMissingSousCat: tForm("errorMissingSousCat"),
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header logo="etudes" />

      <Section py="lg" tone="white">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-16 items-start max-w-5xl">
          {/* Pitch */}
          <div>
            <Eyebrow className="mb-3">{t("heroEyebrow")}</Eyebrow>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink mb-5 leading-tight text-balance">
              {t("heroTitle")}
            </h1>
            <p className="text-base text-ink-muted leading-relaxed mb-6 max-w-xl">
              {t("heroSubtitle")}
            </p>
            <ul className="space-y-2 text-sm text-ink-muted">
              {[t("bullet1"), t("bullet2"), t("bullet3"), t("bullet4")].map((b) => (
                <li key={b} className="flex items-baseline gap-2">
                  <span className="text-amber">·</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="bg-surface border border-DEFAULT rounded-lg p-6 md:p-8 shadow-card">
            <StudyForm
              parents={parents}
              sousCats={sousCats}
              initialError={sp.error}
              initialSousCat={sp.sous_cat}
              i18n={formI18n}
            />
          </div>
        </div>
      </Section>

      {/* Reassurance */}
      <Section py="md" tone="surface">
        <Eyebrow className="mb-3">{t("howEyebrow")}</Eyebrow>
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-ink mb-8 max-w-2xl leading-tight">
          {t("howTitle")}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: t("case1Title"), body: t("case1Body") },
            { title: t("case2Title"), body: t("case2Body") },
            { title: t("case3Title"), body: t("case3Body") },
          ].map((c) => (
            <div key={c.title} className="bg-white border border-DEFAULT rounded-lg p-5 border-l-2 border-l-brand-500">
              <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-2">
                {c.title}
              </p>
              <p className="text-sm text-ink-muted leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Footer />
    </main>
  );
}
