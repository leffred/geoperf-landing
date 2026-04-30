import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
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

type Props = { searchParams: Promise<{ error?: string; check_email?: string; source?: string; category?: string; invitation_token?: string; email?: string }> };

export default async function SignupPage({ searchParams }: Props) {
  const { error, check_email, source, category, invitation_token, email: prefilledEmail } = await searchParams;
  const errorMsg = error ? ERROR_LABELS[error] || ERROR_LABELS.unknown : null;
  const checkEmail = check_email === "1";
  const isEtude = source === "etude";
  const isInvitation = !!invitation_token;

  let title = "Suivre ma marque dans les LLM";
  let subtitle = "Plan gratuit : 1 marque, 1 LLM, snapshot mensuel. Upgrade à tout moment.";
  let eyebrow = "CRÉER UN COMPTE";

  if (isInvitation) {
    title = "Rejoindre l'équipe";
    subtitle = "Tu as été invité à rejoindre un compte Geoperf. Crée ton accès personnel ci-dessous — tu seras automatiquement ajouté à l'équipe après vérification.";
    eyebrow = "INVITATION";
  } else if (isEtude) {
    title = "Recevoir l'étude sectorielle gratuite";
    subtitle = "Crée ton compte gratuit. Une fois connecté, tu recevras automatiquement l'étude sectorielle correspondant à ton secteur en plus de ton dashboard de monitoring.";
    eyebrow = "ÉTUDE GRATUITE + COMPTE";
  }

  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Header rightSlot={<Link href="/login" className="font-mono text-xs text-ink-muted hover:text-navy">Déjà un compte ?</Link>} />

      <Section py="lg" tone="cream">
        <div className="max-w-md mx-auto bg-white border border-navy/10 p-8">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">{eyebrow}</p>
          <h1 className="font-serif text-2xl text-navy mb-2">{title}</h1>
          <p className="text-sm text-ink-muted mb-6">{subtitle}</p>

          {errorMsg && (
            <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">{errorMsg}</div>
          )}
          {checkEmail && !errorMsg && (
            <div className="mb-4 px-4 py-3 bg-amber/20 border-l-2 border-amber text-sm text-navy">
              Email envoyé — clique sur le lien dans ta boîte de réception pour valider ton compte.
            </div>
          )}

          <form action={signup} className="space-y-4">
            {source && <input type="hidden" name="source" value={source} />}
            {category && <input type="hidden" name="category" value={category} />}
            {invitation_token && <input type="hidden" name="invitation_token" value={invitation_token} />}
            <div>
              <label htmlFor="full_name" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Nom complet</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none"
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Entreprise (optionnel)</label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Email professionnel</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                autoFocus={!prefilledEmail}
                defaultValue={prefilledEmail || ""}
                readOnly={isInvitation}
                className={`w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none ${isInvitation ? "opacity-70 cursor-not-allowed" : ""}`}
              />
              {isInvitation && (
                <p className="text-xs text-ink-muted mt-1">L&apos;email est verrouillé sur l&apos;invitation. Pour utiliser un autre email, demande une nouvelle invitation.</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Mot de passe (8+ caractères)</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-navy text-white py-2.5 text-sm font-medium hover:bg-navy-light transition"
            >
              {isInvitation ? "Créer mon compte et rejoindre l'équipe" : isEtude ? "Créer mon compte et recevoir l'étude" : "Créer mon compte gratuit"}
            </button>
          </form>

          <p className="mt-4 text-xs text-ink-muted">
            En créant un compte, tu acceptes nos <Link href="/terms" className="underline">CGU</Link> et notre{" "}
            <Link href="/privacy" className="underline">politique de confidentialité</Link>.
          </p>
        </div>
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
