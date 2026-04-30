import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { login, sendMagicLink } from "./actions";

export const metadata: Metadata = {
  title: "Connexion — Geoperf",
  description: "Connecte-toi à ton dashboard de monitoring LLM.",
};

const ERROR_LABELS: Record<string, string> = {
  missing: "Email et mot de passe requis.",
  invalid: "Identifiants invalides.",
  unknown: "Une erreur est survenue. Réessaie.",
};

type Props = { searchParams: Promise<{ error?: string; next?: string; magic_sent?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error, next, magic_sent } = await searchParams;
  const errorMsg = error ? ERROR_LABELS[error] || ERROR_LABELS.unknown : null;
  const magicSent = magic_sent === "1";

  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Header rightSlot={<Link href="/signup" className="font-mono text-xs text-ink-muted hover:text-navy">Pas de compte ?</Link>} />

      <Section py="lg" tone="cream">
        <div className="max-w-md mx-auto bg-white border border-navy/10 p-8">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">CONNEXION</p>
          <h1 className="font-serif text-2xl text-navy mb-6">Bon retour</h1>

          {errorMsg && (
            <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">{errorMsg}</div>
          )}
          {magicSent && !errorMsg && (
            <div className="mb-4 px-4 py-3 bg-amber/20 border-l-2 border-amber text-sm text-navy">
              Lien magique envoyé — vérifie ta boîte de réception.
            </div>
          )}

          <form action={login} className="space-y-4">
            <input type="hidden" name="next" value={next || "/app/dashboard"} />

            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-navy text-white py-2.5 text-sm font-medium hover:bg-navy-light transition"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-navy/10">
            <p className="text-xs font-mono uppercase tracking-widest text-ink-muted mb-2">Ou par lien magique</p>
            <form action={sendMagicLink}>
              <input
                name="email"
                type="email"
                required
                placeholder="ton.email@société.com"
                className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none mb-2"
              />
              <button type="submit" className="w-full bg-cream border border-navy/15 text-navy py-2 text-sm font-medium hover:bg-navy/5 transition">
                Recevoir un lien par email
              </button>
            </form>
          </div>
        </div>
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
