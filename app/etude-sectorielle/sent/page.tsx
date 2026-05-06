import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Étude envoyée — Geoperf",
  robots: { index: false, follow: false },
};

export default async function SentPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; sous_cat?: string }>;
}) {
  const sp = await searchParams;
  const email = sp.email ?? "votre email";
  const sousCat = sp.sous_cat;

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header logo="etudes" />

      <Section py="lg" tone="white">
        <div className="max-w-2xl">
          <Eyebrow className="mb-3">Confirmation</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink mb-5 leading-tight">
            Le rapport vous a été envoyé.
          </h1>
          <p className="text-base text-ink-muted leading-relaxed mb-4">
            Nous venons d&apos;envoyer{sousCat ? ` l'étude ${sousCat}` : " l'étude"} à{" "}
            <strong className="text-ink">{email}</strong>.
          </p>
          <p className="text-sm text-ink-muted leading-relaxed mb-8">
            Si vous ne le voyez pas dans 5 minutes, vérifiez vos spams. Le lien de
            téléchargement reste valide 7 jours. Vous pouvez aussi nous écrire à{" "}
            <a href="mailto:hello@geoperf.com" className="text-brand-500 hover:underline">
              hello@geoperf.com
            </a>{" "}
            si vous avez besoin d&apos;une nouvelle copie.
          </p>

          <div className="bg-surface border border-DEFAULT rounded-lg p-6 mb-6 border-l-2 border-l-brand-500">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-3">
              Et après ?
            </p>
            <ul className="space-y-3 text-sm text-ink leading-relaxed">
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  <strong>Audit GEO</strong> : 30 min avec un expert pour décortiquer votre
                  positionnement spécifique. Gratuit pour les comptes Pro/Agency, sinon
                  facturé sur devis.{" "}
                  <a href="/contact" className="text-brand-500 hover:underline">
                    Réserver
                  </a>
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  <strong>Geoperf SaaS</strong> : monitoring continu de votre marque sur 4
                  LLM. Plan Free permanent, sans CB.{" "}
                  <a href="/signup?source=etude" className="text-brand-500 hover:underline">
                    Tester gratuitement
                  </a>
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  <strong>Une autre étude</strong> sur un secteur différent.{" "}
                  <a href="/etude-sectorielle" className="text-brand-500 hover:underline">
                    Choisir
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/signup?source=etude" variant="primary" size="md">
              Créer un compte Geoperf gratuit
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
