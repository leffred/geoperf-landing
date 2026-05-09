// S29 Session 4 — types pour le registre des secteurs /secteur/[slug].

import type { PillarSlug } from "../internal-links";

export type SectorEntry = {
  /** Slug Apollo categories.slug, identique à la DB */
  slug: string;
  /** Nom FR du secteur */
  nom: string;
  /** Macro-groupe (servant à grouper les related sectors par défaut) */
  macro: SectorMacro;
  /** 3-5 marques de référence FR (utilisé en fallback si pas de report ready) */
  topBrandsFR: string[];
  /** 3 insights spécifiques au secteur, 1-2 phrases chacun */
  insights: string[];
  /** 4 conseils sectoriels actionnables, 1 phrase chacun */
  conseils: string[];
  /** Slugs de 5 secteurs proches (override default macro grouping) */
  relatedSectorSlugs?: string[];
  /** 2 pillars liés */
  relatedPillarSlugs: [PillarSlug, PillarSlug];
};

export type SectorMacro =
  | "tech"
  | "finance"
  | "industry"
  | "services"
  | "health"
  | "realestate"
  | "logistics"
  | "media"
  | "education"
  | "government"
  | "retail"
  | "energy"
  | "hospitality"
  | "agri";

export type SectorRegistry = Record<string, SectorEntry>;
