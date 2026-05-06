import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Limite atteinte — Geoperf",
  robots: { index: false, follow: false },
};

export default function LimitReachedPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header logo="etudes" />

      <Section py="lg" tone="white">
        <div className="max-w-2xl">
          <Eyebrow className="mb-3">Limite atteinte</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink mb-5 leading-tight text-balance">
            Vous avez déjà téléchargé un rapport ce mois-ci.
          </h1>
          <p className="text-base text-ink-muted leading-relaxed mb-4">
            Pour limiter les abus, nous autorisons un seul rapport sectoriel différent par
            adresse email tous les 30 jours.
          </p>
          <p className="text-base text-ink-muted leading-relaxed mb-8">
            Si vous avez besoin d&apos;accéder à plusieurs études sans cette limite, créez
            un <strong className="text-ink">compte Geoperf SaaS</strong> — c&apos;est
            gratuit et permanent, sans carte bancaire.
          </p>

          <div className="bg-surface border border-DEFAULT rounded-lg p-6 mb-6 border-l-2 border-l-brand-500">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-3">
              Compte Geoperf gratuit — vos avantages
            </p>
            <ul className="space-y-3 text-sm text-ink leading-relaxed">
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  Accès illimité à toutes les études sectorielles publiées (5 disponibles à
                  ce jour, +1-2 / mois).
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  Monitoring continu de <strong>votre propre marque</strong> sur ChatGPT
                  (plan Free : 30 prompts mensuels).
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  Recommandations actionnables après chaque snapshot — sources à cibler,
                  gaps de contenu, alertes.
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>Sans carte bancaire, sans engagement, données hébergées Frankfurt (UE).</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/signup?source=etude_limit" variant="primary" size="md">
              Créer mon compte gratuit
            </Button>
            <Button href="/saas" variant="secondary" size="md">
              Voir les plans payants
            </Button>
            <Button href="/contact" variant="secondary" size="md">
              Nous contacter
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
