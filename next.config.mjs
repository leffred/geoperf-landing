import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

// S28 — i18n FR/EN : resout i18n/request.ts comme config server-side de next-intl.
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow images from Supabase Storage signed URLs + local SVG logos (S23)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "qfdvdcvqknoqfxetttch.supabase.co" },
    ],
    // S23 : autorise <Image src="/logos/*.svg"> (next/image bloque les SVG par defaut).
    // Les SVG servis viennent uniquement de /public/logos/ (controle local, pas de risque XSS).
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Wildcard subdomain support : *.geoperf.com all route here, the [sous_cat] segment
  // is read from the host header in middleware.
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
};

// S17 §4.8 : Sentry wrap pour error tracking + source maps upload (production).
// Si SENTRY_DSN / SENTRY_AUTH_TOKEN absents (dev local), Sentry skip silently
// les uploads et l'init runtime no-op — pas d'erreur de build.
export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
});
