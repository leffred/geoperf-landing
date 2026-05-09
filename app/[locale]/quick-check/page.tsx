// S31 Session 1 — Page /quick-check : tool gratuit "Votre marque est-elle citée par ChatGPT ?"
// Server component shell : SEO + i18n + categories list, passe au client component QuickCheckForm.

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { QuickCheckForm, type CategoryOption, type QuickCheckI18n } from "./QuickCheckForm";

const SITE = "https://geoperf.com";

export const dynamic = "force-static";
export const revalidate = 86400;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn
    ? "Quick LLM Check — Is your brand cited by ChatGPT?"
    : "Quick LLM Check — Votre marque est-elle citée par ChatGPT ?";
  const description = isEn
    ? "Free 5-second test : check whether ChatGPT, Gemini, Claude and Perplexity cite your brand in 2026. No signup required, 5 free checks per day."
    : "Test gratuit 5 secondes : vérifiez si ChatGPT, Gemini, Claude et Perplexity citent votre marque en 2026. Sans inscription, 5 checks gratuits/jour.";
  const url = isEn ? `${SITE}/en/quick-check` : `${SITE}/quick-check`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        fr: `${SITE}/quick-check`,
        en: `${SITE}/en/quick-check`,
        "x-default": `${SITE}/quick-check`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Geoperf",
      images: [{ url: `${SITE}/api/og?title=${encodeURIComponent("Quick LLM Check")}`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// 14 macro-secteurs Apollo (pas les 138 sous-cats — le Quick Check vise une question large
// pour les LLMs). Mappés depuis lib/seo/sectors/types.ts:SectorMacro.
const CATEGORIES_FR: CategoryOption[] = [
  { slug: "tech-saas", label: "Tech & SaaS B2B" },
  { slug: "finance", label: "Finance, banque, assurance" },
  { slug: "industrie", label: "Industrie & manufacturing" },
  { slug: "services-pro", label: "Services professionnels (conseil, RH, juridique)" },
  { slug: "sante", label: "Santé, pharma, biotech" },
  { slug: "immobilier", label: "Immobilier & construction" },
  { slug: "logistique", label: "Logistique & transport" },
  { slug: "media-marketing", label: "Média, marketing, communication" },
  { slug: "education", label: "Éducation & formation" },
  { slug: "secteur-public", label: "Secteur public & associatif" },
  { slug: "retail", label: "Retail & grande distribution" },
  { slug: "energie", label: "Énergie & environnement" },
  { slug: "hotellerie", label: "Hôtellerie, tourisme, restauration" },
  { slug: "agroalimentaire", label: "Agriculture & agroalimentaire" },
];

const CATEGORIES_EN: CategoryOption[] = [
  { slug: "tech-saas", label: "Tech & B2B SaaS" },
  { slug: "finance", label: "Finance, banking, insurance" },
  { slug: "industrie", label: "Industry & manufacturing" },
  { slug: "services-pro", label: "Professional services (consulting, HR, legal)" },
  { slug: "sante", label: "Healthcare, pharma, biotech" },
  { slug: "immobilier", label: "Real estate & construction" },
  { slug: "logistique", label: "Logistics & transport" },
  { slug: "media-marketing", label: "Media, marketing, communication" },
  { slug: "education", label: "Education & training" },
  { slug: "secteur-public", label: "Public sector & non-profit" },
  { slug: "retail", label: "Retail & distribution" },
  { slug: "energie", label: "Energy & environment" },
  { slug: "hotellerie", label: "Hospitality, tourism, restaurants" },
  { slug: "agroalimentaire", label: "Agriculture & food" },
];

export default async function QuickCheckPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const categories = isEn ? CATEGORIES_EN : CATEGORIES_FR;

  const i18n: QuickCheckI18n = isEn
    ? {
        domainLabel: "Your brand domain",
        domainPlaceholder: "amundi.com",
        categoryLabel: "Industry",
        categoryPlaceholder: "Select your industry",
        submit: "Run the check (5 sec)",
        submitting: "Querying 4 LLMs...",
        cooldownLabel: "Wait {n}s before next check",
        errorInvalidDomain: "Invalid domain. Example: amundi.com",
        errorRateLimit: "Free limit reached (5 checks / 24h). Sign up for 50/month.",
        errorGeneric: "An error occurred. Please retry in a few seconds.",
        resultEyebrow: "Result",
        resultTitle: "{domain} is cited by {n} of {total} LLMs",
        citedBy: "Cited",
        notCited: "Not cited",
        costLabel: "Cost: ${cost}",
        latencyLabel: "{ms}ms",
        emailCtaTitle: "Want the full audit?",
        emailCtaBody:
          "30 prompts × 4 LLMs, source attribution, share-of-voice vs your competitors, sectoral benchmark. Delivered by email within 7 days. Free.",
        emailLabel: "Pro email",
        emailPlaceholder: "you@company.com",
        emailSubmit: "Receive the audit",
        emailSubmitting: "Sending...",
        emailSuccess: "Got it. Audit en route — you'll receive it within 7 days.",
        optInLabel: "I agree to receive my audit via email and to Geoperf processing my data per the",
        optInLink: "privacy policy",
        errorOptIn: "You must agree to receive the audit",
      }
    : {
        domainLabel: "Domaine de votre marque",
        domainPlaceholder: "amundi.com",
        categoryLabel: "Secteur",
        categoryPlaceholder: "Sélectionnez votre secteur",
        submit: "Lancer le check (5 sec)",
        submitting: "Interrogation des 4 LLM...",
        cooldownLabel: "Patientez {n}s avant un nouveau check",
        errorInvalidDomain: "Domaine invalide. Exemple : amundi.com",
        errorRateLimit: "Limite atteinte (5 checks gratuits / 24h). Créez un compte pour 50/mois.",
        errorGeneric: "Erreur. Réessayez dans quelques secondes.",
        resultEyebrow: "Résultat",
        resultTitle: "{domain} est cité par {n} LLM sur {total}",
        citedBy: "Cité",
        notCited: "Non cité",
        costLabel: "Coût : ${cost}",
        latencyLabel: "{ms}ms",
        emailCtaTitle: "Vous voulez l'audit complet ?",
        emailCtaBody:
          "30 prompts × 4 LLM, sources d'autorité attribuées, share-of-voice face à vos concurrents, benchmark sectoriel. Délivré par email sous 7 jours. Gratuit.",
        emailLabel: "Email pro",
        emailPlaceholder: "vous@entreprise.com",
        emailSubmit: "Recevoir l'audit",
        emailSubmitting: "Envoi...",
        emailSuccess: "C'est noté. L'audit arrive — vous le recevrez sous 7 jours.",
        optInLabel: "J'accepte de recevoir mon audit par email et que Geoperf traite mes données selon la",
        optInLink: "politique de confidentialité",
        errorOptIn: "Vous devez accepter pour recevoir l'audit",
      };

  // Schema.org SoftwareApplication pour SEO + GEO.
  const applicationLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: isEn ? "Geoperf Quick LLM Check" : "Geoperf Quick LLM Check",
    description: isEn
      ? "Free 5-second tool to check whether ChatGPT, Gemini, Claude and Perplexity cite your B2B brand."
      : "Tool gratuit 5 secondes pour vérifier si ChatGPT, Gemini, Claude et Perplexity citent votre marque B2B.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any (web)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    creator: { "@type": "Organization", name: "Geoperf" },
    url: isEn ? `${SITE}/en/quick-check` : `${SITE}/quick-check`,
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationLd) }} />
      <Header />

      <Section py="lg" tone="white">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-16 items-start max-w-5xl">
          {/* Pitch */}
          <div>
            <Eyebrow className="mb-3">{isEn ? "Free tool" : "Tool gratuit"}</Eyebrow>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink mb-5 leading-tight text-balance">
              {isEn
                ? "Is your brand cited by ChatGPT?"
                : "Votre marque est-elle citée par ChatGPT ?"}
            </h1>
            <p className="text-base text-ink-muted leading-relaxed mb-6 max-w-xl">
              {isEn
                ? "5-second test on the 4 major LLMs (ChatGPT, Gemini, Claude, Perplexity). No signup. Free. We send you the full audit by email if you want."
                : "Test 5 secondes sur les 4 LLM majeurs (ChatGPT, Gemini, Claude, Perplexity). Sans inscription. Gratuit. Audit complet par email si vous le voulez."}
            </p>
            <ul className="space-y-2 text-sm text-ink-muted">
              {(isEn
                ? [
                    "1 representative prompt run on 4 LLMs in parallel",
                    "Result in 5-8 seconds",
                    "Live cost: ~$0.01 per check (we cover it)",
                    "5 free checks per day per IP — no signup required",
                  ]
                : [
                    "1 prompt représentatif exécuté sur 4 LLM en parallèle",
                    "Résultat en 5-8 secondes",
                    "Coût réel : ~$0.01 par check (on prend en charge)",
                    "5 checks gratuits / jour / IP — sans inscription",
                  ]
              ).map((b) => (
                <li key={b} className="flex items-baseline gap-2">
                  <span className="text-amber">·</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div>
            <QuickCheckForm categories={categories} i18n={i18n} />
          </div>
        </div>
      </Section>

      <Section py="md" tone="surface">
        <div className="max-w-3xl">
          <Eyebrow className="mb-3">{isEn ? "How it works" : "Comment ça marche"}</Eyebrow>
          <h2 className="text-xl md:text-2xl font-medium text-ink tracking-tight mb-3">
            {isEn ? "30 seconds, 4 LLMs, 1 result" : "30 secondes, 4 LLM, 1 résultat"}
          </h2>
          <ol className="text-sm text-ink-muted leading-relaxed space-y-2 list-decimal list-inside">
            <li>
              {isEn
                ? "We ask each LLM the same question : "
                : "On pose la même question aux 4 LLM : "}
              <em>
                {isEn
                  ? "“Who are the top 5 leaders in [your industry] in 2026?”"
                  : "« Quels sont les 5 leaders du secteur [votre industrie] en France en 2026 ? »"}
              </em>
            </li>
            <li>
              {isEn
                ? "We check whether your domain is named in the response, and which sources are cited."
                : "On vérifie si votre domaine est nommé dans la réponse, et quelles sources sont citées."}
            </li>
            <li>
              {isEn
                ? "You see immediately which LLMs cite you (and which don't)."
                : "Vous voyez immédiatement quels LLM vous citent (et lesquels non)."}
            </li>
            <li>
              {isEn
                ? "If you want the full audit (30 prompts, source attribution, share-of-voice), drop your email."
                : "Pour l'audit complet (30 prompts, sources d'autorité, share-of-voice), laissez votre email."}
            </li>
          </ol>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
