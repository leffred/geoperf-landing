// S22 §4.4 — Admin /admin/prospects-list : liste prospects avec filtres + bulk actions.
// Server component (filters + data load) + client component (selection + actions bulk).
// Re-utilise v_admin_prospects (deja en DB) et /api/admin/prospects (deja livre S20).

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/ui/HeaderStatic";
import { Footer } from "@/components/ui/FooterStatic";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";
import { logout } from "../login/actions";
import { ProspectsTable } from "./ProspectsTable";
import { Combobox } from "@/components/ui/Combobox";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin · Prospects — Geoperf",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 50;

const ADMIN_TABS = [
  { href: "/admin/saas", label: "Overview" },
  { href: "/admin/saas/snapshots", label: "Snapshots" },
  { href: "/admin/saas/reports", label: "Reports" },
  { href: "/admin/saas/categories", label: "Categories" },
  { href: "/admin/saas/coupons", label: "Coupons" },
  { href: "/admin/prospects-list", label: "Prospects" },
  { href: "/admin/saas/cron", label: "Cron" },
];

const STATUS_OPTIONS = ["new", "engaged", "disqualified", "opted_out", "qualified", "replied"];

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1";
const FIELD_INPUT = "w-full text-sm bg-white px-3 py-1.5 rounded-md border border-DEFAULT focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none";

type SearchParams = Promise<{
  parent_cat?: string;
  category?: string;
  status?: string | string[];
  email_verified?: string;
  search?: string;
  sort?: string;
  dir?: string;
  page?: string;
}>;

export default async function ProspectsListPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login?next=/admin/prospects-list");

  const sb = getServiceClient();

  // Preload categories for dropdown
  const { data: categories } = await sb
    .from("categories")
    .select("id, slug, nom, parent_id, ordre")
    .eq("is_active", true)
    .order("ordre", { ascending: true });

  const cats = (categories as any[]) ?? [];
  const parentCats = cats.filter(c => !c.parent_id);
  const subCats = cats.filter(c => c.parent_id);

  // Build query from filters
  const parentCat = sp.parent_cat || null;
  const category = sp.category || null;
  const statuses = Array.isArray(sp.status) ? sp.status : sp.status ? [sp.status] : [];
  const emailVerified = sp.email_verified || null;
  const search = sp.search?.trim() || null;
  const sortField = sp.sort || "lead_score";
  const sortDir = (sp.dir || "desc").toLowerCase() === "asc";
  const pageNum = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const offset = (pageNum - 1) * PAGE_SIZE;

  let q = sb.from("v_admin_prospects").select("*", { count: "exact" });
  if (parentCat) q = q.eq("parent_category_slug", parentCat);
  if (category) q = q.eq("category_slug", category);
  if (statuses.length > 0) q = q.in("status", statuses);
  if (emailVerified === "true") q = q.eq("email_verified", true);
  if (emailVerified === "false") q = q.eq("email_verified", false);
  if (search) {
    const escaped = search.replace(/[%_]/g, "\\$&");
    q = q.or(`company_nom.ilike.%${escaped}%,full_name.ilike.%${escaped}%,email.ilike.%${escaped}%,title.ilike.%${escaped}%`);
  }
  const ALLOWED_SORTS = new Set(["lead_score", "created_at", "status", "company_nom", "email_verified", "full_name"]);
  const safeSort = ALLOWED_SORTS.has(sortField) ? sortField : "lead_score";
  q = q.order(safeSort, { ascending: sortDir }).range(offset, offset + PAGE_SIZE - 1);

  const { data: rows, count } = await q;
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const list = (rows as any[]) ?? [];

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
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                item.href === "/admin/prospects-list"
                  ? "text-brand-600 border-brand-500"
                  : "text-ink hover:bg-surface border-transparent hover:border-brand-500"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <Section py="md" tone="white">
        <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
          <div>
            <Eyebrow className="mb-2">Admin / Prospects</Eyebrow>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
              {total.toLocaleString("fr-FR")} prospect{total > 1 ? "s" : ""}
            </h1>
          </div>
          <p className="text-sm text-ink-muted">Page {pageNum}/{totalPages} · {PAGE_SIZE} par page</p>
        </div>

        {/* Filters form (GET-based) */}
        <form method="GET" className="bg-surface p-4 rounded-lg border border-DEFAULT mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className={FIELD_LABEL}>Catégorie parente</label>
            <select name="parent_cat" defaultValue={parentCat ?? ""} className={FIELD_INPUT}>
              <option value="">Toutes</option>
              {parentCats.map(c => (
                <option key={c.id} value={c.slug}>{c.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={FIELD_LABEL}>Sous-catégorie</label>
            <Combobox
              name="category"
              options={subCats.map(c => ({
                value: c.slug,
                label: c.nom,
                group: parentCats.find(p => p.id === c.parent_id)?.nom,
              }))}
              placeholder="Toutes (ou recherche...)"
              defaultValue={category ?? undefined}
            />
          </div>

          <div>
            <label className={FIELD_LABEL}>Email vérifié</label>
            <select name="email_verified" defaultValue={emailVerified ?? ""} className={FIELD_INPUT}>
              <option value="">Tous</option>
              <option value="true">Vérifié</option>
              <option value="false">Non vérifié</option>
            </select>
          </div>

          <div>
            <label className={FIELD_LABEL}>Recherche (4 colonnes)</label>
            <input
              type="text"
              name="search"
              defaultValue={search ?? ""}
              placeholder="email, nom, société, titre"
              className={FIELD_INPUT}
            />
          </div>

          <div className="md:col-span-2">
            <label className={FIELD_LABEL}>Statuts (multi)</label>
            <div className="flex flex-wrap gap-3">
              {STATUS_OPTIONS.map(s => (
                <label key={s} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    name="status"
                    value={s}
                    defaultChecked={statuses.includes(s)}
                    className="accent-brand-500"
                  />
                  <span className="font-mono text-xs">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={FIELD_LABEL}>Tri</label>
            <select name="sort" defaultValue={sortField} className={FIELD_INPUT}>
              <option value="lead_score">Lead score</option>
              <option value="created_at">Date création</option>
              <option value="company_nom">Société</option>
              <option value="full_name">Nom</option>
              <option value="status">Statut</option>
              <option value="email_verified">Email vérifié</option>
            </select>
          </div>

          <div>
            <label className={FIELD_LABEL}>Direction</label>
            <select name="dir" defaultValue={sortDir ? "asc" : "desc"} className={FIELD_INPUT}>
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end gap-2">
            <Link
              href="/admin/prospects-list"
              className="px-4 py-2 text-sm font-mono rounded-md bg-white border border-DEFAULT hover:bg-surface text-ink transition-colors"
            >
              Reset
            </Link>
            <button type="submit" className="px-5 py-2 text-sm font-medium rounded-md bg-ink text-white hover:bg-ink/90">
              Filtrer
            </button>
          </div>
        </form>

        {/* Table + bulk actions (client) */}
        <ProspectsTable rows={list} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
              const p = i + 1;
              const params = new URLSearchParams();
              if (parentCat) params.set("parent_cat", parentCat);
              if (category) params.set("category", category);
              statuses.forEach(s => params.append("status", s));
              if (emailVerified) params.set("email_verified", emailVerified);
              if (search) params.set("search", search);
              if (sortField) params.set("sort", sortField);
              if (sortDir) params.set("dir", "asc");
              params.set("page", String(p));
              return (
                <Link
                  key={p}
                  href={`?${params.toString()}`}
                  className={`px-3 py-1.5 text-sm font-mono rounded-md border ${
                    p === pageNum ? "bg-ink text-white border-ink" : "bg-white border-DEFAULT hover:bg-surface text-ink"
                  }`}
                >
                  {p}
                </Link>
              );
            })}
            {totalPages > 10 && <span className="text-ink-muted text-sm">…/{totalPages}</span>}
          </div>
        )}
      </Section>

      <Footer />
    </main>
  );
}
