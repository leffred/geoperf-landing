// S28 hotfix — Root layout : lang fixe a 'fr' pour les routes hors [locale] (admin/app/login/signup).
// Pour les pages sous app/[locale]/, leur propre layout surcharge avec la locale courante via NextIntlClientProvider.
// On evite getLocale() ici car il crash sur les routes que le intl middleware ne traite pas (admin/*, app/*).

import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

// GTM — container web GTM-THVGQ5GJ via googletagmanager.com standard.
// (tag.geoperf.com server-side désactivé : CNAME DNS non configuré → ERR_NAME_NOT_RESOLVED)
const GTM_ID = "GTM-THVGQ5GJ";
const GTM_DOMAIN = "www.googletagmanager.com";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&family=JetBrains+Mono:wght@400;500&family=Source+Serif+Pro:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* GTM head snippet — strategy beforeInteractive pour capturer les events au plus tôt */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://${GTM_DOMAIN}/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className="bg-white text-ink font-sans antialiased">
        {/* GTM noscript fallback (utilisateurs sans JS) */}
        <noscript>
          <iframe
            src={`https://${GTM_DOMAIN}/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
