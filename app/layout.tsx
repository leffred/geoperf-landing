// S28 — Root layout : delegue `lang` a getLocale() de next-intl (server-side).
// Pour les pages sous /admin et /app (hors [locale]), getLocale() retourne defaultLocale='fr'.
// Pour les pages sous app/[locale]/, le middleware + setRequestLocale dans [locale]/layout.tsx
// remontent la locale courante, donc <html lang={locale}> sera correct.

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { getLocale } from "next-intl/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Geoperf — Études sectorielles de visibilité LLM",
  description:
    "Mesurez la perception de votre marque par ChatGPT, Gemini, Claude et Perplexity.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com"
  ),
  openGraph: {
    type: "website",
    siteName: "Geoperf",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&family=JetBrains+Mono:wght@400;500&family=Source+Serif+Pro:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-ink font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
