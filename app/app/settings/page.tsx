import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TierBadge } from "@/components/saas/TierBadge";
import { loadSaasContext } from "@/lib/saas-auth";
import { updateProfile, sendTestEmail } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Réglages — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  update_failed: "Impossible de sauvegarder. Réessaie ou contacte le support.",
  test_free_tier: "L'envoi d'email est réservé aux plans Starter et plus. Upgrade pour activer les notifications.",
  test_opt_out: "Tes notifications email sont désactivées. Active la case ci-dessus puis sauvegarde avant de tester.",
  test_no_brand: "Ajoute d'abord une marque pour pouvoir tester l'email.",
  test_no_snapshot: "Aucun snapshot completed sur ta dernière marque — lance un snapshot puis re-teste.",
  test_insert_failed: "Impossible de créer l'alerte de test. Réessaie ou contacte le support.",
};

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1.5";
const FIELD_INPUT = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";
const FIELD_INPUT_DISABLED = "w-full text-sm bg-surface-2 px-3.5 py-2.5 rounded-md border border-DEFAULT text-ink-muted cursor-not-allowed";

type Props = { searchParams: Promise<{ saved?: string; error?: string; test_sent?: string }> };

export default async function SettingsPage({ searchParams }: Props) {
  const { saved, error, test_sent } = await searchParams;
  const ctx = await loadSaasContext();
  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;
  const testCanSend = ctx.tier !== "free" && ctx.profile?.email_notifs_enabled !== false;

  return (
    <Section py="md" tone="white">
      <div className="max-w-xl">
        <Eyebrow className="mb-2">Réglages</Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3 leading-tight">
          Mon compte
        </h1>
        <p className="text-sm text-ink-muted mb-8">
          <TierBadge tier={ctx.tier} /> — membre depuis{" "}
          {ctx.profile?.created_at ? new Date(ctx.profile.created_at).toLocaleDateString("fr-FR") : "—"}
        </p>

        {saved === "1" && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-success bg-emerald-50 px-4 py-3 text-sm text-success">
            Profil mis à jour.
          </div>
        )}
        {test_sent === "1" && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
            Email de test déclenché. Vérifie ta boîte ({ctx.user.email}) dans 30s. L&apos;alerte apparaît aussi dans{" "}
            <a href="/app/alerts" className="underline">tes alertes</a>.
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
            {errorMsg}
          </div>
        )}

        <Card variant="default">
          <form action={updateProfile} className="space-y-5">
            <div>
              <label className={FIELD_LABEL}>Email</label>
              <input
                type="email"
                value={ctx.user.email ?? ""}
                disabled
                className={FIELD_INPUT_DISABLED}
              />
              <p className="text-xs text-ink-subtle mt-1.5">Pour changer d&apos;email, contacte le support.</p>
            </div>

            <div>
              <label htmlFor="full_name" className={FIELD_LABEL}>Nom complet</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                defaultValue={ctx.profile?.full_name ?? ""}
                className={FIELD_INPUT}
              />
            </div>

            <div>
              <label htmlFor="company" className={FIELD_LABEL}>Entreprise</label>
              <input
                id="company"
                name="company"
                type="text"
                defaultValue={ctx.profile?.company ?? ""}
                className={FIELD_INPUT}
              />
            </div>

            <div className="pt-3 border-t border-DEFAULT space-y-4">
              <Eyebrow className="mb-1">Notifications email</Eyebrow>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="email_notifs_enabled"
                  defaultChecked={ctx.profile?.email_notifs_enabled !== false}
                  className="mt-1 w-4 h-4 accent-brand-500"
                />
                <span className="text-sm text-ink">
                  <span className="font-medium">
                    Recevoir les alertes par email à <span className="font-mono text-xs">{ctx.user.email}</span>
                  </span>
                  <span className="block text-xs text-ink-muted mt-0.5">
                    rank_drop, rank_gain, competitor_overtake, competitor_emerged, new_source, citation_loss/gain.
                    {ctx.tier === "free" && " Réservé aux plans Starter et plus — actuellement Free, donc aucun email envoyé."}
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="digest_weekly_enabled"
                  defaultChecked={ctx.profile?.digest_weekly_enabled !== false}
                  className="mt-1 w-4 h-4 accent-brand-500"
                />
                <span className="text-sm text-ink">
                  <span className="font-medium">
                    Recevoir le digest hebdo (lundi 8h CET)
                  </span>
                  <span className="block text-xs text-ink-muted mt-0.5">
                    Résumé compact de la semaine : visibility delta, top concurrents qui montent, action recommandée.
                    {ctx.tier === "free" && " Réservé aux plans Starter et plus."}
                  </span>
                </span>
              </label>
            </div>

            <Button type="submit" variant="primary" size="md">Sauvegarder</Button>
          </form>
        </Card>

        <div className="mt-10 pt-8 border-t border-DEFAULT">
          <Eyebrow className="mb-2">Tester la deliverability</Eyebrow>
          <p className="text-sm text-ink-muted mb-4">
            Crée une fausse alerte sur ton dernier snapshot pour vérifier que l&apos;email arrive bien dans ta boîte (et pas en spam).
          </p>
          <form action={sendTestEmail} className="flex items-center gap-3 flex-wrap">
            <Button type="submit" variant="secondary" size="md" disabled={!testCanSend}>
              Envoyer un email de test
            </Button>
            {!testCanSend && ctx.tier === "free" && (
              <span className="text-xs text-ink-muted">Upgrade vers Starter pour activer.</span>
            )}
            {!testCanSend && ctx.tier !== "free" && ctx.profile?.email_notifs_enabled === false && (
              <span className="text-xs text-ink-muted">Active d&apos;abord les notifs ci-dessus.</span>
            )}
          </form>
        </div>
      </div>
    </Section>
  );
}
