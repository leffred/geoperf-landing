import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Limite atteinte — Geoperf",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function LimitReachedPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("etudeSectorielle");

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header logo="etudes" />

      <Section py="lg" tone="white">
        <div className="max-w-2xl">
          <Eyebrow className="mb-3">{t("limitEyebrow")}</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink mb-5 leading-tight text-balance">
            {t("limitTitle")}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed mb-4">
            {t("limitBody1")}
          </p>
          <p className="text-base text-ink-muted leading-relaxed mb-8">
            {t("limitBody2")}
          </p>

          <div className="bg-surface border border-DEFAULT rounded-lg p-6 mb-6 border-l-2 border-l-brand-500">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-3">
              {t("limitBenefitsEyebrow")}
            </p>
            <ul className="space-y-3 text-sm text-ink leading-relaxed">
              {[
                t("limitBenefit1"),
                t("limitBenefit2"),
                t("limitBenefit3"),
                t("limitBenefit4"),
              ].map((b) => (
                <li key={b} className="flex items-baseline gap-2">
                  <span className="text-amber">·</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/signup?source=etude_limit" variant="primary" size="md">
              {t("limitCtaPrimary")}
            </Button>
            <Button href="/saas" variant="secondary" size="md">
              {t("limitCtaPlans")}
            </Button>
            <Button href="/contact" variant="secondary" size="md">
              {t("limitCtaContact")}
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
