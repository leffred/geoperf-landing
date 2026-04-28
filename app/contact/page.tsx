import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact — Geoperf",
  description: "Contactez Geoperf pour demander une étude sectorielle ou un audit GEO.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <Section py="lg" eyebrow="Contact">
        <h1 className="font-serif text-5xl text-navy leading-tight mb-6">
          Comment vous aider<span className="text-amber">?</span>
        </h1>
        <p className="text-lg text-ink-muted leading-relaxed mb-12 max-w-2xl">
          Nous répondons à tous les emails sous 48h ouvrées. Pour les demandes urgentes, le plus rapide est de
          réserver directement un créneau de 30 minutes.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-cream p-8">
            <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">Email</p>
            <h2 className="font-serif text-2xl text-navy mb-3">Demander une étude</h2>
            <p className="text-ink-muted text-sm mb-6">
              Vous voulez l'étude Geoperf qui couvre votre secteur ? Précisez votre catégorie et votre fonction,
              nous revenons vers vous sous 48h.
            </p>
            <Button
              href="mailto:contact@geoperf.com?subject=Demande%20d%27%C3%A9tude%20sectorielle"
              variant="secondary"
              size="md"
            >
              contact@geoperf.com
            </Button>
          </div>

          <div className="bg-navy text-white p-8">
            <p className="font-mono text-xs tracking-widest text-amber uppercase mb-3">Audit gratuit</p>
            <h2 className="font-serif text-2xl mb-3">Réserver 30 min</h2>
            <p className="opacity-85 text-sm mb-6">
              30 minutes pour analyser votre positionnement actuel et identifier les leviers prioritaires
              d'amélioration. Aucun engagement.
            </p>
            <Button
              href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/jourdechance/audit-geo"}
              variant="primary"
              size="md"
            >
              Voir mes disponibilités
            </Button>
          </div>
        </div>
      </Section>

      <Section tone="cream" py="md">
        <h3 className="font-serif text-2xl text-navy mb-3">Adresse</h3>
        <address className="not-italic text-ink-muted">
          Jourdechance SAS<br />
          31 rue Diaz<br />
          92100 Boulogne-Billancourt<br />
          France
        </address>
        <p className="text-ink-muted text-sm mt-4">
          Géré depuis Paris · Disponible en français et en anglais.
        </p>
      </Section>

      <Footer />
    </main>
  );
}
