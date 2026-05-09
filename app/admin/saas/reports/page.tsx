// S22 §4.4 — Admin /admin/saas/reports : liste reports + filtres + lancer extraction.

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
import { launchExtraction, regenerateSynthesis } from "./actions";
import { Combobox } from "@/components/ui/Combobox";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin SaaS · Reports — Geoperf",
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
  { href: "/admin/linkedin", label: "LinkedIn" },
];

const STATUS_BADGE: Record<string, string> = {
  ready: "bg-emerald-50 text-success",
  running: "bg-brand-50 text-brand-600",
  failed: "bg-red-50 text-danger",
  queued: "bg-surface text-ink-muted",
};

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1";
const FIELD_INPUT = "w-full text-sm bg-white px-3 py-1.5 rounded-md border border-DEFAULT focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none";

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function fmtUsd(n: number | null): string {
  if (n === null || n === undefined) return "—";
  return `$${Number(n).toFixed(2)}`;
}

type SearchParams = Promise<{
  status?: string;
  parent_cat?: string;
  launched?: string;
  regen?: string;
  error?: string;
}>;

export default async function ReportsAdminPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login?next=/admin/saas/reports");

  const sb = getServiceClient();

  // Load categories (parent + child)
  const { data: categoriesRaw } = await sb
    .from("categories")
    .select("id, slug, nom, parent_id, ordre, is_active")
    .order("ordre", { ascending: true });
  const cats = (categoriesRaw as any[]) ?? [];
  const parentCats = cats.filter(c => !c.parent_id && c.is_active);
  const subCats = cats.filter(c => c.parent_id && c.is_active);

  // Load reports with category join
  let q = sb.from("reports")
    .select("id, sous_categorie, slug_public, status, pdf_url, html_url, total_cost_usd, owner_email, top_n, created_at, completed_at, category_id");
  if (sp.status && ["queued", "running", "ready", "failed"].includes(sp.status)) {
    q = q.eq("status", sp.status);
  }
  q = q.order("created_at", { ascending: false }).limit(100);
  const { data: reports } = await q;
  const reportsList = (reports as any[]) ?? [];

  // Filter by parent_cat if requested (post-filter since category nested)
  const parentCatFilter = sp.parent_cat || null;
  const subCatsByParent = new Map<string, any>();
  subCats.forEach(c => subCatsByParent.set(c.id, c));
  const filteredReports = parentCatFilter
    ? reportsList.filter(r => {
        const cat = cats.find(c => c.id === r.category_id);
        if (!cat) return false;
        const parent = cats.find(c => c.id === cat.parent_id);
        return parent?.slug === parentCatFilter;
      })
    : reportsList;

  // Pending lead-magnet downloads (no report yet for that slug)
  const { data: pendingLM } = await sb
    .from("lead_magnet_downloads")
    .select("id, email, sous_categorie_slug, created_at")
    .eq("pending", true)
    .is("report_id", null)
    .order("created_at", { ascending: false })
    .limit(20);
  const pendings = (pendingLM as any[]) ?? [];

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
                item.href === "/admin/saas/reports"
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
        <Eyebrow className="mb-2">Admin SaaS / Reports</Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight mb-6">
          Reports & extractions
        </h1>

        {sp.launched && (
          <div className="mb-4 text-sm bg-brand-50 border-l-2 border-brand-500 px-4 py-2 rounded">
            ✓ Extraction lancée pour <span className="font-mono">{sp.launched}</span>. Phase 1 prend ~3 min, puis Phase 1.1 ~1 min.
          </div>
        )}
        {sp.regen && (
          <div className="mb-4 text-sm bg-emerald-50 border-l-2 border-success px-4 py-2 rounded">
            ✓ Synthesis relancée pour report <span className="font-mono">{sp.regen}…</span>
          </div>
        )}
        {sp.error && (
          <div className="mb-4 text-sm bg-red-50 border-l-2 border-danger px-4 py-2 rounded">
            Erreur : {sp.error}
          </div>
        )}

        {/* Lancer extraction form */}
        <div className="bg-surface p-4 rounded-lg border border-DEFAULT mb-8">
          <h2 className="text-lg font-medium mb-3">Lancer une nouvelle extraction</h2>
          <form action={launchExtraction} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <label className={FIELD_LABEL}>Sous-catégorie</label>
              <Combobox
                name="category_slug"
                options={subCats.map(c => ({
                  value: c.slug,
                  label: c.nom,
                  group: parentCats.find(p => p.id === c.parent_id)?.nom,
                }))}
                placeholder="Rechercher un secteur (ex: software, banking)..."
                required
              />
            </div>
            <div>
              <label className={FIELD_LABEL}>Top N</label>
              <input type="number" name="top_n" defaultValue={30} min={10} max={100} className={FIELD_INPUT} />
            </div>
            <div>
              <label className={FIELD_LABEL}>Année</label>
              <input type="number" name="year" defaultValue={2026} min={2024} max={2030} className={FIELD_INPUT} />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button type="submit" className="px-5 py-2 text-sm font-medium rounded-md bg-ink text-white hover:bg-ink/90">
                Lancer extraction Phase 1
              </button>
            </div>
          </form>
        </div>

        {/* Pending lead-magnets sans report */}
        {pendings.length > 0 && (
          <div className="bg-amber/20 border border-amber/40 p-4 rounded-lg mb-8">
            <h3 className="text-sm font-medium mb-2">⚠ {pendings.length} lead-magnet(s) en attente sans report disponible</h3>
            <ul className="space-y-1">
              {pendings.map(p => (
                <li key={p.id} className="font-mono text-xs flex items-center justify-between gap-3">
                  <span>{p.email} → <span className="text-brand-600">{p.sous_categorie_slug}</span> ({fmtDate(p.created_at)})</span>
                  <form action={launchExtraction} className="flex gap-1">
                    <input type="hidden" name="category_slug" value={p.sous_categorie_slug} />
                    <input type="hidden" name="top_n" value="30" />
                    <input type="hidden" name="year" value="2026" />
                    <button type="submit" className="text-xs px-2 py-1 bg-ink text-white rounded hover:bg-ink/90">
                      Lancer
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Filters */}
        <form method="GET" className="bg-surface p-4 rounded-lg border border-DEFAULT mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className={FIELD_LABEL}>Statut</label>
            <select name="status" defaultValue={sp.status ?? ""} className={FIELD_INPUT}>
              <option value="">Tous</option>
              <option value="ready">ready</option>
              <option value="running">running</option>
              <option value="failed">failed</option>
              <option value="queued">queued</option>
            </select>
          </div>
          <div>
            <label className={FIELD_LABEL}>Catégorie parente</label>
            <select name="parent_cat" defaultValue={parentCatFilter ?? ""} className={FIELD_INPUT}>
              <option value="">Toutes</option>
              {parentCats.map(c => <option key={c.id} value={c.slug}>{c.nom}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 flex items-end justify-end gap-2">
            <Link href="/admin/saas/reports" className="px-4 py-2 text-sm font-mono rounded-md bg-white border border-DEFAULT hover:bg-surface text-ink">Reset</Link>
            <button type="submit" className="px-5 py-2 text-sm font-medium rounded-md bg-ink text-white hover:bg-ink/90">Filtrer</button>
          </div>
        </form>

        {/* Reports table */}
        <div className="overflow-x-auto bg-white border border-DEFAULT rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-surface text-ink-muted">
              <tr>
                <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Slug</th>
                <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Sous-catégorie</th>
                <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Statut</th>
                <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">PDF</th>
                <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Top N</th>
                <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Coût</th>
                <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Créé / Fini</th>
                <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-DEFAULT">
              {filteredReports.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-ink-muted">Aucun report.</td></tr>
              )}
              {filteredReports.map(r => (
                <tr key={r.id} className="hover:bg-surface">
                  <td className="px-3 py-2 font-mono text-xs text-brand-600">{r.slug_public ?? "—"}</td>
                  <td className="px-3 py-2">{r.sous_categorie ?? "—"}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono ${STATUS_BADGE[r.status] || "bg-surface"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {r.pdf_url ? (
                      <a href={r.pdf_url} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">PDF</a>
                    ) : <span className="text-ink-muted">—</span>}
                    {r.html_url && (
                      <> · <a href={r.html_url} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">HTML</a></>
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{r.top_n ?? "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs">{fmtUsd(r.total_cost_usd)}</td>
                  <td className="px-3 py-2 font-mono text-xs text-ink-muted">
                    <div>{fmtDate(r.created_at)}</div>
                    <div>{fmtDate(r.completed_at)}</div>
                  </td>
                  <td className="px-3 py-2">
                    {r.status === "ready" && !r.pdf_url && (
                      <form action={regenerateSynthesis}>
                        <input type="hidden" name="report_id" value={r.id} />
                        <input type="hidden" name="top_n" value="30" />
                        <button type="submit" className="text-xs px-2 py-1 bg-brand-500 text-white rounded hover:bg-brand-600">
                          Re-synth
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-ink-muted mt-3">100 reports max affichés. Filtre pour réduire.</p>
      </Section>

      <Footer />
    </main>
  );
}
