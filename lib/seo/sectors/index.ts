// S29 Session 4 — registre central des secteurs /secteur/[slug].

import { TECH_FINANCE_SECTORS } from "./tech-finance";
import { INDUSTRY_ENERGY_SECTORS } from "./industry-energy";
import { SERVICES_HEALTH_REALESTATE_SECTORS } from "./services-health-realestate";
import { MEDIA_RETAIL_GOVT_OTHER_SECTORS } from "./media-retail-govt-other";
import type { SectorEntry, SectorRegistry } from "./types";
import type { Locale } from "../internal-links";

export type { SectorEntry, SectorRegistry, SectorMacro } from "./types";

const ALL_SECTORS: SectorRegistry = {
  ...TECH_FINANCE_SECTORS,
  ...INDUSTRY_ENERGY_SECTORS,
  ...SERVICES_HEALTH_REALESTATE_SECTORS,
  ...MEDIA_RETAIL_GOVT_OTHER_SECTORS,
};

export function getSector(slug: string): SectorEntry | null {
  return ALL_SECTORS[slug] ?? null;
}

export function listSectorSlugs(): string[] {
  return Object.keys(ALL_SECTORS);
}

export function listSectorEntries(): SectorEntry[] {
  return Object.values(ALL_SECTORS);
}

/**
 * Retourne les related sectors d'un secteur :
 * - Si l'entry override avec `relatedSectorSlugs`, utilise cette liste.
 * - Sinon, fallback sur 5 secteurs du même macro (alphabétique).
 */
export function relatedSectorsFor(slug: string, limit = 5): { slug: string; nom: string }[] {
  const entry = ALL_SECTORS[slug];
  if (!entry) return [];

  let candidates: string[] = [];
  if (entry.relatedSectorSlugs && entry.relatedSectorSlugs.length > 0) {
    candidates = entry.relatedSectorSlugs.filter((s) => s !== slug && ALL_SECTORS[s]);
  } else {
    // Fallback : autres secteurs du même macro
    candidates = Object.entries(ALL_SECTORS)
      .filter(([s, e]) => s !== slug && e.macro === entry.macro)
      .map(([s]) => s);
  }

  return candidates.slice(0, limit).map((s) => ({
    slug: s,
    nom: ALL_SECTORS[s].nom,
  }));
}

/**
 * Retourne les 2 pillars liés d'un secteur (utilisés dans la section "Voir aussi").
 */
export function relatedPillarsFor(slug: string, locale: Locale = "fr"): { href: string; label: string }[] {
  const entry = ALL_SECTORS[slug];
  if (!entry) return [];

  const labels: Record<string, { fr: string; en: string }> = {
    "visibilite-llm": { fr: "Visibilité LLM : guide complet", en: "LLM visibility: full guide" },
    "geo-generative-engine-optimization": { fr: "GEO : Generative Engine Optimization", en: "GEO: Generative Engine Optimization" },
    "chatgpt-marketing": { fr: "ChatGPT marketing : tout savoir", en: "ChatGPT marketing playbook" },
    "perplexity-pour-marques": { fr: "Perplexity pour les marques", en: "Perplexity for brands" },
    "gemini-search-marketing": { fr: "Gemini search marketing", en: "Gemini search marketing" },
    "ai-search-vs-seo": { fr: "AI search vs SEO classique", en: "AI search vs traditional SEO" },
    "llm-brand-monitoring": { fr: "LLM brand monitoring", en: "LLM brand monitoring" },
    "optimisation-pour-ia": { fr: "Optimisation pour l'IA", en: "AI optimization fundamentals" },
    "generative-ai-marketing": { fr: "IA générative pour le marketing", en: "Generative AI for marketing" },
    "llm-citation-strategy": { fr: "Stratégie de citation LLM", en: "LLM citation strategy" },
  };

  return entry.relatedPillarSlugs.map((p) => ({
    href: `/guide/${p}`,
    label: labels[p][locale === "en" ? "en" : "fr"],
  }));
}

export { ALL_SECTORS };
