import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";
import { SignupsBarChart, TierDonut } from "@/components/saas/AdminCharts";
import { logout } from "../login/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin SaaS — Geoperf", robots: { index: false, follow: false } };

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function fmtUsd(n: number | null): string {
  if (n === null || n === undefined) return "—";
  return `$${Number(n).toFixed(2)}`;
}

export default async function AdminSaasPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const sb = getServiceClient();
  const [{ data: kpi }, { data: signups }, { data: tiers }, { data: topUsers }, { data: recent }] = await Promise.all([
    sb.from("v_saas_admin_overview").select("*").maybeSingle(),
    sb.from("v_saas_admin_signups_daily").select("day, signups"),
    sb.from("v_saas_admin_tier_distribution").select("tier, n"),
    sb.from("v_saas_admin_top_users_cost").select("user_id, email, company, tier, brands_count, cost_30d_usd, snapshots_30d").limit(10),
    sb.from("v_saas_admin_recent_snapshots").select("id, status, brand_id, brand_name, brand_domain, user_id, user_email, visibility_score, citation_rate, total_cost_usd, created_at, completed_at, error_message, duration_seconds").limit(20),
  ]);

  const k = (kpi as any) || { signups_30d: 0, signups_total: 0, active_paid_subs: 0, active_free_subs: 0, mrr_eur: 0, llm_cost_30d_usd: 0, snapshots_30d: 0, emails_sent_30d: 0 };
  const signupsList = (signups as any[] | null) ?? [];
  const tierList = (tiers as any[] | null) ?? [];
  const topUsersList = (topUsers as any[] | null) ?? [];
  const recentList = (recent as any[] | null) ?? [];

  const headerRight = (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-ink-muted hidden sm:inline">{user.email}</span>
      <Link href="/admin" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy">Outreach</Link>
      <form action={logout}>
        <button type="submit" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy transition">Logout</button>
      </form>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Header rightSlot={headerRight} />

      <nav className="bg-white border-b border-navy/10 px-8">
        <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto">
          {[
            { href: "/admin/saas", label: "Overview" },
            { href: "/admin/saas/snapshots", label: "Snapshots" },
            { href: "/admin/saas/cron", label: "Cron" },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="px-4 py-3 text-sm font-medium text-navy hover:bg-cream transition border-b-2 border-transparent hover:border-amber whitespace-nowrap">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <Section py="md" tone="cream">
        <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="font-mono text-xs tracking-widest text-navy-light uppercase">Admin SaaS</p>
            <h1 className="font-serif text-3xl text-navy">Vue d&apos;ensemble</h1>
          </div>
          <p className="text-xs text-ink-muted font-mono">{new Date().toLocaleString("fr-FR")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-navy text-white p-4">
            <div className="font-serif text-3xl font-medium">{k.signups_30d}</div>
            <div className="text-xs opacity-80 mt-1">Signups 30j</div>
            <div className="text-[10px] opacity-60 mt-0.5 font-mono">{k.signups_total} total</div>
          </div>
          <div className="bg-amber p-4">
            <div className="font-serif text-3xl font-medium text-navy">{k.active_paid_subs}</div>
            <div className="text-xs text-navy mt-1">Subs payantes</div>
            <div className="text-[10px] text-navy/70 mt-0.5 font-mono">{k.active_free_subs} free</div>
          </div>
          <div className="bg-cream p-4 border border-navy/10">
            <div className="font-serif text-3xl font-medium text-navy">{Number(k.mrr_eur).toFixed(0)}€</div>
            <div className="text-xs text-ink-muted mt-1">MRR (€/mois)</div>
            <div className="text-[10px] text-ink-muted mt-0.5 font-mono">ARR ~{(Number(k.mrr_eur) * 12).toFixed(0)}€</div>
          </div>
          <div className="bg-cream p-4 border border-navy/10">
            <div className="font-serif text-3xl font-medium text-navy">{fmtUsd(k.llm_cost_30d_usd)}</div>
            <div className="text-xs text-ink-muted mt-1">Coût LLM 30j</div>
            <div className="text-[10px] text-ink-muted mt-0.5 font-mono">{k.snapshots_30d} snapshots · {k.emails_sent_30d} emails</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <SignupsBarChart points={signupsList} />
          <TierDonut slices={tierList} />
        </div>
      </Section>

      <Section py="md" tone="white">
        <div className="flex items-baseline justify-between mb-3">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">Top 10 users · coût 30j</p>
          <Link href="/admin/saas/snapshots" className="font-mono text-xs text-ink-muted hover:text-navy underline">Snapshots →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-muted border-b border-navy/15">
              <tr>
                <th className="text-left py-2 px-3">Email</th>
                <th className="text-left py-2 px-3 hidden md:table-cell">Société</th>
                <th className="text-left py-2 px-3">Tier</th>
                <th className="text-right py-2 px-3">Marques</th>
                <th className="text-right py-2 px-3">Snapshots 30j</th>
                <th className="text-right py-2 px-3">Coût 30j</th>
              </tr>
            </thead>
            <tbody>
              {topUsersList.map(u => (
                <tr key={u.user_id} className="border-b border-navy/5 hover:bg-cream/50">
                  <td className="py-2 px-3">
                    <Link href={`/admin/saas/users/${u.user_id}`} className="font-medium text-navy hover:underline">
                      {u.email}
                    </Link>
                  </td>
                  <td className="py-2 px-3 hidden md:table-cell text-xs text-ink-muted">{u.company || "—"}</td>
                  <td className="py-2 px-3 text-xs">{u.tier ? <span className="font-mono uppercase">{u.tier}</span> : <span className="text-ink-muted">—</span>}</td>
                  <td className="py-2 px-3 text-right font-mono">{u.brands_count}</td>
                  <td className="py-2 px-3 text-right font-mono">{u.snapshots_30d}</td>
                  <td className="py-2 px-3 text-right font-mono">{fmtUsd(u.cost_30d_usd)}</td>
                </tr>
              ))}
              {topUsersList.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-ink-muted text-sm">Aucun user actif.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section py="md" tone="cream">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">20 derniers snapshots</p>
        <div className="bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-muted border-b border-navy/15">
              <tr>
                <th className="text-left py-2 px-3">Date</th>
                <th className="text-left py-2 px-3">Marque</th>
                <th className="text-left py-2 px-3 hidden md:table-cell">User</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-right py-2 px-3">Score</th>
                <th className="text-right py-2 px-3 hidden md:table-cell">Durée</th>
                <th className="text-right py-2 px-3">Coût</th>
              </tr>
            </thead>
            <tbody>
              {recentList.map(s => (
                <tr key={s.id} className="border-b border-navy/5 hover:bg-cream/50">
                  <td className="py-2 px-3 font-mono text-xs">{fmtDate(s.created_at)}</td>
                  <td className="py-2 px-3">
                    <Link href={`/admin/saas/users/${s.user_id}`} className="text-navy hover:underline">{s.brand_name}</Link>
                    <div className="text-[10px] text-ink-muted font-mono">{s.brand_domain}</div>
                  </td>
                  <td className="py-2 px-3 hidden md:table-cell text-xs text-ink-muted">{s.user_email}</td>
                  <td className="py-2 px-3">
                    <span className={`text-xs px-2 py-0.5 ${s.status === "completed" ? "bg-green-100 text-green-800" : s.status === "failed" ? "bg-red-100 text-red-800" : s.status === "running" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"}`}>{s.status}</span>
                    {s.error_message && <span className="block text-[10px] text-red-600 mt-0.5 truncate max-w-[140px]" title={s.error_message}>{s.error_message}</span>}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">{s.visibility_score?.toFixed?.(0) ?? "—"}</td>
                  <td className="py-2 px-3 text-right font-mono hidden md:table-cell text-xs">{s.duration_seconds ? `${Math.round(s.duration_seconds)}s` : "—"}</td>
                  <td className="py-2 px-3 text-right font-mono text-xs">{fmtUsd(s.total_cost_usd)}</td>
                </tr>
              ))}
              {recentList.length === 0 && (
                <tr><td colSpan={7} className="py-6 text-center text-ink-muted text-sm">Aucun snapshot.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
