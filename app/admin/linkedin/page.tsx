// S31 Session 2 — Admin /admin/linkedin : 3 onglets (Pending / Scheduled / Posted)
// Listing des saas_linkedin_drafts + actions edit/schedule/discard/markPosted/regenerate.

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
import { generateDrafts } from "./actions";
import { DraftCard, type DraftRow } from "./DraftCard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin · LinkedIn — Geoperf",
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

const TABS = [
  { key: "pending", label: "Pending review", status: "pending_review" },
  { key: "scheduled", label: "Scheduled", status: "scheduled" },
  { key: "posted", label: "Posted", status: "posted" },
] as const;

type TabKey = typeof TABS[number]["key"];

type SearchParams = Promise<{
  tab?: string;
  generated?: string;
  cost?: string;
  scheduled?: string;
  posted?: string;
  discarded?: string;
  updated?: string;
  error?: string;
}>;

interface DraftDbRow {
  id: string;
  template_type: string;
  draft_text: string;
  hashtags: string[] | null;
  tagged_personas: string[] | null;
  status: string;
  scheduled_at: string | null;
  posted_at: string | null;
  posted_url: string | null;
  source_lb_id: string | null;
  generation_cost_usd: number | null;
  created_at: string;
}

export default async function AdminLinkedInPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login?next=/admin/linkedin");

  const tabKey: TabKey = (TABS.find(t => t.key === sp.tab)?.key) ?? "pending";
  const activeTab = TABS.find(t => t.key === tabKey)!;

  const sb = getServiceClient();

  const [{ data: drafts }, { data: readyReports }, { data: counts }] = await Promise.all([
    sb.from("saas_linkedin_drafts")
      .select("id, template_type, draft_text, hashtags, tagged_personas, status, scheduled_at, posted_at, posted_url, source_lb_id, generation_cost_usd, created_at")
      .eq("status", activeTab.status)
      .order(activeTab.key === "scheduled" ? "scheduled_at" : "created_at", { ascending: activeTab.key === "scheduled", nullsFirst: false })
      .limit(200),
    sb.from("reports")
      .select("id, sous_categorie, slug_public, completed_at")
      .eq("status", "ready")
      .order("completed_at", { ascending: false, nullsFirst: false })
      .limit(50),
    sb.from("saas_linkedin_drafts").select("status"),
  ]);

  const draftsList = (drafts as DraftDbRow[] | null) ?? [];
  const reportsReady = (readyReports as Array<{ id: string; sous_categorie: string | null; slug_public: string | null; completed_at: string | null }> | null) ?? [];
  const allStatuses = (counts as Array<{ status: string }> | null) ?? [];
  const countByStatus: Record<string, number> = {};
  for (const r of allStatuses) countByStatus[r.status] = (countByStatus[r.status] ?? 0) + 1;

  // map source slug
  const sourceIds = Array.from(new Set(draftsList.map(d => d.source_lb_id).filter((x): x is string => Boolean(x))));
  const sourceSlugMap = new Map<string, string>();
  if (sourceIds.length > 0) {
    const { data: sourceReports } = await sb
      .from("reports")
      .select("id, slug_public")
      .in("id", sourceIds);
    for (const r of (sourceReports as Array<{ id: string; slug_public: string | null }> | null) ?? []) {
      if (r.slug_public) sourceSlugMap.set(r.id, r.slug_public);
    }
  }

  const draftRows: DraftRow[] = draftsList.map(d => ({
    id: d.id,
    template_type: d.template_type,
    draft_text: d.draft_text,
    hashtags: d.hashtags,
    tagged_personas: d.tagged_personas,
    status: d.status,
    scheduled_at: d.scheduled_at,
    posted_at: d.posted_at,
    posted_url: d.posted_url,
    source_lb_id: d.source_lb_id,
    source_slug: d.source_lb_id ? (sourceSlugMap.get(d.source_lb_id) ?? null) : null,
    generation_cost_usd: d.generation_cost_usd,
    created_at: d.created_at,
  }));

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
                item.href === "/admin/linkedin"
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
        <Eyebrow className="mb-2">Admin / LinkedIn</Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight mb-6">
          LinkedIn drafts
        </h1>

        {sp.generated && (
          <div className="mb-4 text-sm bg-emerald-50 border-l-2 border-success px-4 py-2 rounded">
            ✓ {sp.generated} drafts générés (coût ${sp.cost ?? "—"}). Onglet « Pending review » mis à jour.
          </div>
        )}
        {sp.scheduled && (
          <div className="mb-4 text-sm bg-brand-50 border-l-2 border-brand-500 px-4 py-2 rounded">
            ✓ Draft <span className="font-mono">{sp.scheduled}…</span> scheduled. Visible dans l&apos;onglet « Scheduled ».
          </div>
        )}
        {sp.posted && (
          <div className="mb-4 text-sm bg-emerald-50 border-l-2 border-success px-4 py-2 rounded">
            ✓ Draft <span className="font-mono">{sp.posted}…</span> marqué comme posté.
          </div>
        )}
        {sp.discarded && (
          <div className="mb-4 text-sm bg-surface border-l-2 border-ink-muted px-4 py-2 rounded">
            ✓ Draft <span className="font-mono">{sp.discarded}…</span> discardé.
          </div>
        )}
        {sp.updated && (
          <div className="mb-4 text-sm bg-brand-50 border-l-2 border-brand-500 px-4 py-2 rounded">
            ✓ Draft <span className="font-mono">{sp.updated}…</span> mis à jour.
          </div>
        )}
        {sp.error && (
          <div className="mb-4 text-sm bg-red-50 border-l-2 border-danger px-4 py-2 rounded">
            Erreur : {decodeURIComponent(sp.error)}
          </div>
        )}

        {/* Generate drafts form */}
        <div className="bg-surface p-4 rounded-lg border border-DEFAULT mb-8">
          <h2 className="text-lg font-medium mb-2">Générer 10 drafts pour un report ready</h2>
          <p className="text-xs text-ink-muted mb-3">
            1 call OpenRouter (claude-sonnet-4-6) → 10 drafts JSON insérés en pending_review. Coût cible &lt; $0.50, latence &lt; 30s.
          </p>
          <form action={generateDrafts} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1">Report (status=ready)</label>
              <select
                name="report_id"
                required
                defaultValue=""
                className="w-full text-sm bg-white px-3 py-1.5 rounded-md border border-DEFAULT focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none"
              >
                <option value="" disabled>Choisir un report ready…</option>
                {reportsReady.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.sous_categorie ?? "—"}{r.slug_public ? ` (${r.slug_public})` : ""} · {r.completed_at ? new Date(r.completed_at).toLocaleDateString("fr-FR") : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full px-5 py-2 text-sm font-medium rounded-md bg-ink text-white hover:bg-ink/90">
                Générer 10 drafts
              </button>
            </div>
          </form>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-DEFAULT mb-6">
          {TABS.map(t => {
            const count = countByStatus[t.status] ?? 0;
            const isActive = t.key === tabKey;
            return (
              <Link
                key={t.key}
                href={`/admin/linkedin?tab=${t.key}`}
                className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  isActive
                    ? "text-brand-600 border-brand-500"
                    : "text-ink-muted border-transparent hover:text-ink hover:border-ink/30"
                }`}
              >
                {t.label}
                <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-xs font-mono bg-surface text-ink-muted">
                  {count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Draft list */}
        {draftRows.length === 0 ? (
          <div className="bg-surface border border-DEFAULT rounded-lg px-6 py-10 text-center">
            <p className="text-ink-muted text-sm">
              {tabKey === "pending"
                ? "Aucun draft en attente de review. Génère un batch de 10 drafts en haut de page."
                : tabKey === "scheduled"
                ? "Aucun draft schedulé. Schedule un draft depuis l'onglet « Pending review »."
                : "Aucun draft posté pour le moment."}
            </p>
          </div>
        ) : (
          <div>
            {draftRows.map(d => (
              <DraftCard key={d.id} draft={d} tab={tabKey} />
            ))}
          </div>
        )}

        <p className="text-xs text-ink-muted mt-3">200 drafts max affichés par onglet.</p>
      </Section>

      <Footer />
    </main>
  );
}
