// Helper pour assigner des couleurs distinctes et stables aux marques cross-page.
// Spec : SPRINTS_S8_S9_S10_PLAN.md S8.5
//
// Garantit que la même brand (identifiée par son domain ou nom) a toujours la
// même couleur dans tous les charts, légendes, tableaux. Hash → index dans
// la palette → couleur déterministe.

export type BrandColor = {
  /** Hex pour Recharts strokes / fills */
  hex: string;
  /** Tailwind classe pour bg compatible avec navy/amber/cream theme */
  bg: string;
  /** Tailwind classe pour texte (contrasté avec bg) */
  text: string;
  /** Label canonique (debug + a11y) */
  label: string;
};

// 7 couleurs distinctes lisibles sur cream + navy backgrounds.
// Ordre choisi pour que les premières assignations (la marque user en premier)
// utilisent les couleurs les plus visibles (navy puis amber).
const PALETTE: BrandColor[] = [
  { hex: "#042C53", bg: "bg-navy",       text: "text-white", label: "navy"    },
  { hex: "#EF9F27", bg: "bg-amber",      text: "text-navy",  label: "amber"   },
  { hex: "#1D9E75", bg: "bg-emerald-600",text: "text-white", label: "emerald" },
  { hex: "#993C1D", bg: "bg-red-700",    text: "text-white", label: "rust"    },
  { hex: "#534AB7", bg: "bg-indigo-600", text: "text-white", label: "indigo"  },
  { hex: "#0EA5BC", bg: "bg-cyan-600",   text: "text-white", label: "cyan"    },
  { hex: "#C03278", bg: "bg-pink-600",   text: "text-white", label: "pink"    },
];

/** Hash déterministe d'une string → entier non-signé. Algo djb2 simplifié. */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0; // h * 33 + char
  }
  return Math.abs(h);
}

/**
 * Normalise un identifiant brand pour le hash. On accepte un domain
 * ("axa.fr") OU un nom ("AXA Investment Managers"). Retourne la racine
 * lowercase pour stabilité.
 */
function normalize(input: string): string {
  return String(input || "").toLowerCase().trim()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/\.[a-z]{2,}$/, ""); // retire la TLD si domain
}

/**
 * Retourne la couleur attribuée à une brand. Stable cross-call : même input → même output.
 * @param identifier domain ou nom (case-insensitive)
 */
export function assignBrandColor(identifier: string): BrandColor {
  const key = normalize(identifier);
  if (!key) return PALETTE[PALETTE.length - 1]; // fallback (rare)
  const idx = hashString(key) % PALETTE.length;
  return PALETTE[idx];
}

/** Attribution forcée pour la marque "principale" de l'user (toujours navy/amber). */
export function ownerBrandColor(): BrandColor {
  return PALETTE[0]; // navy
}

/** Liste complète de la palette pour boucles ou docs */
export function brandPalette(): BrandColor[] {
  return PALETTE;
}
