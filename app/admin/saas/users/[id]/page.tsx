import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";
import { logout } from "../../../login/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin user — Geoperf", robots: { index: false, follow: false } };

type Props = { params: Promise<{ id: string }> };

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmtDay(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtUsd(n: number | null): string {
  if (n === null || n === undefined) return "—";
  return `$${Number(n).toFixed(2)}`;
}

export default async function AdminUserPage({ params }: Props) {
  const { id } = await params;
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

  const sb = getServiceClient();

  const [
    { data: profile },
    { data: subs },
    { data: brands },
    { data: snapshots30d },
    { data: alerts30d },
    { data: usageRows },
  ] = await Promise.all([
    sb.from("saas_profiles").select("id, email, full_name, company, stripe_customer_id, email_notifs_enabled, welcome_email_sent_at, created_at, updated_at").eq("id", id).maybeSingle(),
    sb.from("saas_subscriptions").select("id, tier, status, stripe_subscription_id, stripe_price_id, current_period_end, cancel_at_period_end, created_at, updated_at").eq("user_id", id).order("created_at", { ascending: false }),
    sb.from("saas_tracked_brands").select("id, name, domain, category_slug, cadence, is_active, created_at, competitor_domains").eq("user_id", id).order("created_at", { ascending: false }),
    sb.from("saas_brand_snapshots").select("id, status, brand_id, visibility_score, citation_rate, total_cost_usd, created_at, completed_at").eq("user_id", id).gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()).order("created_at", { ascending: false }),
    sb.from("saas_alerts").select("id, alert_type, severity, email_sent_at, created_at").eq("user_id", id).gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()),
    sb.from("saas_usage_log").select("event_type, cost_usd, created_at").eq("user_id", id).gte("created_at", new Date(Date.now() - 6 * 30 * 86400000).toISOString()),
  ]);

  if (!profile) notFound();

  const subList = (subs as any[] | null) ?? [];
  const brandList = (brands as any[] | null) ?? [];
  const snapList = (snapshots30d as any[] | null) ?? [];
  const alertList = (alerts30d as any[] | null) ?? [];
  const usageList = (usageRows as any[] | null) ?? [];

  // Group cost by month (YYYY-MM)
  const costByMonth: Record<string, { cost: number; events: number }> = {};
  for (const u of usageList) {
    const month = (u.created_at as string).slice(0, 7);
    costByMonth[month] = costByMonth[month] || { cost: 0, events: 0 };
    costByMonth[month].cost += Number(u.cost_usd || 0);
    costByMonth[month].events += 1;
  }
  const costMonths = Object.entries(costByMonth).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6);

  const activeSub = subList.find(s => s.status === "active");
  const completedSnapshots = snapList.filter(s => s.status === "completed");
  const failedSnapshots = snapList.filter(s => s.status === "failed");
  const totalCost30d = snapList.reduce((s, sn) => s + Number(sn.total_cost_usd || 0), 0);
  const emailsSent = alertList.filter(a => a.email_sent_at).length;

  const headerRight = (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-ink-muted hidden sm:inline">{admin.email}</span>
      <Link href="/admin/saas" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy">SaaS</Link>
      <form action={logout}><button type="submit" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy transition">Logout</button></form>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Header rightSlot={headerRight} />

      <Section py="md" tone="cream">
        <div className="mb-4">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
            <Link href="/admin/saas" className="hover:underline">Admin SaaS</Link> / Users / {profile.email}
          </p>
          <h1 className="font-serif text-3xl text-navy">{profile.full_name || profile.email}</h1>
          <p className="text-sm text-ink-muted">{profile.company || "Pas de société"} · membre depuis {fmtDay(profile.created_at)}</p>
          <p className="font-mono text-xs text-ink-muted mt-1">user_id: {profile.id}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4">
            <div className="font-serif text-2xl font-medium text-navy">{activeSub?.tier?.toUpperCase() || "FREE"}</div>
            <div className="text-xs text-ink-muted mt-1">Plan actuel</div>
            <div className="text-[10px] text-ink-muted mt-0.5 font-mono">{activeSub?.status || "no sub"}</div>
          </div>
          <div className="bg-white p-4">
            <div className="font-serif text-2xl font-medium text-navy">{brandList.filter(b => b.is_active).length}</div>
            <div className="text-xs text-ink-muted mt-1">Marques actives</div>
            <div className="text-[10px] text-ink-muted mt-0.5 font-mono">{brandList.length} total</div>
          </div>
          <div className="bg-white p-4">
            <div className="font-serif text-2xl font-medium text-navy">{completedSnapshots.length}</div>
            <div className="text-xs text-ink-muted mt-1">Snapshots 30j</div>
            <div className="text-[10px] text-ink-muted mt-0.5 font-mono">{failedSnapshots.length} failed</div>
          </div>
          <div className="bg-white p-4">
            <div className="font-serif text-2xl font-medium text-navy">${totalCost30d.toFixed(2)}</div>
            <div className="text-xs text-ink-muted mt-1">Coût LLM 30j</div>
            <div className="text-[10px] text-ink-muted mt-0.5 font-mono">{emailsSent} emails envoyés</div>
          </div>
        </div>

        <div className="bg-white p-5 mb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-2">Profil</p>
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div><dt className="text-xs text-ink-muted">Email</dt><dd className="font-mono">{profile.email}</dd></div>
            <div><dt className="text-xs text-ink-muted">Nom</dt><dd>{profile.full_name || "—"}</dd></div>
            <div><dt className="text-xs text-ink-muted">Société</dt><dd>{profile.company || "—"}</dd></div>
            <div><dt className="text-xs text-ink-muted">Stripe customer</dt><dd className="font-mono text-xs">{profile.stripe_customer_id || "—"}</dd></div>
            <div><dt className="text-xs text-ink-muted">Notifs email</dt><dd>{profile.email_notifs_enabled ? "✓ activées" : "✗ désactivées"}</dd></div>
            <div><dt className="text-xs text-ink-muted">Welcome email</dt><dd className="text-xs">{profile.welcome_email_sent_at ? `envoyé ${fmtDay(profile.welcome_email_sent_at)}` : "non envoyé"}</dd></div>
          </dl>
        </div>
      </Section>

      <Section py="md" tone="white">
        <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Subscription history ({subList.length})</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-muted border-b border-navy/15">
              <tr>
                <th className="text-left py-2 px-3">Tier</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3 hidden md:table-cell">Stripe sub</th>
                <th className="text-left py-2 px-3 hidden md:table-cell">Period end</th>
                <th className="text-left py-2 px-3 hidden lg:table-cell">Cancel @ end</th>
                <th className="text-left py-2 px-3">Créée</th>
              </tr>
            </thead>
            <tbody>
              {subList.map(s => (
                <tr key={s.id} className="border-b border-navy/5">
                  <td className="py-2 px-3 font-mono uppercase">{s.tier}</td>
                  <td className="py-2 px-3"><span className={`text-xs px-2 py-0.5 ${s.status === "active" ? "bg-green-100 text-green-800" : s.status === "canceled" ? "bg-gray-200 text-gray-700" : "bg-amber/30 text-navy"}`}>{s.status}</span></td>
                  <td className="py-2 px-3 hidden md:table-cell font-mono text-xs">{s.stripe_subscription_id ? s.stripe_subscription_id.slice(0, 14) + "…" : "—"}</td>
                  <td className="py-2 px-3 hidden md:table-cell text-xs">{fmtDay(s.current_period_end)}</td>
                  <td className="py-2 px-3 hidden lg:table-cell text-xs">{s.cancel_at_period_end ? "oui" : "non"}</td>
                  <td className="py-2 px-3 font-mono text-xs">{fmtDate(s.created_at)}</td>
                </tr>
              ))}
              {subList.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-ink-muted text-sm">Aucune subscription.</td></tr>}
            </tbody>
          </table>
        </div>
      </Section>

      <Section py="md" tone="cream">
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Marques trackées ({brandList.length})</p>
            <div className="bg-white">
              <table className="w-full text-sm">
                <thead className="text-xs text-ink-muted border-b border-navy/15">
                  <tr><th className="text-left py-2 px-3">Marque</th><th className="text-left py-2 px-3">Domain</th><th className="text-right py-2 px-3">Cadence</th><th className="text-right py-2 px-3">Active</th></tr>
                </thead>
                <tbody>
                  {brandList.map(b => (
                    <tr key={b.id} className="border-b border-navy/5">
                      <td className="py-2 px-3 text-navy">{b.name}</td>
                      <td className="py-2 px-3 font-mono text-xs text-ink-muted">{b.domain}</td>
                      <td className="py-2 px-3 text-right text-xs">{b.cadence}</td>
                      <td className="py-2 px-3 text-right">{b.is_active ? "✓" : "✗"}</td>
                    </tr>
                  ))}
                  {brandList.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-ink-muted text-sm">Aucune marque.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Coût mensuel (6 derniers mois)</p>
            <div className="bg-white">
              <table className="w-full text-sm">
                <thead className="text-xs text-ink-muted border-b border-navy/15">
                  <tr><th className="text-left py-2 px-3">Mois</th><th className="text-right py-2 px-3">Events</th><th className="text-right py-2 px-3">Coût</th></tr>
                </thead>
                <tbody>
                  {costMonths.map(([month, m]) => (
                    <tr key={month} className="border-b border-navy/5">
                      <td className="py-2 px-3 font-mono text-xs">{month}</td>
                      <td className="py-2 px-3 text-right font-mono text-xs">{m.events}</td>
                      <td className="py-2 px-3 text-right font-mono">{fmtUsd(m.cost)}</td>
                    </tr>
                  ))}
                  {costMonths.length === 0 && <tr><td colSpan={3} className="py-4 text-center text-ink-muted text-sm">Aucune activité 6 mois.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      <Section py="md" tone="white">
        <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Snapshots 30j ({snapList.length})</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-muted border-b border-navy/15">
              <tr><th className="text-left py-2 px-3">Date</th><th className="text-left py-2 px-3">Brand</th><th className="text-left py-2 px-3">Status</th><th className="text-right py-2 px-3">Score</th><th className="text-right py-2 px-3">Cit.%</th><th className="text-right py-2 px-3">Coût</th></tr>
            </thead>
            <tbody>
              {snapList.slice(0, 30).map(s => {
                const brand = brandList.find(b => b.id === s.brand_id);
                return (
                  <tr key={s.id} className="border-b border-navy/5">
                    <td className="py-2 px-3 font-mono text-xs">{fmtDate(s.created_at)}</td>
                    <td className="py-2 px-3 text-xs">{brand?.name ?? "—"}</td>
                    <td className="py-2 px-3"><span className={`text-xs px-2 py-0.5 ${s.status === "completed" ? "bg-green-100 text-green-800" : s.status === "failed" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>{s.status}</span></td>
                    <td className="py-2 px-3 text-right font-mono">{s.visibility_score?.toFixed?.(0) ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono">{s.citation_rate?.toFixed?.(0) ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-xs">{fmtUsd(s.total_cost_usd)}</td>
                  </tr>
                );
              })}
              {snapList.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-ink-muted text-sm">Aucun snapshot 30j.</td></tr>}
            </tbody>
          </table>
        </div>
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
