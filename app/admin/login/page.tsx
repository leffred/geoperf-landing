import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Admin login — Geoperf",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ error?: string; next?: string }> };

const ERROR_LABELS: Record<string, string> = {
  missing: "Email et mot de passe requis.",
  invalid: "Identifiants invalides.",
  unknown: "Une erreur est survenue. Réessaie.",
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error, next } = await searchParams;
  const errorMsg = error ? ERROR_LABELS[error] || ERROR_LABELS.unknown : null;

  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Header rightSlot={<span className="font-mono text-xs text-ink-muted">ADMIN</span>} />

      <Section py="lg" tone="cream">
        <div className="max-w-md mx-auto bg-white border border-navy/10 p-8">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">SECTION 01</p>
          <h1 className="font-serif text-2xl text-navy mb-6">Connexion admin</h1>

          {errorMsg && (
            <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">
              {errorMsg}
            </div>
          )}

          <form action={login} className="space-y-4">
            <input type="hidden" name="next" value={next || "/admin"} />

            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">
                Email
              </label>
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
              <label htmlFor="password" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">
                Mot de passe
              </label>
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

          <p className="mt-6 text-xs text-ink-muted">
            Réservé aux administrateurs Geoperf. Si tu as oublié ton mot de passe, ré-initialise depuis le dashboard Supabase.
          </p>
        </div>
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
