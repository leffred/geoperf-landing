// S29 hotfix - Page coming-soon générique pour /insights/[slug].
// Les pillars créés en Session 2 contiennent des liens vers ~50 clusters /insights/* qui
// seront générés en Session 3. En attendant, cette page absorbe les 404 et propose
// un lien retour vers le guide pillar associé.
// noindex,follow → Google ne référence pas ces placeholders mais suit les liens internes.

import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

// S30 Session 2 — page placeholder sans DB lookup, peut etre cachee CDN.
// dynamic = "force-static" + dynamicParams autorise le catch-all sur slugs inconnus.
// revalidate 86400s = 24h cache, refresh background quand un cluster reel sera publie.
export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Article en préparation — Geoperf",
  robots: { index: false, follow: true },
};

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Map slug → pillar pertinent (best-effort, fallback /guide/visibilite-llm)
function pillarForSlug(slug: string): { href: string; label: string } {
  const s = slug.toLowerCase();
  if (s.includes("geo") || s.includes("vs-seo") || s.includes("optimiser-article"))
    return { href: "/guide/geo-generative-engine-optimization", label: "GEO — Generative Engine Optimization" };
  if (s.includes("chatgpt") || s.includes("openai"))
    return { href: "/guide/chatgpt-marketing", label: "ChatGPT marketing" };
  if (s.includes("perplexity") || s.includes("sonar"))
    return { href: "/guide/perplexity-pour-marques", label: "Perplexity pour marques" };
  if (s.includes("gemini") || s.includes("google-ai"))
    return { href: "/guide/gemini-search-marketing", label: "Gemini search marketing" };
  if (s.includes("ai-search") || s.includes("vs-seo"))
    return { href: "/guide/ai-search-vs-seo", label: "AI search vs SEO" };
  if (s.includes("brand-monitoring") || s.includes("monitoring") || s.includes("kpi") || s.includes("audit"))
    return { href: "/guide/llm-brand-monitoring", label: "LLM brand monitoring" };
  if (s.includes("optimisation") || s.includes("optimization-pour-ia"))
    return { href: "/guide/optimisation-pour-ia", label: "Optimisation pour IA" };
  if (s.includes("generative") || s.includes("ia-generative") || s.includes("prompt"))
    return { href: "/guide/generative-ai-marketing", label: "Generative AI marketing" };
  if (s.includes("citation"))
    return { href: "/guide/llm-citation-strategy", label: "LLM citation strategy" };
  return { href: "/guide/visibilite-llm", label: "Visibilité LLM" };
}

export default async function InsightsPlaceholderPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const pillar = pillarForSlug(slug);
  const isEN = locale === "en";

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      <Section py="lg" tone="white">
        <div className="max-w-2xl mx-auto text-center">
          <Eyebrow className="mb-4">{isEN ? "INSIGHTS" : "INSIGHTS"}</Eyebrow>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-4">
            {isEN ? "Article coming soon" : "Article en préparation"}
          </h1>
          <p className="text-base text-ink-muted mb-8">
            {isEN
              ? "This in-depth article is being written by our editorial team and will be published soon. In the meantime, explore the related guide:"
              : "Cet article approfondi est en cours de rédaction par notre équipe éditoriale et sera publié prochainement. En attendant, explore le guide associé :"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
            <Button href={pillar.href} variant="primary" size="md">
              {isEN ? "Read the guide" : "Lire le guide"} : {pillar.label}
            </Button>
            <Button href="/etude-sectorielle" variant="secondary" size="md">
              {isEN ? "Free sector study" : "Étude sectorielle gratuite"}
            </Button>
          </div>
          <p className="text-xs text-ink-subtle font-mono">
            {isEN
              ? "Want to be notified when this article goes live? "
              : "Tu veux être notifié quand l'article sort ? "}
            <Link href="/signup" className="text-brand-500 hover:underline">
              {isEN ? "Create a free account" : "Crée un compte gratuit"}
            </Link>
          </p>
        </div>
      </Section>
      <Footer />
    </main>
  );
}

// Pas de generateStaticParams : on accepte n'importe quel slug en dynamic render.
// Quand Session 3 livrera les vrais clusters, ce catch-all sera supprimé / remplacé
// par les vraies pages générées sous chaque slug exact.
