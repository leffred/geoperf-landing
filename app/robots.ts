import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com";
  return {
    rules: [
      {
        userAgent: "*",
        // Allow public pages (S17 : ajout /saas, /leaderboard, /profile)
        allow: ["/", "/sample", "/about", "/contact", "/privacy", "/terms", "/saas", "/leaderboard", "/profile"],
        // Disallow personalized landings, admin, API routes
        disallow: [
          "/admin",
          "/merci",
          "/api/",
          // The dynamic [sous_cat] route is allowed in principle but each landing
          // page sets robots: noindex via metadata so they won't be indexed.
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
