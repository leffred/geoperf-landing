// S35 — Page upgrade GEO Content Writer.
// Server Component : 3 cartes plans (Starter/Pro/Agency) + form action createContentCheckout par plan.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { CONTENT_PLAN_LIMITS, CONTENT_TIER_LABELS, type ContentTier } from "@/lib/content-plans";
import { createContentCheckout } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Upgrade Content — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  invalid_tier: "Plan invalide.",
  checkout_failed: "Impossible de créer la session Stripe.",
  checkout_unreachable: "Service de paiement indisponible — réessayez dans quelques instants.",
  no_url: "Stripe n'a pas retourné d'URL de checkout.",
  tier_not_configured: "Ce plan n'est pas encore configuré côté Stripe — contactez le support.",
};

interface PlanCardSpec {
  tier: Exclude<ContentTier, "free">;
  description: string;
  features: string[];
  recommended?: boolean;
}

const PLAN_CARDS: PlanCardSpec[] = [
  {
    tier: "starter",
    description: "Pour démarrer avec la création GEO.",
    features: [
      "10 articles GEO par mois",
      "Pipeline Claude 3 Haiku + Brave Search",
      "Publication WordPress / Shopify / Webflow",
      "Suggestions GSC (si connecté)",
    ],
  },
  {
    tier: "pro",
    description: "Le sweet spot pour les équipes Content.",
    features: [
      "30 articles GEO par mois",
      "Tout Starter +",
      "Éditeur TipTap + revue humaine",
      "Support prioritaire",
    ],
    recommended: true,
  },
  {
    tier: "agency",
    description: "Volume illimité pour agences & gros sites.",
    features: [
      "Articles illimités (999/mois)",
      "Tout Pro +",
      "Multi-CMS sans limite",
      "Onboarding dédié",
    ],
  },
];

export default async function UpgradeContentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; canceled?: string }>;
}) {
  const sp = await searchParams;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: contentSub } = await sb
    .from("saas_content_subscriptions")
    .select("tier, current_period_end")
    .eq("user_id", ctx.user.id)
    .eq("status", "active")
    .maybeSingle();
  const currentTier = ((contentSub as { tier?: ContentTier } | null)?.tier ?? "free") as ContentTier;

  const errorMsg = sp.error ? ERROR_LABELS[sp.error] ?? `Erreur : ${sp.error}` : null;
  const canceled = sp.canceled === "true";

  return (
    <div className="px-6 md:px-8 py-6 md:py-8 max-w-5xl mx-auto">
      <Link
        href="/app/content"
        className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink mb-4 transition-colors"
        style={{ fontSize: 12 }}
      >
        <ArrowLeft size={13} strokeWidth={1.8} />
        Mes articles
      </Link>

      <div className="mb-8 text-center">
        <div className="font-mono uppercase text-brand-500 mb-2" style={{ fontSize: 10, letterSpacing: "0.16em" }}>
          // Plans GEO Content Writer
        </div>
        <h1 className="text-ink leading-tight tracking-tight mb-2" style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
          Débloquez plus d&apos;articles GEO
        </h1>
        <p className="text-ink-muted max-w-xl mx-auto" style={{ fontSize: 14 }}>
          Plan actuel : <strong className="text-ink">{CONTENT_TIER_LABELS[currentTier]}</strong>{" "}
          ({CONTENT_PLAN_LIMITS[currentTier].articles_per_month} articles {currentTier === "free" ? "au total" : "/ mois"}).
          Choisissez un plan pour augmenter votre quota.
        </p>
      </div>

      {canceled && (
        <div className="mb-6 max-w-2xl mx-auto rounded-lg border border-DEFAULT border-l-2 border-l-ink/15 bg-surface px-4 py-3 text-ink-muted" style={{ fontSize: 13 }}>
          Checkout annulé. Vous pouvez relancer à tout moment.
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 max-w-2xl mx-auto rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-danger" style={{ fontSize: 13 }}>
          {errorMsg}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {PLAN_CARDS.map((card) => {
          const isCurrent = card.tier === currentTier;
          const limits = CONTENT_PLAN_LIMITS[card.tier];
          return (
            <div
              key={card.tier}
              className={`relative bg-white rounded-xl p-6 shadow-card transition-all ${
                card.recommended
                  ? "border-2 border-brand-500"
                  : "border border-DEFAULT"
              }`}
            >
              {card.recommended && !isCurrent && (
                <span className="absolute -top-3 right-4 bg-brand-500 text-white font-mono uppercase rounded" style={{ fontSize: 9, letterSpacing: "0.14em", padding: "3px 10px", fontWeight: 600 }}>
                  Recommandé
                </span>
              )}
              {isCurrent && (
                <span className="absolute -top-3 right-4 bg-ink text-white font-mono uppercase rounded" style={{ fontSize: 9, letterSpacing: "0.14em", padding: "3px 10px", fontWeight: 600 }}>
                  Plan actuel
                </span>
              )}

              <h2 className="text-ink" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
                {CONTENT_TIER_LABELS[card.tier]}
              </h2>
              <p className="text-ink-muted mt-1 mb-4" style={{ fontSize: 12, lineHeight: 1.4 }}>
                {card.description}
              </p>

              <div className="mb-5 flex items-baseline gap-1">
                <span className="text-ink" style={{ fontSize: 36, fontWeight: 600, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
                  {limits.price_eur}
                </span>
                <span className="text-ink-muted" style={{ fontSize: 14 }}>€ HT / mois</span>
              </div>

              <ul className="space-y-2 mb-6">
                {card.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-ink" style={{ fontSize: 12, lineHeight: 1.5 }}>
                    <Check size={13} strokeWidth={2.4} className="text-brand-500 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  type="button"
                  disabled
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-surface text-ink-muted cursor-not-allowed"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  Plan actuel
                </button>
              ) : (
                <form action={createContentCheckout}>
                  <input type="hidden" name="tier" value={card.tier} />
                  <button
                    type="submit"
                    className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md transition-colors ${
                      card.recommended
                        ? "bg-brand-500 hover:bg-brand-600 text-white"
                        : "bg-ink hover:bg-ink/90 text-white"
                    }`}
                    style={{ fontSize: 13, fontWeight: 600 }}
                  >
                    <Sparkles size={13} strokeWidth={2} />
                    Passer à {CONTENT_TIER_LABELS[card.tier]}
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-ink-subtle text-center mt-8 max-w-2xl mx-auto" style={{ fontSize: 11, lineHeight: 1.5 }}>
        Prix HT, TVA française 20% calculée par Stripe (autoliquidation pour clients UE assujettis).
        Paiement sécurisé via Stripe. Annulation à tout moment via le portail client.
        Le quota d&apos;articles se renouvelle à chaque cycle de facturation.
      </p>
    </div>
  );
}
