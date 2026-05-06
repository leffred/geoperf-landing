// Single source of truth pour les design tokens GEOPERF.
//
// Importé par tailwind.config.ts (génération des classes) et par les composants
// Edge runtime qui ne peuvent pas utiliser les classes Tailwind (ex: app/api/og/route.tsx).
//
// Doc complète : docs/design-system.md
// Brand voice  : docs/brand-voice-guidelines.md

/**
 * Palette éditoriale — pour logos, OG images, covers LinkedIn, étude sectorielle.
 * Ton chaleureux, premium, autorité. À utiliser sur les surfaces de marque.
 */
export const editorial = {
  navy:      "#042C53",  // Wordmark, fonds dark éditoriaux, texte sur parchment
  navyLight: "#0C447C",  // Eyebrow secondaire, accents sur fond navy
  amber:     "#EF9F27",  // Point signal — 1 par composition max
  parchment: "#F1EFE8",  // Cream chaud éditorial (OG image, étude sectorielle)
  inkMuted:  "#5F5E5A",  // Texte secondaire sur parchment
} as const;

/**
 * Palette UI / dashboard — pour app/portail/profile/leaderboard.
 * Ton tech crisp, neutre, fonctionnel. À utiliser sur les surfaces produit.
 */
export const ui = {
  ink:       "#0A0E1A",  // Texte body, titres standards
  inkMuted:  "#5B6478",  // Texte secondaire, hints
  inkSubtle: "#8C94A6",  // Texte tertiaire, placeholders, disabled
  surface:   "#F7F8FA",  // Fond page par défaut (cool gray)
  surface2:  "#EEF1F5",  // Fond secondaire, séparation
  brand50:   "#EFF4FE",
  brand500:  "#2563EB",  // CTA primaire, liens, focus ring
  brand600:  "#1D4ED8",
  white:     "#FFFFFF",
} as const;

/**
 * Palette sémantique partagée (status, alerts).
 */
export const semantic = {
  success: "#059669",
  warning: "#D97706",
  danger:  "#DC2626",
} as const;

/**
 * Bordures — opacités sur ink (#0A0E1A).
 */
export const borders = {
  default:  "rgba(10, 14, 26, 0.08)",
  strong:   "rgba(10, 14, 26, 0.14)",
  hairline: "rgba(10, 14, 26, 0.06)",
} as const;

/**
 * Ombres — shadows = elevation, jamais décoratif.
 */
export const shadows = {
  card:      "0 1px 2px rgba(10,14,26,0.04), 0 0 0 0.5px rgba(10,14,26,0.06)",
  cardHover: "0 4px 12px rgba(10,14,26,0.06), 0 0 0 0.5px rgba(10,14,26,0.10)",
  popover:   "0 8px 24px rgba(10,14,26,0.08), 0 0 0 0.5px rgba(10,14,26,0.08)",
  modal:     "0 20px 40px rgba(10,14,26,0.10), 0 0 0 0.5px rgba(10,14,26,0.10)",
} as const;

/**
 * Motion tokens.
 */
export const motion = {
  duration: {
    fast: "120ms",
    base: "150ms",
    slow: "240ms",
  },
  easing: {
    snappy: "cubic-bezier(0.16, 1, 0.3, 1)",
    smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

/**
 * Stack typographique. Source Serif Pro réservé aux moments éditoriaux
 * (wordmark, hero marketing, OG, étude sectorielle).
 */
export const fonts = {
  sans:  ['"Inter"', "system-ui", "sans-serif"].join(", "),
  serif: ['"Source Serif Pro"', '"Times New Roman"', "Georgia", "serif"].join(", "),
  mono:  ['"JetBrains Mono"', '"IBM Plex Mono"', "ui-monospace", "monospace"].join(", "),
} as const;

/**
 * Toutes les couleurs aplaties — utile pour les composants Edge runtime
 * (next/og) qui ne supportent pas les classes Tailwind.
 *
 * Convention : on expose `cream` = parchment éditorial (#F1EFE8) explicitement
 * pour les OG cards éditoriales, distinct de `surface` (#F7F8FA) pour les UI.
 */
export const colors = {
  ...editorial,
  ...ui,
  ...semantic,
  // Alias rétrocompatibles (à supprimer une fois les usages migrés)
  cream: editorial.parchment,
} as const;
