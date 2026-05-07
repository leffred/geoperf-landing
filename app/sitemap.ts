import type { MetadataRoute } from "next";
import { getServiceClient } from "@/lib/supabase";
import { routing } from "@/i18n/routing";

// S28 — sitemap multi-locale. Chaque route publique apparait 2× (FR + EN)
// avec hreflang alternates pour que Google sache que les versions sont equivalentes.
// localePrefix='as-needed' : la version FR est servie sans prefixe (canonical),
// la version EN est sous /en/...

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/sample", changeFrequency: "weekly", priority: 0.9 },
  { path: "/etude-sectorielle", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/saas", changeFrequency: "weekly", priority: 0.9 },
  { path: "/saas/vs-getmint", changeFrequency: "monthly", priority: 0.7 },
  { path: "/saas/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/leaderboard", changeFrequency: "weekly", priority: 0.8 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

function buildLocalizedEntries(
  base: string,
  path: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap {
  // FR (default) sans prefixe + EN avec /en
  const frUrl = `${base}${path}`;
  const enUrl = `${base}/en${path}`;
  const languages: Record<string, string> = {
    fr: frUrl,
    en: enUrl,
    "x-default": frUrl,
  };
  return [
    {
      url: frUrl,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    },
    {
      url: enUrl,
      lastModified,
      changeFrequency,
      priority: priority * 0.95, // legere preference Google pour la canonical FR
      alternates: { languages },
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com";
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap((r) =>
    buildLocalizedEntries(base, r.path, now, r.changeFrequency, r.priority),
  );

  // S17 §4.5 : leaderboard sectoriel — une entry par catégorie qui a un report ready.
  const leaderboardEntries: MetadataRoute.Sitemap = [];
  try {
    const sb = getServiceClient();
    const { data: reports } = await sb
      .from("reports")
      .select("category_id, completed_at, created_at, categories!inner(slug, parent_id)")
      .eq("status", "ready")
      .not("categories.parent_id", "is", null);
    const bySlug = new Map<string, string>();
    for (const r of (reports || []) as Array<{
      categories?: { slug?: string };
      completed_at?: string | null;
      created_at?: string | null;
    }>) {
      const slug = r.categories?.slug;
      if (!slug) continue;
      const lastMod = r.completed_at ?? r.created_at;
      if (!bySlug.has(slug) || (lastMod && lastMod > (bySlug.get(slug) ?? ""))) {
        bySlug.set(slug, lastMod ?? now.toISOString());
      }
    }
    for (const [slug, lastMod] of bySlug.entries()) {
      leaderboardEntries.push(
        ...buildLocalizedEntries(
          base,
          `/leaderboard/${slug}`,
          new Date(lastMod),
          "monthly",
          0.7,
        ),
      );
    }
  } catch {
    // DB injoignable au build → skip
  }

  // S29 — Placeholders pour les 4 nouvelles surfaces SEO/GEO.
  // Vides en Session 1, peuples en Sessions 2-4 :
  //   /guide/[slug]      ← 10 pillars
  //   /insights/[slug]   ← 50 clusters
  //   /secteur/[slug]    ← 130 programmatic
  //   /blog/[slug]       ← 20 blog posts
  // Priority cible : pillar 0.9, cluster 0.7, programmatic 0.6, blog 0.7
  const PILLAR_SLUGS: string[] = [];      // ← Session 2 : 10 entries
  const CLUSTER_SLUGS: string[] = [];     // ← Session 2-3 : 50 entries
  const PROGRAMMATIC_SLUGS: string[] = []; // ← Session 3 : 130 entries
  const BLOG_SLUGS: string[] = [];        // ← Session 4 : 20 entries

  const seoEntries: MetadataRoute.Sitemap = [
    ...PILLAR_SLUGS.flatMap((s) => buildLocalizedEntries(base, `/guide/${s}`, now, "monthly", 0.9)),
    ...CLUSTER_SLUGS.flatMap((s) => buildLocalizedEntries(base, `/insights/${s}`, now, "monthly", 0.7)),
    ...PROGRAMMATIC_SLUGS.flatMap((s) => buildLocalizedEntries(base, `/secteur/${s}`, now, "monthly", 0.6)),
    ...BLOG_SLUGS.flatMap((s) => buildLocalizedEntries(base, `/blog/${s}`, now, "monthly", 0.7)),
  ];

  // Generative SEO: /profile/[domain] — 1 entry par company qui a un report ready.
  // Profiles ne sont pas localises (data brut FR uniquement pour l'instant) —
  // on emet uniquement la version FR canonique.
  const profileEntries: MetadataRoute.Sitemap = [];
  try {
    const sb = getServiceClient();
    const { data } = await sb
      .from("report_companies")
      .select("companies(domain), reports!inner(status)")
      .eq("reports.status", "ready");
    const seen = new Set<string>();
    for (const row of (data || []) as Array<{
      companies?: { domain?: string };
    }>) {
      const d = row.companies?.domain?.toLowerCase();
      if (d && !seen.has(d)) {
        seen.add(d);
        profileEntries.push({
          url: `${base}/profile/${d}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    }
  } catch {
    // skip
  }

  return [...staticEntries, ...leaderboardEntries, ...seoEntries, ...profileEntries];
}

// Export pour reference (ESLint friendly + tests futurs)
export { routing };
