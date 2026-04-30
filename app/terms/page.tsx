import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — Geoperf",
  description: "CGU et mentions légales de Geoperf, produit de Jourdechance SAS.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Section eyebrow="Mentions légales" py="lg">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-2">Conditions générales d'utilisation</h1>
        <p className="text-ink-muted text-sm mb-12">Dernière mise à jour : 28 avril 2026</p>

        <div className="prose-lg space-y-8 text-ink leading-relaxed">
          <section>
            <h2 className="text-xl font-medium text-ink mb-3">1. Éditeur du site</h2>
            <p>
              Le site geoperf.com est édité par <strong>Jourdechance SAS</strong>, société par actions simplifiée
              au capital de 1 000 €, immatriculée au RCS de Nanterre sous le numéro <strong>838 114 619</strong>,
              dont le siège social est situé au 31 rue Diaz, 92100 Boulogne-Billancourt, France.
            </p>
            <p>
              Numéro de TVA intracommunautaire : FR (à compléter).<br />
              Directeur de la publication : Frédéric Lefebvre, Président.<br />
              Email : <a href="mailto:contact@geoperf.com" className="text-brand-500 underline hover:text-brand-600">contact@geoperf.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">2. Hébergeur</h2>
            <p>
              Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.<br />
              Les données back-end sont hébergées par <strong>Supabase Inc.</strong> sur AWS région EU-Central-1
              (Francfort, Allemagne).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">3. Objet du service</h2>
            <p>
              Geoperf est un service B2B qui produit et distribue des études sectorielles sur la perception des
              marques par les principaux modèles de langage (LLM) tels que ChatGPT, Gemini, Claude et Perplexity.
            </p>
            <p>
              Les études sont distribuées gratuitement aux décideurs marketing des sociétés analysées. Geoperf propose
              également des prestations payantes d'audit et de conseil GEO (Generative Engine Optimization).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus publiés sur geoperf.com (études, méthodologie, design, textes, logos) sont
              la propriété exclusive de Jourdechance SAS. Toute reproduction, partielle ou totale, à des fins
              autres qu'un usage professionnel interne, est strictement interdite sans autorisation préalable.
            </p>
            <p>
              Les noms et logos des sociétés citées dans les études restent la propriété de leurs détenteurs respectifs.
              Leur mention relève de l'analyse sectorielle informative et n'implique aucun lien commercial.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">5. Limites de responsabilité</h2>
            <p>
              Les études Geoperf reflètent la perception des LLM à un instant donné. Cette perception peut évoluer
              au fil des mises à jour des modèles. Les classements et descriptions ne constituent pas une évaluation
              objective de la performance commerciale ou financière des sociétés citées.
            </p>
            <p>
              Geoperf ne garantit pas l'exhaustivité ni l'actualité absolue des données présentées. L'utilisateur
              est invité à vérifier les informations critiques auprès de sources institutionnelles avant toute
              décision d'investissement ou commerciale.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">6. Liens externes</h2>
            <p>
              Le site peut contenir des liens vers des sites tiers. Geoperf ne peut être tenu responsable du
              contenu, des pratiques ou de la disponibilité de ces sites externes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">7. Données personnelles</h2>
            <p>
              Le traitement des données personnelles est détaillé dans notre <a href="/privacy" className="text-brand-500 underline hover:text-brand-600">politique de confidentialité</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">8. Droit applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou leur
              exécution relève de la compétence exclusive des tribunaux du ressort de la Cour d'appel de Versailles,
              sauf disposition légale impérative contraire.
            </p>
          </section>
        </div>
      </Section>
      <Footer />
    </main>
  );
}
