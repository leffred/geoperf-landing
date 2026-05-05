// Home — Geoperf. Refonte S18 (PME FR + sections SEO/GEO + FT-style factuel).
// Sections : hero, problem stats, how-it-works, audience, why-geoperf, pricing preview, cta final.

import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

const FEATURES = [
  {
    label: "01",
    title: "Suivez votre marque",
    body: "30 à 300 prompts ciblés par marque, interrogés sur ChatGPT, Claude, Gemini, Perplexity (+Mistral, Grok en Pro). Vous voyez votre rang moyen, votre taux de citation, votre share-of-voice.",
  },
  {
    label: "02",
    title: "Comparez aux concurrents",
    body: "Heatmap 6 LLMs × N concurrents. Détection automatique des entrants. Sources autorité priorisées par fréquence de citation cross-LLM.",
  },
  {
    label: "03",
    title: "Améliorez votre référencement IA",
    body: "Recommandations actionnables générées par Claude Haiku après chaque snapshot : sources à cibler, gaps de contenu, alertes concurrentielles. Alertes email instantanées.",
  },
];

const PROBLEM_STATS = [
  {
    figure: "+82%",
    label: "Recherches IA YoY",
    body: "Volumes de recherche traités par les LLM grand public en 2025 vs 2024. Source : Similarweb panel ChatGPT/Perplexity, T1 2025.",
  },
  {
    figure: "1 sur 3",
    label: "Achats B2B influencés",
    body: "Décideurs B2B qui consultent un LLM au moins une fois durant leur cycle d'évaluation fournisseur. Source : Gartner 2025.",
  },
  {
    figure: "0",
    label: "Outil FR de monitoring",
    body: "Solutions monitoring LLM hébergées en UE et facturées en EUR avant Geoperf. La majorité des concurrents sont US, basés en USD, hors RGPD strict.",
  },
];

const AUDIENCES = [
  {
    role: "CMO PME / ETI",
    use: "Mesure l'autorité de la marque dans les LLM. Identifie les sources média à cibler en RP pour faire monter le rang moyen.",
  },
  {
    role: "Head of Marketing scale-up",
    use: "Vérifie chaque semaine si la marque est citée à côté des concurrents directs. Alertes quand un concurrent gagne en visibilité.",
  },
  {
    role: "Directeur Communication ESN",
    use: "Suit le share-of-voice sur les requêtes prospect type \"meilleure ESN data en France\". Brief les agences avec des chiffres.",
  },
  {
    role: "Founder SaaS B2B FR",
    use: "Capture les early adopters qui découvrent les outils via ChatGPT. Mesure l'effet d'un coup éditorial (podcast, tribune).",
  },
];

const DIFFERENTIATORS = [
  {
    title: "FR / UE de bout en bout",
    body: "Hébergement Supabase Frankfurt, factures EUR avec TVA UE, équipe FR. RGPD strict, contrat DPA disponible.",
  },
  {
    title: "Plan Free permanent, sans CB",
    body: "1 marque, 1 LLM (GPT-4o), 30 prompts, snapshot mensuel — gratuit pour toujours. Upgrade Starter à 79 €/mois si besoin de cadence hebdo.",
  },
  {
    title: "Funnel intégré",
    body: "Recommandations actionnables après chaque snapshot. Audit GEO consulting de Jourdechance disponible en option pour passer du monitoring à l'action éditoriale.",
  },
  {
    title: "Tarification mid-market",
    body: "5 plans de 0 à 799 €/mois. Pas de pricing par seat caché ni de minimum annuel. Annulation 1 clic depuis le portail Stripe.",
  },
];

const PRICING_PREVIEW = [
  { name: "Free", price: 0, items: ["1 marque", "1 LLM", "30 prompts", "Mensuel"] },
  { name: "Starter", price: 79, items: ["1 marque", "4 LLMs", "50 prompts", "Hebdo"] },
  { name: "Growth", price: 199, items: ["1 marque", "200 prompts", "9 topics", "5 seats"], highlight: true },
  { name: "Pro", price: 399, items: ["3 marques", "6 LLMs", "200 prompts", "Topics ∞"] },
  { name: "Agency", price: 799, items: ["10 marques", "Tous LLMs", "300 prompts", "White-label"] },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header
        rightSlot={
          <div className="flex items-center gap-4 text-sm">
            <Link href="/saas" className="hover:underline text-navy">Tarifs</Link>
            <Link href="/saas/faq" className="hover:underline text-navy hidden sm:inline">FAQ</Link>
            <Link href="/login" className="hover:underline text-navy">Connexion</Link>
            <Link href="/contact" className="hover:underline text-navy hidden md:inline">Contact</Link>
            <Link href="/signup" className="bg-amber text-navy px-4 py-2 text-sm font-medium hover:bg-amber/90 transition">
              Créer un compte
            </Link>
          </div>
        }
      />

      {/* HERO */}
      <section className="px-6 md:px-8 py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.4fr_1fr] gap-12 md:gap-16 items-center">
          <div>
            <Eyebrow variant="code" className="mb-5">Monitoring LLM</Eyebrow>
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] text-ink text-balance">
              Surveillez votre visibilité dans <span className="text-brand-500">ChatGPT, Claude, Gemini, Perplexity</span>.
            </h1>
            <p className="mt-6 text-lg text-ink-muted leading-relaxed max-w-xl">
              Geoperf interroge chaque semaine 4 à 6 LLMs sur 30-300 prompts représentatifs de votre secteur.
              Rang, citation, share-of-voice et recommandations actionnables — tout dans un dashboard unifié.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/signup" size="lg">Suivre ma marque dans les LLM</Button>
              <Button href="/etude-sectorielle" variant="secondary" size="lg">Recevoir l&apos;étude sectorielle gratuite</Button>
            </div>
            <p className="mt-4 text-xs font-mono text-ink-subtle">
              Sans carte bancaire · Plan Free permanent · Hébergé Frankfurt (UE)
            </p>
          </div>

          <Card variant="surface" className="p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-ink">Top mentions · Asset Mgmt</span>
              <span className="font-mono text-[11px] text-ink-subtle">Q2 26</span>
            </div>
            <div className="space-y-2.5">
              {[
                { name: "Amundi", v: 78 },
                { name: "BNP AM", v: 62 },
                { name: "AXA IM", v: 48 },
                { name: "CA AM", v: 34 },
              ].map((b, i) => (
                <div key={b.name} className="flex items-center gap-3">
                  <span className="text-xs text-ink-muted w-16 truncate">{b.name}</span>
                  <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${i < 3 ? "bg-brand-500" : "bg-brand-500/40"}`} style={{ width: `${b.v}%` }} />
                  </div>
                  <span className="font-mono text-xs text-ink tabular-nums w-8 text-right">{b.v}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 pt-3 border-t border-DEFAULT text-[11px] text-ink-subtle">
              Aperçu — données anonymisées issues de l&apos;étude Asset Mgmt Q2 26.
            </p>
          </Card>
        </div>
      </section>

      {/* SECTION : LE PROBLEME (3 stats factuelles) */}
      <section className="px-6 md:px-8 py-20 md:py-28 bg-surface border-y border-DEFAULT">
        <div className="max-w-6xl mx-auto">
          <Eyebrow className="mb-3">Pourquoi maintenant</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink max-w-3xl text-balance leading-tight">
            Vos prospects interrogent les LLM avant de vous trouver — et vous ne le mesurez pas.
          </h2>
          <p className="mt-4 text-base text-ink-muted max-w-2xl leading-relaxed">
            Le SEO classique mesure votre rang sur Google. Geoperf mesure ce que ChatGPT, Claude, Gemini et Perplexity disent de vous quand un prospect leur pose une question type &laquo;&nbsp;quelle est la meilleure agence digitale FR&nbsp;?&nbsp;&raquo;.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {PROBLEM_STATS.map((s) => (
              <Card key={s.label} variant="default" className="border-l-2 border-l-amber">
                <p className="font-serif text-4xl font-medium text-ink tracking-tight">{s.figure}</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-eyebrow text-brand-500">{s.label}</p>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">{s.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION : COMMENT CA MARCHE */}
      <section className="px-6 md:px-8 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <Eyebrow className="mb-3">Comment ça marche</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink max-w-2xl text-balance">
            3 étapes pour piloter votre référencement IA.
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <Card key={f.label} variant="default">
                <span className="font-mono text-xs text-brand-500">{f.label}</span>
                <h3 className="mt-4 text-xl font-medium text-ink leading-tight">{f.title}</h3>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">{f.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION : POUR QUI */}
      <section className="px-6 md:px-8 py-20 md:py-28 bg-surface border-y border-DEFAULT">
        <div className="max-w-6xl mx-auto">
          <Eyebrow className="mb-3">Pour qui</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink max-w-2xl text-balance leading-tight">
            Conçu pour les équipes marketing PME et ETI françaises.
          </h2>
          <p className="mt-4 text-base text-ink-muted max-w-2xl leading-relaxed">
            Sociétés de 50 à 500 employés, B2B principalement, qui veulent passer du SEO au GEO sans monter une équipe data interne.
          </p>
          <div className="mt-12 grid md:grid-cols-2 gap-4">
            {AUDIENCES.map((a) => (
              <Card key={a.role} variant="default">
                <h3 className="text-lg font-medium text-ink leading-tight">{a.role}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{a.use}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION : POURQUOI GEOPERF */}
      <section className="px-6 md:px-8 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <Eyebrow className="mb-3">Différenciateurs</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink max-w-2xl text-balance leading-tight">
            4 raisons concrètes de choisir Geoperf.
          </h2>
          <div className="mt-12 grid md:grid-cols-2 gap-4">
            {DIFFERENTIATORS.map((d) => (
              <Card key={d.title} variant="default" className="border-l-2 border-l-brand-500">
                <h3 className="text-lg font-medium text-ink leading-tight">{d.title}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{d.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION : TARIFS */}
      <section className="px-6 md:px-8 py-20 md:py-28 bg-surface border-y border-DEFAULT">
        <div className="max-w-6xl mx-auto">
          <Eyebrow className="mb-3">Tarifs</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink max-w-2xl text-balance mb-3">
            5 plans, du gratuit à l&apos;agence.
          </h2>
          <p className="text-base text-ink-muted max-w-xl mb-10">
            Plan Free permanent, sans carte bancaire. Annulation en 1 clic depuis le portail Stripe.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {PRICING_PREVIEW.map((p) => (
              <div key={p.name} className={`p-5 ${p.highlight ? "bg-navy text-white ring-2 ring-amber" : "bg-white border border-DEFAULT"}`}>
                <p className={`font-mono text-xs uppercase tracking-widest ${p.highlight ? "text-amber" : "text-ink-muted"} mb-2`}>{p.name}</p>
                <p className="font-serif text-3xl font-medium mb-3">
                  {p.price}<span className={`text-sm ml-1 ${p.highlight ? "opacity-70" : "text-ink-muted"}`}>€/mois</span>
                </p>
                <ul className={`text-xs space-y-1 ${p.highlight ? "" : "text-ink"}`}>
                  {p.items.map((i) => (
                    <li key={i} className="flex items-baseline gap-2">
                      <span className="text-amber">·</span>
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/saas" size="md">Voir les détails</Button>
            <Button href="/saas/faq" variant="secondary" size="md">FAQ</Button>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 md:px-8 py-20 md:py-28 bg-navy text-white">
        <div className="max-w-3xl mx-auto">
          <Eyebrow className="mb-3" variant="code">Pour démarrer</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white text-balance mb-4">
            Créez votre compte gratuit en 60 secondes.
          </h2>
          <p className="text-base text-white/85 leading-relaxed max-w-xl mb-8">
            Une marque, 30 prompts, ChatGPT — gratuit pour toujours. Upgrade Starter à 79 €/mois si vous voulez les 4 LLMs et la cadence hebdo.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="bg-amber text-navy px-6 py-3 text-base font-medium hover:bg-amber/90 transition">
              Suivre ma marque
            </Link>
            <Link href="/etude-sectorielle" className="border border-white/40 text-white px-6 py-3 text-base font-medium hover:bg-white/10 transition">
              Recevoir l&apos;étude sectorielle
            </Link>
            <Link href="/contact" className="text-white/85 px-6 py-3 text-base font-medium hover:text-white transition underline-offset-4 hover:underline">
              Demander un audit GEO
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
