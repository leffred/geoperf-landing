// S29 — ClusterLayout : layout léger pour les 50 pages /insights/[slug].
// Server component async. Genere : breadcrumb, hero compact, lien retour vers
// pillar parent, CTA bottom, JSON-LD Article + BreadcrumbList.

import type { ReactNode } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export type ClusterLayoutProps = {
  locale: string;
  slug: string;
  title: string;
  intro: string;
  publishedAt: string;
  modifiedAt?: string;
  parentPillar: { slug: string; label: string };
  body: ReactNode;
  cousinClusters?: { href: string; label: string }[];
  ctaPrimaryHref?: string;
  ctaPrimaryLabel?: string;
};

const SITE = "https://geoperf.com";

export function ClusterLayout({
  locale,
  slug,
  title,
  intro,
  publishedAt,
  modifiedAt,
  parentPillar,
  body,
  cousinClusters = [],
  ctaPrimaryHref = "/etude-sectorielle",
  ctaPrimaryLabel,
}: ClusterLayoutProps) {
  const url = locale === "fr" ? `${SITE}/insights/${slug}` : `${SITE}/${locale}/insights/${slug}`;
  const pillarUrl = `/guide/${parentPillar.slug}`;

  const breadcrumb = [
    { name: "Home", url: locale === "fr" ? SITE : `${SITE}/${locale}` },
    { name: "Insights", url: locale === "fr" ? `${SITE}/insights` : `${SITE}/${locale}/insights` },
    { name: title, url },
  ];

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
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
    isPartOf: { "@type": "Article", "@id": `${SITE}${pillarUrl}` },
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

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <Header />

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
        <Eyebrow className="mb-3">Insight</Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3 leading-tight text-balance max-w-3xl">
          {title}
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">{intro}</p>
      </Section>

      <Section py="md" tone="white">
        <article className="prose-cluster max-w-3xl">{body}</article>
      </Section>

      <Section py="md" tone="surface">
        <Link
          href={pillarUrl}
          className="inline-flex items-center gap-2 text-sm text-brand-500 hover:underline font-medium"
        >
          ← {parentPillar.label}
        </Link>
      </Section>

      <Section py="md" tone="white">
        <Eyebrow className="mb-3">Action</Eyebrow>
        <h2 className="text-xl md:text-2xl font-medium tracking-tight text-ink mb-4 leading-tight max-w-2xl">
          Demander un audit de visibilité gratuit
        </h2>
        <Button href={ctaPrimaryHref} variant="primary" size="md">
          {ctaPrimaryLabel ?? "Recevoir mon audit"}
        </Button>
      </Section>

      {cousinClusters.length > 0 && (
        <Section py="md" tone="surface">
          <Eyebrow className="mb-3">Insights connexes</Eyebrow>
          <ul className="grid md:grid-cols-2 gap-3 max-w-4xl">
            {cousinClusters.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="block bg-white border border-DEFAULT rounded-lg p-4 hover:shadow-card transition text-sm text-ink">
                  {c.label}
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
