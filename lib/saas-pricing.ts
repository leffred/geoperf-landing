// Pricing canonique post-S16.2 (tax_behavior=exclusive, annuel -25% / 3 mois offerts).
// Source unique pour /saas, /app/billing, /saas/vs-getmint.
// Tous les montants en cents (centimes EUR).

export type TierKey = "free" | "starter" | "growth" | "pro" | "agency";

export type TierPricing = {
  monthly_ht: number;       // ex: 7900 = 79€ HT/mois
  yearly_ht: number;        // ex: 70800 = 708€ HT/an (= 12 × yearly_eq_mo_ht)
  yearly_eq_mo_ht: number;  // ex: 5900 = 59€ HT/mois équivalent (annuel / 12)
  saving_yr: number;        // ex: 24000 = 240€ économie/an vs mensuel cumulé
};

// Constantes pricing — interdiction d'inventer (cf brief S17 §4.9).
export const TIERS: Record<Exclude<TierKey, "free">, TierPricing> = {
  starter: { monthly_ht: 7900,  yearly_ht: 70800,  yearly_eq_mo_ht: 5900,  saving_yr: 24000 },
  growth:  { monthly_ht: 19900, yearly_ht: 178800, yearly_eq_mo_ht: 14900, saving_yr: 60000 },
  pro:     { monthly_ht: 39900, yearly_ht: 358800, yearly_eq_mo_ht: 29900, saving_yr: 120000 },
  agency:  { monthly_ht: 79900, yearly_ht: 718800, yearly_eq_mo_ht: 59900, saving_yr: 240000 },
};

export const VAT_RATE = 0.20; // FR

export function fmtEuro(cents: number, opts: { decimals?: 0 | 2 } = {}): string {
  const decimals = opts.decimals ?? 0;
  const major = cents / 100;
  if (decimals === 0) return `${Math.round(major)}€`;
  // 2 décimales, supprime ".00" si entier exact
  const fixed = major.toFixed(2);
  return `${fixed.replace(/\.00$/, "")}€`;
}

export function fmtHT(cents: number): string {
  return `${fmtEuro(cents)} HT`;
}

export function fmtTTC(cents: number, decimals: 0 | 2 = 2): string {
  return `${fmtEuro(Math.round(cents * (1 + VAT_RATE)), { decimals })} TTC`;
}

// Renvoie le triplet pricing à afficher pour un tier + cycle donné.
export type PriceDisplay = {
  /** Prix HT principal (gros chiffre), ex "79€ HT/mois" ou "59€ HT/mois" en annuel */
  primaryHT: string;
  /** Suffixe sous le prix : "soit 94.80€ TTC" (mensuel) ou "facturé annuellement" (annuel) */
  secondary: string;
  /** Économie en mode annuel : "Économisez 240€ vs mensuel" / null en mensuel */
  savingHint: string | null;
};

export function priceDisplay(tier: Exclude<TierKey, "free">, cycle: "monthly" | "annual"): PriceDisplay {
  const t = TIERS[tier];
  if (cycle === "monthly") {
    return {
      primaryHT: fmtHT(t.monthly_ht) + "/mois",
      secondary: `soit ${fmtTTC(t.monthly_ht, 2)}`,
      savingHint: null,
    };
  }
  // Annuel : on affiche l'équivalent mensuel HT (59/149/299/599) — plus
  // lisible que le total annuel.
  return {
    primaryHT: fmtHT(t.yearly_eq_mo_ht) + "/mois",
    secondary: `facturé annuellement (${fmtHT(t.yearly_ht)}/an)`,
    savingHint: `Économisez ${fmtEuro(t.saving_yr)}/an vs mensuel`,
  };
}
