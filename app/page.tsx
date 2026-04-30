// Home — Geoperf. Refonte S7 : 2 CTAs distincts, aucun mailto, aucun form de capture.
// L'étude sectorielle devient un bonus de l'onboarding free → /signup?source=etude.

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
            <Link href="/login" className="hover:underline text-navy">Connexion</Link>
            <Link href="/contact" className="hover:underline text-navy hidden md:inline">Contact</Link>
            <Link href="/signup" className="bg-amber text-navy px-4 py-2 text-sm font-medium hover:bg-amber/90 transition">
              Créer un compte
            </Link>
          </div>
        }
      />

      <section className="px-6 md:px-8 py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.4fr_1fr] gap-12 md:gap-16 items-center">
          <div>
            <Eyebrow variant="code" className="mb-5">
              Monitoring LLM
            </Eyebrow>
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] text-ink text-balance">
              Surveillez votre visibilité dans <span className="text-brand-500">ChatGPT, Claude, Gemini, Perplexity</span>.
            </h1>
            <p className="mt-6 text-lg text-ink-muted leading-relaxed max-w-xl">
              Geoperf interroge chaque semaine 4 à 6 LLMs sur 30-300 prompts représentatifs de votre secteur.
              Rang, citation, share-of-voice et recommandations actionnables — tout dans un dashboard unifié.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/signup" size="lg">Suivre ma marque dans les LLM</Button>
              <Button href="/signup?source=etude" variant="secondary" size="lg">Recevoir l&apos;étude sectorielle gratuite</Button>
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

      <section className="px-6 md:px-8 py-20 md:py-28 bg-surface border-y border-DEFAULT">
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

      <section className="px-6 md:px-8 py-20 md:py-28">
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
              <div key={p.name} className={`p-5 ${p.highlight ? "bg-navy text-white ring-2 ring-amber" : "bg-surface border border-DEFAULT"}`}>
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

      <section className="px-6 md:px-8 py-20 md:py-28 bg-navy text-white">
        <div className="max-w-3xl mx-auto">
          <Eyebrow className="mb-3" variant="code">Pour démarrer</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white text-balance mb-4">
            Créez votre compte gratuit en 60 secondes.
          </h2>
          <p className="text-base text-white/85 leading-relaxed max-w-xl mb-8">
            Une marque, 30 prompts, ChatGPT — gratuit pour toujours. Upgrade Starter à 79€/mois si vous voulez les 4 LLMs et la cadence hebdo.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="bg-amber text-navy px-6 py-3 text-base font-medium hover:bg-amber/90 transition">
              Suivre ma marque
            </Link>
            <Link href="/signup?source=etude" className="border border-white/40 text-white px-6 py-3 text-base font-medium hover:bg-white/10 transition">
              Recevoir l&apos;étude sectorielle
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
