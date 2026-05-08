// S29 Session 3 — page /insights/[slug] : sert un cluster du registre OU
// fallback sur le placeholder coming-soon (catch-all des slugs inconnus).
// Strategy : force-static + dynamicParams = true. generateStaticParams retourne
// les 50 slugs clusters pour pre-build statique au deploy. Slugs inconnus
// passent en dynamic render (placeholder).

import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ClusterLayout } from "@/components/seo/ClusterLayout";
import { getCluster, listClusterSlugs, clusterCousins } from "@/lib/seo/clusters";
import { type Locale, type PillarSlug } from "@/lib/seo/internal-links";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

const SITE = "https://geoperf.com";

const PILLAR_LABELS_FR: Record<PillarSlug, string> = {
  "visibilite-llm": "Visibilité LLM : guide complet",
  "geo-generative-engine-optimization": "GEO : Generative Engine Optimization",
  "chatgpt-marketing": "ChatGPT marketing : tout savoir",
  "perplexity-pour-marques": "Perplexity pour les marques",
  "gemini-search-marketing": "Gemini search marketing",
  "ai-search-vs-seo": "AI search vs SEO classique",
  "llm-brand-monitoring": "LLM brand monitoring",
  "optimisation-pour-ia": "Optimisation pour l'IA",
  "generative-ai-marketing": "IA générative pour le marketing",
  "llm-citation-strategy": "Stratégie de citation LLM",
};

const PILLAR_LABELS_EN: Record<PillarSlug, string> = {
  "visibilite-llm": "LLM visibility: full guide",
  "geo-generative-engine-optimization": "GEO: Generative Engine Optimization",
  "chatgpt-marketing": "ChatGPT marketing playbook",
  "perplexity-pour-marques": "Perplexity for brands",
  "gemini-search-marketing": "Gemini search marketing",
  "ai-search-vs-seo": "AI search vs traditional SEO",
  "llm-brand-monitoring": "LLM brand monitoring",
  "optimisation-pour-ia": "AI optimization fundamentals",
  "generative-ai-marketing": "Generative AI for marketing",
  "llm-citation-strategy": "LLM citation strategy",
};

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const entry = getCluster(slug);
  if (!entry) {
    return {
      title: "Article en préparation — Geoperf",
      robots: { index: false, follow: true },
    };
  }
  const c = (locale === "en" && entry.en) ? entry.en : entry.fr;
  const url = locale === "en" ? `${SITE}/en/insights/${slug}` : `${SITE}/insights/${slug}`;
  return {
    title: c.title,
    description: c.metaDescription,
    alternates: {
      canonical: url,
      languages: {
        fr: `${SITE}/insights/${slug}`,
        en: entry.en ? `${SITE}/en/insights/${slug}` : `${SITE}/insights/${slug}`,
        "x-default": `${SITE}/insights/${slug}`,
      },
    },
    openGraph: {
      title: c.title,
      description: c.metaDescription,
      url,
      type: "article",
      siteName: "Geoperf",
      images: [
        {
          url: `${SITE}/api/og?title=${encodeURIComponent(c.title)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: { card: "summary_large_image", title: c.title, description: c.metaDescription },
  };
}

// Pre-build : 1 entry par slug cluster + locale qui a une version. Les slugs
// inconnus passent en dynamic render (placeholder coming-soon).
export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  const params: { locale: string; slug: string }[] = [];
  for (const slug of listClusterSlugs("fr")) {
    params.push({ locale: "fr", slug });
  }
  for (const slug of listClusterSlugs("en")) {
    params.push({ locale: "en", slug });
  }
  return params;
}

// Best-effort pillar guess pour le placeholder fallback.
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
  if (s.includes("ai-search"))
    return { href: "/guide/ai-search-vs-seo", label: "AI search vs SEO" };
  if (s.includes("brand-monitoring") || s.includes("monitoring") || s.includes("alertes") || s.includes("audit"))
    return { href: "/guide/llm-brand-monitoring", label: "LLM brand monitoring" };
  if (s.includes("optimisation") || s.includes("schema") || s.includes("longue-traine"))
    return { href: "/guide/optimisation-pour-ia", label: "Optimisation pour IA" };
  if (s.includes("generative") || s.includes("ia-generative") || s.includes("prompt"))
    return { href: "/guide/generative-ai-marketing", label: "Generative AI marketing" };
  if (s.includes("citation"))
    return { href: "/guide/llm-citation-strategy", label: "LLM citation strategy" };
  return { href: "/guide/visibilite-llm", label: "Visibilité LLM" };
}

export default async function InsightPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const entry = getCluster(slug);

  // Cluster connu : render via ClusterLayout
  if (entry) {
    const isEn = locale === "en";
    const c = (isEn && entry.en) ? entry.en : entry.fr;
    const labelMap = isEn ? PILLAR_LABELS_EN : PILLAR_LABELS_FR;
    const cousins = clusterCousins(slug, isEn ? "en" : "fr", 3);
    const Body = c.Body;
    return (
      <ClusterLayout
        locale={isEn ? "en" : "fr"}
        slug={slug}
        title={c.title}
        intro={c.intro}
        publishedAt={c.publishedAt}
        parentPillar={{ slug: entry.parentPillar, label: labelMap[entry.parentPillar] }}
        body={<Body />}
        cousinClusters={cousins}
        ctaPrimaryHref="/etude-sectorielle"
        ctaPrimaryLabel={isEn ? "Get my sector study" : "Demander mon étude sectorielle"}
      />
    );
  }

  // Slug inconnu : placeholder coming-soon (S29 hotfix)
  const pillar = pillarForSlug(slug);
  const isEN = locale === "en";

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      <Section py="lg" tone="white">
        <div className="max-w-2xl mx-auto text-center">
          <Eyebrow className="mb-4">INSIGHTS</Eyebrow>
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
