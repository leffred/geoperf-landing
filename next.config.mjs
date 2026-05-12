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

// Sentry désactivé — overhead build trop élevé (~2 min) pour un usage non actif.
// Pour réactiver : npm install @sentry/nextjs, wrapper withSentryConfig ci-dessous.
export default withNextIntl(nextConfig);
