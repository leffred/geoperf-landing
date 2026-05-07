import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <Section py="lg" eyebrow={t("heroEyebrow")}>
        <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-ink leading-[1.05] mb-6">
          {t("heroTitle")}<span className="text-amber">?</span>
        </h1>
        <p className="text-lg text-ink-muted leading-relaxed mb-12 max-w-2xl">{t("heroSubtitle")}</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-cream p-8">
            <p className="font-mono text-xs tracking-widest text-brand-500 uppercase mb-3">{t("emailEyebrow")}</p>
            <h2 className="text-xl font-medium text-ink mb-3">{t("emailTitle")}</h2>
            <p className="text-ink-muted text-sm mb-6">{t("emailBody")}</p>
            <Button
              href="mailto:contact@geoperf.com?subject=Demande%20d%27%C3%A9tude%20sectorielle"
              variant="secondary"
              size="md"
            >
              contact@geoperf.com
            </Button>
          </div>

          <div className="bg-navy text-white p-8">
            <p className="font-mono text-xs tracking-widest text-amber uppercase mb-3">{t("calendlyEyebrow")}</p>
            <h2 className="text-xl font-medium mb-3">{t("calendlyTitle")}</h2>
            <p className="opacity-85 text-sm mb-6">{t("calendlyBody")}</p>
            <Button
              href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/jourdechance/audit-geo"}
              variant="primary"
              size="md"
            >
              {t("calendlyCta")}
            </Button>
          </div>
        </div>
      </Section>

      <Section tone="cream" py="md">
        <h3 className="text-xl font-medium text-ink mb-3">{t("addressTitle")}</h3>
        <address className="not-italic text-ink-muted">
          Jourdechance SAS<br />
          31 rue Diaz<br />
          92100 Boulogne-Billancourt<br />
          France
        </address>
        <p className="text-ink-muted text-sm mt-4">{t("addressNote")}</p>
      </Section>

      <Footer />
    </main>
  );
}
