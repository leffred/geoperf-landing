// S22 §4.4 — Admin /admin/saas/categories : CRUD categories.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/ui/HeaderStatic";
import { Footer } from "@/components/ui/FooterStatic";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";
import { logout } from "../../login/actions";
import { CategoryForm } from "./CategoryForm";
import { ToggleCategoryActiveButton } from "./ToggleCategoryActiveButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin SaaS · Categories — Geoperf",
  robots: { index: false, follow: false },
};

const ADMIN_TABS = [
  { href: "/admin/saas", label: "Overview" },
  { href: "/admin/saas/snapshots", label: "Snapshots" },
  { href: "/admin/saas/reports", label: "Reports" },
  { href: "/admin/saas/categories", label: "Categories" },
  { href: "/admin/saas/coupons", label: "Coupons" },
  { href: "/admin/prospects-list", label: "Prospects" },
  { href: "/admin/saas/cron", label: "Cron" },
];

type Cat = {
  id: string;
  slug: string;
  nom: string;
  parent_id: string | null;
  ordre: number;
  is_active: boolean;
  created_at: string;
};

export default async function CategoriesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; toggled?: string; updated?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login?next=/admin/saas/categories");

  const sb = getServiceClient();
  const { data: catsRaw } = await sb
    .from("categories")
    .select("id, slug, nom, parent_id, ordre, is_active, created_at")
    .order("ordre", { ascending: true });
  const cats = (catsRaw as Cat[]) ?? [];

  // Group : parents + their sous-cats
  const parents = cats.filter(c => !c.parent_id);
  const subsByParent = new Map<string, Cat[]>();
  for (const c of cats) {
    if (c.parent_id) {
      if (!subsByParent.has(c.parent_id)) subsByParent.set(c.parent_id, []);
      subsByParent.get(c.parent_id)!.push(c);
    }
  }

  // Count reports per sous-cat (preview link to /admin/saas/reports)
  const { data: reportsAgg } = await sb
    .from("reports")
    .select("category_id, status")
    .order("created_at", { ascending: false });
  const reportsCounts = new Map<string, { ready: number; running: number; failed: number; total: number }>();
  for (const r of (reportsAgg as any[]) ?? []) {
    const key = r.category_id;
    if (!key) continue;
    if (!reportsCounts.has(key)) reportsCounts.set(key, { ready: 0, running: 0, failed: 0, total: 0 });
    const counts = reportsCounts.get(key)!;
    counts.total++;
    if (r.status === "ready") counts.ready++;
    else if (r.status === "running") counts.running++;
    else if (r.status === "failed") counts.failed++;
  }

  const headerRight = (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-ink-muted hidden sm:inline">{admin.email}</span>
      <Link href="/admin/saas" className="font-mono text-xs px-3 py-1.5 rounded-md bg-surface hover:bg-surface-2 text-ink transition-colors">Overview</Link>
      <form action={logout}>
        <button type="submit" className="font-mono text-xs px-3 py-1.5 rounded-md bg-surface hover:bg-surface-2 text-ink transition-colors">Logout</button>
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
                item.href === "/admin/saas/categories"
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
        <Eyebrow className="mb-2">Admin SaaS / Categories</Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight mb-6">
          Catégories sectorielles
        </h1>

        {sp.created && (
          <div className="mb-4 text-sm bg-emerald-50 border-l-2 border-success px-4 py-2 rounded">
            ✓ Catégorie <span className="font-mono">{sp.created}</span> créée.
          </div>
        )}
        {sp.toggled && (
          <div className="mb-4 text-sm bg-brand-50 border-l-2 border-brand-500 px-4 py-2 rounded">
            ✓ Catégorie <span className="font-mono">{sp.toggled}…</span> toggled.
          </div>
        )}
        {sp.error && (
          <div className="mb-4 text-sm bg-red-50 border-l-2 border-danger px-4 py-2 rounded">
            Erreur : {sp.error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form (1 col) */}
          <div className="md:col-span-1">
            <h2 className="text-lg font-medium mb-3">Nouvelle catégorie</h2>
            <CategoryForm parents={parents.map(p => ({ id: p.id, nom: p.nom, slug: p.slug }))} />
          </div>

          {/* List (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-lg font-medium">
              {parents.length} parents · {cats.length - parents.length} sous-cats
            </h2>
            {parents.map(parent => {
              const subs = subsByParent.get(parent.id) ?? [];
              return (
                <div key={parent.id} className="bg-white border border-DEFAULT rounded-lg overflow-hidden">
                  <div className={`px-4 py-3 flex items-center justify-between ${parent.is_active ? "bg-surface" : "bg-gray-50 opacity-60"}`}>
                    <div>
                      <span className="font-medium text-ink">{parent.nom}</span>
                      <span className="ml-2 font-mono text-xs text-ink-muted">{parent.slug}</span>
                      <span className="ml-3 font-mono text-xs text-ink-muted">ordre={parent.ordre}</span>
                      {!parent.is_active && <span className="ml-2 text-xs px-2 py-0.5 rounded bg-amber/30 text-ink">inactive</span>}
                    </div>
                    <ToggleCategoryActiveButton id={parent.id} isActive={parent.is_active} />
                  </div>
                  {subs.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead className="bg-surface text-ink-muted text-xs">
                        <tr>
                          <th className="px-4 py-2 text-left font-mono uppercase tracking-eyebrow">Slug</th>
                          <th className="px-4 py-2 text-left font-mono uppercase tracking-eyebrow">Nom</th>
                          <th className="px-4 py-2 text-left font-mono uppercase tracking-eyebrow">Ordre</th>
                          <th className="px-4 py-2 text-left font-mono uppercase tracking-eyebrow">Reports</th>
                          <th className="px-4 py-2 text-left font-mono uppercase tracking-eyebrow">Statut</th>
                          <th className="px-4 py-2 text-right font-mono uppercase tracking-eyebrow">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-DEFAULT">
                        {subs.map(s => {
                          const counts = reportsCounts.get(s.id);
                          return (
                            <tr key={s.id} className={s.is_active ? "" : "opacity-50"}>
                              <td className="px-4 py-2 font-mono text-xs text-brand-600">{s.slug}</td>
                              <td className="px-4 py-2">{s.nom}</td>
                              <td className="px-4 py-2 font-mono text-xs">{s.ordre}</td>
                              <td className="px-4 py-2 font-mono text-xs">
                                {counts ? (
                                  <Link href={`/admin/saas/reports?status=ready`} className="text-brand-600 hover:underline">
                                    {counts.ready}✓ {counts.running > 0 ? `${counts.running}⏳` : ""} {counts.failed > 0 ? `${counts.failed}✗` : ""}
                                  </Link>
                                ) : <span className="text-ink-muted">—</span>}
                              </td>
                              <td className="px-4 py-2">
                                {s.is_active ? (
                                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-success font-mono">active</span>
                                ) : (
                                  <span className="text-xs px-2 py-0.5 rounded bg-amber/30 text-ink font-mono">inactive</span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-right">
                                <ToggleCategoryActiveButton id={s.id} isActive={s.is_active} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <p className="px-4 py-3 text-sm text-ink-muted italic">Aucune sous-catégorie</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-ink-muted mt-8">
          Note : pas de delete (soft via Désactiver). Edit slug/nom non exposé en UI — passer par SQL si vraiment nécessaire (et casser potentiellement les URLs publiques).
        </p>
      </Section>

      <Footer />
    </main>
  );
}
