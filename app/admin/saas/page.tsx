import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stat } from "@/components/ui/Card";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";
import { SignupsBarChart, TierDonut } from "@/components/saas/AdminCharts";
import { logout } from "../login/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin SaaS — Geoperf", robots: { index: false, follow: false } };

const STATUS_BADGE: Record<string, string> = {
  completed: "bg-emerald-50 text-success",
  failed: "bg-red-50 text-danger",
  running: "bg-brand-50 text-brand-600",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function fmtUsd(n: number | null): string {
  if (n === null || n === undefined) return "—";
  return `$${Number(n).toFixed(2)}`;
}

const ADMIN_TABS = [
  { href: "/admin/saas", label: "Overview" },
  { href: "/admin/saas/snapshots", label: "Snapshots" },
  { href: "/admin/saas/reports", label: "Reports" },
  { href: "/admin/saas/categories", label: "Categories" },
  { href: "/admin/saas/coupons", label: "Coupons" },
  { href: "/admin/prospects-list", label: "Prospects" },
  { href: "/admin/saas/cron", label: "Cron" },
];

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
      <Link
        href="/admin"
        className="font-mono text-xs px-3 py-1.5 rounded-md bg-surface hover:bg-surface-2 text-ink transition-colors"
      >
        Outreach
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="font-mono text-xs px-3 py-1.5 rounded-md bg-surface hover:bg-surface-2 text-ink transition-colors"
        >
          Logout
        </button>
      </form>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header rightSlot={headerRight} />

      <nav className="bg-white border-b border-DEFAULT px-6 md:px-8">
        <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto">
          {ADMIN_TABS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-3 text-sm font-medium text-ink hover:bg-surface transition-colors border-b-2 border-transparent hover:border-brand-500 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <Section py="md" tone="white">
        <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
          <div>
            <Eyebrow className="mb-2">Admin SaaS</Eyebrow>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
              Vue d&apos;ensemble
            </h1>
          </div>
          <p className="text-xs text-ink-subtle font-mono">{new Date().toLocaleString("fr-FR")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Stat label="Signups 30j" value={String(k.signups_30d)} hint={`${k.signups_total} total`} variant="dark" />
          <Stat label="Subs payantes" value={String(k.active_paid_subs)} hint={`${k.active_free_subs} free`} />
          <Stat label="MRR (€/mois)" value={`${Number(k.mrr_eur).toFixed(0)}€`} hint={`ARR ~${(Number(k.mrr_eur) * 12).toFixed(0)}€`} />
          <Stat label="Coût LLM 30j" value={fmtUsd(k.llm_cost_30d_usd)} hint={`${k.snapshots_30d} snapshots · ${k.emails_sent_30d} emails`} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <SignupsBarChart points={signupsList} />
          <TierDonut slices={tierList} />
        </div>
      </Section>

      <Section py="md" tone="surface">
        <div className="flex items-baseline justify-between mb-4">
          <Eyebrow>Top 10 users · coût 30j</Eyebrow>
          <Link href="/admin/saas/snapshots" className="font-mono text-xs text-ink-muted hover:text-ink underline transition-colors">
            Snapshots →
          </Link>
        </div>
        <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
              <tr>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Email</th>
                <th className="text-left py-3 px-3 hidden md:table-cell font-mono uppercase tracking-eyebrow">Société</th>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Tier</th>
                <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Marques</th>
                <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Snapshots 30j</th>
                <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Coût 30j</th>
              </tr>
            </thead>
            <tbody>
              {topUsersList.map(u => (
                <tr key={u.user_id} className="border-b border-DEFAULT last:border-b-0 hover:bg-surface transition-colors">
                  <td className="py-2 px-3">
                    <Link href={`/admin/saas/users/${u.user_id}`} className="font-medium text-ink hover:text-brand-500 transition-colors">
                      {u.email}
                    </Link>
                  </td>
                  <td className="py-2 px-3 hidden md:table-cell text-xs text-ink-muted">{u.company || "—"}</td>
                  <td className="py-2 px-3 text-xs">
                    {u.tier ? <span className="font-mono uppercase text-ink">{u.tier}</span> : <span className="text-ink-subtle">—</span>}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-ink tabular-nums">{u.brands_count}</td>
                  <td className="py-2 px-3 text-right font-mono text-ink tabular-nums">{u.snapshots_30d}</td>
                  <td className="py-2 px-3 text-right font-mono text-ink tabular-nums">{fmtUsd(u.cost_30d_usd)}</td>
                </tr>
              ))}
              {topUsersList.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-ink-muted text-sm">Aucun user actif.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section py="md" tone="white">
        <Eyebrow className="mb-4">20 derniers snapshots</Eyebrow>
        <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
              <tr>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Date</th>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Marque</th>
                <th className="text-left py-3 px-3 hidden md:table-cell font-mono uppercase tracking-eyebrow">User</th>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Status</th>
                <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Score</th>
                <th className="text-right py-3 px-3 hidden md:table-cell font-mono uppercase tracking-eyebrow">Durée</th>
                <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Coût</th>
              </tr>
            </thead>
            <tbody>
              {recentList.map(s => (
                <tr key={s.id} className="border-b border-DEFAULT last:border-b-0 hover:bg-surface transition-colors">
                  <td className="py-2 px-3 font-mono text-xs text-ink-muted">{fmtDate(s.created_at)}</td>
                  <td className="py-2 px-3">
                    <Link href={`/admin/saas/users/${s.user_id}`} className="text-ink hover:text-brand-500 transition-colors">
                      {s.brand_name}
                    </Link>
                    <div className="text-[10px] text-ink-subtle font-mono">{s.brand_domain}</div>
                  </td>
                  <td className="py-2 px-3 hidden md:table-cell text-xs text-ink-muted">{s.user_email}</td>
                  <td className="py-2 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono uppercase tracking-eyebrow ${STATUS_BADGE[s.status] || "bg-surface text-ink-subtle"}`}>
                      {s.status}
                    </span>
                    {s.error_message && (
                      <span className="block text-[10px] text-danger mt-0.5 truncate max-w-[140px]" title={s.error_message}>
                        {s.error_message}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-ink tabular-nums">{s.visibility_score?.toFixed?.(0) ?? "—"}</td>
                  <td className="py-2 px-3 text-right font-mono hidden md:table-cell text-xs text-ink-muted tabular-nums">
                    {s.duration_seconds ? `${Math.round(s.duration_seconds)}s` : "—"}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-xs text-ink-muted tabular-nums">{fmtUsd(s.total_cost_usd)}</td>
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
