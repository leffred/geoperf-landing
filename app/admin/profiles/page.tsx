import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "@/components/ui/HeaderStatic";
import { Footer } from "@/components/ui/FooterStatic";
import { Section } from "@/components/ui/Section";
import { getServiceClient } from "@/lib/supabase";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { logout } from "../login/actions";

export const metadata: Metadata = {
  title: "Admin · /profile pages — Geoperf",
  robots: { index: false, follow: false },
};

type Row = {
  domain: string;
  nom: string;
  country: string | null;
  category: string | null;
  rank: number | null;
  visibility_score: number | null;
  ai_saturation_gap: number | null;
  reports_count: number;
  latest_report_at: string | null;
};

export default async function AdminProfilesIndex() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const sb = getServiceClient();
  const { data } = await sb
    .from("report_companies")
    .select("rank, visibility_score, ai_saturation_gap, companies(nom, domain, country), reports!inner(sous_categorie, created_at, status)")
    .eq("reports.status", "ready");

  const byDomain = new Map<string, Row>();
  for (const r of (data || []) as any[]) {
    const domain = (r.companies?.domain || "").toLowerCase();
    if (!domain) continue;
    const existing = byDomain.get(domain);
    const reportTime = r.reports?.created_at ? new Date(r.reports.created_at).getTime() : 0;
    const isLatest = !existing || reportTime > new Date(existing.latest_report_at || 0).getTime();
    if (isLatest) {
      byDomain.set(domain, {
        domain,
        nom: r.companies?.nom || domain,
        country: r.companies?.country || null,
        category: r.reports?.sous_categorie || null,
        rank: r.rank,
        visibility_score: r.visibility_score,
        ai_saturation_gap: r.ai_saturation_gap !== null ? Number(r.ai_saturation_gap) : null,
        reports_count: (existing?.reports_count || 0) + 1,
        latest_report_at: r.reports?.created_at || null,
      });
    } else if (existing) {
      existing.reports_count += 1;
    }
  }

  const rows = Array.from(byDomain.values()).sort((a, b) => (b.visibility_score ?? 0) - (a.visibility_score ?? 0));

  const headerRight = (
    <div className="flex items-center gap-4">
      <span className="font-mono text-xs text-ink-muted hidden sm:inline">{user.email}</span>
      <a href="/admin" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy">← Pipeline</a>
      <form action={logout}>
        <button type="submit" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy transition">Logout</button>
      </form>
    </div>
  );

  function dotsScore(score: number | null) {
    const s = score ?? 0;
    return ["", "", "", "", ""].map((_, i) => (
      <span key={i} className={`inline-block w-2 h-2 rounded-full mx-0.5 ${i < s ? "bg-amber" : "bg-navy/15"}`} />
    ));
  }

  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Header rightSlot={headerRight} />

      <Section py="md" tone="white">
        <div className="flex items-baseline justify-between mb-2">
          <h1 className="font-serif text-3xl text-navy">Profils SEO publics</h1>
          <span className="font-mono text-xs text-ink-muted">{rows.length} pages indexables</span>
        </div>
        <p className="text-sm text-ink-muted mb-6">
          Une page <code className="bg-cream px-1">/profile/[domain]</code> est générée pour chaque société qui apparaît dans un report ready.
          Toutes ces URLs sont dans le sitemap dynamique et indexables par Google. Cliquer ouvre la page publique dans un nouvel onglet.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {rows.map((r) => {
            const gap = r.ai_saturation_gap;
            const gapBadge = gap !== null && gap < -10 ? "Sous-représenté" : gap !== null && gap > 10 ? "Sur-représenté" : null;
            return (
              <a key={r.domain} href={`/profile/${r.domain}`} target="_blank" rel="noopener" className="block bg-white border border-navy/10 hover:border-navy/30 p-4 transition">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-serif text-lg text-navy">{r.nom}</h3>
                  {r.country && <span className="font-mono text-[10px] text-ink-muted">{r.country}</span>}
                </div>
                <div className="font-mono text-xs text-navy-light mb-3">{r.domain}</div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">{dotsScore(r.visibility_score)}<span className="ml-2 text-xs text-ink-muted font-mono">{r.visibility_score ?? 0}/4</span></div>
                  <span className="text-xs text-ink-muted font-mono">#{r.rank ?? "—"}</span>
                </div>
                <div className="text-xs text-ink-muted">
                  {r.category}
                  {r.reports_count > 1 && <span className="ml-2">· {r.reports_count} études</span>}
                </div>
                {gapBadge && (
                  <div className={`mt-2 inline-block text-[10px] font-mono px-2 py-0.5 ${gap! < 0 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                    {gapBadge} ({gap! > 0 ? "+" : ""}{gap!.toFixed(1)}%)
                  </div>
                )}
              </a>
            );
          })}
          {rows.length === 0 && <p className="col-span-full text-center text-ink-muted py-8">Aucun profil — lance d'abord une étude depuis /admin.</p>}
        </div>
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
