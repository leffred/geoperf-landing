import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { TierBadge } from "@/components/saas/TierBadge";
import { loadSaasContext, tierLabel, TIER_LIMITS, type SaasTier } from "@/lib/saas-auth";
import { isDemoMode } from "@/lib/demo-mode";
import { priceDisplay, TIERS as PRICING_TIERS, fmtHT, type TierKey } from "@/lib/saas-pricing";
import { startCheckout, openCustomerPortal } from "./actions";
import { GtmPageEvent } from "@/components/gtm/GtmPageEvent";

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

type Props = { searchParams: Promise<{ error?: string; success?: string; session_id?: string; canceled?: string; cycle?: string }> };

export default async function BillingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const ctx = await loadSaasContext();
  const demo = await isDemoMode();
  const errorMsg = sp.error ? ERROR_LABELS[sp.error] || "Erreur." : null;
  const limits = ctx.limits;
  const cycle: "monthly" | "annual" = sp.cycle === "annual" ? "annual" : "monthly";

  const currentTierKey: Exclude<SaasTier, "solo"> = ctx.tier === "solo" ? "starter" : (ctx.tier as Exclude<SaasTier, "solo">);

  // Détecte trial actif (Stripe synchronise via saas_subscriptions.status='trialing')
  // S16 : type SaasSubStatus inclut désormais 'trialing', plus besoin de cast.
  const isTrialing = ctx.subscription?.status === "trialing";
  const trialEnd = ctx.subscription?.current_period_end ? new Date(ctx.subscription.current_period_end) : null;
  const trialDaysLeft = isTrialing && trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 86400000)) : 0;

  // S17 §4.9 : pricing canonique via lib/saas-pricing.ts (TIERS constants partagés).

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
        <>
          <GtmPageEvent event="subscription_active" dedupKey={`subscription_active_${sp.session_id ?? ""}`} params={{ session_id: sp.session_id }} />
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-success bg-emerald-50 px-4 py-3 text-sm text-success">
            Paiement validé. Votre plan sera actif d&apos;ici quelques instants.
          </div>
        </>
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

      {ctx.is_owner && ctx.subscription?.stripe_subscription_id && !demo && (
        <form action={openCustomerPortal} className="mb-10">
          <Button type="submit" variant="primary" size="md">Gérer mon abonnement (Stripe)</Button>
          <span className="ml-3 text-xs text-ink-muted">
            Cancel, upgrade, downgrade, factures — tout depuis le portail Stripe.
          </span>
        </form>
      )}

      {demo && (
        <div className="mb-10 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
          <strong>Mode démo</strong> · Le compte démo est en plan <strong>Pro</strong> permanent. Toutes les fonctionnalités sont débloquées en lecture seule. Pour utiliser Geoperf sur ta marque, <a href="/signup" className="underline hover:text-brand-700">crée ton compte gratuit</a>.
        </div>
      )}

      {!ctx.is_owner && (
        <p className="text-sm text-ink-muted mb-10">
          La gestion d&apos;abonnement est réservée au propriétaire du compte.
        </p>
      )}

      <div className="flex items-baseline justify-between mb-2 flex-wrap gap-3">
        <Eyebrow>5 plans · facturation {cycle === "annual" ? "annuelle (3 mois offerts)" : "mensuelle"}</Eyebrow>
        <div className="inline-flex rounded-md bg-surface p-1 text-xs">
          <Link
            href="/app/billing"
            className={`px-3 py-1.5 rounded-md transition-colors duration-150 ease-out ${cycle === "monthly" ? "bg-white text-ink shadow-card font-medium" : "text-ink-muted hover:text-ink"}`}
          >
            Mensuel
          </Link>
          <Link
            href="/app/billing?cycle=annual"
            className={`px-3 py-1.5 rounded-md transition-colors duration-150 ease-out ${cycle === "annual" ? "bg-white text-ink shadow-card font-medium" : "text-ink-muted hover:text-ink"}`}
          >
            Annuel
          </Link>
        </div>
      </div>
      {cycle === "annual" && (
        <p className="text-xs text-success mb-4 font-mono">Économisez 25% — 3 mois offerts sur tous les plans payants.</p>
      )}

      <p className="text-xs text-ink-muted mb-4 max-w-3xl">
        En souscrivant, vous acceptez les <a href="/terms" className="text-brand-500 underline hover:text-brand-600">Conditions Générales</a>{" "}
        et la <a href="/privacy" className="text-brand-500 underline hover:text-brand-600">Politique de Confidentialité</a>.
        Vos données de paiement sont traitées par <strong>Stripe</strong> (PCI-DSS) ; les données SaaS sont stockées sur{" "}
        <strong>Supabase Frankfurt (UE)</strong>.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {ORDER.map(t => {
          const isCurrent = t === currentTierKey;
          const features = TIER_FEATURES[t];
          const recommended = t === "growth";
          const isFreeTier = t === "free";
          const price = isFreeTier ? null : priceDisplay(t as Exclude<TierKey, "free">, cycle);
          // Affichage prix : extrait juste le montant numérique (ex: "59" depuis "59€ HT/mois")
          const priceMain = isFreeTier ? "0" : String(Math.round(PRICING_TIERS[t as Exclude<TierKey, "free">][cycle === "monthly" ? "monthly_ht" : "yearly_eq_mo_ht"] / 100));
          return (
            <div
              key={t}
              className={`relative rounded-lg p-5 transition-all duration-150 ease-out ${
                isCurrent
                  ? "bg-ink text-white shadow-card"
                  : recommended
                    ? "bg-white ring-2 ring-brand-500 shadow-cardHover"
                    : "bg-white border border-DEFAULT shadow-card hover:shadow-cardHover"
              }`}
            >
              {!isFreeTier && cycle === "annual" && !isCurrent && (
                <span className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-eyebrow bg-brand-50 text-brand-600 px-2 py-0.5 rounded">
                  3 mois offerts
                </span>
              )}
              <div className="flex items-baseline justify-between mb-3">
                <TierBadge tier={t} size="md" />
                {isCurrent && (
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow opacity-70">Actuel</span>
                )}
                {recommended && !isCurrent && cycle === "monthly" && (
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-brand-500">Recommandé</span>
                )}
              </div>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-4xl font-medium tracking-tight tabular-nums">{priceMain}</span>
                <span className={`text-sm ${isCurrent ? "opacity-70" : "text-ink-muted"}`}>€ HT/mois</span>
              </div>
              {!isFreeTier && (
                <>
                  <p className={`text-[11px] mb-1 ${isCurrent ? "opacity-70" : "text-ink-subtle"}`}>
                    {price!.secondary}
                  </p>
                  {price!.savingHint && (
                    <p className={`text-[11px] mb-3 font-medium ${isCurrent ? "text-brand-500" : "text-success"}`}>
                      {price!.savingHint}
                    </p>
                  )}
                  {!price!.savingHint && <div className="mb-3" />}
                </>
              )}
              {isFreeTier && (
                <p className={`text-[11px] mb-4 ${isCurrent ? "opacity-70" : "text-ink-subtle"}`}>Sans CB · à vie</p>
              )}
              <ul className={`text-xs space-y-1.5 mb-5 ${isCurrent ? "" : "text-ink"}`}>
                {features.map(f => (
                  <li key={f} className="flex items-baseline gap-2">
                    <span className={isCurrent ? "text-white/60" : "text-brand-500"}>·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {ctx.is_owner && !isCurrent && !isFreeTier && !demo && (
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
              {ctx.is_owner && !isCurrent && isFreeTier && ctx.subscription?.stripe_subscription_id && !demo && (
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
        Prix HT, TVA française 20% calculée automatiquement par Stripe (autoliquidation pour clients UE assujettis).
        Annuel = équivalent à 9 mois facturés (3 mois offerts vs mensuel).
        Trial Pro = 14 jours sans CB requise.
      </p>
    </Section>
  );
}
