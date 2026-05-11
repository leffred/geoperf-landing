import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { signup } from "./actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("signupTitle"),
    description: t("signupDescription"),
  };
}

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1.5";
const FIELD_INPUT = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    error?: string;
    check_email?: string;
    source?: string;
    category?: string;
    invitation_token?: string;
    email?: string;
    coupon?: string;
  }>;
};

export default async function SignupPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { error, check_email, source, category, invitation_token, email: prefilledEmail, coupon } = await searchParams;
  const t = await getTranslations("auth");

  const ERROR_LABELS: Record<string, string> = {
    missing: t("errorMissing"),
    password_too_short: t("errorPasswordTooShort"),
    exists: t("errorExists"),
    oauth_failed: t("errorOauthFailed"),
    unknown: t("errorUnknown"),
  };

  const errorMsg = error ? ERROR_LABELS[error] || ERROR_LABELS.unknown : null;
  const checkEmail = check_email === "1";
  const isEtude = source === "etude";
  const isInvitation = !!invitation_token;
  const hasCoupon = !!coupon && /^[A-Z0-9_-]{3,40}$/.test(coupon.toUpperCase());

  let title = t("signupTitle");
  let subtitle = t("signupSubtitle");
  let eyebrow = t("signupEyebrow");
  let submitLabel = t("submitDefault");

  if (isInvitation) {
    title = t("signupTitleInvitation");
    subtitle = t("signupSubtitleInvitation");
    eyebrow = t("signupEyebrowInvitation");
    submitLabel = t("submitInvitation");
  } else if (isEtude) {
    title = t("signupTitleEtude");
    subtitle = t("signupSubtitleEtude");
    eyebrow = t("signupEyebrowEtude");
    submitLabel = t("submitEtude");
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header
        rightSlot={
          <Link href="/login" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">
            {t("alreadyAccount")}
          </Link>
        }
      />

      <Section py="lg" tone="surface">
        <div className="max-w-md mx-auto">
          <Card variant="default" className="p-8">
            <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-ink mb-3 leading-tight">
              {title}
            </h1>
            <p className="text-sm text-ink-muted mb-6 leading-relaxed">{subtitle}</p>

            {errorMsg && (
              <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
                {errorMsg}
              </div>
            )}
            {checkEmail && !errorMsg && (
              <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
                {t("checkEmail")}
              </div>
            )}

            {hasCoupon && (
              <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-amber bg-amber/5 px-4 py-3 text-sm text-ink">
                <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-1">{t("couponEyebrow")}</p>
                <p>
                  {t("couponBodyBefore")}{" "}
                  <code className="font-mono bg-white px-1.5 py-0.5 rounded">{coupon!.toUpperCase()}</code>{" "}
                  {t("couponBodyAfter")}
                </p>
              </div>
            )}

            {!isInvitation && <OAuthButtons next="/app/dashboard" />}

            <form action={signup} className="space-y-4">
              {source && <input type="hidden" name="source" value={source} />}
              {category && <input type="hidden" name="category" value={category} />}
              {invitation_token && <input type="hidden" name="invitation_token" value={invitation_token} />}
              {hasCoupon && <input type="hidden" name="coupon_code" value={coupon!.toUpperCase()} />}
              <div>
                <label htmlFor="full_name" className={FIELD_LABEL}>{t("fieldFullName")}</label>
                <input id="full_name" name="full_name" type="text" autoComplete="name" className={FIELD_INPUT} />
              </div>
              <div>
                <label htmlFor="company" className={FIELD_LABEL}>{t("fieldCompany")}</label>
                <input id="company" name="company" type="text" autoComplete="organization" className={FIELD_INPUT} />
              </div>
              <div>
                <label htmlFor="email" className={FIELD_LABEL}>{t("fieldEmail")}</label>
                <input
                  id="email" name="email" type="email" required autoComplete="email"
                  autoFocus={!prefilledEmail}
                  defaultValue={prefilledEmail || ""}
                  readOnly={isInvitation}
                  className={`${FIELD_INPUT} ${isInvitation ? "opacity-70 cursor-not-allowed bg-surface-2" : ""}`}
                />
                {isInvitation && (
                  <p className="text-xs text-ink-subtle mt-1.5">
                    {t("invitationEmailLocked")}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="password" className={FIELD_LABEL}>{t("fieldPassword")}</label>
                <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className={FIELD_INPUT} />
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full">
                {submitLabel}
              </Button>
            </form>

            <p className="mt-5 text-xs text-ink-subtle">
              {t.rich("termsNote", {
                terms: (chunks) => <Link href="/terms" className="text-brand-500 hover:underline">{chunks}</Link>,
                privacy: (chunks) => <Link href="/privacy" className="text-brand-500 hover:underline">{chunks}</Link>,
              })}
            </p>
          </Card>
        </div>
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
