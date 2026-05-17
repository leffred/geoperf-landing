// S35 — GEO Content Writer plans + Stripe Price IDs.
// Source of truth pour les limites + pricing affiché dans /app/content/upgrade.
// Le webhook saas_stripe_webhook utilise les mêmes env vars côté Supabase Edge.

export const CONTENT_PLAN_LIMITS = {
  free:    { articles_per_month: 5,   renews: false, price_eur: 0   },
  starter: { articles_per_month: 10,  renews: true,  price_eur: 49  },
  pro:     { articles_per_month: 30,  renews: true,  price_eur: 99  },
  agency:  { articles_per_month: 999, renews: true,  price_eur: 299 },
} as const;

export type ContentTier = keyof typeof CONTENT_PLAN_LIMITS;

export const CONTENT_TIER_ORDER: ContentTier[] = ["free", "starter", "pro", "agency"];

export const CONTENT_TIER_LABELS: Record<ContentTier, string> = {
  free:    "Free",
  starter: "Starter",
  pro:     "Pro",
  agency:  "Agency",
};

// Price IDs Stripe (créés dans Stripe Dashboard, renseignés en env).
// Côté frontend : pas strictement requis (Vercel n'utilise pas ces env vars).
// Côté Supabase Edge Functions : requis pour saas_content_checkout + saas_stripe_webhook.
export const CONTENT_STRIPE_PRICES: Record<Exclude<ContentTier, "free">, string> = {
  starter: process.env.STRIPE_CONTENT_STARTER_PRICE_ID ?? "",
  pro:     process.env.STRIPE_CONTENT_PRO_PRICE_ID     ?? "",
  agency:  process.env.STRIPE_CONTENT_AGENCY_PRICE_ID  ?? "",
};

export function contentTierLimits(tier: ContentTier) {
  return CONTENT_PLAN_LIMITS[tier];
}
