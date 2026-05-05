import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Étude en cours de génération — Geoperf",
  robots: { index: false, follow: false },
};

export default async function PendingPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; sous_cat?: string }>;
}) {
  const sp = await searchParams;
  const email = sp.email ?? "votre email";
  const sousCat = sp.sous_cat ?? "demandée";

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <Section py="lg" tone="white">
        <div className="max-w-2xl">
          <Eyebrow className="mb-3">Étude en cours de génération</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink mb-5 leading-tight text-balance">
            Cette étude n&apos;est pas encore disponible.
          </h1>
          <p className="text-base text-ink-muted leading-relaxed mb-4">
            Nous venons de lancer la génération de l&apos;étude{" "}
            <strong className="text-ink">{sousCat}</strong>. Elle prend généralement
            24-48 heures (interrogation des 4 LLM + analyse + rendu PDF).
          </p>
          <p className="text-base text-ink-muted leading-relaxed mb-8">
            Vous serez notifié·e par email à <strong className="text-ink">{email}</strong>{" "}
            dès qu&apos;elle sera prête. Aucune action de votre part n&apos;est requise.
          </p>

          <div className="bg-surface border border-DEFAULT rounded-lg p-6 mb-6 border-l-2 border-l-brand-500">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-3">
              En attendant
            </p>
            <ul className="space-y-3 text-sm text-ink leading-relaxed">
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  <strong>Voir l&apos;aperçu d&apos;une étude existante</strong> (Asset
                  Management 2026) pour comprendre le format.{" "}
                  <a href="/sample" className="text-brand-500 hover:underline">
                    Aperçu
                  </a>
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  <strong>Créer un compte Geoperf gratuit</strong> pour suivre votre marque
                  spécifique en parallèle.{" "}
                  <a href="/signup?source=etude" className="text-brand-500 hover:underline">
                    Tester
                  </a>
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  <strong>Une question sur la méthodologie ?</strong>{" "}
                  <a href="/saas/faq" className="text-brand-500 hover:underline">
                    FAQ
                  </a>{" "}
                  ou{" "}
                  <a
                    href="mailto:hello@geoperf.com"
                    className="text-brand-500 hover:underline"
                  >
                    hello@geoperf.com
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/sample" variant="primary" size="md">
              Voir l&apos;étude Asset Management
            </Button>
            <Button href="/" variant="secondary" size="md">
              Retour à l&apos;accueil
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
