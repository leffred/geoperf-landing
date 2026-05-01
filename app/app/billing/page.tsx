import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { TierBadge } from "@/components/saas/TierBadge";
import { loadSaasContext, tierLimits, tierLabel, TIER_LIMITS, type SaasTier } from "@/lib/saas-auth";
import { startCheckout, openCustomerPortal } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Abonnement — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  bad_tier: "Tier invalide.",
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
    "✨ Sentiment analysis (Brand Health)",
  ],
  pro: [
    "3 marques", "6 LLMs (+ Mistral, Grok)", "200 prompts / marque",
    "Topics illimités", "Seats illimités",
    "Tout Growth + Sentiment",
    "✨ Brand Alignment (gap keywords / value props)",
    "✨ Content Studio (10 drafts/mois)",
    "Matrice concurrentielle",
  ],
  agency: [
    "10 marques", "7 LLMs (+ Llama)", "300 prompts / marque",
    "Topics illimités", "Seats illimités",
    "Tout Pro + Content Studio illimité",
    "White-label + support prioritaire",
  ],
};

const ORDER: Array<Exclude<SaasTier, "solo">> = ["free", "starter", "growth", "pro", "agency"];

type Props = { searchParams: Promise<{ error?: string; success?: string; canceled?: string }> };

export default async function BillingPage({ searchParams }: Props) {
  const { error, success, canceled } = await searchParams;
  const ctx = await loadSaasContext();
  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;
  const limits = ctx.limits;

  // Resolve current tier label (legacy 'solo' affiché comme 'starter')
  const currentTierKey: Exclude<SaasTier, "solo"> = ctx.tier === "solo" ? "starter" : (ctx.tier as Exclude<SaasTier, "solo">);

  return (
    <Section py="md" tone="cream">
      <div className="mb-6">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-2">Abonnement</p>
        <h1 className="font-serif text-3xl text-navy mb-2">Plan actuel</h1>
        <div className="flex items-baseline gap-3 flex-wrap">
          <TierBadge tier={ctx.tier} size="md" />
          <span className="text-sm text-ink-muted">
            {ctx.tier === "free" ? "0€/mois" : `${limits.price_eur}€/mois HT`}
          </span>
          {ctx.subscription?.current_period_end && (
            <span className="text-xs text-ink-muted">
              · renouvellement {new Date(ctx.subscription.current_period_end).toLocaleDateString("fr-FR")}
              {ctx.subscription.cancel_at_period_end && " (résiliation programmée)"}
            </span>
          )}
          {!ctx.is_owner && (
            <span className="text-xs text-ink-muted italic">
              · Tu es membre du compte de <strong>{ctx.owner_profile?.email ?? "?"}</strong>
            </span>
          )}
        </div>
      </div>

      {success === "true" && (
        <div className="mb-4 px-4 py-3 bg-amber/20 border-l-2 border-amber text-sm text-navy">
          Paiement reçu. Ton plan se met à jour dans quelques secondes (synchro Stripe → Supabase via webhook).
        </div>
      )}
      {canceled === "true" && (
        <div className="mb-4 px-4 py-3 bg-cream border-l-2 border-navy/20 text-sm text-ink-muted">
          Checkout annulé. Tu peux relancer quand tu veux.
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">{errorMsg}</div>
      )}

      {ctx.is_owner && ctx.subscription?.stripe_subscription_id && (
        <form action={openCustomerPortal} className="mb-8">
          <button type="submit" className="bg-navy text-white px-4 py-2 text-sm font-medium hover:bg-navy-light transition">
            Gérer mon abonnement (Stripe)
          </button>
          <span className="ml-3 text-xs text-ink-muted">
            Cancel, upgrade, downgrade, factures — tout depuis le portail Stripe.
          </span>
        </form>
      )}

      {!ctx.is_owner && (
        <p className="text-sm text-ink-muted mb-8">
          La gestion d&apos;abonnement est réservée au propriétaire du compte.
        </p>
      )}

      <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-4">5 plans</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {ORDER.map(t => {
          const isCurrent = t === currentTierKey;
          const tLimits = TIER_LIMITS[t];
          const features = TIER_FEATURES[t];
          const recommended = t === "growth";
          return (
            <div
              key={t}
              className={`p-5 ${isCurrent ? "bg-navy text-white" : "bg-white"} ${recommended && !isCurrent ? "ring-2 ring-amber" : ""}`}
            >
              <div className="flex items-baseline justify-between mb-3">
                <TierBadge tier={t} size="md" />
                {isCurrent && <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">Actuel</span>}
                {recommended && !isCurrent && <span className="font-mono text-[10px] uppercase tracking-widest text-amber">Recommandé</span>}
              </div>
              <div className="mb-4">
                <span className="font-serif text-3xl font-medium">{tLimits.price_eur}</span>
                <span className={`text-sm ml-1 ${isCurrent ? "opacity-70" : "text-ink-muted"}`}>€/mois HT</span>
              </div>
              <ul className={`text-xs space-y-1.5 mb-5 ${isCurrent ? "" : "text-ink"}`}>
                {features.map(f => (
                  <li key={f} className="flex items-baseline gap-2">
                    <span className="text-amber">·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {ctx.is_owner && !isCurrent && t !== "free" && (
                <form action={startCheckout}>
                  <input type="hidden" name="tier" value={t} />
                  <button type="submit" className={`w-full py-2 text-sm font-medium transition ${recommended ? "bg-amber text-navy hover:bg-amber/90" : "bg-navy text-white hover:bg-navy-light"}`}>
                    {ctx.tier === "free" ? "Activer" : "Switcher vers"} {tierLabel(t)}
                  </button>
                </form>
              )}
              {ctx.is_owner && !isCurrent && t === "free" && ctx.subscription?.stripe_subscription_id && (
                <form action={openCustomerPortal}>
                  <button type="submit" className="w-full bg-cream border border-navy/15 text-navy py-2 text-sm font-medium hover:bg-navy/5 transition">
                    Downgrade (via Stripe)
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-ink-muted mt-6">
        Paiement géré par Stripe (PCI-DSS). TVA UE auto-calculée. Carte test : <code className="font-mono">4242 4242 4242 4242</code> · 12/34 · 123.
      </p>
    </Section>
  );
}
