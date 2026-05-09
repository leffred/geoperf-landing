import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/ui/HeaderStatic";
import { Footer } from "@/components/ui/FooterStatic";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stat } from "@/components/ui/Card";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";
import { logout } from "../../login/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin SaaS · Cron — Geoperf", robots: { index: false, follow: false } };

const STATUS_BADGE: Record<string, string> = {
  succeeded: "bg-emerald-50 text-success",
  failed: "bg-red-50 text-danger",
  running: "bg-brand-50 text-brand-600",
};

const ADMIN_TABS = [
  { href: "/admin/saas", label: "Overview" },
  { href: "/admin/saas/snapshots", label: "Snapshots" },
  { href: "/admin/saas/reports", label: "Reports" },
  { href: "/admin/saas/categories", label: "Categories" },
  { href: "/admin/saas/coupons", label: "Coupons" },
  { href: "/admin/prospects-list", label: "Prospects" },
  { href: "/admin/saas/cron", label: "Cron" },
  { href: "/admin/linkedin", label: "LinkedIn" },
];

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminCronPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

  const sb = getServiceClient();
  const { data, error } = await sb
    .from("v_saas_admin_cron_runs")
    .select("runid, jobid, jobname, schedule, status, return_message, start_time, end_time, duration_seconds, command")
    .order("start_time", { ascending: false })
    .limit(50);

  const runs = (data as any[] | null) ?? [];
  const successCount = runs.filter(r => r.status === "succeeded").length;
  const failCount = runs.filter(r => r.status === "failed").length;
  const lastRun = runs[0] ?? null;

  const headerRight = (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-ink-muted hidden sm:inline">{admin.email}</span>
      <Link href="/admin/saas" className="font-mono text-xs px-3 py-1.5 rounded-md bg-surface hover:bg-surface-2 text-ink transition-colors">
        Overview
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
        <div className="mb-6">
          <Eyebrow className="mb-2">Admin SaaS / Cron</Eyebrow>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
            Pg_cron job runs
          </h1>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
            Erreur lecture cron : {error.message}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Stat label="Runs (50 max)" value={String(runs.length)} variant="dark" />
          <Stat label="Succeeded" value={String(successCount)} />
          <Stat label="Failed" value={String(failCount)} />
          <Stat label="Dernier run" value={lastRun ? fmtDate(lastRun.start_time) : "—"} hint={lastRun?.status ?? "—"} />
        </div>

        <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
              <tr>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Start</th>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Job</th>
                <th className="text-left py-3 px-3 hidden md:table-cell font-mono uppercase tracking-eyebrow">Schedule</th>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Status</th>
                <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Durée</th>
                <th className="text-left py-3 px-3 hidden lg:table-cell font-mono uppercase tracking-eyebrow">Message</th>
              </tr>
            </thead>
            <tbody>
              {runs.map(r => (
                <tr key={r.runid} className="border-b border-DEFAULT last:border-b-0 hover:bg-surface transition-colors">
                  <td className="py-2 px-3 font-mono text-xs text-ink-muted">{fmtDate(r.start_time)}</td>
                  <td className="py-2 px-3 text-xs text-ink">{r.jobname}</td>
                  <td className="py-2 px-3 hidden md:table-cell font-mono text-xs text-ink-muted">{r.schedule}</td>
                  <td className="py-2 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono uppercase tracking-eyebrow ${STATUS_BADGE[r.status] || "bg-surface text-ink-muted"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-xs text-ink tabular-nums">
                    {r.duration_seconds ? `${Number(r.duration_seconds).toFixed(2)}s` : "—"}
                  </td>
                  <td className="py-2 px-3 hidden lg:table-cell text-xs text-ink-muted max-w-[300px] truncate" title={r.return_message ?? ""}>
                    {r.return_message ?? "—"}
                  </td>
                </tr>
              ))}
              {runs.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-ink-muted text-sm">Aucun run pg_cron enregistré.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-xs text-ink-muted font-mono space-y-1">
          <p>
            Pour ajuster un schedule :{" "}
            <code className="bg-surface px-2 py-0.5 rounded border border-DEFAULT">SELECT cron.schedule(jobname, &apos;new schedule&apos;, &apos;new command&apos;);</code>
          </p>
          <p>
            Pour désactiver :{" "}
            <code className="bg-surface px-2 py-0.5 rounded border border-DEFAULT">SELECT cron.unschedule(&apos;jobname&apos;);</code>
          </p>
        </div>
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
