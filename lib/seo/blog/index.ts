// S29 Session 5 — registre central des articles /blog/[slug].

import { ARTICLES_BATCH_1 } from "./articles-1";
import { ARTICLES_BATCH_2 } from "./articles-2";
import type { BlogArticle, BlogRegistry } from "./types";

export type { BlogArticle, BlogCategory, BlogRegistry } from "./types";

const ALL_ARTICLES: BlogRegistry = {
  ...ARTICLES_BATCH_1,
  ...ARTICLES_BATCH_2,
};

export function getArticle(slug: string): BlogArticle | null {
  return ALL_ARTICLES[slug] ?? null;
}

export function listArticleSlugs(): string[] {
  return Object.keys(ALL_ARTICLES);
}

export function listArticles(): BlogArticle[] {
  return Object.values(ALL_ARTICLES);
}

export function getSimilarArticles(slug: string, limit = 3): { href: string; label: string; publishedAt: string }[] {
  const article = ALL_ARTICLES[slug];
  if (!article || !article.similar) return [];
  return article.similar
    .slice(0, limit)
    .map((s) => ALL_ARTICLES[s])
    .filter((a): a is BlogArticle => Boolean(a))
    .map((a) => ({
      href: `/blog/${a.slug}`,
      label: a.title,
      publishedAt: a.publishedAt,
    }));
}

export { ALL_ARTICLES };
