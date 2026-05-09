// S29 Session 4 — page template /secteur/[slug] : 130+ pages programmatic FR
// rendues via SectorEntry data + ProgrammaticLayout.
//
// dynamic = "force-static" + dynamicParams = true. generateStaticParams pre-build
// les ~130 slugs connus. Les slugs inconnus passent en notFound() (404 propre).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ProgrammaticLayout, type SectorBrandRow } from "@/components/seo/ProgrammaticLayout";
import { getSector, listSectorSlugs, relatedSectorsFor, relatedPillarsFor } from "@/lib/seo/sectors";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

const SITE = "https://geoperf.com";
const PUBLISHED_AT = "2026-05-08T08:00:00.000Z";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const entry = getSector(slug);
  if (!entry) {
    return {
      title: "Secteur introuvable — Geoperf",
      robots: { index: false, follow: true },
    };
  }
  const url = locale === "en" ? `${SITE}/en/secteur/${slug}` : `${SITE}/secteur/${slug}`;
  const title = `Visibilité LLM dans le secteur ${entry.nom} — Geoperf`;
  const description = `Comment ChatGPT, Gemini, Claude et Perplexity perçoivent les marques ${entry.nom} en France. Top marques, méthodologie, tendances 2026 et conseils GEO sectoriels.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        fr: `${SITE}/secteur/${slug}`,
        "x-default": `${SITE}/secteur/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "Geoperf",
      images: [
        { url: `${SITE}/api/og?title=${encodeURIComponent(`Visibilité LLM ${entry.nom}`)}`, width: 1200, height: 630 },
      ],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  // FR-only en Session 4. EN reportée S30+.
  return listSectorSlugs().map((slug) => ({ locale: "fr", slug }));
}

/**
 * Pull la data leaderboard depuis Supabase si un report ready existe pour ce secteur.
 * Sinon retourne un array vide, le template affichera le fallback.
 */
async function loadTopBrands(slug: string): Promise<{ topBrands: SectorBrandRow[]; hasData: boolean }> {
  try {
    const sb = getServiceClient();
    // Trouver la category_id depuis le slug
    const { data: cat } = await sb
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!cat) return { topBrands: [], hasData: false };

    // Récupérer le dernier report ready pour cette catégorie
    const { data: report } = await sb
      .from("reports")
      .select("id")
      .eq("category_id", (cat as { id: string }).id)
      .eq("status", "ready")
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!report) return { topBrands: [], hasData: false };

    // Récupérer le top 10 du leaderboard pour ce report
    const { data: rows } = await sb
      .from("report_companies")
      .select("rank, companies!inner(name, domain), visibility_score")
      .eq("report_id", (report as { id: string }).id)
      .order("rank", { ascending: true })
      .limit(10);

    type Row = {
      rank: number;
      visibility_score: number | null;
      companies: { name: string; domain: string | null } | null;
    };

    const topBrands: SectorBrandRow[] = ((rows as unknown as Row[]) ?? []).map((r) => ({
      rank: r.rank,
      name: r.companies?.name ?? "—",
      domain: r.companies?.domain ?? null,
      visibilityScore: r.visibility_score,
    }));
    return { topBrands, hasData: topBrands.length > 0 };
  } catch {
    return { topBrands: [], hasData: false };
  }
}

export default async function SectorPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const entry = getSector(slug);
  if (!entry) notFound();

  const { topBrands, hasData } = await loadTopBrands(slug);
  const relatedSectors = relatedSectorsFor(slug, 5).map((s) => ({
    href: `/secteur/${s.slug}`,
    label: s.nom,
  }));
  const relatedPillars = relatedPillarsFor(slug, "fr");

  const intro = `Comment ChatGPT, Gemini, Claude et Perplexity perçoivent les marques ${entry.nom.toLowerCase()} en France. Cette page synthétise notre méthodologie Geoperf, les tendances clés observées en 2026 et nos conseils sectoriels pour optimiser votre visibilité dans les LLM.`;

  // Décision noindex si pas de data report ET pas d'insights spécifiques (faillible content guard)
  const hasUniqueContent = entry.insights.length >= 2 && entry.conseils.length >= 3;
  const shouldNoindex = !hasData && !hasUniqueContent;

  // Générer le body avec contenu unique au secteur
  const body = (
    <>
      <h2>Top 10 marques {entry.nom} selon les LLM</h2>
      {hasData ? (
        <p>Les données ci-dessus présentent le top 10 du leaderboard {entry.nom} mesuré par Geoperf sur les 4 LLM majeurs (ChatGPT, Gemini, Claude, Perplexity). Le visibility score sur 4 reflète la présence cumulée de chaque marque dans les réponses LLM testées sur 30 prompts représentatifs du secteur. <a href={`/leaderboard/${slug}`} className="underline text-brand-500">Voir le leaderboard complet et les sources d&apos;autorité associées →</a></p>
      ) : (
        <>
          <p>L&apos;étude sectorielle {entry.nom} est en cours de préparation. Les marques de référence FR à surveiller actuellement&nbsp;: {entry.topBrandsFR.slice(0, 5).join(", ")}.</p>
          <p>Pour obtenir le leaderboard complet de votre secteur en avant-première, demandez votre étude sectorielle gratuite&nbsp;: vous recevrez un PDF brandé Geoperf avec le top 30 marques, le détail des prompts, le sentiment et les sources d&apos;autorité utilisées par les 4 LLM.</p>
        </>
      )}

      <h2>Méthodologie Geoperf</h2>
      <p>Geoperf instrumentent la visibilité de votre secteur sur les 4 LLM majeurs grâce à un panel de 30 prompts représentatifs du parcours d&apos;achat&nbsp;: 40 % de prompts de découverte («&nbsp;meilleur acteur X&nbsp;»), 25 % comparatifs, 20 % techniques, 15 % marque-explicites. Chaque snapshot est ré-exécuté chaque semaine, sur ChatGPT (GPT-4o), Gemini (2.5 Pro et Flash), Claude (Sonnet 4.6) et Perplexity (Sonar Pro). Sur l&apos;année, ce sont 26 snapshots qui alimentent le leaderboard.</p>
      <p>Les KPI mesurés sont&nbsp;: citation rate (% de prompts où votre marque apparaît), average source rank (position de votre URL parmi les sources citées), share-of-voice (votre poids dans les réponses face aux concurrents), sentiment (positif/neutre/négatif des contextes), et source attribution (quelles sources tierces vous attribuent).</p>

      <h2>Tendances clés observées en 2026 dans le secteur {entry.nom}</h2>
      {entry.insights.map((insight, i) => (
        <p key={i}>{insight}</p>
      ))}

      <h2>Comment optimiser votre visibilité dans le secteur {entry.nom}</h2>
      <ul className="list-disc pl-5 space-y-2">
        {entry.conseils.map((conseil, i) => (
          <li key={i}>{conseil}</li>
        ))}
      </ul>
      <p>Pour aller plus loin, consultez nos guides associés sur la <a href="/guide/llm-brand-monitoring" className="underline text-brand-500">monitoring de marque dans les LLM</a> et la <a href="/guide/llm-citation-strategy" className="underline text-brand-500">stratégie de citation LLM</a>, qui détaillent les méthodologies applicables à votre secteur.</p>

      {shouldNoindex && (
        <p className="text-sm text-ink-muted italic mt-8">
          Note&nbsp;: cette page est en cours de complétion. Les données détaillées du secteur {entry.nom} seront ajoutées dès la publication de notre prochaine étude sectorielle.
        </p>
      )}
    </>
  );

  return (
    <>
      {/* Anti-thin-content guard : noindex si content faible + pas de data leaderboard */}
      {shouldNoindex && (
        <meta name="robots" content="noindex, follow" />
      )}
      <ProgrammaticLayout
        locale={locale === "en" ? "en" : "fr"}
        slug={slug}
        sectorName={entry.nom}
        intro={intro}
        publishedAt={PUBLISHED_AT}
        topBrands={topBrands}
        hasData={hasData}
        body={body}
        relatedSectors={relatedSectors}
        relatedPillars={relatedPillars}
        ctaPrimaryHref={`/etude-sectorielle?secteur=${encodeURIComponent(slug)}`}
      />
    </>
  );
}
