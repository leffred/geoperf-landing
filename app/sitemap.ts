import type { MetadataRoute } from "next";
import { getServiceClient } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com";
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/sample`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/etude-sectorielle`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/saas`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/saas/vs-getmint`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/saas/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/leaderboard`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // S17 §4.5 : leaderboard sectoriel — une entry par catégorie qui a un report ready.
  let leaderboardEntries: MetadataRoute.Sitemap = [];
  try {
    const sb = getServiceClient();
    const { data: reports } = await sb
      .from("reports")
      .select("category_id, completed_at, created_at, categories!inner(slug, parent_id)")
      .eq("status", "ready")
      .not("categories.parent_id", "is", null);
    const bySlug = new Map<string, string>();
    for (const r of (reports || []) as any[]) {
      const slug = r.categories?.slug;
      if (!slug) continue;
      const lastMod = r.completed_at ?? r.created_at;
      // Garde la plus récente par slug
      if (!bySlug.has(slug) || (lastMod && lastMod > (bySlug.get(slug) ?? ""))) {
        bySlug.set(slug, lastMod ?? now.toISOString());
      }
    }
    for (const [slug, lastMod] of bySlug.entries()) {
      leaderboardEntries.push({
        url: `${base}/leaderboard/${slug}`,
        lastModified: new Date(lastMod),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // Si DB injoignable au build, on saute ces entries — sitemap reste valide.
  }

  // Generative SEO: one /profile/[domain] per company that has at least one ready report.
  let profileEntries: MetadataRoute.Sitemap = [];
  try {
    const sb = getServiceClient();
    const { data } = await sb
      .from("report_companies")
      .select("companies(domain), reports!inner(status)")
      .eq("reports.status", "ready");
    const seen = new Set<string>();
    for (const row of (data || []) as any[]) {
      const d = row.companies?.domain?.toLowerCase();
      if (d && !seen.has(d)) {
        seen.add(d);
        profileEntries.push({ url: `${base}/profile/${d}`, lastModified: now, changeFrequency: "monthly", priority: 0.5 });
      }
    }
  } catch {
    // If DB is unreachable at build time, skip profile entries — sitemap still valid.
  }

  return [...staticEntries, ...leaderboardEntries, ...profileEntries];
}
