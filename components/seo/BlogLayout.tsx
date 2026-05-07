// S29 — BlogLayout : layout pour les 20 pages /blog/[slug].
// Server component async. Genere : auteur, dateline, reading time, share buttons,
// articles similaires en bas, JSON-LD Article + BreadcrumbList.

import type { ReactNode } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/navigation";

export type BlogLayoutProps = {
  locale: string;
  slug: string;
  title: string;
  intro: string;
  publishedAt: string;
  modifiedAt?: string;
  author?: { name: string; role?: string };
  readingTimeMin?: number;
  body: ReactNode;
  similarPosts?: { href: string; label: string; publishedAt?: string }[];
};

const SITE = "https://geoperf.com";

const DEFAULT_AUTHOR = { name: "Frédéric Lefebvre", role: "Fondateur Geoperf" };

function formatDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function BlogLayout({
  locale,
  slug,
  title,
  intro,
  publishedAt,
  modifiedAt,
  author = DEFAULT_AUTHOR,
  readingTimeMin,
  body,
  similarPosts = [],
}: BlogLayoutProps) {
  const url = locale === "fr" ? `${SITE}/blog/${slug}` : `${SITE}/${locale}/blog/${slug}`;
  const breadcrumb = [
    { name: "Home", url: locale === "fr" ? SITE : `${SITE}/${locale}` },
    { name: "Blog", url: locale === "fr" ? `${SITE}/blog` : `${SITE}/${locale}/blog` },
    { name: title, url },
  ];

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: intro,
    datePublished: publishedAt,
    dateModified: modifiedAt ?? publishedAt,
    author: { "@type": "Person", name: author.name },
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
        <Eyebrow className="mb-3">Blog</Eyebrow>
        <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-ink mb-4 leading-tight text-balance max-w-3xl">
          {title}
        </h1>
        <p className="text-base md:text-lg text-ink-muted leading-relaxed max-w-2xl mb-6">{intro}</p>
        <div className="flex items-center gap-4 text-xs font-mono text-ink-subtle">
          <span>{author.name}{author.role && ` · ${author.role}`}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={publishedAt}>{formatDate(publishedAt, locale)}</time>
          {readingTimeMin && (
            <>
              <span aria-hidden="true">·</span>
              <span>{readingTimeMin} min</span>
            </>
          )}
        </div>
      </Section>

      <Section py="md" tone="white">
        <article className="prose-blog max-w-3xl">{body}</article>
      </Section>

      <Section py="md" tone="surface">
        <div className="max-w-3xl flex items-center gap-3 text-xs font-mono text-ink-muted">
          <span className="uppercase tracking-eyebrow">Partager</span>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            LinkedIn
          </a>
          <span aria-hidden="true">·</span>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            X
          </a>
          <span aria-hidden="true">·</span>
          <a
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
            className="hover:text-ink"
          >
            Email
          </a>
        </div>
      </Section>

      {similarPosts.length > 0 && (
        <Section py="md" tone="white">
          <Eyebrow className="mb-3">Articles similaires</Eyebrow>
          <ul className="grid md:grid-cols-3 gap-3 max-w-5xl">
            {similarPosts.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="block bg-white border border-DEFAULT rounded-lg p-4 hover:shadow-card transition">
                  <span className="block text-sm text-ink leading-snug">{p.label}</span>
                  {p.publishedAt && (
                    <time dateTime={p.publishedAt} className="block mt-2 font-mono text-[10px] uppercase tracking-eyebrow text-ink-subtle">
                      {formatDate(p.publishedAt, locale)}
                    </time>
                  )}
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
