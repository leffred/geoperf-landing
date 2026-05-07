import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <Section tone="navy" py="lg" eyebrow={t("heroEyebrow")}>
        <h1 className="text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] mb-6">
          {t("heroTitle")}<span className="text-amber">.</span>
        </h1>
        <p className="text-xl opacity-85 max-w-2xl leading-relaxed">{t("heroSubtitle")}</p>
      </Section>

      <Section py="lg">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-ink mb-6">{t("methodTitle")}</h2>
        <div className="space-y-4 text-ink leading-relaxed">
          <p>{t("methodP1")}</p>
          <p>
            {t("methodP2Before")} <strong>{t("methodP2Highlight")}</strong> {t("methodP2After")}
          </p>
          <p>{t("methodP3")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          <Stat label={t("methodStatLLM")} value="4" variant="highlight" />
          <Stat label={t("methodStatStudies")} value="1" />
          <Stat label={t("methodStatCompanies")} value="14" />
          <Stat label={t("methodStatUpdates")} value="2" />
        </div>
      </Section>

      <Section tone="cream" py="lg">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-ink mb-6">{t("behindTitle")}</h2>
        <p className="text-ink leading-relaxed mb-4">
          {t("behindP1Before")} <strong>{t("behindP1Strong")}</strong>{t("behindP1After")}
        </p>
        <p className="text-ink leading-relaxed">{t("behindP2")}</p>
      </Section>

      <Section py="lg">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-ink mb-6">{t("audienceTitle")}</h2>
        <ul className="space-y-3 text-ink leading-relaxed">
          <li><strong>{t("audience1Strong")}</strong> {t("audience1")}</li>
          <li><strong>{t("audience2Strong")}</strong> {t("audience2")}</li>
          <li><strong>{t("audience3Strong")}</strong> {t("audience3")}</li>
        </ul>
      </Section>

      <Section tone="navy" py="lg">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-4">{t("ctaFinalTitle")}</h2>
        <p className="text-lg opacity-85 mb-8 max-w-xl">{t("ctaFinalSubtitle")}</p>
        <div className="flex gap-4 flex-wrap">
          <Button href="/contact" variant="primary" size="lg">{t("ctaFinalPrimary")}</Button>
          <Button
            href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/jourdechance/audit-geo"}
            variant="outline-light"
            size="lg"
          >
            {t("ctaFinalSecondary")}
          </Button>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
