import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { priceDisplay, type TierKey } from "@/lib/saas-pricing";

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
    bullets: ["1 marque", "1 LLM (ChatGPT)", "30 prompts", "1 topic", "Snapshot mensuel", "Aucun export"],
    highlight: false,
  },
  {
    key: "starter",
    name: "Starter",
    price: 79,
    cta: "Démarrer Starter",
    href: "/signup?next=/app/billing",
    bullets: ["1 marque", "4 LLMs", "50 prompts", "3 topics", "Snapshot hebdo", "Recos IA + alertes", "Export CSV/PDF"],
    highlight: false,
  },
  {
    key: "growth",
    name: "Growth",
    price: 199,
    cta: "Passer Growth",
    href: "/signup?next=/app/billing",
    bullets: ["1 marque", "4 LLMs", "200 prompts", "9 topics", "5 seats inclus", "Sentiment ✨", "Webhooks Slack 🔌"],
    highlight: true,
  },
  {
    key: "pro",
    name: "Pro",
    price: 399,
    cta: "Passer Pro",
    href: "/signup?next=/app/billing",
    bullets: ["3 marques", "6 LLMs", "Topics ∞", "Seats ∞", "Alignment ✨", "Content Studio ✨", "Citations Flow 📊", "Webhooks Teams 🔌"],
    highlight: false,
  },
  {
    key: "agency",
    name: "Agency",
    price: 799,
    cta: "Déployer Agency",
    href: "/signup?next=/app/billing",
    bullets: ["10 marques", "7 LLMs", "Tout Pro", "Content Studio ∞", "API REST 🔑", "White-label"],
    highlight: false,
  },
];

const FEATURES = [
  {
    n: "01",
    title: "Suivez votre marque",
    body: "Renseignez votre nom, votre domaine, votre catégorie et 2-3 concurrents. Geoperf génère 30 prompts contextuels et lance un 1er snapshot immédiatement.",
  },
  {
    n: "02",
    title: "Comparez aux concurrents",
    body: "Visualisez votre rang moyen, votre taux de citation et votre share-of-voice face à vos rivaux dans les réponses des 4 grands LLMs. Heatmap détaillée par LLM (Pro+).",
  },
  {
    n: "03",
    title: "Améliorez votre SEO LLM",
    body: "Claude Haiku analyse vos snapshots et propose 3 à 5 actions priorisées : sources autorité à cibler, gaps de contenu, menaces concurrentielles. Alertes email à chaque dérive.",
  },
];

const DIFFERENTIATORS = [
  {
    title: "4 LLMs, en parallèle",
    body: "Beaucoup d'outils GEO se contentent d'interroger ChatGPT. Geoperf compare en parallèle ChatGPT (GPT-4o), Claude Sonnet 4.6, Gemini 2.5 Pro et Perplexity Sonar — chacun a ses biais, c'est leur consensus qui compte.",
  },
  {
    title: "Recommandations actionnables",
    body: "Pas de dashboard de chiffres opaques. Chaque snapshot vient avec 3 à 5 actions concrètes générées par Claude Haiku 4.5 : quelles sources autorité cibler, sur quels sujets publier, quels concurrents à surveiller.",
  },
  {
    title: "Données stockées en Europe",
    body: "Hébergé sur Supabase Frankfurt. Aucun transfert de données vers les US. Conforme RGPD, audit possible sur demande.",
  },
  {
    title: "Audit GEO sur mesure inclus",
    body: "Geoperf est une extension du cabinet Jourdechance. Si les résultats automatisés ne suffisent pas, nous proposons un audit GEO consulting (réservé aux clients Pro+).",
  },
];

type Props = { searchParams: Promise<{ cycle?: string }> };

export default async function SaasMarketingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const cycle: "monthly" | "annual" = sp.cycle === "annual" ? "annual" : "monthly";

  // S17 §4.9 : pricing canonique via lib/saas-pricing.ts (TIERS constants partagés).

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header
        rightSlot={
          <div className="flex items-center gap-4">
            <Link href="/saas/vs-getmint" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors hidden md:inline">vs GetMint</Link>
            <Link href="/saas/faq" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">FAQ</Link>
            <Link href="/login" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">Connexion</Link>
            <Button href="/signup" variant="primary" size="sm">Créer un compte</Button>
          </div>
        }
      />

      <Section py="lg" tone="dark">
        <div className="max-w-3xl">
          <Eyebrow variant="muted" className="mb-5 text-amber">Geoperf SaaS · Monitoring continu</Eyebrow>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.05] text-white text-balance mb-6">
            Surveillez votre visibilité dans <span className="text-brand-500">ChatGPT, Claude, Gemini, Perplexity</span>.
          </h1>
          <p className="text-lg text-white/85 leading-relaxed mb-8 max-w-2xl">
            Geoperf interroge chaque semaine les 4 grands LLMs sur 30 prompts représentatifs de votre secteur, mesure votre rang, vos concurrents et vos sources autorité, et vous propose des recommandations actionnables pour améliorer votre référencement génératif.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/signup" variant="primary" size="lg">Créer mon compte gratuit</Button>
            <Button href="#pricing" variant="outline-light" size="lg">Voir les plans</Button>
          </div>
          <p className="text-xs text-white/60 mt-6 font-mono">
            Sans carte bancaire · Annulation en 1 clic · Hébergé en Europe (Frankfurt)
          </p>
        </div>
      </Section>

      <Section py="lg" tone="white" eyebrow="Comment ça marche">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-10 max-w-2xl text-balance leading-tight">
          3 étapes pour piloter votre référencement génératif.
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map(s => (
            <Card key={s.n} variant="default">
              <span className="font-mono text-xs text-brand-500 tracking-eyebrow uppercase">{s.n}</span>
              <h3 className="mt-4 text-xl font-medium text-ink leading-tight tracking-tightish">{s.title}</h3>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">{s.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section py="lg" tone="surface" eyebrow="Différenciation">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-10 max-w-2xl text-balance leading-tight">
          Pourquoi Geoperf, pas un autre outil GEO ?
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {DIFFERENTIATORS.map(d => (
            <Card key={d.title} variant="default">
              <Eyebrow className="mb-2">{d.title}</Eyebrow>
              <p className="text-sm leading-relaxed text-ink-muted">{d.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section py="lg" tone="white" className="scroll-mt-20">
        <a id="pricing" />
        <Eyebrow className="mb-3">Plans &amp; tarifs</Eyebrow>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3 leading-tight max-w-2xl text-balance">
          Tarifs simples, sans engagement.
        </h2>
        <p className="text-sm text-ink-muted mb-8 max-w-2xl leading-relaxed">
          Tous les plans incluent : prompts FR, monitoring multi-LLM (à partir de Starter), recos Haiku, alertes email. Annulation en 1 clic depuis le portail Stripe.
        </p>

        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-xs font-mono uppercase tracking-eyebrow text-ink-subtle">Cycle</span>
          <div className="inline-flex rounded-md bg-surface p-1 text-xs">
            <Link
              href="/saas#pricing"
              className={`px-3 py-1.5 rounded-md transition-colors duration-150 ease-out ${cycle === "monthly" ? "bg-white text-ink shadow-card font-medium" : "text-ink-muted hover:text-ink"}`}
            >
              Mensuel
            </Link>
            <Link
              href="/saas?cycle=annual#pricing"
              className={`px-3 py-1.5 rounded-md transition-colors duration-150 ease-out ${cycle === "annual" ? "bg-white text-ink shadow-card font-medium" : "text-ink-muted hover:text-ink"}`}
            >
              Annuel
            </Link>
          </div>
        </div>
        {cycle === "annual" && (
          <p className="text-xs text-success mb-8 font-mono">Économisez 25% — 3 mois offerts sur tous les plans.</p>
        )}
        {cycle === "monthly" && <div className="mb-8" />}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {TIERS.map(t => {
            const isFreeTier = t.key === "free";
            const price = isFreeTier ? null : priceDisplay(t.key as Exclude<TierKey, "free">, cycle);
            return (
              <div
                key={t.key}
                className={`relative rounded-lg p-6 transition-all duration-150 ease-out ${
                  t.highlight
                    ? "bg-ink text-white shadow-card"
                    : "bg-white border border-DEFAULT shadow-card hover:shadow-cardHover"
                }`}
              >
                {!isFreeTier && cycle === "annual" && (
                  <span className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-eyebrow bg-brand-50 text-brand-600 px-2 py-0.5 rounded">
                    3 mois offerts
                  </span>
                )}
                <div className="flex items-baseline justify-between mb-3">
                  <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500">{t.name}</p>
                  {t.highlight && (
                    <span className="font-mono text-[10px] uppercase tracking-eyebrow text-brand-500">Recommandé</span>
                  )}
                </div>
                {isFreeTier ? (
                  <>
                    <div className="mb-1">
                      <span className="text-5xl font-medium tracking-tight tabular-nums">0</span>
                      <span className={`text-sm ml-1 ${t.highlight ? "opacity-70" : "text-ink-muted"}`}>€ HT/mois</span>
                    </div>
                    <p className={`text-[11px] mb-4 ${t.highlight ? "opacity-70" : "text-ink-subtle"}`}>Sans CB · à vie</p>
                  </>
                ) : (
                  <>
                    <div className="mb-1 flex items-baseline gap-1">
                      <span className="text-5xl font-medium tracking-tight tabular-nums">{price!.primaryHT.split(" ")[0].replace("€", "")}</span>
                      <span className={`text-sm ${t.highlight ? "opacity-70" : "text-ink-muted"}`}>€ HT/mois</span>
                    </div>
                    <p className={`text-[11px] mb-1 ${t.highlight ? "opacity-70" : "text-ink-subtle"}`}>
                      {price!.secondary}
                    </p>
                    {price!.savingHint && (
                      <p className={`text-[11px] mb-3 font-medium ${t.highlight ? "text-brand-500" : "text-success"}`}>
                        {price!.savingHint}
                      </p>
                    )}
                    {!price!.savingHint && <div className="mb-3" />}
                  </>
                )}
                <ul className={`text-xs space-y-2 mb-6 ${t.highlight ? "" : "text-ink"}`}>
                  {t.bullets.map(b => (
                    <li key={b} className="flex items-baseline gap-2">
                      <span className="text-brand-500">·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  href={cycle === "annual" && !isFreeTier ? `${t.href}&cycle=annual` : t.href}
                  variant={t.highlight ? "primary" : "secondary"}
                  size="md"
                  className="w-full"
                >
                  {t.cta}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-ink-subtle mt-6">
          Prix HT, TVA française 20% calculée automatiquement par Stripe au checkout (autoliquidation pour les clients UE assujettis).
          Annuel = équivalent à 9 mois de mensuel facturés (3 mois offerts).
          Trial 14 jours gratuit dispo sur Pro. Carte test :{" "}
          <code className="font-mono text-xs bg-surface px-2 py-0.5 rounded">4242 4242 4242 4242</code>
        </p>
      </Section>

      <Section py="lg" tone="surface" eyebrow="Questions">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {[
            {
              q: "Combien de temps avant les 1ers résultats ?",
              a: "Le 1er snapshot tourne en 30 secondes après création de la marque. Les recommandations Haiku arrivent ~10 secondes plus tard. Le suivi continu démarre immédiatement.",
            },
            {
              q: "Quels LLMs sont testés ?",
              a: "GPT-4o (OpenAI), Claude Sonnet 4.6 (Anthropic), Gemini 2.5 Pro (Google), Perplexity Sonar Pro. Le plan Free se limite à GPT-4o.",
            },
            {
              q: "Combien de prompts ?",
              a: "30 prompts FR catégorisés (recherche directe, use-case, concurrentiel) générés à partir de votre catégorie et concurrents. Templates publiés sur GitHub.",
            },
            {
              q: "Et le RGPD ?",
              a: "Données hébergées Supabase Frankfurt. Aucune donnée personnelle dans les prompts. Audit RGPD complet sur demande contractuelle.",
            },
          ].map((item, i) => (
            <div key={i}>
              <h3 className="text-xl font-medium text-ink mb-2 tracking-tightish">{item.q}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/saas/faq" className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 hover:underline">
            Voir toutes les questions →
          </Link>
        </div>
      </Section>

      <Section py="lg" tone="dark">
        <div className="max-w-2xl">
          <Eyebrow variant="muted" className="mb-3 text-amber">Prêt à tester ?</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white text-balance mb-4 leading-tight">
            Démarrez gratuitement en 60 secondes.
          </h2>
          <p className="text-base text-white/85 mb-6 leading-relaxed">
            Plan Free sans carte bancaire. Upgrade Starter (79€/mois) à tout moment via Stripe.
          </p>
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
