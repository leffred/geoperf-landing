import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Geoperf",
  description: "Comment Geoperf collecte, utilise et protège vos données personnelles. Conformité RGPD.",
};

type Props = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tDisc = await getTranslations("legalDisclaimer");

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Section eyebrow="Confidentialité" py="lg">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-2">Politique de confidentialité</h1>
        <p className="text-ink-muted text-sm mb-6">Dernière mise à jour : 4 mai 2026</p>

        {locale === "en" && (
          <div className="mb-10 rounded-lg border border-DEFAULT border-l-2 border-l-amber bg-amber/5 px-4 py-4">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-1">{tDisc("title")}</p>
            <p className="text-sm text-ink leading-relaxed">{tDisc("body")}</p>
          </div>
        )}

        <div className="prose-lg space-y-8 text-ink leading-relaxed">
          <section>
            <h2 className="text-xl font-medium text-ink mb-3">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données collectées via geoperf.com est <strong>Jourdechance SAS</strong>,
              SIREN 838&nbsp;114&nbsp;619, TVA intracommunautaire <strong>FR 79 838114619</strong>{" "}
              <span className="text-ink-subtle">(numéro complet à confirmer)</span>, dont le siège est situé
              au 31 rue Diaz, 92100 Boulogne-Billancourt, France.
            </p>
            <p>
              Pour toute question relative à la protection de vos données : <a href="mailto:contact@geoperf.com" className="text-brand-500 underline hover:text-brand-600">contact@geoperf.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">2. Données collectées</h2>
            <p>Geoperf collecte deux catégories de données :</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>
                <strong>Données prospects (B2B) :</strong> nom, prénom, fonction, email professionnel, entreprise,
                téléphone professionnel, profil LinkedIn. Sources : enrichissement Apollo.io et données publiques
                (sites institutionnels, LinkedIn, registres légaux).
              </li>
              <li>
                <strong>Données comportementales :</strong> visites des landing pages personnalisées, téléchargements
                des études, clics sur les liens des emails, ouvertures d'emails. Stockées dans la table <code>prospect_events</code>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">3. Base légale</h2>
            <p>
              Le traitement repose sur l'<strong>intérêt légitime</strong> de Geoperf à promouvoir ses services
              auprès de décideurs marketing dans un contexte strictement professionnel (RGPD article 6.1.f).
            </p>
            <p>
              Cette base légale s'applique uniquement aux contacts de niveau décisionnel (CMO, Directeur Marketing,
              Head of Brand, Head of Digital) dans des sociétés que nos études sectorielles ont identifiées comme
              pertinentes pour notre offre.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">4. Finalités</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Vous adresser nos études sectorielles personnalisées sur la perception de votre marque par les LLM.</li>
              <li>Mesurer l'engagement (ouvertures, clics, téléchargements) pour améliorer la pertinence de nos communications.</li>
              <li>Vous proposer un audit gratuit ou des prestations payantes si vous manifestez un intérêt.</li>
              <li>Respecter nos obligations légales et tenir un registre de nos opt-out.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">5. Durée de conservation</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Prospects actifs :</strong> 3 ans à compter du dernier engagement (ouverture, clic, téléchargement).</li>
              <li><strong>Prospects inactifs :</strong> suppression automatique après 3 ans sans engagement.</li>
              <li><strong>Opt-out :</strong> conservation des minimum d'identifiants nécessaires pour respecter votre demande, pendant 30 jours, puis suppression complète.</li>
              <li><strong>Logs techniques :</strong> 6 mois.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">6. Hébergement et sous-traitants</h2>
            <p>
              Les données sont hébergées par <strong>Supabase Inc.</strong> sur l'infrastructure AWS région
              <strong> EU-Central-1 (Francfort, Allemagne)</strong>. Aucun transfert hors Union européenne n'est
              effectué pour le stockage primaire.
            </p>
            <p>Sous-traitants techniques :</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li><strong>Stripe Inc.</strong> (États-Unis) — traitement des paiements SaaS, conformité PCI-DSS niveau&nbsp;1, transfert encadré par les Clauses Contractuelles Types (SCC) de la Commission européenne.</li>
              <li><strong>Resend</strong> — envoi des emails transactionnels (alertes, digest hebdo, notifications de paiement).</li>
              <li><strong>Apollo.io</strong> — enrichissement de prospects B2B (lead-magnet uniquement, pas le SaaS).</li>
              <li><strong>n8n Cloud</strong> — orchestration des workflows de production des études sectorielles (lead-magnet).</li>
              <li><strong>OpenRouter</strong> — accès aux modèles LLM (OpenAI, Anthropic, Google, Perplexity, Mistral, xAI, Meta) pour la production des études et des snapshots SaaS.</li>
              <li><strong>Vercel</strong> — hébergement de l'application web (région Frankfurt).</li>
              <li><strong>PDFShift</strong> — rendu PDF des études sectorielles.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">7. Data Processing Agreement (DPA)</h2>
            <p>
              Pour les clients SaaS Pro et Agency qui en font la demande, un <strong>DPA standard</strong> conforme
              à l'article 28 du RGPD est disponible. Il encadre le rôle de Geoperf en tant que sous-traitant pour
              les données traitées au sein du SaaS (marques suivies, snapshots, recommandations).
            </p>
            <p>
              Demande à : <a href="mailto:dpa@geoperf.com" className="text-brand-500 underline hover:text-brand-600">dpa@geoperf.com</a>.
              Délai de réponse&nbsp;: 5 jours ouvrés.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">8. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez à tout moment des droits suivants :</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li><strong>Droit d'accès :</strong> obtenir la liste de vos données.</li>
              <li><strong>Droit de rectification :</strong> corriger des données inexactes.</li>
              <li><strong>Droit à l'effacement :</strong> demander la suppression complète de vos données.</li>
              <li><strong>Droit d'opposition :</strong> refuser tout traitement futur.</li>
              <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré.</li>
              <li><strong>Droit de réclamation :</strong> auprès de la CNIL (cnil.fr).</li>
            </ul>
            <p className="mt-4">
              Pour exercer un droit : envoyez un email à <a href="mailto:contact@geoperf.com" className="text-brand-500 underline hover:text-brand-600">contact@geoperf.com</a>.
              Réponse sous 30 jours maximum.
            </p>
            <p className="mt-2">
              <strong>Désabonnement immédiat :</strong> répondez "STOP" à n'importe lequel de nos emails ou utilisez le lien dédié.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">9. Cookies</h2>
            <p>
              Geoperf n'utilise <strong>aucun cookie de tracking publicitaire</strong>. Seuls des cookies techniques
              strictement nécessaires au fonctionnement du site sont déposés (préférences de langue, session).
              Aucune donnée n'est partagée avec des régies publicitaires tierces.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">10. Sécurité</h2>
            <p>
              Les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). L'accès aux données prospects
              est restreint aux membres autorisés de Jourdechance et tracé via les logs Supabase. Les emails sont
              envoyés via une infrastructure SPF/DKIM/DMARC conforme.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">11. Modifications</h2>
            <p>
              Cette politique peut évoluer. La date de dernière mise à jour figure en haut de page. En cas de
              modification substantielle, les prospects actifs seront informés par email.
            </p>
          </section>
        </div>
      </Section>
      <Footer />
    </main>
  );
}
