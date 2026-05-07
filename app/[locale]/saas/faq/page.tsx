import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

type CategoryKey = "understand" | "product" | "pricing" | "security";
type FaqItem = { cat: CategoryKey; q: string; a: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "saasFaq" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === "fr" ? "https://geoperf.com/saas/faq" : `https://geoperf.com/${locale}/saas/faq`,
      languages: {
        fr: "https://geoperf.com/saas/faq",
        en: "https://geoperf.com/en/saas/faq",
        "x-default": "https://geoperf.com/saas/faq",
      },
    },
  };
}

const CATEGORY_ORDER: CategoryKey[] = ["understand", "product", "pricing", "security"];

type Props = { params: Promise<{ locale: string }> };

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("saasFaq");
  const tHeader = await getTranslations("header");
  const items = t.raw("items") as FaqItem[];

  // FAQ JSON-LD : citable par les LLM (RAG ChatGPT/Perplexity) et Google Rich Snippets
  const FAQ_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      <Header
        logo="monitoring"
        rightSlot={
          <div className="flex items-center gap-4">
            <Link href="/saas" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">Geoperf SaaS</Link>
            <Link href="/login" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">{tHeader("login")}</Link>
            <Button href="/signup" variant="primary" size="sm">{tHeader("signup")}</Button>
          </div>
        }
      />

      <Section py="lg" tone="white">
        <Eyebrow className="mb-3">FAQ</Eyebrow>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink mb-3 leading-tight">
          {t("title")}
        </h1>
        <p className="text-sm text-ink-muted mb-12 max-w-2xl">
          {t("intro", { count: items.length })}
          <a href="mailto:hello@geoperf.com" className="text-brand-500 hover:underline">hello@geoperf.com</a>.
        </p>

        {CATEGORY_ORDER.map((catKey) => {
          const catItems = items.filter((f) => f.cat === catKey);
          if (catItems.length === 0) return null;
          return (
            <div key={catKey} className="mb-14">
              <h2 className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-4">
                {t(`categories.${catKey}`)}
              </h2>
              <div className="max-w-3xl space-y-4">
                {catItems.map((item, i) => (
                  <article key={item.q} className="bg-white rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 shadow-card p-6">
                    <p className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-subtle mb-2">
                      {t("questionLabel")} {String(i + 1).padStart(2, "0")}
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
          <Eyebrow variant="muted" className="mb-3 text-amber">{t("ctaFinalEyebrow")}</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-4 leading-tight">
            {t("ctaFinalTitle")}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button href="mailto:hello@geoperf.com" variant="primary" size="md">{t("ctaFinalEmail")}</Button>
            <Button href="/contact" variant="outline-light" size="md">{t("ctaFinalContact")}</Button>
            <Button href="/signup" variant="outline-light" size="md">{t("ctaFinalSignup")}</Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
