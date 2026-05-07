import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — Geoperf",
  description: "CGU et mentions légales de Geoperf, produit de Jourdechance SAS.",
};

type Props = { params: Promise<{ locale: string }> };

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tDisc = await getTranslations("legalDisclaimer");

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Section eyebrow="Mentions légales" py="lg">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-2">Conditions générales d'utilisation</h1>
        <p className="text-ink-muted text-sm mb-6">Dernière mise à jour : 4 mai 2026</p>

        {locale === "en" && (
          <div className="mb-10 rounded-lg border border-DEFAULT border-l-2 border-l-amber bg-amber/5 px-4 py-4">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-1">{tDisc("title")}</p>
            <p className="text-sm text-ink leading-relaxed">{tDisc("body")}</p>
          </div>
        )}

        <div className="prose-lg space-y-8 text-ink leading-relaxed">
          <section>
            <h2 className="text-xl font-medium text-ink mb-3">1. Éditeur du site</h2>
            <p>
              Le site geoperf.com est édité par <strong>Jourdechance SAS</strong>, société par actions simplifiée
              au capital de 1 000 €, immatriculée au RCS de Nanterre sous le numéro <strong>838 114 619</strong>,
              dont le siège social est situé au 31 rue Diaz, 92100 Boulogne-Billancourt, France.
            </p>
            <p>
              Numéro de TVA intracommunautaire : <strong>FR 79 838114619</strong> <span className="text-ink-subtle">(numéro complet à confirmer)</span>.<br />
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
              Pour les clients SaaS Pro et Agency, un Data Processing Agreement (DPA) est disponible sur demande à{" "}
              <a href="mailto:dpa@geoperf.com" className="text-brand-500 underline hover:text-brand-600">dpa@geoperf.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">8. Conditions du SaaS Geoperf</h2>
            <p><strong>Abonnement et durée.</strong> Les plans SaaS (Starter, Growth, Pro, Agency) sont souscrits
              à la carte, en cycle <strong>mensuel ou annuel</strong> selon le choix de l'utilisateur lors du checkout.
              L'abonnement est tacitement renouvelé à chaque échéance jusqu'à résiliation.</p>
            <p><strong>Résiliation.</strong> L'utilisateur peut résilier à tout moment via son espace de facturation
              (portail Stripe). La résiliation est effective <strong>à la fin de la période payée en cours</strong> ;
              l'accès aux features payantes reste actif jusqu'à cette date, puis le compte bascule automatiquement
              sur le plan Free.</p>
            <p><strong>Remboursements.</strong> Les paiements sont non-remboursables, y compris pour les abonnements annuels,
              sauf dans les cas suivants : (i) défaut technique majeur empêchant l'usage du service pendant plus de 7 jours
              consécutifs, (ii) erreur de facturation (double prélèvement, prélèvement après résiliation). Les demandes de remboursement
              exceptionnel sont à adresser à <a href="mailto:contact@geoperf.com" className="text-brand-500 underline hover:text-brand-600">contact@geoperf.com</a>.</p>
            <p><strong>Paiement et facturation.</strong> Les paiements sont traités par Stripe Inc. (PCI-DSS niveau 1).
              Les factures HT/TTC sont accessibles depuis le portail Stripe. La TVA française (20%) s'applique aux clients
              français&nbsp;; mécanisme d'autoliquidation pour les clients UE assujettis.</p>
            <p><strong>Trial Pro.</strong> Le plan Pro propose un essai gratuit de 14 jours, sans prélèvement immédiat.
              À l'issue du trial, le prélèvement est effectué automatiquement sauf résiliation par l'utilisateur depuis
              le portail Stripe avant la fin de la période d'essai.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">9. Droit applicable</h2>
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
