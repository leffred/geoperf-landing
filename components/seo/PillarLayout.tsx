// S29 — PillarLayout : layout squelette pour les 10 pages /guide/[slug].
// Server component async, accepte la locale + les sections content via props.
// Genere : breadcrumb, hero, sticky TOC, JSON-LD Article + FAQPage + BreadcrumbList,
// blocs CTA reutilisables, section "Pour aller plus loin".
//
// Pas de content : ce composant est un wrapper. Le content est passe via props
// (sections.tableOfContents, sections.body, sections.faq, sections.relatedLinks).

import type { ReactNode } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export type FaqEntry = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; kind?: "pillar" | "cluster" | "programmatic" | "blog" };

export type PillarLayoutProps = {
  locale: string;
  slug: string;
  title: string;
  intro: string;
  publishedAt: string; // ISO
  modifiedAt?: string; // ISO
  toc: { id: string; label: string }[];
  body: ReactNode;
  faq: FaqEntry[];
  relatedLinks: RelatedLink[];
  ctaPrimaryHref?: string;
  ctaPrimaryLabel?: string;
};

const SITE = "https://geoperf.com";

export function PillarLayout({
  locale,
  slug,
  title,
  intro,
  publishedAt,
  modifiedAt,
  toc,
  body,
  faq,
  relatedLinks,
  ctaPrimaryHref = "/etude-sectorielle",
  ctaPrimaryLabel,
}: PillarLayoutProps) {
  const url = locale === "fr" ? `${SITE}/guide/${slug}` : `${SITE}/${locale}/guide/${slug}`;
  const breadcrumb = [
    { name: "Home", url: locale === "fr" ? SITE : `${SITE}/${locale}` },
    { name: "Guide", url: locale === "fr" ? `${SITE}/guide` : `${SITE}/${locale}/guide` },
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
  };

  const faqLd = faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

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
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <Header />

      <Section py="lg" tone="white">
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
        <Eyebrow className="mb-3">Pillar guide</Eyebrow>
        <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-ink mb-4 leading-tight text-balance max-w-3xl">
          {title}
        </h1>
        <p className="text-base md:text-lg text-ink-muted leading-relaxed max-w-2xl">{intro}</p>
      </Section>

      <Section py="md" tone="surface">
        <div className="grid lg:grid-cols-[220px_1fr] gap-8 lg:gap-12">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-3">Sommaire</p>
            <ul className="space-y-2 text-sm">
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="text-ink-muted hover:text-ink transition">{t.label}</a>
                </li>
              ))}
            </ul>
          </aside>
          <article className="prose-pillar max-w-3xl">{body}</article>
        </div>
      </Section>

      {faq.length > 0 && (
        <Section py="md" tone="white">
          <Eyebrow className="mb-3">FAQ</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-ink mb-6 leading-tight">
            Questions fréquentes
          </h2>
          <div className="space-y-4 max-w-3xl">
            {faq.map((f, i) => (
              <article key={i} className="bg-white rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 p-5 shadow-card">
                <h3 className="text-lg font-medium text-ink mb-2 leading-tight">{f.question}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{f.answer}</p>
              </article>
            ))}
          </div>
        </Section>
      )}

      <Section py="lg" tone="dark">
        <div className="max-w-2xl">
          <Eyebrow variant="muted" className="mb-3 text-amber">Action</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-4 leading-tight">
            Lancer une étude sectorielle gratuite
          </h2>
          <Button href={ctaPrimaryHref} variant="primary" size="lg">
            {ctaPrimaryLabel ?? "Demander mon étude"}
          </Button>
        </div>
      </Section>

      {relatedLinks.length > 0 && (
        <Section py="md" tone="surface">
          <Eyebrow className="mb-3">Pour aller plus loin</Eyebrow>
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl">
            {relatedLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block bg-white border border-DEFAULT rounded-lg p-4 hover:shadow-card transition">
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-brand-500">{l.kind ?? "guide"}</span>
                  <span className="block text-sm text-ink mt-1">{l.label}</span>
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
