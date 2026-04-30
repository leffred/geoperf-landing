import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "FAQ — Geoperf SaaS",
  description: "Questions fréquentes sur Geoperf : LLMs testés, prompts, RGPD, annulation, audit GEO.",
  alternates: { canonical: "https://geoperf.com/saas/faq" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Quels LLMs sont testés ?",
    a: "Geoperf interroge en parallèle GPT-4o (OpenAI), Claude Sonnet 4.6 (Anthropic), Gemini 2.5 Pro (Google) et Perplexity Sonar Pro. Le plan Free se limite à GPT-4o pour maîtriser les coûts ; les plans Solo, Pro et Agency couvrent les 4 modèles. Les LLMs sont appelés via OpenRouter pour garantir la cohérence des outputs et des coûts.",
  },
  {
    q: "Combien de prompts par snapshot ?",
    a: "30 prompts en français, répartis en 3 catégories : 10 prompts de recherche directe sectorielle, 10 prompts par cas d'usage, 10 prompts concurrentiels. Les templates sont publiés (saas/prompts/brand_monitoring/ sur GitHub) et personnalisés à partir de votre catégorie + 2-3 concurrents que vous renseignez.",
  },
  {
    q: "Combien de temps avant les premiers résultats ?",
    a: "Le 1er snapshot tourne en environ 30 secondes après la création de la marque. Les recommandations générées par Claude Haiku arrivent automatiquement ~10 secondes plus tard. Vous voyez tout immédiatement dans votre dashboard. Les snapshots suivants sont planifiés selon la cadence de votre plan (mensuel pour Free, hebdo pour Solo+).",
  },
  {
    q: "Comment Geoperf détecte-t-il les mentions ?",
    a: "On parse les réponses LLM pour repérer (1) le nom officiel de votre marque, (2) le nom dérivé du domaine principal, (3) les classements numérotés pour calculer votre rang moyen, (4) les concurrents que vous avez configurés, (5) les URLs sources citées dans la réponse. La détection est insensible à la casse et word-boundary stricte (BNP Paribas est détecté, BNP n'est pas confondu avec BNP Real Estate).",
  },
  {
    q: "Que sont les recommandations actionnables ?",
    a: "Après chaque snapshot, Claude Haiku 4.5 analyse vos résultats agrégés (visibility score, concurrents top 8, sources autorité top 10) et vous propose 3 à 5 actions priorisées. Catégories : (a) authority_source — médias/analystes à cibler en relation presse, (b) content_gap — sujets sur lesquels publier, (c) competitor_threat — concurrents qui montent, (d) positioning — repositionnement éditorial. Chaque reco vient avec une priorité (high/medium/low) et un body de 2-4 phrases.",
  },
  {
    q: "Comment fonctionnent les alertes ?",
    a: "À chaque nouveau snapshot, on compare avec le précédent et on déclenche des alertes si : rang moyen change de >2 positions (rank_drop/rank_gain), taux de citation varie de >20 points (citation_loss/citation_gain), un concurrent devient visible (>30% des prompts) pour la 1re fois (competitor_overtake), 3+ nouvelles sources autorité apparaissent (new_source). Les alertes sont envoyées par email aux plans Solo+ uniquement.",
  },
  {
    q: "Quelles données sont stockées et où ?",
    a: "Tout est hébergé sur Supabase Frankfurt (région EU). On stocke : votre profile (email, nom, société), vos marques, les snapshots et les réponses brutes des LLM (incluant les prompts). Aucune donnée personnelle de tiers n'est délibérément collectée. Les payloads OpenRouter contiennent des identifiants de modèle mais aucun token utilisateur. RLS Postgres garantit qu'aucun client ne voit les données d'un autre.",
  },
  {
    q: "RGPD et confidentialité ?",
    a: "Geoperf est édité par Jourdechance SAS (SIREN 838 114 619, RCS Nanterre). Conformité RGPD : données EU only, contrat DPA disponible sur demande, droit à l'effacement implémenté (suppression compte = CASCADE sur toutes les tables). Aucun pixel publicitaire externe sur les pages /app/*. Politique de confidentialité complète sur /privacy.",
  },
  {
    q: "Comment fonctionne le paiement ?",
    a: "Stripe Subscription en EUR avec TVA UE auto-calculée. CB ou virement SEPA. Mode test pour les essais : 4242 4242 4242 4242 / 12/34 / 123. Renouvellement mensuel automatique. Toutes les factures dans le portail Stripe (lien depuis /app/billing).",
  },
  {
    q: "Annulation et remboursement ?",
    a: "Annulation en 1 clic depuis le portail Stripe (bouton « Gérer mon abonnement » sur /app/billing). L'abonnement reste actif jusqu'à la fin de la période payée, puis bascule en Free automatiquement. Pas de remboursement pro-rata sur le mois en cours, mais aucun engagement de durée.",
  },
  {
    q: "Quelle est la différence avec un audit GEO ?",
    a: "Geoperf SaaS est un outil de monitoring continu (vous voyez les chiffres). Un audit GEO de Jourdechance est une mission consulting humaine : nous analysons en profondeur votre écosystème média + recommandons un plan d'action sur 6-12 mois (relations presse autorités, contenu, partenariats Wikipédia, etc.). L'audit est inclus pour les clients Pro et Agency, ou disponible en standalone via /contact.",
  },
  {
    q: "Quelle est la marge LLM ?",
    a: "Pour transparence : un snapshot Solo (4 LLM × 30 prompts = 120 calls) coûte ~5€ en frais OpenRouter cumulés. À 149€/mois soit ~25€ de coûts mensuels (1 snapshot/semaine), la marge brute est de ~83%. Cette marge baisse en Pro/Agency (multi-marques) mais reste >70%. Aucune surfacturation cachée — vous êtes facturé au plan, pas aux calls.",
  },
  {
    q: "Multi-langues ?",
    a: "v1 = FR uniquement. Les prompts et templates emails sont en français. Une version EN est sur la roadmap (Sprint 7+). Si vous avez besoin d'EN urgent, contactez-nous : c'est faisable en consulting custom.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Header
        rightSlot={
          <div className="flex items-center gap-4">
            <Link href="/saas" className="font-mono text-xs text-ink-muted hover:text-navy">Geoperf SaaS</Link>
            <Link href="/login" className="font-mono text-xs text-ink-muted hover:text-navy">Connexion</Link>
            <Button href="/signup" variant="primary" size="sm">Créer un compte</Button>
          </div>
        }
      />

      <Section py="lg" tone="cream">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">FAQ</p>
        <h1 className="font-serif text-4xl text-navy mb-2">Questions fréquentes</h1>
        <p className="text-sm text-ink-muted mb-10 max-w-2xl">
          Pas de réponse ici ? Écris-nous : <a href="mailto:hello@geoperf.com" className="text-navy underline">hello@geoperf.com</a>.
        </p>

        <div className="max-w-3xl space-y-6">
          {FAQ.map((item, i) => (
            <article key={i} className="bg-white p-6 border-l-2 border-amber">
              <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Question {String(i + 1).padStart(2, "0")}</p>
              <h2 className="font-serif text-xl text-navy mb-3">{item.q}</h2>
              <p className="text-sm leading-relaxed text-ink">{item.a}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section py="lg" tone="navy">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-widest text-amber uppercase mb-3">Reste une question ?</p>
          <h2 className="font-serif text-2xl text-white mb-4">On répond sous 24h ouvrées.</h2>
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
