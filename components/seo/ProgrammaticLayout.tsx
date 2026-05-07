// S29 — ProgrammaticLayout : layout pour les 130 pages /secteur/[slug].
// Server component async avec data fetcher Supabase. Genere : breadcrumb, hero,
// top brands (si data dispo), CTA, JSON-LD Article + BreadcrumbList + Dataset.
//
// Anti-thin-content guard : si pas de data leaderboard pour ce secteur, on ajoute
// `noindex` via meta + section methodology longue. La logique de fallback est
// portee par la page parent (/secteur/[slug]/page.tsx) qui calcule `hasData`.

import type { ReactNode } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export type SectorBrandRow = {
  rank: number;
  name: string;
  domain?: string | null;
  visibilityScore?: number | null;
};

export type ProgrammaticLayoutProps = {
  locale: string;
  slug: string;
  sectorName: string;
  intro: string;
  publishedAt: string;
  modifiedAt?: string;
  topBrands: SectorBrandRow[]; // empty array if no data
  hasData: boolean;
  body: ReactNode;
  relatedSectors?: { href: string; label: string }[];
  relatedPillars?: { href: string; label: string }[];
  ctaPrimaryHref?: string;
};

const SITE = "https://geoperf.com";

export function ProgrammaticLayout({
  locale,
  slug,
  sectorName,
  intro,
  publishedAt,
  modifiedAt,
  topBrands,
  hasData,
  body,
  relatedSectors = [],
  relatedPillars = [],
  ctaPrimaryHref = "/etude-sectorielle",
}: ProgrammaticLayoutProps) {
  const url = locale === "fr" ? `${SITE}/secteur/${slug}` : `${SITE}/${locale}/secteur/${slug}`;
  const breadcrumb = [
    { name: "Home", url: locale === "fr" ? SITE : `${SITE}/${locale}` },
    { name: "Secteur", url: locale === "fr" ? `${SITE}/secteur` : `${SITE}/${locale}/secteur` },
    { name: sectorName, url },
  ];

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Visibilité LLM dans le secteur ${sectorName}`,
    description: intro,
    datePublished: publishedAt,
    dateModified: modifiedAt ?? publishedAt,
    author: { "@type": "Organization", name: "Geoperf" },
    publisher: {
      "@type": "Organization",
      name: "Geoperf",
      logo: { "@type": "ImageObject", url: `${SITE}/logos/logo_master.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: locale,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };

  // Dataset schema pour le leaderboard (si data dispo)
  const datasetLd = hasData && topBrands.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: `Top ${topBrands.length} ${sectorName} dans les LLM`,
        description: `Classement des marques ${sectorName} selon ChatGPT, Claude, Gemini et Perplexity.`,
        creator: { "@type": "Organization", name: "Geoperf" },
        datePublished: publishedAt,
        license: "https://geoperf.com/terms",
        url,
      }
    : null;

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {datasetLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />
      )}

      <Header logo="etudes" />

      <Section py="md" tone="white">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs font-mono text-ink-muted">
          {breadcrumb.map((b, i) => (
            <span key={b.url}>
              {i > 0 && <span className="mx-1.5 text-ink-subtle">/</span>}
              {i === breadcrumb.length - 1 ? (
                <span className="text-ink">{b.name}</span>
              ) : (
                <Link href={b.url.replace(SITE, "").replace(`/${locale}`, "") || "/"} className="hover:underline">{b.name}</Link>
              )}
            </span>
          ))}
        </nav>
        <Eyebrow className="mb-3">Secteur</Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3 leading-tight text-balance max-w-3xl">
          Visibilité LLM dans le secteur {sectorName}
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">{intro}</p>
      </Section>

      {hasData && topBrands.length > 0 && (
        <Section py="md" tone="surface">
          <Eyebrow className="mb-3">Top {topBrands.length} marques</Eyebrow>
          <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto max-w-4xl">
            <table className="w-full text-sm">
              <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
                <tr>
                  <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">Rang</th>
                  <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">Marque</th>
                  <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">Domaine</th>
                  <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">Score</th>
                </tr>
              </thead>
              <tbody>
                {topBrands.map((b) => (
                  <tr key={b.rank} className="border-b border-DEFAULT last:border-b-0 hover:bg-surface transition">
                    <td className="py-3 px-4 font-mono text-brand-500 font-medium">{String(b.rank).padStart(2, "0")}</td>
                    <td className="py-3 px-4 text-ink font-medium">{b.name}</td>
                    <td className="py-3 px-4 font-mono text-xs text-ink-muted">{b.domain ?? "—"}</td>
                    <td className="py-3 px-4 text-right font-mono text-ink">{b.visibilityScore ?? "—"}/4</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      <Section py="md" tone="white">
        <article className="prose-programmatic max-w-3xl">{body}</article>
      </Section>

      <Section py="md" tone="dark">
        <div className="max-w-2xl">
          <Eyebrow variant="muted" className="mb-3 text-amber">Action</Eyebrow>
          <h2 className="text-xl md:text-2xl font-medium tracking-tight text-white mb-4 leading-tight">
            Demandez votre étude sectorielle gratuite
          </h2>
          <Button href={ctaPrimaryHref} variant="primary" size="lg">
            Recevoir l&apos;étude {sectorName}
          </Button>
        </div>
      </Section>

      {(relatedSectors.length > 0 || relatedPillars.length > 0) && (
        <Section py="md" tone="surface">
          <Eyebrow className="mb-3">Voir aussi</Eyebrow>
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl">
            {relatedPillars.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="block bg-white border border-DEFAULT rounded-lg p-4 hover:shadow-card transition">
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-brand-500">Pillar</span>
                  <span className="block text-sm text-ink mt-1">{p.label}</span>
                </Link>
              </li>
            ))}
            {relatedSectors.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="block bg-white border border-DEFAULT rounded-lg p-4 hover:shadow-card transition">
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-brand-500">Secteur</span>
                  <span className="block text-sm text-ink mt-1">{s.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Footer />
    </main>
  );
}
