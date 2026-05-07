import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/ui/HeaderStatic";
import { Footer } from "@/components/ui/FooterStatic";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stat } from "@/components/ui/Card";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";
import { logout } from "../../../login/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin user — Geoperf", robots: { index: false, follow: false } };

type Props = { params: Promise<{ id: string }> };

const STATUS_BADGE: Record<string, string> = {
  completed: "bg-emerald-50 text-success",
  failed: "bg-red-50 text-danger",
  running: "bg-brand-50 text-brand-600",
  active: "bg-emerald-50 text-success",
  canceled: "bg-surface text-ink-muted",
};

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
      <Link href="/admin/saas" className="font-mono text-xs px-3 py-1.5 rounded-md bg-surface hover:bg-surface-2 text-ink transition-colors">
        SaaS
      </Link>
      <form action={logout}>
        <button type="submit" className="font-mono text-xs px-3 py-1.5 rounded-md bg-surface hover:bg-surface-2 text-ink transition-colors">
          Logout
        </button>
      </form>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header rightSlot={headerRight} />

      <Section py="md" tone="white">
        <div className="mb-6">
          <Eyebrow className="mb-2">
            <Link href="/admin/saas" className="hover:underline">Admin SaaS</Link>
            <span className="opacity-50"> / Users / </span>
            <span>{profile.email}</span>
          </Eyebrow>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
            {profile.full_name || profile.email}
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            {profile.company || "Pas de société"} · membre depuis {fmtDay(profile.created_at)}
          </p>
          <p className="font-mono text-xs text-ink-subtle mt-1">user_id: {profile.id}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Stat label="Plan actuel" value={activeSub?.tier?.toUpperCase() || "FREE"} hint={activeSub?.status || "no sub"} variant="dark" />
          <Stat label="Marques actives" value={String(brandList.filter(b => b.is_active).length)} hint={`${brandList.length} total`} />
          <Stat label="Snapshots 30j" value={String(completedSnapshots.length)} hint={`${failedSnapshots.length} failed`} />
          <Stat label="Coût LLM 30j" value={`$${totalCost30d.toFixed(2)}`} hint={`${emailsSent} emails envoyés`} />
        </div>

        <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-5 mb-8">
          <Eyebrow className="mb-3">Profil</Eyebrow>
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div><dt className="text-xs text-ink-subtle">Email</dt><dd className="font-mono text-ink">{profile.email}</dd></div>
            <div><dt className="text-xs text-ink-subtle">Nom</dt><dd className="text-ink">{profile.full_name || "—"}</dd></div>
            <div><dt className="text-xs text-ink-subtle">Société</dt><dd className="text-ink">{profile.company || "—"}</dd></div>
            <div><dt className="text-xs text-ink-subtle">Stripe customer</dt><dd className="font-mono text-xs text-ink-muted">{profile.stripe_customer_id || "—"}</dd></div>
            <div><dt className="text-xs text-ink-subtle">Notifs email</dt><dd className="text-ink">{profile.email_notifs_enabled ? "✓ activées" : "✗ désactivées"}</dd></div>
            <div><dt className="text-xs text-ink-subtle">Welcome email</dt><dd className="text-xs text-ink-muted">{profile.welcome_email_sent_at ? `envoyé ${fmtDay(profile.welcome_email_sent_at)}` : "non envoyé"}</dd></div>
          </dl>
        </div>
      </Section>

      <Section py="md" tone="surface">
        <Eyebrow className="mb-4">Subscription history ({subList.length})</Eyebrow>
        <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
              <tr>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Tier</th>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Status</th>
                <th className="text-left py-3 px-3 hidden md:table-cell font-mono uppercase tracking-eyebrow">Stripe sub</th>
                <th className="text-left py-3 px-3 hidden md:table-cell font-mono uppercase tracking-eyebrow">Period end</th>
                <th className="text-left py-3 px-3 hidden lg:table-cell font-mono uppercase tracking-eyebrow">Cancel @ end</th>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Créée</th>
              </tr>
            </thead>
            <tbody>
              {subList.map(s => (
                <tr key={s.id} className="border-b border-DEFAULT last:border-b-0">
                  <td className="py-2 px-3 font-mono uppercase text-ink">{s.tier}</td>
                  <td className="py-2 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono uppercase tracking-eyebrow ${STATUS_BADGE[s.status] || "bg-surface text-ink-muted"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 hidden md:table-cell font-mono text-xs text-ink-muted">{s.stripe_subscription_id ? s.stripe_subscription_id.slice(0, 14) + "…" : "—"}</td>
                  <td className="py-2 px-3 hidden md:table-cell text-xs text-ink-muted">{fmtDay(s.current_period_end)}</td>
                  <td className="py-2 px-3 hidden lg:table-cell text-xs text-ink-muted">{s.cancel_at_period_end ? "oui" : "non"}</td>
                  <td className="py-2 px-3 font-mono text-xs text-ink-muted">{fmtDate(s.created_at)}</td>
                </tr>
              ))}
              {subList.length === 0 && (
                <tr><td colSpan={6} className="py-4 text-center text-ink-muted text-sm">Aucune subscription.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section py="md" tone="white">
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <Eyebrow className="mb-4">Marques trackées ({brandList.length})</Eyebrow>
            <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
                  <tr>
                    <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Marque</th>
                    <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Domain</th>
                    <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Cadence</th>
                    <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {brandList.map(b => (
                    <tr key={b.id} className="border-b border-DEFAULT last:border-b-0">
                      <td className="py-2 px-3 text-ink">{b.name}</td>
                      <td className="py-2 px-3 font-mono text-xs text-ink-muted">{b.domain}</td>
                      <td className="py-2 px-3 text-right text-xs text-ink-muted">{b.cadence}</td>
                      <td className="py-2 px-3 text-right text-ink">{b.is_active ? "✓" : "✗"}</td>
                    </tr>
                  ))}
                  {brandList.length === 0 && (
                    <tr><td colSpan={4} className="py-4 text-center text-ink-muted text-sm">Aucune marque.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <Eyebrow className="mb-4">Coût mensuel (6 derniers mois)</Eyebrow>
            <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
                  <tr>
                    <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Mois</th>
                    <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Events</th>
                    <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Coût</th>
                  </tr>
                </thead>
                <tbody>
                  {costMonths.map(([month, m]) => (
                    <tr key={month} className="border-b border-DEFAULT last:border-b-0">
                      <td className="py-2 px-3 font-mono text-xs text-ink">{month}</td>
                      <td className="py-2 px-3 text-right font-mono text-xs text-ink-muted">{m.events}</td>
                      <td className="py-2 px-3 text-right font-mono text-ink">{fmtUsd(m.cost)}</td>
                    </tr>
                  ))}
                  {costMonths.length === 0 && (
                    <tr><td colSpan={3} className="py-4 text-center text-ink-muted text-sm">Aucune activité 6 mois.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      <Section py="md" tone="surface">
        <Eyebrow className="mb-4">Snapshots 30j ({snapList.length})</Eyebrow>
        <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
              <tr>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Date</th>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Brand</th>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Status</th>
                <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Score</th>
                <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Cit.%</th>
                <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Coût</th>
              </tr>
            </thead>
            <tbody>
              {snapList.slice(0, 30).map(s => {
                const brand = brandList.find(b => b.id === s.brand_id);
                return (
                  <tr key={s.id} className="border-b border-DEFAULT last:border-b-0">
                    <td className="py-2 px-3 font-mono text-xs text-ink-muted">{fmtDate(s.created_at)}</td>
                    <td className="py-2 px-3 text-xs text-ink">{brand?.name ?? "—"}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono uppercase tracking-eyebrow ${STATUS_BADGE[s.status] || "bg-surface text-ink-muted"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-ink tabular-nums">{s.visibility_score?.toFixed?.(0) ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-ink tabular-nums">{s.citation_rate?.toFixed?.(0) ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono text-xs text-ink-muted">{fmtUsd(s.total_cost_usd)}</td>
                  </tr>
                );
              })}
              {snapList.length === 0 && (
                <tr><td colSpan={6} className="py-4 text-center text-ink-muted text-sm">Aucun snapshot 30j.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
