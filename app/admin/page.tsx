import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { getServiceClient } from "@/lib/supabase";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { logout } from "./login/actions";
import { AdminActions } from "./AdminActions";

export const metadata: Metadata = { title: "Admin — Geoperf", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ status?: string; min_score?: string }> };

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-gray-200 text-gray-700" },
  queued: { label: "Queued", color: "bg-blue-100 text-blue-800" },
  sequence_a: { label: "Seq A", color: "bg-amber/30 text-navy" },
  sequence_b: { label: "Seq B", color: "bg-amber text-navy" },
  engaged: { label: "Engaged", color: "bg-green-100 text-green-800" },
  converted: { label: "Won", color: "bg-green-600 text-white" },
  opted_out: { label: "Opt-out", color: "bg-red-100 text-red-800" },
  bounced: { label: "Bounced", color: "bg-red-100 text-red-800" },
  disqualified: { label: "DQ", color: "bg-gray-300 text-gray-600" },
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminPage({ searchParams }: Props) {
  const { status: statusFilter, min_score } = await searchParams;
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const sb = getServiceClient();

  const { data: catRows } = await sb.from("categories").select("slug, nom, parent_id").order("nom");
  const { data: catParents } = await sb.from("categories").select("id, nom").is("parent_id", null);
  const parentMap = Object.fromEntries((catParents || []).map((c: any) => [c.id, c.nom]));
  const { data: reportRows } = await sb.from("reports").select("id, sous_categorie, created_at").eq("status", "ready").order("created_at", { ascending: false }).limit(20);
  const reportCounts = await sb.from("report_companies").select("report_id");
  const countByReport = (reportCounts.data || []).reduce<Record<string, number>>((acc: any, r: any) => { acc[r.report_id] = (acc[r.report_id] || 0) + 1; return acc; }, {});
  const categoriesForActions = (catRows || []).filter((c: any) => c.parent_id !== null).map((c: any) => ({ slug: c.slug, nom: c.nom, parent_nom: parentMap[c.parent_id] || null, reports_count: (reportRows || []).filter((r: any) => r.sous_categorie === c.nom).length }));
  const reportsForActions = (reportRows || []).map((r: any) => ({ id: r.id, sous_categorie: r.sous_categorie, created_at: r.created_at, companies_count: countByReport[r.id] || 0 }));

  const { data: kpiData } = await sb.from("prospects").select("id, status, lead_score, download_at, conversion_at");
  const all = kpiData || [];
  const kpis = {
    total: all.length,
    by_status: all.reduce<Record<string, number>>((acc, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; }, {}),
    avg_score: all.length ? Math.round((all.reduce((s, p) => s + (p.lead_score || 0), 0) / all.length) * 10) / 10 : 0,
    downloads: all.filter((p) => p.download_at).length,
    conversions: all.filter((p) => p.conversion_at).length,
  };

  let q = sb.from("prospects").select(`id, first_name, last_name, full_name, email, title, lead_score, status, tracking_token, download_at, last_engagement_at, created_at, companies(nom, country), reports(sous_categorie)`).order("lead_score", { ascending: false }).limit(200);
  if (statusFilter) q = q.eq("status", statusFilter);
  if (min_score) q = q.gte("lead_score", parseInt(min_score, 10) || 0);
  const { data: prospects } = await q;

  const { data: recentEvents } = await sb.from("prospect_events").select("id, event_type, channel, created_at, prospect_id, prospects(full_name, companies(nom))").order("created_at", { ascending: false }).limit(20);

  const headerRight = (
    <div className="flex items-center gap-4">
      <span className="font-mono text-xs text-ink-muted hidden sm:inline">{user.email}</span>
      <a href="/admin/saas" className="font-mono text-xs px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded transition">Admin SaaS →</a>
      <a href="/admin/profiles" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy">Profils SEO</a>
      <span className="font-mono text-xs text-ink-muted">{kpis.total} prospects</span>
      <form action={logout}>
        <button type="submit" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy transition">
          Logout
        </button>
      </form>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Header rightSlot={headerRight} />

      <Section py="md" tone="white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl text-navy">Pipeline Geoperf</h1>
          <p className="text-xs text-ink-muted font-mono">{new Date().toLocaleString("fr-FR")}</p>
        </div>

        <AdminActions categories={categoriesForActions} reports={reportsForActions} />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <div className="bg-navy text-white p-4">
            <div className="font-serif text-3xl font-medium">{kpis.total}</div>
            <div className="text-xs opacity-80 mt-1">Prospects total</div>
          </div>
          <div className="bg-cream p-4">
            <div className="font-serif text-3xl font-medium text-navy">{kpis.avg_score}</div>
            <div className="text-xs text-ink-muted mt-1">Score moyen</div>
          </div>
          <div className="bg-cream p-4">
            <div className="font-serif text-3xl font-medium text-navy">{kpis.downloads}</div>
            <div className="text-xs text-ink-muted mt-1">Downloads</div>
          </div>
          <div className="bg-amber p-4">
            <div className="font-serif text-3xl font-medium text-navy">{kpis.conversions}</div>
            <div className="text-xs text-navy mt-1">Conversions</div>
          </div>
          <div className="bg-cream p-4">
            <div className="font-serif text-3xl font-medium text-navy">{kpis.total ? Math.round((kpis.downloads / kpis.total) * 100) : 0}%</div>
            <div className="text-xs text-ink-muted mt-1">Taux DL</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <a href={`/admin`} className={`px-3 py-1.5 text-xs ${!statusFilter ? "bg-navy text-white" : "bg-white text-ink-muted hover:bg-cream"}`}>Tous ({kpis.total})</a>
          {Object.entries(kpis.by_status).map(([status, count]) => {
            const meta = STATUS_LABELS[status] || { label: status, color: "bg-gray-100" };
            const active = statusFilter === status;
            return (
              <a key={status} href={`/admin?status=${status}`} className={`px-3 py-1.5 text-xs ${active ? "bg-navy text-white" : meta.color + " hover:opacity-80"}`}>
                {meta.label} ({count})
              </a>
            );
          })}
        </div>
      </Section>

      <Section py="md" tone="white" className="border-t border-navy/10">
        <h2 className="font-serif text-2xl text-navy mb-4">Prospects {statusFilter ? `· ${STATUS_LABELS[statusFilter]?.label || statusFilter}` : ""}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-muted border-b border-navy/15">
              <tr>
                <th className="text-left py-2 pr-3">Nom</th>
                <th className="text-left py-2 pr-3">Société</th>
                <th className="text-left py-2 pr-3">Titre</th>
                <th className="text-left py-2 pr-3">Étude</th>
                <th className="text-right py-2 pr-3">Score</th>
                <th className="text-left py-2 pr-3">Status</th>
                <th className="text-left py-2 pr-3">Dernier engagement</th>
                <th className="text-left py-2 pr-3">Download</th>
                <th className="text-left py-2 pr-3">Portal</th>
              </tr>
            </thead>
            <tbody>
              {(prospects || []).map((p: any) => {
                const meta = STATUS_LABELS[p.status] || { label: p.status, color: "bg-gray-100" };
                return (
                  <tr key={p.id} className="border-b border-navy/5 hover:bg-cream/50">
                    <td className="py-2 pr-3">
                      <a href={`/admin/prospects/${p.id}`} className="block hover:underline">
                        <div className="font-medium text-navy">{p.full_name || `${p.first_name || ""} ${p.last_name || ""}`}</div>
                        <div className="text-xs text-ink-muted">{p.email}</div>
                      </a>
                    </td>
                    <td className="py-2 pr-3">
                      {p.companies?.nom}
                      {p.companies?.country && <span className="text-xs text-ink-muted ml-1">· {p.companies.country}</span>}
                    </td>
                    <td className="py-2 pr-3 text-ink-muted">{p.title || "—"}</td>
                    <td className="py-2 pr-3 text-xs">{p.reports?.sous_categorie || "—"}</td>
                    <td className="py-2 pr-3 text-right font-mono">{p.lead_score}</td>
                    <td className="py-2 pr-3"><span className={`inline-block px-2 py-0.5 text-xs ${meta.color}`}>{meta.label}</span></td>
                    <td className="py-2 pr-3 text-xs text-ink-muted">{fmtDate(p.last_engagement_at)}</td>
                    <td className="py-2 pr-3 text-xs">{p.download_at ? <span className="text-green-700 font-medium">{fmtDate(p.download_at)}</span> : <span className="text-ink-muted">—</span>}</td>
                    <td className="py-2 pr-3 text-xs">
                      {p.tracking_token ? (
                        <a href={`/portal?t=${p.tracking_token}`} target="_blank" rel="noopener" className="font-mono text-navy-light hover:underline">ouvrir →</a>
                      ) : (<span className="text-ink-muted">—</span>)}
                    </td>
                  </tr>
                );
              })}
              {(!prospects || prospects.length === 0) && (
                <tr><td colSpan={9} className="py-8 text-center text-ink-muted text-sm">Aucun prospect ne correspond à ce filtre.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section py="md" tone="cream">
        <h2 className="font-serif text-2xl text-navy mb-4">Activité récente</h2>
        <div className="space-y-2">
          {(recentEvents || []).map((e: any) => (
            <div key={e.id} className="bg-white px-4 py-2 text-sm flex items-center justify-between">
              <div>
                <span className="font-mono text-xs px-2 py-0.5 bg-navy text-white mr-3">{e.event_type}</span>
                <span className="text-ink">{e.prospects?.full_name}</span>
                {e.prospects?.companies?.nom && <span className="text-ink-muted text-xs ml-2">· {e.prospects.companies.nom}</span>}
              </div>
              <span className="text-xs text-ink-muted font-mono">{fmtDate(e.created_at)}</span>
            </div>
          ))}
          {(!recentEvents || recentEvents.length === 0) && <p className="text-ink-muted text-sm">Aucun événement enregistré.</p>}
        </div>
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
