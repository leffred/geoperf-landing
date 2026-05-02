import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { TierBadge } from "@/components/saas/TierBadge";
import { loadSaasContext, tierLabel, TIER_LIMITS, type SaasTier } from "@/lib/saas-auth";
import { startCheckout, openCustomerPortal } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Abonnement — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  bad_tier: "Tier invalide.",
  bad_cycle: "Cycle de facturation invalide.",
  checkout_failed: "Impossible de créer la session Stripe. Réessaie ou contacte le support.",
  checkout_no_url: "Stripe n'a pas retourné d'URL de checkout.",
  portal_failed: "Impossible d'ouvrir le portail Stripe.",
  portal_no_url: "Stripe n'a pas retourné d'URL de portail.",
  not_owner: "Seul le propriétaire du compte peut gérer la souscription.",
};

const TIER_FEATURES: Record<Exclude<SaasTier, "solo">, string[]> = {
  free: [
    "1 marque", "1 LLM (ChatGPT)", "30 prompts / marque",
    "1 topic", "Snapshot mensuel", "3 derniers snapshots", "Pas d'export",
  ],
  starter: [
    "1 marque", "4 LLMs (tous)", "50 prompts / marque",
    "3 topics", "Snapshot hebdomadaire", "Historique illimité",
    "Recommandations IA", "Alertes email", "Export CSV/PDF",
  ],
  growth: [
    "1 marque", "4 LLMs", "200 prompts / marque",
    "9 topics", "5 seats inclus", "Snapshot hebdo",
    "Recos IA + alertes email", "Sources Explorer",
    "Sentiment analysis (Brand Health)",
    "Webhooks Slack / Discord",
  ],
  pro: [
    "3 marques", "6 LLMs (+ Mistral, Grok)", "200 prompts / marque",
    "Topics illimités", "Seats illimités",
    "Tout Growth + Sentiment",
    "Brand Alignment (gap keywords / value props)",
    "Content Studio (10 drafts/mois)",
    "Citations Flow (Sankey diagram)",
    "Webhooks Teams + custom",
  ],
  agency: [
    "10 marques", "7 LLMs (+ Llama)", "300 prompts / marque",
    "Topics illimités", "Seats illimités",
    "Tout Pro + Content Studio illimité",
    "API REST publique (60 req/min)",
    "White-label + support prioritaire",
  ],
};

const ORDER: Array<Exclude<SaasTier, "solo">> = ["free", "starter", "growth", "pro", "agency"];

type Props = { searchParams: Promise<{ error?: string; success?: string; canceled?: string; cycle?: string }> };

export default async function BillingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const ctx = await loadSaasContext();
  const errorMsg = sp.error ? ERROR_LABELS[sp.error] || "Erreur." : null;
  const limits = ctx.limits;
  const cycle: "monthly" | "annual" = sp.cycle === "annual" ? "annual" : "monthly";

  const currentTierKey: Exclude<SaasTier, "solo"> = ctx.tier === "solo" ? "starter" : (ctx.tier as Exclude<SaasTier, "solo">);

  // Détecte trial actif (Stripe synchronise via saas_subscriptions.status='trialing')
  const isTrialing = (ctx.subscription?.status as string | undefined) === "trialing";
  const trialEnd = ctx.subscription?.current_period_end ? new Date(ctx.subscription.current_period_end) : null;
  const trialDaysLeft = isTrialing && trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 86400000)) : 0;

  function priceLabel(monthly: number) {
    if (cycle === "annual") {
      const yearly = Math.round(monthly * 12 * 0.8);
      const monthlyEquiv = Math.round(monthly * 0.8);
      return { main: `${yearly}`, suffix: "€/an HT", hint: `≈ ${monthlyEquiv}€/mois · économisez ${Math.round(monthly * 12 * 0.2)}€/an` };
    }
    return { main: `${monthly}`, suffix: "€/mois HT", hint: null };
  }

  return (
    <Section py="md" tone="white">
      <div className="mb-8">
        <Eyebrow className="mb-2">Abonnement</Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight mb-3">
          Plan actuel
        </h1>
        <div className="flex items-baseline gap-3 flex-wrap">
          <TierBadge tier={ctx.tier} size="md" />
          <span className="text-sm text-ink-muted">
            {ctx.tier === "free" ? "0€/mois" : `${limits.price_eur}€/mois HT`}
          </span>
          {ctx.subscription?.current_period_end && (
            <span className="text-xs text-ink-subtle">
              · renouvellement {new Date(ctx.subscription.current_period_end).toLocaleDateString("fr-FR")}
              {ctx.subscription.cancel_at_period_end && " (résiliation programmée)"}
            </span>
          )}
          {!ctx.is_owner && (
            <span className="text-xs text-ink-subtle italic">
              · Tu es membre du compte de <strong className="text-ink">{ctx.owner_profile?.email ?? "?"}</strong>
            </span>
          )}
        </div>
      </div>

      {isTrialing && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
          <strong>Trial actif</strong> · {trialDaysLeft} jour{trialDaysLeft > 1 ? "s" : ""} restant{trialDaysLeft > 1 ? "s" : ""} jusqu&apos;au{" "}
          {trialEnd?.toLocaleDateString("fr-FR")}. Aucun paiement avant cette date. Annulation gratuite via le portail Stripe.
        </div>
      )}

      {sp.success === "true" && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-success bg-emerald-50 px-4 py-3 text-sm text-success">
          Paiement reçu. Ton plan se met à jour dans quelques secondes (synchro Stripe → Supabase via webhook).
        </div>
      )}
      {sp.canceled === "true" && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-ink/15 bg-surface px-4 py-3 text-sm text-ink-muted">
          Checkout annulé. Tu peux relancer quand tu veux.
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      {ctx.is_owner && ctx.subscription?.stripe_subscription_id && (
        <form action={openCustomerPortal} className="mb-10">
          <Button type="submit" variant="primary" size="md">Gérer mon abonnement (Stripe)</Button>
          <span className="ml-3 text-xs text-ink-muted">
            Cancel, upgrade, downgrade, factures — tout depuis le portail Stripe.
          </span>
        </form>
      )}

      {!ctx.is_owner && (
        <p className="text-sm text-ink-muted mb-10">
          La gestion d&apos;abonnement est réservée au propriétaire du compte.
        </p>
      )}

      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
        <Eyebrow>5 plans · facturation {cycle === "annual" ? "annuelle (-20%)" : "mensuelle"}</Eyebrow>
        <div className="flex gap-1 rounded-md bg-surface p-1 text-xs">
          <Link
            href="/app/billing"
            className={`px-3 py-1.5 rounded-md transition-colors duration-150 ease-out ${cycle === "monthly" ? "bg-white text-ink shadow-card" : "text-ink-muted hover:text-ink"}`}
          >
            Mensuel
          </Link>
          <Link
            href="/app/billing?cycle=annual"
            className={`px-3 py-1.5 rounded-md transition-colors duration-150 ease-out ${cycle === "annual" ? "bg-white text-ink shadow-card" : "text-ink-muted hover:text-ink"}`}
          >
            Annuel <span className="font-mono text-brand-500">-20%</span>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {ORDER.map(t => {
          const isCurrent = t === currentTierKey;
          const tLimits = TIER_LIMITS[t];
          const features = TIER_FEATURES[t];
          const recommended = t === "growth";
          const price = priceLabel(tLimits.price_eur);
          const isFreeTier = t === "free";
          return (
            <div
              key={t}
              className={`rounded-lg p-5 transition-all duration-150 ease-out ${
                isCurrent
                  ? "bg-ink text-white shadow-card"
                  : recommended
                    ? "bg-white ring-2 ring-brand-500 shadow-cardHover"
                    : "bg-white border border-DEFAULT shadow-card hover:shadow-cardHover"
              }`}
            >
              <div className="flex items-baseline justify-between mb-3">
                <TierBadge tier={t} size="md" />
                {isCurrent && (
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow opacity-70">Actuel</span>
                )}
                {recommended && !isCurrent && (
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-brand-500">Recommandé</span>
                )}
              </div>
              <div className="mb-1">
                <span className="text-3xl font-medium tracking-tightish tabular-nums">{isFreeTier ? "0" : price.main}</span>
                <span className={`text-sm ml-1 ${isCurrent ? "opacity-70" : "text-ink-muted"}`}>
                  {isFreeTier ? "€" : price.suffix}
                </span>
              </div>
              {!isFreeTier && price.hint && (
                <p className={`text-[11px] mb-4 ${isCurrent ? "text-white/60" : "text-brand-500"}`}>
                  {price.hint}
                </p>
              )}
              {isFreeTier || !price.hint ? <div className="mb-4" /> : null}
              <ul className={`text-xs space-y-1.5 mb-5 ${isCurrent ? "" : "text-ink"}`}>
                {features.map(f => (
                  <li key={f} className="flex items-baseline gap-2">
                    <span className={isCurrent ? "text-white/60" : "text-brand-500"}>·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {ctx.is_owner && !isCurrent && !isFreeTier && (
                <div className="space-y-2">
                  <form action={startCheckout}>
                    <input type="hidden" name="tier" value={t} />
                    <input type="hidden" name="cycle" value={cycle} />
                    <Button type="submit" variant={recommended ? "primary" : "secondary"} size="sm" className="w-full">
                      {ctx.tier === "free" ? "Activer" : "Switcher vers"} {tierLabel(t)}
                    </Button>
                  </form>
                  {t === "pro" && ctx.tier !== "pro" && !isTrialing && (
                    <form action={startCheckout}>
                      <input type="hidden" name="tier" value="pro" />
                      <input type="hidden" name="cycle" value={cycle} />
                      <input type="hidden" name="trial" value="1" />
                      <button
                        type="submit"
                        className="w-full text-xs px-3 py-1.5 rounded-md text-brand-500 border border-brand-500/30 hover:bg-brand-50 transition-colors duration-150 ease-out font-medium"
                      >
                        Essayer 14 jours gratuit
                      </button>
                    </form>
                  )}
                </div>
              )}
              {ctx.is_owner && !isCurrent && isFreeTier && ctx.subscription?.stripe_subscription_id && (
                <form action={openCustomerPortal}>
                  <Button type="submit" variant="secondary" size="sm" className="w-full">
                    Downgrade (via Stripe)
                  </Button>
                </form>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-ink-subtle mt-6">
        Paiement géré par Stripe (PCI-DSS). TVA UE auto-calculée. Carte test :{" "}
        <code className="font-mono">4242 4242 4242 4242</code> · 12/34 · 123.
        {" "}Annual = -20% sur le prix mensuel × 12. Trial Pro = 14 jours sans CB requise.
      </p>
    </Section>
  );
}
