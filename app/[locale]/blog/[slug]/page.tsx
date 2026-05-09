// S29 Session 5 — page /blog/[slug] : 20 articles FR via BlogLayout + registry.
// dynamic = "force-static" + dynamicParams = true. generateStaticParams pre-build
// les 20 slugs. Slugs inconnus → notFound() (404 propre).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BlogLayout } from "@/components/seo/BlogLayout";
import { getArticle, listArticleSlugs, getSimilarArticles } from "@/lib/seo/blog";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

const SITE = "https://geoperf.com";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (!article) {
    return {
      title: "Article introuvable — Geoperf",
      robots: { index: false, follow: true },
    };
  }
  const url = locale === "en" ? `${SITE}/en/blog/${slug}` : `${SITE}/blog/${slug}`;
  return {
    title: article.title,
    description: article.metaDescription,
    alternates: {
      canonical: url,
      languages: {
        fr: `${SITE}/blog/${slug}`,
        "x-default": `${SITE}/blog/${slug}`,
      },
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url,
      type: "article",
      siteName: "Geoperf",
      publishedTime: article.publishedAt,
      authors: ["Frédéric Lefebvre"],
      images: [
        { url: `${SITE}/api/og?title=${encodeURIComponent(article.title)}`, width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.metaDescription,
    },
  };
}

export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  // FR-only. Toutes les pages blog Session 5 sont FR.
  return listArticleSlugs().map((slug) => ({ locale: "fr", slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = getArticle(slug);
  if (!article) notFound();

  const similar = getSimilarArticles(slug, 3);
  const Body = article.Body;

  return (
    <BlogLayout
      locale={locale === "en" ? "en" : "fr"}
      slug={slug}
      title={article.title}
      intro={article.intro}
      publishedAt={article.publishedAt}
      readingTimeMin={article.readingTimeMin}
      body={<Body />}
      similarPosts={similar}
    />
  );
}
