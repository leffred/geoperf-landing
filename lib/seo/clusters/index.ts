// S29 Session 3 — registre central des clusters /insights/[slug].
// Aggregue les 10 modules par pillar + expose getCluster() + slug list.

import { VISIBILITE_LLM_CLUSTERS } from "./visibilite-llm";
import { GEO_CLUSTERS } from "./geo";
import { CHATGPT_MARKETING_CLUSTERS } from "./chatgpt-marketing";
import { PERPLEXITY_CLUSTERS } from "./perplexity";
import { GEMINI_CLUSTERS } from "./gemini";
import { AI_SEARCH_VS_SEO_CLUSTERS } from "./ai-search-vs-seo";
import { BRAND_MONITORING_CLUSTERS } from "./brand-monitoring";
import { OPTIMISATION_POUR_IA_CLUSTERS } from "./optimisation-pour-ia";
import { GENERATIVE_AI_MARKETING_CLUSTERS } from "./generative-ai-marketing";
import { CITATION_STRATEGY_CLUSTERS } from "./citation-strategy";
import type { ClusterEntry, ClusterRegistry } from "./types";
import type { Locale, PillarSlug } from "../internal-links";

export type { ClusterContent, ClusterEntry, ClusterRegistry } from "./types";

const ALL_CLUSTERS: ClusterRegistry = {
  ...VISIBILITE_LLM_CLUSTERS,
  ...GEO_CLUSTERS,
  ...CHATGPT_MARKETING_CLUSTERS,
  ...PERPLEXITY_CLUSTERS,
  ...GEMINI_CLUSTERS,
  ...AI_SEARCH_VS_SEO_CLUSTERS,
  ...BRAND_MONITORING_CLUSTERS,
  ...OPTIMISATION_POUR_IA_CLUSTERS,
  ...GENERATIVE_AI_MARKETING_CLUSTERS,
  ...CITATION_STRATEGY_CLUSTERS,
};

export function getCluster(slug: string): ClusterEntry | null {
  return ALL_CLUSTERS[slug] ?? null;
}

export function listClusterSlugs(locale: Locale = "fr"): string[] {
  return Object.entries(ALL_CLUSTERS)
    .filter(([, entry]) => locale === "fr" || entry.en !== undefined)
    .map(([slug]) => slug);
}

export function listClustersByPillar(pillar: PillarSlug): string[] {
  return Object.entries(ALL_CLUSTERS)
    .filter(([, entry]) => entry.parentPillar === pillar)
    .map(([slug]) => slug);
}

export function clusterCousins(slug: string, locale: Locale, limit = 3): { href: string; label: string }[] {
  const entry = ALL_CLUSTERS[slug];
  if (!entry) return [];
  const cousins = Object.entries(ALL_CLUSTERS)
    .filter(([s, e]) => s !== slug && e.parentPillar === entry.parentPillar)
    .filter(([, e]) => locale === "fr" || e.en !== undefined)
    .slice(0, limit)
    .map(([s, e]) => {
      const c = locale === "en" && e.en ? e.en : e.fr;
      const prefix = locale === "en" ? "/en" : "";
      return { href: `${prefix}/insights/${s}`, label: c.title };
    });
  return cousins;
}

export { ALL_CLUSTERS };
