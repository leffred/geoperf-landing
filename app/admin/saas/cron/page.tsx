import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";
import { logout } from "../../login/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin SaaS · Cron — Geoperf", robots: { index: false, follow: false } };

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
      <Link href="/admin/saas" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy">Overview</Link>
      <form action={logout}><button type="submit" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy transition">Logout</button></form>
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
            <Link key={item.href} href={item.href} className="px-4 py-3 text-sm font-medium text-navy hover:bg-cream transition border-b-2 border-transparent hover:border-amber whitespace-nowrap">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <Section py="md" tone="cream">
        <div className="mb-6">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">Admin SaaS / Cron</p>
          <h1 className="font-serif text-3xl text-navy">Pg_cron job runs</h1>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">
            Erreur lecture cron : {error.message}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4">
            <div className="font-serif text-2xl font-medium text-navy">{runs.length}</div>
            <div className="text-xs text-ink-muted mt-1">Runs (50 max)</div>
          </div>
          <div className="bg-white p-4">
            <div className="font-serif text-2xl font-medium text-green-700">{successCount}</div>
            <div className="text-xs text-ink-muted mt-1">Succeeded</div>
          </div>
          <div className="bg-white p-4">
            <div className="font-serif text-2xl font-medium text-red-700">{failCount}</div>
            <div className="text-xs text-ink-muted mt-1">Failed</div>
          </div>
          <div className="bg-white p-4">
            <div className="font-serif text-base text-navy">{lastRun ? fmtDate(lastRun.start_time) : "—"}</div>
            <div className="text-xs text-ink-muted mt-1">Dernier run</div>
            <div className="text-[10px] text-ink-muted mt-0.5 font-mono">{lastRun?.status ?? "—"}</div>
          </div>
        </div>

        <div className="bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-muted border-b border-navy/15">
              <tr>
                <th className="text-left py-2 px-3">Start</th>
                <th className="text-left py-2 px-3">Job</th>
                <th className="text-left py-2 px-3 hidden md:table-cell">Schedule</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-right py-2 px-3">Durée</th>
                <th className="text-left py-2 px-3 hidden lg:table-cell">Message</th>
              </tr>
            </thead>
            <tbody>
              {runs.map(r => (
                <tr key={r.runid} className="border-b border-navy/5">
                  <td className="py-2 px-3 font-mono text-xs">{fmtDate(r.start_time)}</td>
                  <td className="py-2 px-3 text-xs">{r.jobname}</td>
                  <td className="py-2 px-3 hidden md:table-cell font-mono text-xs text-ink-muted">{r.schedule}</td>
                  <td className="py-2 px-3">
                    <span className={`text-xs px-2 py-0.5 ${r.status === "succeeded" ? "bg-green-100 text-green-800" : r.status === "failed" ? "bg-red-100 text-red-800" : r.status === "running" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-xs">{r.duration_seconds ? `${Number(r.duration_seconds).toFixed(2)}s` : "—"}</td>
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

        <div className="mt-4 text-xs text-ink-muted font-mono">
          <p>Pour ajuster un schedule : <code className="bg-white px-2 py-0.5 border border-navy/10">SELECT cron.schedule(jobname, &apos;new schedule&apos;, &apos;new command&apos;);</code></p>
          <p className="mt-1">Pour désactiver : <code className="bg-white px-2 py-0.5 border border-navy/10">SELECT cron.unschedule(&apos;jobname&apos;);</code></p>
        </div>
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
