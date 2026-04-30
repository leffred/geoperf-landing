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
export const metadata: Metadata = { title: "Admin SaaS · Snapshots — Geoperf", robots: { index: false, follow: false } };

const PAGE_SIZE = 50;

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
      <Link href="/admin/saas" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy">Overview</Link>
      <form action={logout}><button type="submit" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy transition">Logout</button></form>
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
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
          <div>
            <p className="font-mono text-xs tracking-widest text-navy-light uppercase">Admin SaaS / Snapshots</p>
            <h1 className="font-serif text-3xl text-navy">{total} snapshot{total > 1 ? "s" : ""}</h1>
          </div>
          <p className="text-xs text-ink-muted font-mono">Page {pageNum} / {totalPages}</p>
        </div>

        <form className="bg-white p-4 mb-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <div>
            <label className="block text-xs font-mono uppercase text-ink-muted mb-1">Status</label>
            <select name="status" defaultValue={status || ""} className="w-full bg-cream px-2 py-1.5 border border-navy/15 text-sm">
              <option value="">Tous</option>
              <option value="completed">Completed</option>
              <option value="running">Running</option>
              <option value="failed">Failed</option>
              <option value="queued">Queued</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-muted mb-1">User email</label>
            <input name="user" defaultValue={user || ""} placeholder="email…" className="w-full bg-cream px-2 py-1.5 border border-navy/15 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-muted mb-1">Marque</label>
            <input name="brand" defaultValue={brand || ""} placeholder="nom…" className="w-full bg-cream px-2 py-1.5 border border-navy/15 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-muted mb-1">Du</label>
            <input type="date" name="from" defaultValue={from || ""} className="w-full bg-cream px-2 py-1.5 border border-navy/15 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-muted mb-1">Au</label>
            <input type="date" name="to" defaultValue={to || ""} className="w-full bg-cream px-2 py-1.5 border border-navy/15 text-sm" />
          </div>
          <div className="col-span-2 md:col-span-5 flex gap-2">
            <button type="submit" className="bg-navy text-white px-4 py-1.5 text-sm hover:bg-navy-light transition">Filtrer</button>
            <Link href="/admin/saas/snapshots" className="px-3 py-1.5 text-sm text-ink-muted hover:text-navy underline">Réinitialiser</Link>
          </div>
        </form>

        <div className="bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-muted border-b border-navy/15">
              <tr>
                <th className="text-left py-2 px-3">Date</th>
                <th className="text-left py-2 px-3">Marque</th>
                <th className="text-left py-2 px-3 hidden md:table-cell">User</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-right py-2 px-3">Score</th>
                <th className="text-right py-2 px-3 hidden md:table-cell">Cit.%</th>
                <th className="text-right py-2 px-3 hidden lg:table-cell">Durée</th>
                <th className="text-right py-2 px-3">Coût</th>
              </tr>
            </thead>
            <tbody>
              {list.map(s => (
                <tr key={s.id} className="border-b border-navy/5 hover:bg-cream/50">
                  <td className="py-2 px-3 font-mono text-xs">{fmtDate(s.created_at)}</td>
                  <td className="py-2 px-3">
                    <Link href={`/admin/saas/users/${s.user_id}`} className="text-navy hover:underline">{s.brand_name}</Link>
                    <div className="text-[10px] text-ink-muted font-mono">{s.brand_domain}</div>
                  </td>
                  <td className="py-2 px-3 hidden md:table-cell text-xs text-ink-muted">{s.user_email}</td>
                  <td className="py-2 px-3">
                    <span className={`text-xs px-2 py-0.5 ${s.status === "completed" ? "bg-green-100 text-green-800" : s.status === "failed" ? "bg-red-100 text-red-800" : s.status === "running" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"}`}>{s.status}</span>
                    {s.error_message && <div className="text-[10px] text-red-600 mt-1 max-w-[200px] truncate" title={s.error_message}>{s.error_message}</div>}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">{s.visibility_score?.toFixed?.(0) ?? "—"}</td>
                  <td className="py-2 px-3 text-right font-mono hidden md:table-cell">{s.citation_rate?.toFixed?.(0) ?? "—"}</td>
                  <td className="py-2 px-3 text-right font-mono hidden lg:table-cell text-xs">{s.duration_seconds ? `${Math.round(s.duration_seconds)}s` : "—"}</td>
                  <td className="py-2 px-3 text-right font-mono text-xs">{fmtUsd(s.total_cost_usd)}</td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-ink-muted text-sm">Aucun snapshot ne correspond aux filtres.</td></tr>}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm">
            {pageNum > 1 ? (
              <Link href={`/admin/saas/snapshots${buildHref({ page: String(pageNum - 1) })}`} className="font-mono text-xs px-3 py-1.5 bg-white hover:bg-cream transition">← Précédent</Link>
            ) : <span></span>}
            <span className="font-mono text-xs text-ink-muted">Page {pageNum} / {totalPages} ({total} total)</span>
            {pageNum < totalPages ? (
              <Link href={`/admin/saas/snapshots${buildHref({ page: String(pageNum + 1) })}`} className="font-mono text-xs px-3 py-1.5 bg-white hover:bg-cream transition">Suivant →</Link>
            ) : <span></span>}
          </div>
        )}
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
