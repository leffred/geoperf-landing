// S29 Session 5 — types pour le registre des articles /blog/[slug].

import type { ComponentType } from "react";

export type BlogCategory = "flagship" | "trends" | "tactique" | "platforms" | "objection" | "showcase";

export type BlogArticle = {
  /** Slug URL */
  slug: string;
  /** Titre H1 */
  title: string;
  /** Meta description (~155 char) */
  metaDescription: string;
  /** Intro hook (~100 mots) sous le H1 */
  intro: string;
  /** Date ISO de publication (étalée sur les 4 dernières semaines pour cadence régulière) */
  publishedAt: string;
  /** Catégorie (pour stats / filtering) */
  category: BlogCategory;
  /** Reading time estimé en minutes */
  readingTimeMin: number;
  /** Body component (JSX inline) */
  Body: ComponentType;
  /** 3 articles similaires (slugs) */
  similar?: string[];
};

export type BlogRegistry = Record<string, BlogArticle>;
