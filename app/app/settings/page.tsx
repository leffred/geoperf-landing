import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TierBadge } from "@/components/saas/TierBadge";
import { loadSaasContext } from "@/lib/saas-auth";
import { updateProfile, changePassword, sendTestEmail } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Réglages — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  update_failed:    "Impossible de sauvegarder. Réessaie ou contacte le support.",
  pwd_too_short:    "Le mot de passe doit faire au moins 8 caractères.",
  pwd_mismatch:     "Les deux mots de passe ne correspondent pas.",
  pwd_failed:       "Impossible de changer le mot de passe. Réessaie.",
  test_free_tier:   "L'envoi d'email est réservé aux plans Starter et plus.",
  test_opt_out:     "Tes notifications email sont désactivées. Active la case ci-dessus puis sauvegarde avant de tester.",
  test_no_brand:    "Ajoute d'abord une marque pour pouvoir tester l'email.",
  test_no_snapshot: "Aucun snapshot completed — lance un snapshot puis re-teste.",
  test_insert_failed: "Impossible de créer l'alerte de test. Réessaie ou contacte le support.",
};

const FIELD_LABEL    = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1.5";
const FIELD_INPUT    = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";
const FIELD_DISABLED = "w-full text-sm bg-surface-2 px-3.5 py-2.5 rounded-md border border-DEFAULT text-ink-muted cursor-not-allowed";

type Props = { searchParams: Promise<{ saved?: string; error?: string; test_sent?: string; pwd_saved?: string }> };

export default async function SettingsPage({ searchParams }: Props) {
  const { saved, error, test_sent, pwd_saved } = await searchParams;
  const ctx = await loadSaasContext();
  const p = ctx.profile;
  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;
  const testCanSend = ctx.tier !== "free" && p?.email_notifs_enabled !== false;

  return (
    <Section py="md" tone="white">
      <div className="max-w-xl">
        <Eyebrow className="mb-2">Réglages</Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3 leading-tight">
          Mon compte
        </h1>
        <p className="text-sm text-ink-muted mb-8">
          <TierBadge tier={ctx.tier} /> — membre depuis{" "}
          {p?.created_at ? new Date(p.created_at).toLocaleDateString("fr-FR") : "—"}
        </p>

        {saved === "1" && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-success bg-emerald-50 px-4 py-3 text-sm text-success">
            Profil mis à jour.
          </div>
        )}
        {pwd_saved === "1" && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-success bg-emerald-50 px-4 py-3 text-sm text-success">
            Mot de passe mis à jour.
          </div>
        )}
        {test_sent === "1" && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
            Email de test déclenché. Vérifie ta boîte ({ctx.user.email}) dans 30s.
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
            {errorMsg}
          </div>
        )}

        {/* ── Informations personnelles ── */}
        <Card variant="default" className="mb-6">
          <form action={updateProfile} className="space-y-5">
            <Eyebrow className="mb-1">Informations personnelles</Eyebrow>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className={FIELD_LABEL}>Prénom</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  defaultValue={p?.first_name ?? ""}
                  autoComplete="given-name"
                  className={FIELD_INPUT}
                />
              </div>
              <div>
                <label htmlFor="last_name" className={FIELD_LABEL}>Nom</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  defaultValue={p?.last_name ?? ""}
                  autoComplete="family-name"
                  className={FIELD_INPUT}
                />
              </div>
            </div>

            <div>
              <label className={FIELD_LABEL}>Email</label>
              <input
                type="email"
                value={ctx.user.email ?? ""}
                disabled
                className={FIELD_DISABLED}
              />
              <p className="text-xs text-ink-subtle mt-1.5">Pour changer d&apos;email, contacte le support.</p>
            </div>

            <div>
              <label htmlFor="phone" className={FIELD_LABEL}>Téléphone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={p?.phone ?? ""}
                placeholder="+33 6 12 34 56 78"
                autoComplete="tel"
                className={FIELD_INPUT}
              />
            </div>

            <div>
              <label htmlFor="company" className={FIELD_LABEL}>Entreprise</label>
              <input
                id="company"
                name="company"
                type="text"
                defaultValue={p?.company ?? ""}
                className={FIELD_INPUT}
              />
            </div>

            {/* Language toggle */}
            <div>
              <label className={FIELD_LABEL}>Langue de l&apos;interface</label>
              <div className="flex gap-2">
                {(["fr", "en"] as const).map((lang) => (
                  <label key={lang} className="cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value={lang}
                      defaultChecked={(p?.language ?? "fr") === lang}
                      className="sr-only"
                    />
                    <span className={`flex items-center gap-1.5 px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                      (p?.language ?? "fr") === lang
                        ? "border-brand-500 bg-brand-50 text-brand-600"
                        : "border-DEFAULT text-ink-muted hover:border-strong"
                    }`}
                      style={{ pointerEvents: "none" }}
                    >
                      {lang === "fr" ? "🇫🇷 Français" : "🇬🇧 English"}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-ink-subtle mt-1.5">L&apos;interface bascule en anglais après rechargement.</p>
            </div>

            <div className="pt-3 border-t border-DEFAULT space-y-4">
              <Eyebrow className="mb-1">Notifications email</Eyebrow>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="email_notifs_enabled"
                  defaultChecked={p?.email_notifs_enabled !== false}
                  className="mt-1 w-4 h-4 accent-brand-500"
                />
                <span className="text-sm text-ink">
                  <span className="font-medium">Alertes en temps réel à <span className="font-mono text-xs">{ctx.user.email}</span></span>
                  <span className="block text-xs text-ink-muted mt-0.5">
                    rank_drop, rank_gain, competitor_overtake, competitor_emerged, new_source, citation_loss/gain.
                    {ctx.tier === "free" && " Réservé Starter+."}
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="digest_weekly_enabled"
                  defaultChecked={p?.digest_weekly_enabled !== false}
                  className="mt-1 w-4 h-4 accent-brand-500"
                />
                <span className="text-sm text-ink">
                  <span className="font-medium">Digest hebdo (lundi 8h CET)</span>
                  <span className="block text-xs text-ink-muted mt-0.5">
                    Résumé compact de la semaine.{ctx.tier === "free" && " Réservé Starter+."}
                  </span>
                </span>
              </label>
            </div>

            <Button type="submit" variant="primary" size="md">Sauvegarder</Button>
          </form>
        </Card>

        {/* ── Mot de passe ── */}
        <Card variant="default" className="mb-6">
          <form action={changePassword} className="space-y-5">
            <Eyebrow className="mb-1">Mot de passe</Eyebrow>
            <div>
              <label htmlFor="new_password" className={FIELD_LABEL}>Nouveau mot de passe</label>
              <input
                id="new_password"
                name="new_password"
                type="password"
                minLength={8}
                required
                autoComplete="new-password"
                placeholder="8 caractères minimum"
                className={FIELD_INPUT}
              />
            </div>
            <div>
              <label htmlFor="confirm_password" className={FIELD_LABEL}>Confirmer le mot de passe</label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                minLength={8}
                required
                autoComplete="new-password"
                placeholder="Répète le mot de passe"
                className={FIELD_INPUT}
              />
            </div>
            <Button type="submit" variant="secondary" size="md">Changer le mot de passe</Button>
          </form>
        </Card>

        {/* ── Test email ── */}
        <div className="pt-4 border-t border-DEFAULT">
          <Eyebrow className="mb-2">Tester la deliverability</Eyebrow>
          <p className="text-sm text-ink-muted mb-4">
            Crée une fausse alerte sur ton dernier snapshot pour vérifier que l&apos;email arrive bien.
          </p>
          <form action={sendTestEmail} className="flex items-center gap-3 flex-wrap">
            <Button type="submit" variant="secondary" size="md" disabled={!testCanSend}>
              Envoyer un email de test
            </Button>
            {!testCanSend && ctx.tier === "free" && (
              <span className="text-xs text-ink-muted">Upgrade vers Starter pour activer.</span>
            )}
            {!testCanSend && ctx.tier !== "free" && p?.email_notifs_enabled === false && (
              <span className="text-xs text-ink-muted">Active d&apos;abord les notifs ci-dessus.</span>
            )}
          </form>
        </div>
      </div>
    </Section>
  );
}
