import type { MetadataRoute } from "next";
import { getServiceClient } from "@/lib/supabase";
import { routing } from "@/i18n/routing";
import { listClusterSlugs } from "@/lib/seo/clusters";
import { listSectorSlugs } from "@/lib/seo/sectors";

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
  const PILLAR_SLUGS: string[] = [
    "visibilite-llm",
    "geo-generative-engine-optimization",
    "chatgpt-marketing",
    "perplexity-pour-marques",
    "gemini-search-marketing",
    "ai-search-vs-seo",
    "llm-brand-monitoring",
    "optimisation-pour-ia",
    "generative-ai-marketing",
    "llm-citation-strategy",
  ];      // S29 Session 2 : 10 pillars FR+EN
  // S29 Session 3 : clusters FR (50) + EN partiels (les pillars a fort volume EN).
  // CLUSTER_SLUGS_FR : tous les slugs presents en FR.
  // CLUSTER_SLUGS_EN : sous-ensemble qui a une version EN.
  const CLUSTER_SLUGS_FR: string[] = listClusterSlugs("fr");
  const CLUSTER_SLUGS_EN_SET = new Set(listClusterSlugs("en"));
  // S29 Session 4 : 130+ secteurs FR.
  const PROGRAMMATIC_SLUGS: string[] = listSectorSlugs();
  const BLOG_SLUGS: string[] = [];        // ← Session 5 : 20 entries

  // Clusters : emit FR canonical + EN alt seulement quand la version EN existe.
  const clusterEntries: MetadataRoute.Sitemap = [];
  for (const slug of CLUSTER_SLUGS_FR) {
    const path = `/insights/${slug}`;
    const frUrl = `${base}${path}`;
    const enUrl = `${base}/en${path}`;
    const hasEn = CLUSTER_SLUGS_EN_SET.has(slug);
    const languages: Record<string, string> = { fr: frUrl, "x-default": frUrl };
    if (hasEn) languages.en = enUrl;
    clusterEntries.push({
      url: frUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages },
    });
    if (hasEn) {
      clusterEntries.push({
        url: enUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.65,
        alternates: { languages },
      });
    }
  }

  // Programmatic (FR-only Session 4) : emit FR canonical sans alternative EN.
  const programmaticEntries: MetadataRoute.Sitemap = PROGRAMMATIC_SLUGS.map((s) => ({
    url: `${base}/secteur/${s}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
    alternates: { languages: { fr: `${base}/secteur/${s}`, "x-default": `${base}/secteur/${s}` } },
  }));

  const seoEntries: MetadataRoute.Sitemap = [
    ...PILLAR_SLUGS.flatMap((s) => buildLocalizedEntries(base, `/guide/${s}`, now, "monthly", 0.9)),
    ...clusterEntries,
    ...programmaticEntries,
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
