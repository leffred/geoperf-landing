// S28 — Locale layout (sous app/[locale]/).
// Wrap toutes les pages publiques avec NextIntlClientProvider pour acceder
// aux messages cote client. setRequestLocale assure que getLocale() / useLocale()
// retournent la bonne valeur dans les Server/Client Components enfants.
//
// Pas de <html>/<body> ici (uniquement dans app/layout.tsx root) —
// Next.js App Router exige UN seul rendu <html>.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "metadata" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com";

  return {
    title: `${t("siteName")} — ${t("tagline")}`,
    description: t("defaultDescription"),
    // S28 Phase 1 : pas de alternates.languages au niveau layout car ils pointeraient
    // tous vers / (pas par page). Phase 2 ajoutera un helper hreflang per-page qui lit
    // le path courant. Le sitemap.xml expose les hreflang corrects entre-temps.
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: locale === routing.defaultLocale ? siteUrl : `${siteUrl}/${locale}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
