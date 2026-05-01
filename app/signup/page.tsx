import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { signup } from "./actions";

export const metadata: Metadata = {
  title: "Créer un compte — Geoperf",
  description: "Inscris-toi gratuitement pour suivre la visibilité de ta marque dans les LLM.",
};

const ERROR_LABELS: Record<string, string> = {
  missing: "Email et mot de passe requis.",
  password_too_short: "Le mot de passe doit faire au moins 8 caractères.",
  exists: "Un compte existe déjà avec cet email — connecte-toi à la place.",
  unknown: "Une erreur est survenue. Réessaie.",
};

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1.5";
const FIELD_INPUT = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";

type Props = { searchParams: Promise<{ error?: string; check_email?: string; source?: string; category?: string; invitation_token?: string; email?: string }> };

export default async function SignupPage({ searchParams }: Props) {
  const { error, check_email, source, category, invitation_token, email: prefilledEmail } = await searchParams;
  const errorMsg = error ? ERROR_LABELS[error] || ERROR_LABELS.unknown : null;
  const checkEmail = check_email === "1";
  const isEtude = source === "etude";
  const isInvitation = !!invitation_token;

  let title = "Suivre ma marque dans les LLM";
  let subtitle = "Plan gratuit : 1 marque, 1 LLM, snapshot mensuel. Upgrade à tout moment.";
  let eyebrow = "Créer un compte";

  if (isInvitation) {
    title = "Rejoindre l'équipe";
    subtitle = "Tu as été invité à rejoindre un compte Geoperf. Crée ton accès personnel ci-dessous — tu seras automatiquement ajouté à l'équipe après vérification.";
    eyebrow = "Invitation";
  } else if (isEtude) {
    title = "Recevoir l'étude sectorielle gratuite";
    subtitle = "Crée ton compte gratuit. Une fois connecté, tu recevras automatiquement l'étude sectorielle correspondant à ton secteur en plus de ton dashboard de monitoring.";
    eyebrow = "Étude gratuite + compte";
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header
        rightSlot={
          <Link href="/login" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">
            Déjà un compte ?
          </Link>
        }
      />

      <Section py="lg" tone="surface">
        <div className="max-w-md mx-auto">
          <Card variant="default" className="p-8">
            <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-ink mb-3 leading-tight">
              {title}
            </h1>
            <p className="text-sm text-ink-muted mb-6 leading-relaxed">{subtitle}</p>

            {errorMsg && (
              <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
                {errorMsg}
              </div>
            )}
            {checkEmail && !errorMsg && (
              <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
                Email envoyé — clique sur le lien dans ta boîte de réception pour valider ton compte.
              </div>
            )}

            <form action={signup} className="space-y-4">
              {source && <input type="hidden" name="source" value={source} />}
              {category && <input type="hidden" name="category" value={category} />}
              {invitation_token && <input type="hidden" name="invitation_token" value={invitation_token} />}
              <div>
                <label htmlFor="full_name" className={FIELD_LABEL}>Nom complet</label>
                <input id="full_name" name="full_name" type="text" autoComplete="name" className={FIELD_INPUT} />
              </div>
              <div>
                <label htmlFor="company" className={FIELD_LABEL}>Entreprise (optionnel)</label>
                <input id="company" name="company" type="text" autoComplete="organization" className={FIELD_INPUT} />
              </div>
              <div>
                <label htmlFor="email" className={FIELD_LABEL}>Email professionnel</label>
                <input
                  id="email" name="email" type="email" required autoComplete="email"
                  autoFocus={!prefilledEmail}
                  defaultValue={prefilledEmail || ""}
                  readOnly={isInvitation}
                  className={`${FIELD_INPUT} ${isInvitation ? "opacity-70 cursor-not-allowed bg-surface-2" : ""}`}
                />
                {isInvitation && (
                  <p className="text-xs text-ink-subtle mt-1.5">
                    L&apos;email est verrouillé sur l&apos;invitation. Pour utiliser un autre email, demande une nouvelle invitation.
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="password" className={FIELD_LABEL}>Mot de passe (8+ caractères)</label>
                <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className={FIELD_INPUT} />
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full">
                {isInvitation ? "Créer mon compte et rejoindre l'équipe" : isEtude ? "Créer mon compte et recevoir l'étude" : "Créer mon compte gratuit"}
              </Button>
            </form>

            <p className="mt-5 text-xs text-ink-subtle">
              En créant un compte, tu acceptes nos <Link href="/terms" className="text-brand-500 hover:underline">CGU</Link> et notre{" "}
              <Link href="/privacy" className="text-brand-500 hover:underline">politique de confidentialité</Link>.
            </p>
          </Card>
        </div>
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
