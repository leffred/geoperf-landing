// /saas — Geoperf SaaS marketing page. S28 i18n : sections + features + differentiators + FAQ traduits via t.raw().
// TIERS bullets restent en const FR partagé (le contenu des plans est technique et n'a pas de version EN
// distincte pour l'instant — Phase 3 finira avec la grille technique multi-locale).

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { priceDisplay, type TierKey } from "@/lib/saas-pricing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com";
  return {
    title: t("saasTitle"),
    description: t("saasDescription"),
    alternates: {
      canonical: locale === "fr" ? `${siteUrl}/saas` : `${siteUrl}/${locale}/saas`,
      languages: {
        fr: `${siteUrl}/saas`,
        en: `${siteUrl}/en/saas`,
        "x-default": `${siteUrl}/saas`,
      },
    },
  };
}

// TIER_DEFS : technique + bullets restent FR partagé (les LLM/limits sont des metrics
// techniques pas le marketing). Les `name` + `cta` sont localisables via messages.saas.tiers.
type TierDef = {
  key: "free" | "starter" | "growth" | "pro" | "agency";
  price: number;
  href: string;
  bullets: string[];
  highlight: boolean;
};
const TIER_DEFS: TierDef[] = [
  {
    key: "free",
    price: 0,
    href: "/signup",
    bullets: ["1 marque", "1 LLM (ChatGPT)", "30 prompts", "1 topic", "Snapshot mensuel", "Aucun export"],
    highlight: false,
  },
  {
    key: "starter",
    price: 79,
    href: "/signup?next=/app/billing",
    bullets: ["1 marque", "4 LLMs", "50 prompts", "3 topics", "Snapshot hebdo", "Recos IA + alertes", "Export CSV/PDF"],
    highlight: false,
  },
  {
    key: "growth",
    price: 199,
    href: "/signup?next=/app/billing",
    bullets: ["1 marque", "4 LLMs", "200 prompts", "9 topics", "5 seats inclus", "Sentiment ✨", "Webhooks Slack 🔌"],
    highlight: true,
  },
  {
    key: "pro",
    price: 399,
    href: "/signup?next=/app/billing",
    bullets: ["3 marques", "6 LLMs", "Topics ∞", "Seats ∞", "Alignment ✨", "Content Studio ✨", "Citations Flow 📊", "Webhooks Teams 🔌"],
    highlight: false,
  },
  {
    key: "agency",
    price: 799,
    href: "/signup?next=/app/billing",
    bullets: ["10 marques", "7 LLMs", "Tout Pro", "Content Studio ∞", "API REST 🔑", "White-label"],
    highlight: false,
  },
];

type SaasFeature = { n: string; title: string; body: string };
type SaasDiff = { title: string; body: string };
type SaasFaq = { q: string; a: string };
type SaasTierLabel = { name: string; cta: string };

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cycle?: string }>;
};

export default async function SaasMarketingPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const cycle: "monthly" | "annual" = sp.cycle === "annual" ? "annual" : "monthly";

  const t = await getTranslations("saas");
  const tHeader = await getTranslations("header");
  const features = t.raw("features") as SaasFeature[];
  const differentiators = t.raw("differentiators") as SaasDiff[];
  const faqItems = t.raw("faqItems") as SaasFaq[];
  const tierLabels = t.raw("tiers") as Record<TierDef["key"], SaasTierLabel>;

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header
        logo="monitoring"
        rightSlot={
          <div className="flex items-center gap-4">
            <Link href="/saas/vs-getmint" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors hidden md:inline">{tHeader("vsGetmint")}</Link>
            <Link href="/saas/faq" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">{tHeader("faq")}</Link>
            <Link href="/login" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">{tHeader("login")}</Link>
            <Button href="/signup" variant="primary" size="sm">{tHeader("signup")}</Button>
          </div>
        }
      />

      <Section py="lg" tone="dark">
        <div className="max-w-3xl">
          <Eyebrow variant="muted" className="mb-5 text-amber">{t("heroEyebrow")}</Eyebrow>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.05] text-white text-balance mb-6">
            {t("heroTitleStart")} <span className="text-brand-500">{t("heroTitleHighlight")}</span>.
          </h1>
          <p className="text-lg text-white/85 leading-relaxed mb-8 max-w-2xl">
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/signup" variant="primary" size="lg">{t("heroCtaPrimary")}</Button>
            <Button href="/etude-sectorielle" variant="outline-light" size="lg">{t("heroCtaSecondary")}</Button>
            <Button href="#pricing" variant="outline-light" size="lg">{t("heroCtaTertiary")}</Button>
          </div>
          <p className="text-xs text-white/60 mt-6 font-mono">
            {t("heroFinePrint")}
          </p>
        </div>
      </Section>

      <Section py="lg" tone="white" eyebrow={t("howItWorksEyebrow")}>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-10 max-w-2xl text-balance leading-tight">
          {t("howItWorksTitle")}
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map(s => (
            <Card key={s.n} variant="default">
              <span className="font-mono text-xs text-brand-500 tracking-eyebrow uppercase">{s.n}</span>
              <h3 className="mt-4 text-xl font-medium text-ink leading-tight tracking-tightish">{s.title}</h3>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">{s.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section py="lg" tone="surface" eyebrow={t("diffEyebrow")}>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-10 max-w-2xl text-balance leading-tight">
          {t("diffTitle")}
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {differentiators.map(d => (
            <Card key={d.title} variant="default">
              <Eyebrow className="mb-2">{d.title}</Eyebrow>
              <p className="text-sm leading-relaxed text-ink-muted">{d.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section py="lg" tone="white" className="scroll-mt-20">
        <a id="pricing" />
        <Eyebrow className="mb-3">{t("pricingEyebrow")}</Eyebrow>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3 leading-tight max-w-2xl text-balance">
          {t("pricingTitle")}
        </h2>
        <p className="text-sm text-ink-muted mb-8 max-w-2xl leading-relaxed">
          {t("pricingSubtitle")}
        </p>

        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-xs font-mono uppercase tracking-eyebrow text-ink-subtle">{t("cycleLabel")}</span>
          <div className="inline-flex rounded-md bg-surface p-1 text-xs">
            <Link
              href="/saas#pricing"
              className={`px-3 py-1.5 rounded-md transition-colors duration-150 ease-out ${cycle === "monthly" ? "bg-white text-ink shadow-card font-medium" : "text-ink-muted hover:text-ink"}`}
            >
              {t("cycleMonthly")}
            </Link>
            <Link
              href="/saas?cycle=annual#pricing"
              className={`px-3 py-1.5 rounded-md transition-colors duration-150 ease-out ${cycle === "annual" ? "bg-white text-ink shadow-card font-medium" : "text-ink-muted hover:text-ink"}`}
            >
              {t("cycleAnnual")}
            </Link>
          </div>
        </div>
        {cycle === "annual" && (
          <p className="text-xs text-success mb-8 font-mono">{t("annualSaving")}</p>
        )}
        {cycle === "monthly" && <div className="mb-8" />}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {TIER_DEFS.map(tier => {
            const isFreeTier = tier.key === "free";
            const price = isFreeTier ? null : priceDisplay(tier.key as Exclude<TierKey, "free">, cycle);
            const label = tierLabels[tier.key];
            return (
              <div
                key={tier.key}
                className={`relative rounded-lg p-6 transition-all duration-150 ease-out ${
                  tier.highlight
                    ? "bg-ink text-white shadow-card"
                    : "bg-white border border-DEFAULT shadow-card hover:shadow-cardHover"
                }`}
              >
                {!isFreeTier && cycle === "annual" && (
                  <span className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-eyebrow bg-brand-50 text-brand-600 px-2 py-0.5 rounded">
                    {t("monthsFreeBadge")}
                  </span>
                )}
                <div className="flex items-baseline justify-between mb-3">
                  <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500">{label.name}</p>
                  {tier.highlight && (
                    <span className="font-mono text-[10px] uppercase tracking-eyebrow text-brand-500">{t("recommendedBadge")}</span>
                  )}
                </div>
                {isFreeTier ? (
                  <>
                    <div className="mb-1">
                      <span className="text-5xl font-medium tracking-tight tabular-nums">0</span>
                      <span className={`text-sm ml-1 ${tier.highlight ? "opacity-70" : "text-ink-muted"}`}>€ HT/mois</span>
                    </div>
                    <p className={`text-[11px] mb-4 ${tier.highlight ? "opacity-70" : "text-ink-subtle"}`}>{t("freeNoCard")}</p>
                  </>
                ) : (
                  <>
                    <div className="mb-1 flex items-baseline gap-1">
                      <span className="text-5xl font-medium tracking-tight tabular-nums">{price!.primaryHT.split(" ")[0].replace("€", "")}</span>
                      <span className={`text-sm ${tier.highlight ? "opacity-70" : "text-ink-muted"}`}>€ HT/mois</span>
                    </div>
                    <p className={`text-[11px] mb-1 ${tier.highlight ? "opacity-70" : "text-ink-subtle"}`}>
                      {price!.secondary}
                    </p>
                    {price!.savingHint && (
                      <p className={`text-[11px] mb-3 font-medium ${tier.highlight ? "text-brand-500" : "text-success"}`}>
                        {price!.savingHint}
                      </p>
                    )}
                    {!price!.savingHint && <div className="mb-3" />}
                  </>
                )}
                <ul className={`text-xs space-y-2 mb-6 ${tier.highlight ? "" : "text-ink"}`}>
                  {tier.bullets.map(b => (
                    <li key={b} className="flex items-baseline gap-2">
                      <span className="text-brand-500">·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  href={cycle === "annual" && !isFreeTier ? `${tier.href}&cycle=annual` : tier.href}
                  variant={tier.highlight ? "primary" : "secondary"}
                  size="md"
                  className="w-full"
                >
                  {label.cta}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-ink-subtle mt-6">
          {t("priceTaxNote")}{" "}
          <code className="font-mono text-xs bg-surface px-2 py-0.5 rounded">4242 4242 4242 4242</code>
        </p>
      </Section>

      <Section py="lg" tone="surface" eyebrow={t("faqEyebrow")}>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {faqItems.map((item, i) => (
            <div key={i}>
              <h3 className="text-xl font-medium text-ink mb-2 tracking-tightish">{item.q}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/saas/faq" className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 hover:underline">
            {t("faqViewAll")}
          </Link>
        </div>
      </Section>

      <Section py="lg" tone="dark">
        <div className="max-w-2xl">
          <Eyebrow variant="muted" className="mb-3 text-amber">{t("ctaFinalEyebrow")}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white text-balance mb-4 leading-tight">
            {t("ctaFinalTitle")}
          </h2>
          <p className="text-base text-white/85 mb-6 leading-relaxed">
            {t("ctaFinalSubtitle")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/signup" variant="primary" size="lg">{t("ctaFinalPrimary")}</Button>
            <Button href="/contact" variant="outline-light" size="lg">{t("ctaFinalSecondary")}</Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
