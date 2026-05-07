import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Étude en cours de génération — Geoperf",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string; sous_cat?: string }>;
};

export default async function PendingPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("etudeSectorielle");
  const tCommon = await getTranslations("common");
  const email = sp.email ?? (locale === "en" ? "your email" : "votre email");
  const sousCat = sp.sous_cat ?? (locale === "en" ? "requested" : "demandée");

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header logo="etudes" />

      <Section py="lg" tone="white">
        <div className="max-w-2xl">
          <Eyebrow className="mb-3">{t("pendingEyebrow")}</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink mb-5 leading-tight text-balance">
            {t("pendingTitle")}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed mb-4">
            {t("pendingBody", { sousCat })
              .split(sousCat)
              .flatMap((s, i, arr) =>
                i < arr.length - 1
                  ? [s, <strong key={`s-${i}`} className="text-ink">{sousCat}</strong>]
                  : [s]
              )}
          </p>
          <p className="text-base text-ink-muted leading-relaxed mb-8">
            {t("pendingNotice", { email })
              .split(email)
              .flatMap((s, i, arr) =>
                i < arr.length - 1
                  ? [s, <strong key={`em-${i}`} className="text-ink">{email}</strong>]
                  : [s]
              )}
          </p>

          <div className="bg-surface border border-DEFAULT rounded-lg p-6 mb-6 border-l-2 border-l-brand-500">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-3">
              {t("pendingMeantimeEyebrow")}
            </p>
            <ul className="space-y-3 text-sm text-ink leading-relaxed">
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  {t("pendingMeantimeSample")}{" "}
                  <Link href="/sample" className="text-brand-500 hover:underline">
                    {t("pendingMeantimeSampleCta")}
                  </Link>
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  {t("pendingMeantimeAccount")}{" "}
                  <Link href="/signup?source=etude" className="text-brand-500 hover:underline">
                    {t("pendingMeantimeAccountCta")}
                  </Link>
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  {t("pendingMeantimeFaq")}{" "}
                  <Link href="/saas/faq" className="text-brand-500 hover:underline">
                    FAQ
                  </Link>{" "}
                  ·{" "}
                  <a href="mailto:hello@geoperf.com" className="text-brand-500 hover:underline">
                    hello@geoperf.com
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/sample" variant="primary" size="md">
              {t("pendingCtaPrimary")}
            </Button>
            <Button href="/" variant="secondary" size="md">
              {tCommon("ctaBack")}
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
