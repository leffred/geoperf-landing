import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { login, sendMagicLink } from "./actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return {
    title: t("loginMetaTitle"),
    description: t("loginMetaDescription"),
  };
}

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1.5";
const FIELD_INPUT = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; next?: string; magic_sent?: string }>;
};

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { error, next, magic_sent } = await searchParams;
  const t = await getTranslations("auth");

  const ERROR_LABELS: Record<string, string> = {
    missing: t("errorMissing"),
    invalid: t("loginErrorInvalid"),
    email_not_confirmed: t("loginErrorEmailNotConfirmed"),
    unknown: t("errorUnknown"),
  };
  const errorMsg = error ? ERROR_LABELS[error] || ERROR_LABELS.unknown : null;
  const magicSent = magic_sent === "1";

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header
        rightSlot={
          <Link href="/signup" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">
            {t("loginNoAccount")}
          </Link>
        }
      />

      <Section py="lg" tone="surface">
        <div className="max-w-md mx-auto">
          <Card variant="default" className="p-8">
            <Eyebrow className="mb-3">{t("loginEyebrow")}</Eyebrow>
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-ink mb-6 leading-tight">
              {t("loginTitle")}
            </h1>

            {errorMsg && (
              <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
                {errorMsg}
              </div>
            )}
            {magicSent && !errorMsg && (
              <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
                {t("loginMagicSent")}
              </div>
            )}

            <form action={login} className="space-y-4">
              <input type="hidden" name="next" value={next || "/app/dashboard"} />

              <div>
                <label htmlFor="email" className={FIELD_LABEL}>{t("loginEmailLabel")}</label>
                <input id="email" name="email" type="email" required autoComplete="email" autoFocus className={FIELD_INPUT} />
              </div>

              <div>
                <label htmlFor="password" className={FIELD_LABEL}>{t("loginPasswordLabel")}</label>
                <input id="password" name="password" type="password" required autoComplete="current-password" className={FIELD_INPUT} />
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full">{t("loginSubmit")}</Button>

              <p className="text-sm text-ink-muted text-center mt-4">
                {t("loginInlineNoAccount")}{" "}
                <Link href="/signup" className="text-brand-500 hover:underline font-medium">
                  {t("loginInlineCta")}
                </Link>
              </p>
            </form>

            <div className="mt-6 pt-6 border-t border-DEFAULT">
              <Eyebrow className="mb-2">{t("loginMagicEyebrow")}</Eyebrow>
              <form action={sendMagicLink} className="space-y-2">
                <input
                  name="email" type="email" required
                  placeholder={t("loginMagicEmailPlaceholder")}
                  className={FIELD_INPUT}
                />
                <Button type="submit" variant="secondary" size="md" className="w-full">
                  {t("loginMagicSubmit")}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
