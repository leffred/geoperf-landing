import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { TierBadge } from "@/components/saas/TierBadge";
import { loadSaasContext } from "@/lib/saas-auth";
import { updateProfile, sendTestEmail } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Réglages — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  update_failed: "Impossible de sauvegarder. Réessaie ou contacte le support.",
  test_free_tier: "L'envoi d'email est réservé aux plans Solo et plus. Upgrade pour activer les notifications.",
  test_opt_out: "Tes notifications email sont désactivées. Active la case ci-dessus puis sauvegarde avant de tester.",
  test_no_brand: "Ajoute d'abord une marque pour pouvoir tester l'email.",
  test_no_snapshot: "Aucun snapshot completed sur ta dernière marque — lance un snapshot puis re-teste.",
  test_insert_failed: "Impossible de créer l'alerte de test. Réessaie ou contacte le support.",
};

type Props = { searchParams: Promise<{ saved?: string; error?: string; test_sent?: string }> };

export default async function SettingsPage({ searchParams }: Props) {
  const { saved, error, test_sent } = await searchParams;
  const ctx = await loadSaasContext();
  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;
  const testCanSend = ctx.tier !== "free" && ctx.profile?.email_notifs_enabled !== false;

  return (
    <Section py="md" tone="cream">
      <div className="max-w-xl">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-2">Réglages</p>
        <h1 className="font-serif text-3xl text-navy mb-2">Mon compte</h1>
        <p className="text-sm text-ink-muted mb-6">
          <TierBadge tier={ctx.tier} /> — membre depuis {ctx.profile?.created_at ? new Date(ctx.profile.created_at).toLocaleDateString("fr-FR") : "—"}
        </p>

        {saved === "1" && (
          <div className="mb-4 px-4 py-3 bg-amber/20 border-l-2 border-amber text-sm text-navy">
            Profil mis à jour.
          </div>
        )}
        {test_sent === "1" && (
          <div className="mb-4 px-4 py-3 bg-amber/20 border-l-2 border-amber text-sm text-navy">
            Email de test déclenché. Vérifie ta boîte ({ctx.user.email}) dans 30s. L&apos;alerte apparaît aussi dans <a href="/app/alerts" className="underline">tes alertes</a>.
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">{errorMsg}</div>
        )}

        <form action={updateProfile} className="bg-white p-6 space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Email</label>
            <input
              type="email"
              value={ctx.user.email ?? ""}
              disabled
              className="w-full text-sm bg-cream/50 px-3 py-2.5 border border-navy/10 text-ink-muted"
            />
            <p className="text-xs text-ink-muted mt-1">Pour changer d&apos;email, contacte le support.</p>
          </div>

          <div>
            <label htmlFor="full_name" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Nom complet</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              defaultValue={ctx.profile?.full_name ?? ""}
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Entreprise</label>
            <input
              id="company"
              name="company"
              type="text"
              defaultValue={ctx.profile?.company ?? ""}
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none"
            />
          </div>

          <div className="pt-3 border-t border-navy/10">
            <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">Notifications email</p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="email_notifs_enabled"
                defaultChecked={ctx.profile?.email_notifs_enabled !== false}
                className="mt-1 w-4 h-4 accent-navy"
              />
              <span className="text-sm text-ink">
                <span className="font-medium">Recevoir les alertes par email à <span className="font-mono text-xs">{ctx.user.email}</span></span>
                <span className="block text-xs text-ink-muted mt-0.5">
                  rank_drop, rank_gain, competitor_overtake, new_source, citation_loss/gain.
                  {ctx.tier === "free" && " Réservé aux plans Solo et plus — actuellement Free, donc aucun email envoyé."}
                </span>
              </span>
            </label>
          </div>

          <button type="submit" className="bg-navy text-white px-6 py-2.5 text-sm font-medium hover:bg-navy-light transition">
            Sauvegarder
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-navy/10">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-2">Tester la deliverability</p>
          <p className="text-sm text-ink-muted mb-3">
            Crée une fausse alerte sur ton dernier snapshot pour vérifier que l&apos;email arrive bien dans ta boîte (et pas en spam).
          </p>
          <form action={sendTestEmail}>
            <button
              type="submit"
              disabled={!testCanSend}
              className="bg-cream border border-navy/20 text-navy px-4 py-2 text-sm font-medium hover:bg-navy/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Envoyer un email de test
            </button>
            {!testCanSend && ctx.tier === "free" && (
              <span className="ml-3 text-xs text-ink-muted">Upgrade vers Solo pour activer.</span>
            )}
            {!testCanSend && ctx.tier !== "free" && ctx.profile?.email_notifs_enabled === false && (
              <span className="ml-3 text-xs text-ink-muted">Active d&apos;abord les notifs ci-dessus.</span>
            )}
          </form>
        </div>
      </div>
    </Section>
  );
}
