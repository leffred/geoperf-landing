import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Geoperf SaaS — Monitoring de visibilité dans les LLM",
  description:
    "Surveillez en continu la perception de votre marque par ChatGPT, Claude, Gemini et Perplexity. 30 prompts, 4 LLMs, recommandations actionnables. Plan gratuit disponible.",
  alternates: { canonical: "https://geoperf.com/saas" },
};

const TIERS = [
  {
    key: "free",
    name: "Free",
    price: 0,
    cta: "Créer un compte",
    href: "/signup",
    bullets: ["1 marque", "1 LLM (ChatGPT)", "Snapshot mensuel", "3 derniers snapshots", "Aucun export"],
    highlight: false,
  },
  {
    key: "solo",
    name: "Solo",
    price: 149,
    cta: "Démarrer Solo",
    href: "/signup?next=/app/billing",
    bullets: ["1 marque", "4 LLMs (tous)", "Snapshot hebdo", "Historique illimité", "Recos IA + alertes email", "Export CSV/PDF"],
    highlight: true,
  },
  {
    key: "pro",
    name: "Pro",
    price: 349,
    cta: "Passer Pro",
    href: "/signup?next=/app/billing",
    bullets: ["3 marques", "4 LLMs hebdo", "Tout Solo", "Matrice concurrentielle", "Comparaison cross-marques"],
    highlight: false,
  },
  {
    key: "agency",
    name: "Agency",
    price: 899,
    cta: "Déployer Agency",
    href: "/signup?next=/app/billing",
    bullets: ["10 marques", "Tout Pro", "White-label", "Multi-utilisateurs (à venir)", "Support prioritaire"],
    highlight: false,
  },
];

export default function SaasMarketingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Header
        rightSlot={
          <div className="flex items-center gap-4">
            <Link href="/saas/faq" className="font-mono text-xs text-ink-muted hover:text-navy">FAQ</Link>
            <Link href="/login" className="font-mono text-xs text-ink-muted hover:text-navy">Connexion</Link>
            <Button href="/signup" variant="primary" size="sm">Créer un compte</Button>
          </div>
        }
      />

      <Section py="lg" tone="navy">
        <div className="max-w-3xl">
          <p className="font-mono text-xs tracking-widest text-amber uppercase mb-4">Geoperf SaaS · Monitoring continu</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-6">
            Surveillez votre visibilité dans <span className="text-amber">ChatGPT, Claude, Gemini, Perplexity</span>.
          </h1>
          <p className="text-lg text-white/85 leading-relaxed mb-8 max-w-2xl">
            Geoperf interroge chaque semaine les 4 grands LLMs sur 30 prompts représentatifs de votre secteur, mesure votre rang, vos concurrents et vos sources autorité, et vous propose des recommandations actionnables pour améliorer votre référencement génératif.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/signup" variant="primary" size="lg">Créer mon compte gratuit</Button>
            <Button href="#pricing" variant="outline-light" size="lg">Voir les plans</Button>
          </div>
          <p className="text-xs text-white/60 mt-6 font-mono">Sans carte bancaire · Annulation en 1 clic · Hébergé en Europe (Frankfurt)</p>
        </div>
      </Section>

      <Section py="lg" tone="white" eyebrow="Comment ça marche">
        <h2 className="font-serif text-3xl text-navy mb-10">3 étapes pour piloter votre référencement génératif</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              n: "01",
              title: "Suivez votre marque",
              body:
                "Renseignez votre nom, votre domaine, votre catégorie et 2-3 concurrents. Geoperf génère 30 prompts contextuels et lance un 1er snapshot immédiatement.",
            },
            {
              n: "02",
              title: "Comparez aux concurrents",
              body:
                "Visualisez votre rang moyen, votre taux de citation et votre share-of-voice face à vos rivaux dans les réponses des 4 grands LLMs. Heatmap détaillée par LLM (Pro+).",
            },
            {
              n: "03",
              title: "Améliorez votre SEO LLM",
              body:
                "Claude Haiku analyse vos snapshots et propose 3 à 5 actions priorisées : sources autorité à cibler, gaps de contenu, menaces concurrentielles. Alertes email à chaque dérive.",
            },
          ].map((s) => (
            <article key={s.n} className="bg-cream p-6 border-l-2 border-amber">
              <p className="font-mono text-xs tracking-widest text-amber mb-3">SECTION {s.n}</p>
              <h3 className="font-serif text-xl text-navy mb-3">{s.title}</h3>
              <p className="text-sm leading-relaxed text-ink">{s.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section py="lg" tone="cream" eyebrow="Différenciation">
        <h2 className="font-serif text-3xl text-navy mb-6">Pourquoi Geoperf, pas un autre outil GEO ?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-2">4 LLMs, en parallèle</p>
            <p className="text-sm leading-relaxed">
              Beaucoup d&apos;outils GEO se contentent d&apos;interroger ChatGPT. Geoperf compare en parallèle <strong>ChatGPT (GPT-4o), Claude Sonnet 4.6, Gemini 2.5 Pro et Perplexity Sonar</strong> — chacun a ses biais, c&apos;est leur consensus qui compte.
            </p>
          </div>
          <div className="bg-white p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-2">Recommandations actionnables</p>
            <p className="text-sm leading-relaxed">
              Pas de dashboard de chiffres opaques. Chaque snapshot vient avec 3 à 5 actions concrètes générées par <strong>Claude Haiku 4.5</strong> : quelles sources autorité cibler, sur quels sujets publier, quels concurrents à surveiller.
            </p>
          </div>
          <div className="bg-white p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-2">Données stockées en Europe</p>
            <p className="text-sm leading-relaxed">
              Hébergé sur Supabase Frankfurt. Aucun transfert de données vers les US. Conforme RGPD, audit possible sur demande.
            </p>
          </div>
          <div className="bg-white p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-2">Audit GEO sur mesure inclus dès Solo</p>
            <p className="text-sm leading-relaxed">
              Geoperf est une extension du cabinet <strong>Jourdechance</strong>. Si les résultats automatisés ne suffisent pas, nous proposons un audit GEO consulting (réservé aux clients Solo+).
            </p>
          </div>
        </div>
      </Section>

      <Section py="lg" tone="white" eyebrow="Plans & tarifs" className="scroll-mt-20" >
        <a id="pricing" />
        <h2 className="font-serif text-3xl text-navy mb-3">Tarifs simples, sans engagement</h2>
        <p className="text-sm text-ink-muted mb-10 max-w-2xl">Tous les plans incluent : prompts FR, monitoring multi-LLM (à partir de Solo), recos Haiku, alertes email. Annulation en 1 clic depuis le portail Stripe.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map((t) => (
            <div
              key={t.key}
              className={`p-6 ${t.highlight ? "bg-navy text-white" : "bg-cream"} ${t.highlight ? "ring-2 ring-amber" : ""}`}
            >
              <div className="flex items-baseline justify-between mb-3">
                <p className={`font-mono text-xs uppercase tracking-widest ${t.highlight ? "text-amber" : "text-navy-light"}`}>{t.name}</p>
                {t.highlight && <span className="font-mono text-[10px] uppercase tracking-widest text-amber">Recommandé</span>}
              </div>
              <div className="mb-4">
                <span className="font-serif text-4xl font-medium">{t.price}</span>
                <span className={`text-sm ml-1 ${t.highlight ? "opacity-70" : "text-ink-muted"}`}>€/mois HT</span>
              </div>
              <ul className={`text-xs space-y-2 mb-6 ${t.highlight ? "" : "text-ink"}`}>
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-baseline gap-2">
                    <span className={t.highlight ? "text-amber" : "text-amber"}>·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={t.href}
                className={`block w-full text-center py-2.5 text-sm font-medium transition ${
                  t.highlight ? "bg-amber text-navy hover:bg-amber/90" : "bg-navy text-white hover:bg-navy-light"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-xs text-ink-muted mt-6">
          TVA UE auto-calculée par Stripe. Carte test :{" "}
          <code className="font-mono text-xs bg-cream px-2 py-0.5">4242 4242 4242 4242</code>
        </p>
      </Section>

      <Section py="lg" tone="cream" eyebrow="Questions">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          <div>
            <h3 className="font-serif text-xl text-navy mb-2">Combien de temps avant les 1ers résultats ?</h3>
            <p className="text-sm text-ink-muted">Le 1er snapshot tourne en 30 secondes après création de la marque. Les recommandations Haiku arrivent ~10 secondes plus tard. Le suivi continu démarre immédiatement.</p>
          </div>
          <div>
            <h3 className="font-serif text-xl text-navy mb-2">Quels LLMs sont testés ?</h3>
            <p className="text-sm text-ink-muted">GPT-4o (OpenAI), Claude Sonnet 4.6 (Anthropic), Gemini 2.5 Pro (Google), Perplexity Sonar Pro. Le plan Free se limite à GPT-4o.</p>
          </div>
          <div>
            <h3 className="font-serif text-xl text-navy mb-2">Combien de prompts ?</h3>
            <p className="text-sm text-ink-muted">30 prompts FR catégorisés (recherche directe, use-case, concurrentiel) générés à partir de votre catégorie et concurrents. Templates publiés sur GitHub.</p>
          </div>
          <div>
            <h3 className="font-serif text-xl text-navy mb-2">Et le RGPD ?</h3>
            <p className="text-sm text-ink-muted">Données hébergées Supabase Frankfurt. Aucune donnée personnelle dans les prompts. Audit RGPD complet sur demande contractuelle.</p>
          </div>
        </div>
        <div className="mt-8">
          <Link href="/saas/faq" className="font-mono text-xs uppercase tracking-widest text-navy-light underline hover:text-navy">
            Voir toutes les questions →
          </Link>
        </div>
      </Section>

      <Section py="lg" tone="navy">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-widest text-amber uppercase mb-4">Prêt à tester ?</p>
          <h2 className="font-serif text-3xl text-white mb-4">Démarrez gratuitement en 60 secondes</h2>
          <p className="text-base text-white/85 mb-6">Plan Free sans carte bancaire. Upgrade Solo (149€/mois) à tout moment via Stripe.</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/signup" variant="primary" size="lg">Créer mon compte</Button>
            <Button href="/contact" variant="outline-light" size="lg">Parler à un humain</Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
