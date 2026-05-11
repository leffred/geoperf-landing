import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { GtmPageEvent } from "@/components/gtm/GtmPageEvent";

export const metadata: Metadata = {
  title: "Étude envoyée — Geoperf",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string; sous_cat?: string }>;
};

export default async function SentPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("etudeSectorielle");
  const tCommon = await getTranslations("common");
  const email = sp.email ?? (locale === "en" ? "your email" : "votre email");
  const sousCat = sp.sous_cat;

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* S32 GTM : push event form_submit_etude au mount (conversion mid-funnel 20€) */}
      <GtmPageEvent
        event="form_submit_etude"
        value={20}
        params={{ secteur: sousCat || "unknown" }}
        dedupKey={`form_submit_etude_${sousCat || "unknown"}`}
      />
      <Header logo="etudes" />

      <Section py="lg" tone="white">
        <div className="max-w-2xl">
          <Eyebrow className="mb-3">{t("sentEyebrow")}</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink mb-5 leading-tight">
            {t("sentTitle")}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed mb-4">
            {sousCat
              ? locale === "en"
                ? <>We just sent the <strong className="text-ink">{sousCat}</strong> study to <strong className="text-ink">{email}</strong>.</>
                : <>Nous venons d&apos;envoyer l&apos;étude <strong className="text-ink">{sousCat}</strong> à <strong className="text-ink">{email}</strong>.</>
              : locale === "en"
                ? <>We just sent the study to <strong className="text-ink">{email}</strong>.</>
                : <>Nous venons d&apos;envoyer l&apos;étude à <strong className="text-ink">{email}</strong>.</>}
          </p>
          <p className="text-sm text-ink-muted leading-relaxed mb-8">
            {locale === "en"
              ? <>If you don&apos;t see it in 5 minutes, check your spam folder. The download link stays active for 7 days. You can also write to <a href="mailto:hello@geoperf.com" className="text-brand-500 hover:underline">hello@geoperf.com</a> if you need a fresh copy.</>
              : <>Si vous ne le voyez pas dans 5 minutes, vérifiez vos spams. Le lien de téléchargement reste valide 7 jours. Vous pouvez aussi nous écrire à <a href="mailto:hello@geoperf.com" className="text-brand-500 hover:underline">hello@geoperf.com</a> si vous avez besoin d&apos;une nouvelle copie.</>}
          </p>

          <div className="bg-surface border border-DEFAULT rounded-lg p-6 mb-6 border-l-2 border-l-brand-500">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-3">
              {t("sentNextEyebrow")}
            </p>
            <ul className="space-y-3 text-sm text-ink leading-relaxed">
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  {t("sentNextAudit")}{" "}
                  <Link href="/contact" className="text-brand-500 hover:underline">
                    {t("sentNextAuditCta")}
                  </Link>
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  {t("sentNextSaas")}{" "}
                  <Link href="/signup?source=etude" className="text-brand-500 hover:underline">
                    {t("sentNextSaasCta")}
                  </Link>
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>
                  {t("sentNextOther")}{" "}
                  <Link href="/etude-sectorielle" className="text-brand-500 hover:underline">
                    {t("sentNextOtherCta")}
                  </Link>
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/signup?source=etude" variant="primary" size="md">
              {t("sentCtaPrimary")}
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
