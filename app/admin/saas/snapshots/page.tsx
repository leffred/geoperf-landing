import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";
import { logout } from "../../login/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin SaaS · Snapshots — Geoperf", robots: { index: false, follow: false } };

const PAGE_SIZE = 50;

const STATUS_BADGE: Record<string, string> = {
  completed: "bg-emerald-50 text-success",
  failed: "bg-red-50 text-danger",
  running: "bg-brand-50 text-brand-600",
  queued: "bg-surface text-ink-muted",
};

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1";
const FIELD_INPUT = "w-full text-sm bg-white px-3 py-1.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";

const ADMIN_TABS = [
  { href: "/admin/saas", label: "Overview" },
  { href: "/admin/saas/snapshots", label: "Snapshots" },
  { href: "/admin/saas/reports", label: "Reports" },
  { href: "/admin/saas/categories", label: "Categories" },
  { href: "/admin/saas/coupons", label: "Coupons" },
  { href: "/admin/prospects-list", label: "Prospects" },
  { href: "/admin/saas/cron", label: "Cron" },
];

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function fmtUsd(n: number | null): string {
  if (n === null || n === undefined) return "—";
  return `$${Number(n).toFixed(4)}`;
}

type Props = { searchParams: Promise<{ status?: string; user?: string; brand?: string; from?: string; to?: string; page?: string }> };

export default async function AdminSnapshotsPage({ searchParams }: Props) {
  const { status, user, brand, from, to, page } = await searchParams;
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

  const sb = getServiceClient();
  const pageNum = Math.max(1, parseInt(page || "1", 10) || 1);
  const offset = (pageNum - 1) * PAGE_SIZE;

  let q = sb.from("v_saas_admin_recent_snapshots")
    .select("id, status, brand_id, brand_name, brand_domain, user_id, user_email, visibility_score, citation_rate, total_cost_usd, created_at, completed_at, error_message, duration_seconds", { count: "exact" });

  if (status && ["queued", "running", "completed", "failed"].includes(status)) q = q.eq("status", status);
  if (user) q = q.ilike("user_email", `%${user}%`);
  if (brand) q = q.ilike("brand_name", `%${brand}%`);
  if (from) q = q.gte("created_at", from);
  if (to) q = q.lte("created_at", to);

  const { data: rows, count } = await q.range(offset, offset + PAGE_SIZE - 1);
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const list = (rows as any[] | null) ?? [];

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

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merge = (k: string, v: string | undefined) => { if (v) p.set(k, v); };
    merge("status", overrides.status ?? status);
    merge("user", overrides.user ?? user);
    merge("brand", overrides.brand ?? brand);
    merge("from", overrides.from ?? from);
    merge("to", overrides.to ?? to);
    merge("page", overrides.page);
    const s = p.toString();
    return s ? `?${s}` : "";
  };

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
        <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
          <div>
            <Eyebrow className="mb-2">Admin SaaS / Snapshots</Eyebrow>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
              {total} snapshot{total > 1 ? "s" : ""}
            </h1>
          </div>
          <p className="text-xs text-ink-subtle font-mono">Page {pageNum} / {totalPages}</p>
        </div>

        <form className="bg-white rounded-lg border border-DEFAULT shadow-card p-4 mb-6 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <div>
            <label className={FIELD_LABEL}>Status</label>
            <select name="status" defaultValue={status || ""} className={FIELD_INPUT}>
              <option value="">Tous</option>
              <option value="completed">Completed</option>
              <option value="running">Running</option>
              <option value="failed">Failed</option>
              <option value="queued">Queued</option>
            </select>
          </div>
          <div>
            <label className={FIELD_LABEL}>User email</label>
            <input name="user" defaultValue={user || ""} placeholder="email…" className={FIELD_INPUT} />
          </div>
          <div>
            <label className={FIELD_LABEL}>Marque</label>
            <input name="brand" defaultValue={brand || ""} placeholder="nom…" className={FIELD_INPUT} />
          </div>
          <div>
            <label className={FIELD_LABEL}>Du</label>
            <input type="date" name="from" defaultValue={from || ""} className={FIELD_INPUT} />
          </div>
          <div>
            <label className={FIELD_LABEL}>Au</label>
            <input type="date" name="to" defaultValue={to || ""} className={FIELD_INPUT} />
          </div>
          <div className="col-span-2 md:col-span-5 flex gap-2 items-center">
            <Button type="submit" variant="primary" size="sm">Filtrer</Button>
            <Link href="/admin/saas/snapshots" className="px-3 py-1.5 text-sm text-ink-muted hover:text-ink underline transition-colors">
              Réinitialiser
            </Link>
          </div>
        </form>

        <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
              <tr>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Date</th>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Marque</th>
                <th className="text-left py-3 px-3 hidden md:table-cell font-mono uppercase tracking-eyebrow">User</th>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Status</th>
                <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Score</th>
                <th className="text-right py-3 px-3 hidden md:table-cell font-mono uppercase tracking-eyebrow">Cit.%</th>
                <th className="text-right py-3 px-3 hidden lg:table-cell font-mono uppercase tracking-eyebrow">Durée</th>
                <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Coût</th>
              </tr>
            </thead>
            <tbody>
              {list.map(s => (
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
                      <div className="text-[10px] text-danger mt-1 max-w-[200px] truncate" title={s.error_message}>
                        {s.error_message}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-ink tabular-nums">{s.visibility_score?.toFixed?.(0) ?? "—"}</td>
                  <td className="py-2 px-3 text-right font-mono hidden md:table-cell text-ink-muted tabular-nums">{s.citation_rate?.toFixed?.(0) ?? "—"}</td>
                  <td className="py-2 px-3 text-right font-mono hidden lg:table-cell text-xs text-ink-muted tabular-nums">
                    {s.duration_seconds ? `${Math.round(s.duration_seconds)}s` : "—"}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-xs text-ink-muted tabular-nums">{fmtUsd(s.total_cost_usd)}</td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-ink-muted text-sm">Aucun snapshot ne correspond aux filtres.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm">
            {pageNum > 1 ? (
              <Link
                href={`/admin/saas/snapshots${buildHref({ page: String(pageNum - 1) })}`}
                className="font-mono text-xs px-3 py-1.5 rounded-md bg-white border border-DEFAULT hover:bg-surface text-ink transition-colors"
              >
                ← Précédent
              </Link>
            ) : <span></span>}
            <span className="font-mono text-xs text-ink-subtle">Page {pageNum} / {totalPages} ({total} total)</span>
            {pageNum < totalPages ? (
              <Link
                href={`/admin/saas/snapshots${buildHref({ page: String(pageNum + 1) })}`}
                className="font-mono text-xs px-3 py-1.5 rounded-md bg-white border border-DEFAULT hover:bg-surface text-ink transition-colors"
              >
                Suivant →
              </Link>
            ) : <span></span>}
          </div>
        )}
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
