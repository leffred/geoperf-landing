import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "FAQ — Geoperf SaaS",
  description:
    "Questions fréquentes sur Geoperf : LLMs testés, prompts, RGPD, annulation, audit GEO, différence SEO/GEO, sécurité, sous-traitants.",
  alternates: { canonical: "https://geoperf.com/saas/faq" },
};

type FaqItem = { q: string; a: string; cat: string };

const FAQ: FaqItem[] = [
  // ===== Comprendre Geoperf =====
  {
    cat: "Comprendre Geoperf",
    q: "Qu'est-ce que Geoperf ?",
    a: "Geoperf est un SaaS français de monitoring de visibilité dans les LLM (ChatGPT, Claude, Gemini, Perplexity). Vous suivez chaque semaine si votre marque est citée et à quel rang quand un prospect interroge un LLM sur votre secteur. Édité par Jourdechance SAS, hébergé Frankfurt (UE), facturé en EUR.",
  },
  {
    cat: "Comprendre Geoperf",
    q: "Qu'est-ce que le GEO et en quoi diffère-t-il du SEO ?",
    a: "Le SEO (Search Engine Optimization) optimise votre rang sur les moteurs de recherche classiques (Google, Bing). Le GEO (Generative Engine Optimization) optimise votre visibilité dans les réponses générées par les LLM. Le SEO travaille les liens cliqués ; le GEO travaille les marques citées dans le texte de réponse. Les deux sont complémentaires, mais le GEO devient critique à mesure que les LLM remplacent une partie des requêtes Google sur le B2B.",
  },
  {
    cat: "Comprendre Geoperf",
    q: "Pourquoi monitorer ma visibilité dans les LLM ?",
    a: "Parce que vos prospects B2B utilisent ChatGPT et Perplexity comme première source de recherche fournisseur (Gartner 2025 : 1 décideur sur 3 consulte un LLM durant son cycle d'évaluation). Si votre marque n'est pas citée, vous êtes invisible — et vous ne le savez pas, car aucun analytics traditionnel ne capture ce type de requête.",
  },
  {
    cat: "Comprendre Geoperf",
    q: "Quelle différence avec un audit GEO consulting ?",
    a: "Geoperf SaaS est un outil de monitoring continu (vous voyez les chiffres). Un audit GEO de Jourdechance est une mission consulting humaine : nous analysons en profondeur votre écosystème média + recommandons un plan d'action sur 6-12 mois (relations presse autorités, contenu, partenariats Wikipédia, etc.). L'audit est inclus pour les clients Pro et Agency, ou disponible en standalone via /contact.",
  },
  {
    cat: "Comprendre Geoperf",
    q: "Qui utilise Geoperf en pratique ?",
    a: "Notre cible : PME et ETI françaises de 50-500 employés, principalement B2B. Profils types : CMO d'agences digitales, Head of Marketing de scale-ups SaaS B2B, Directeur Communication d'ESN mid-market, Founder de fintech B2B. Si vous avez un budget marketing actif et une concurrence sur Google, vous avez probablement aussi une concurrence dans les LLM.",
  },

  // ===== Utilisation produit =====
  {
    cat: "Utilisation produit",
    q: "Quels LLMs sont testés ?",
    a: "Geoperf interroge en parallèle GPT-4o (OpenAI), Claude Sonnet 4.6 (Anthropic), Gemini 2.5 Pro (Google) et Perplexity Sonar Pro. Le plan Free se limite à GPT-4o pour maîtriser les coûts ; les plans Solo, Pro et Agency couvrent les 4 modèles. Les LLMs sont appelés via OpenRouter pour garantir la cohérence des outputs et des coûts.",
  },
  {
    cat: "Utilisation produit",
    q: "Combien de prompts par snapshot ?",
    a: "30 prompts en français, répartis en 3 catégories : 10 prompts de recherche directe sectorielle, 10 prompts par cas d'usage, 10 prompts concurrentiels. Les templates sont publiés (saas/prompts/brand_monitoring/ sur GitHub) et personnalisés à partir de votre catégorie + 2-3 concurrents que vous renseignez.",
  },
  {
    cat: "Utilisation produit",
    q: "Combien de temps avant les premiers résultats ?",
    a: "Le 1er snapshot tourne en environ 30 secondes après la création de la marque. Les recommandations générées par Claude Haiku arrivent automatiquement ~10 secondes plus tard. Vous voyez tout immédiatement dans votre dashboard. Les snapshots suivants sont planifiés selon la cadence de votre plan (mensuel pour Free, hebdo pour Solo+).",
  },
  {
    cat: "Utilisation produit",
    q: "Comment Geoperf détecte-t-il les mentions ?",
    a: "On parse les réponses LLM pour repérer (1) le nom officiel de votre marque, (2) le nom dérivé du domaine principal, (3) les classements numérotés pour calculer votre rang moyen, (4) les concurrents que vous avez configurés, (5) les URLs sources citées dans la réponse. La détection est insensible à la casse et word-boundary stricte (BNP Paribas est détecté, BNP n'est pas confondu avec BNP Real Estate).",
  },
  {
    cat: "Utilisation produit",
    q: "Que sont les recommandations actionnables ?",
    a: "Après chaque snapshot, Claude Haiku 4.5 analyse vos résultats agrégés (visibility score, concurrents top 8, sources autorité top 10) et vous propose 3 à 5 actions priorisées. Catégories : (a) authority_source — médias/analystes à cibler en relation presse, (b) content_gap — sujets sur lesquels publier, (c) competitor_threat — concurrents qui montent, (d) positioning — repositionnement éditorial. Chaque reco vient avec une priorité (high/medium/low) et un body de 2-4 phrases.",
  },
  {
    cat: "Utilisation produit",
    q: "Comment fonctionnent les alertes ?",
    a: "À chaque nouveau snapshot, on compare avec le précédent et on déclenche des alertes si : rang moyen change de >2 positions (rank_drop/rank_gain), taux de citation varie de >20 points (citation_loss/citation_gain), un concurrent devient visible (>30% des prompts) pour la 1re fois (competitor_overtake), 3+ nouvelles sources autorité apparaissent (new_source). Les alertes sont envoyées par email aux plans Solo+ uniquement.",
  },
  {
    cat: "Utilisation produit",
    q: "Multi-langues ?",
    a: "v1 = FR uniquement. Les prompts et templates emails sont en français. Une version EN est sur la roadmap (Sprint 19+). Si vous avez besoin d'EN urgent, contactez-nous : c'est faisable en consulting custom.",
  },

  // ===== Pricing & business =====
  {
    cat: "Pricing & business",
    q: "Quelle est la différence entre Free et Starter ?",
    a: "Free : 1 marque, 1 LLM (GPT-4o), 30 prompts, snapshot mensuel, gratuit pour toujours, sans CB. Starter (79 €/mois) : 1 marque, 4 LLMs (GPT-4o, Claude Sonnet, Gemini Pro, Perplexity), 50 prompts, snapshot hebdomadaire, alertes email. Le Free permet de valider la valeur ; Starter ajoute la cadence hebdo et le multi-LLM nécessaires pour piloter en continu.",
  },
  {
    cat: "Pricing & business",
    q: "Comment fonctionne le paiement ?",
    a: "Stripe Subscription en EUR avec TVA UE auto-calculée. CB ou virement SEPA. Renouvellement mensuel automatique. Toutes les factures dans le portail Stripe (lien depuis /app/billing).",
  },
  {
    cat: "Pricing & business",
    q: "Annulation et remboursement ?",
    a: "Annulation en 1 clic depuis le portail Stripe (bouton « Gérer mon abonnement » sur /app/billing). L'abonnement reste actif jusqu'à la fin de la période payée, puis bascule en Free automatiquement. Pas de remboursement pro-rata sur le mois en cours, mais aucun engagement de durée.",
  },
  {
    cat: "Pricing & business",
    q: "Quelle est la marge LLM ?",
    a: "Pour transparence : un snapshot Solo (4 LLM × 30 prompts = 120 calls) coûte ~5 € en frais OpenRouter cumulés. À 149 €/mois soit ~25 € de coûts mensuels (1 snapshot/semaine), la marge brute est de ~83 %. Cette marge baisse en Pro/Agency (multi-marques) mais reste >70 %. Aucune surfacturation cachée — vous êtes facturé au plan, pas aux calls.",
  },

  // ===== Sécurité & RGPD =====
  {
    cat: "Sécurité & RGPD",
    q: "Quelles données sont stockées et où ?",
    a: "Tout est hébergé sur Supabase Frankfurt (région EU). On stocke : votre profile (email, nom, société), vos marques, les snapshots et les réponses brutes des LLM (incluant les prompts). Aucune donnée personnelle de tiers n'est délibérément collectée. Les payloads OpenRouter contiennent des identifiants de modèle mais aucun token utilisateur. RLS Postgres garantit qu'aucun client ne voit les données d'un autre.",
  },
  {
    cat: "Sécurité & RGPD",
    q: "Quels sous-traitants ?",
    a: "Supabase (DB et auth, Frankfurt UE), Vercel (hébergement frontend, multi-région), OpenRouter (gateway LLM, US — flux de prompts uniquement), Stripe (paiement, IE), Resend (emails transactionnels, US — adresses + sujets uniquement). Liste complète et liens DPA dans /privacy.",
  },
  {
    cat: "Sécurité & RGPD",
    q: "RGPD et confidentialité ?",
    a: "Geoperf est édité par Jourdechance SAS (SIREN 838 114 619, RCS Nanterre). Conformité RGPD : données EU, contrat DPA disponible sur demande, droit à l'effacement implémenté (suppression compte = CASCADE sur toutes les tables). Aucun pixel publicitaire externe sur les pages /app/*. Politique de confidentialité complète sur /privacy.",
  },
  {
    cat: "Sécurité & RGPD",
    q: "Mes prompts sont-ils utilisés pour entraîner des modèles ?",
    a: "Non. OpenRouter ne réutilise pas les prompts pour entraîner ses propres modèles ; les fournisseurs sous-jacents (OpenAI, Anthropic, Google) opèrent en mode API commercial (pas d'opt-in training). Vos prompts restent stockés sur Supabase Frankfurt sous votre tenant uniquement.",
  },
];

// Schema.org FAQPage JSON-LD — pour citation par les LLM (GEO) et SERP Google.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const CATEGORIES = ["Comprendre Geoperf", "Utilisation produit", "Pricing & business", "Sécurité & RGPD"] as const;

export default function FaqPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* JSON-LD pour SEO/GEO — citable par les LLM en mode RAG */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      <Header
        logo="monitoring"
        rightSlot={
          <div className="flex items-center gap-4">
            <Link href="/saas" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">Geoperf SaaS</Link>
            <Link href="/login" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">Connexion</Link>
            <Button href="/signup" variant="primary" size="sm">Créer un compte</Button>
          </div>
        }
      />

      <Section py="lg" tone="white">
        <Eyebrow className="mb-3">FAQ</Eyebrow>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink mb-3 leading-tight">
          Questions fréquentes
        </h1>
        <p className="text-sm text-ink-muted mb-12 max-w-2xl">
          {FAQ.length} questions, regroupées en 4 catégories. Pas de réponse ici&nbsp;? Écrivez-nous&nbsp;:{" "}
          <a href="mailto:hello@geoperf.com" className="text-brand-500 hover:underline">hello@geoperf.com</a>.
        </p>

        {CATEGORIES.map((cat) => {
          const items = FAQ.filter((f) => f.cat === cat);
          return (
            <div key={cat} className="mb-14">
              <h2 className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-4">{cat}</h2>
              <div className="max-w-3xl space-y-4">
                {items.map((item, i) => (
                  <article key={item.q} className="bg-white rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 shadow-card p-6">
                    <p className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-subtle mb-2">
                      Question {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="text-xl font-medium text-ink mb-3 tracking-tightish leading-tight">{item.q}</h3>
                    <p className="text-sm leading-relaxed text-ink-muted">{item.a}</p>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </Section>

      <Section py="lg" tone="dark">
        <div className="max-w-2xl">
          <Eyebrow variant="muted" className="mb-3 text-amber">Reste une question&nbsp;?</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-4 leading-tight">
            On répond sous 24h ouvrées.
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button href="mailto:hello@geoperf.com" variant="primary" size="md">hello@geoperf.com</Button>
            <Button href="/contact" variant="outline-light" size="md">Page contact</Button>
            <Button href="/signup" variant="outline-light" size="md">Tester gratuitement</Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
