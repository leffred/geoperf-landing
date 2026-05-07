// S29 — Internal links registry.
// Map TS typee qui declare les relations entre pillars / clusters / programmatic
// pour generer les blocs "Pour aller plus loin" automatiquement dans les layouts SEO.
//
// Schema simple : chaque topic a un slug pillar parent, des clusters cousins,
// et des secteurs lies. Les fonctions exportees produisent les arrays de liens
// que les layouts consomment.
//
// Squelette en Session 1 — les arrays sont vides. Les links sont peuples au fil
// de la creation des pillars/clusters/programmatic en Sessions 2-4.

export type Locale = "fr" | "en";

export type PillarSlug =
  | "visibilite-llm"
  | "geo-generative-engine-optimization"
  | "chatgpt-marketing"
  | "perplexity-pour-marques"
  | "gemini-search-marketing"
  | "ai-search-vs-seo"
  | "llm-brand-monitoring"
  | "optimisation-pour-ia"
  | "generative-ai-marketing"
  | "llm-citation-strategy";

export type LinkKind = "pillar" | "cluster" | "programmatic" | "blog";

export type RelatedLink = {
  href: string; // path locale-relative (next-intl Link gere le prefix)
  label: string;
  kind: LinkKind;
};

// Map pillar -> liste de cluster slugs cousins (clusters qui pointent vers ce pillar).
// Squelette : a etoffer en Session 2 quand les clusters sont crees.
const CLUSTERS_BY_PILLAR: Record<PillarSlug, string[]> = {
  "visibilite-llm": [],
  "geo-generative-engine-optimization": [],
  "chatgpt-marketing": [],
  "perplexity-pour-marques": [],
  "gemini-search-marketing": [],
  "ai-search-vs-seo": [],
  "llm-brand-monitoring": [],
  "optimisation-pour-ia": [],
  "generative-ai-marketing": [],
  "llm-citation-strategy": [],
};

// Map programmatic slug -> { pillarsRelated, sectorsRelated }
// Squelette vide en Session 1.
const PROGRAMMATIC_GRAPH: Record<string, {
  pillars: PillarSlug[];
  sectors: string[];
}> = {};

// Map pillar -> autres pillars du graph topical (linkage horizontal).
const PILLAR_GRAPH: Record<PillarSlug, PillarSlug[]> = {
  "visibilite-llm": ["llm-brand-monitoring", "ai-search-vs-seo"],
  "geo-generative-engine-optimization": ["ai-search-vs-seo", "optimisation-pour-ia"],
  "chatgpt-marketing": ["llm-citation-strategy", "generative-ai-marketing"],
  "perplexity-pour-marques": ["chatgpt-marketing", "gemini-search-marketing"],
  "gemini-search-marketing": ["chatgpt-marketing", "ai-search-vs-seo"],
  "ai-search-vs-seo": ["geo-generative-engine-optimization", "visibilite-llm"],
  "llm-brand-monitoring": ["visibilite-llm", "llm-citation-strategy"],
  "optimisation-pour-ia": ["geo-generative-engine-optimization", "chatgpt-marketing"],
  "generative-ai-marketing": ["chatgpt-marketing", "optimisation-pour-ia"],
  "llm-citation-strategy": ["chatgpt-marketing", "llm-brand-monitoring"],
};

// Labels FR pour les pillars (pour generer les libelles des liens).
// EN labels viendront en Session 2 quand les pages EN existent.
const PILLAR_LABELS_FR: Record<PillarSlug, string> = {
  "visibilite-llm": "Visibilité LLM : guide complet",
  "geo-generative-engine-optimization": "GEO : Generative Engine Optimization",
  "chatgpt-marketing": "ChatGPT marketing : tout savoir",
  "perplexity-pour-marques": "Perplexity pour les marques",
  "gemini-search-marketing": "Gemini search marketing",
  "ai-search-vs-seo": "AI search vs SEO classique",
  "llm-brand-monitoring": "LLM brand monitoring",
  "optimisation-pour-ia": "Optimisation pour l'IA",
  "generative-ai-marketing": "IA générative pour le marketing",
  "llm-citation-strategy": "Stratégie de citation LLM",
};

const PILLAR_LABELS_EN: Record<PillarSlug, string> = {
  "visibilite-llm": "LLM visibility: full guide",
  "geo-generative-engine-optimization": "GEO: Generative Engine Optimization",
  "chatgpt-marketing": "ChatGPT marketing playbook",
  "perplexity-pour-marques": "Perplexity for brands",
  "gemini-search-marketing": "Gemini search marketing",
  "ai-search-vs-seo": "AI search vs traditional SEO",
  "llm-brand-monitoring": "LLM brand monitoring",
  "optimisation-pour-ia": "AI optimization fundamentals",
  "generative-ai-marketing": "Generative AI for marketing",
  "llm-citation-strategy": "LLM citation strategy",
};

function pillarLabel(slug: PillarSlug, locale: Locale): string {
  return locale === "en" ? PILLAR_LABELS_EN[slug] : PILLAR_LABELS_FR[slug];
}

/**
 * Retourne 4-6 liens "Pour aller plus loin" pour une pillar page.
 * Mix : autres pillars du graph topical + 2-3 clusters cousins.
 */
export function relatedForPillar(slug: PillarSlug, locale: Locale): RelatedLink[] {
  const links: RelatedLink[] = [];
  // Pillars liés
  for (const p of PILLAR_GRAPH[slug] ?? []) {
    links.push({
      href: `/guide/${p}`,
      label: pillarLabel(p, locale),
      kind: "pillar",
    });
  }
  // Clusters cousins (seront ajoutes en Session 2 quand le map est rempli)
  for (const c of CLUSTERS_BY_PILLAR[slug] ?? []) {
    links.push({
      href: `/insights/${c}`,
      label: c.replace(/-/g, " "),
      kind: "cluster",
    });
  }
  return links.slice(0, 6);
}

/**
 * Retourne 2-3 clusters cousins (meme pillar parent) pour une cluster page.
 * Squelette : retourne [] en Session 1.
 */
export function relatedForCluster(slug: string, parentPillar: PillarSlug, locale: Locale): RelatedLink[] {
  void slug; void locale;
  const cousins = (CLUSTERS_BY_PILLAR[parentPillar] ?? []).filter((c) => c !== slug);
  return cousins.slice(0, 3).map((c) => ({
    href: `/insights/${c}`,
    label: c.replace(/-/g, " "),
    kind: "cluster" as LinkKind,
  }));
}

/**
 * Retourne 2 pillars + 2-3 secteurs proches pour une programmatic page.
 * Squelette : utilise PROGRAMMATIC_GRAPH si declare, sinon retourne 2 pillars
 * generiques (visibilite-llm, llm-brand-monitoring).
 */
export function relatedForProgrammatic(
  slug: string,
  locale: Locale
): { pillars: RelatedLink[]; sectors: RelatedLink[] } {
  const entry = PROGRAMMATIC_GRAPH[slug];
  const pillars: PillarSlug[] = entry?.pillars ?? ["visibilite-llm", "llm-brand-monitoring"];
  const sectors = entry?.sectors ?? [];

  return {
    pillars: pillars.map((p) => ({
      href: `/guide/${p}`,
      label: pillarLabel(p, locale),
      kind: "pillar" as LinkKind,
    })),
    sectors: sectors.map((s) => ({
      href: `/secteur/${s}`,
      label: s.replace(/-/g, " "),
      kind: "programmatic" as LinkKind,
    })),
  };
}

/**
 * Helper utilitaire : enregistrer un cluster dans la map. Sera appele depuis
 * les fichiers seed Session 2 (au lieu de hardcoder ici les 50 clusters).
 */
export function registerCluster(parentPillar: PillarSlug, clusterSlug: string): void {
  const arr = CLUSTERS_BY_PILLAR[parentPillar];
  if (!arr.includes(clusterSlug)) arr.push(clusterSlug);
}
