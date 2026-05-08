// S29 Session 3 — types pour le registre des clusters /insights/[slug].

import type { ComponentType } from "react";
import type { PillarSlug } from "../internal-links";

export type ClusterContent = {
  title: string;
  /** Meta description (max ~160 char) */
  metaDescription: string;
  /** Intro affichée sous le H1 (~100 mots) */
  intro: string;
  /** Date ISO de publication */
  publishedAt: string;
  /** JSX body (4-6 H2 + content). Composant fonctionnel sans props. */
  Body: ComponentType;
};

export type ClusterEntry = {
  parentPillar: PillarSlug;
  fr: ClusterContent;
  en?: ClusterContent;
};

export type ClusterRegistry = Record<string, ClusterEntry>;
