import type { MetadataRoute } from "next";
import { getServiceClient } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com";
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/sample`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

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

  return [...staticEntries, ...profileEntries];
}
