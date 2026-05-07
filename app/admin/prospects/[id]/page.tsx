import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/ui/HeaderStatic";
import { Footer } from "@/components/ui/FooterStatic";
import { Section } from "@/components/ui/Section";
import { getServiceClient } from "@/lib/supabase";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { logout } from "../../login/actions";
import { CopyButton } from "./CopyButton";

export const metadata: Metadata = { title: "Admin · Prospect — Geoperf", robots: { index: false } };

type Props = { params: Promise<{ id: string }> };

const STATUS_META: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-gray-200 text-gray-700" },
  queued: { label: "Queued", color: "bg-blue-100 text-blue-800" },
  sequence_a: { label: "Seq A", color: "bg-amber/30 text-navy" },
  sequence_b: { label: "Seq B", color: "bg-amber text-navy" },
  engaged: { label: "Engaged", color: "bg-green-100 text-green-800" },
  converted: { label: "Won", color: "bg-green-600 text-white" },
  opted_out: { label: "Opt-out", color: "bg-red-100 text-red-800" },
  bounced: { label: "Bounced", color: "bg-red-100 text-red-800" },
  disqualified: { label: "DQ", color: "bg-gray-300 text-gray-600" },
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function ProspectDetail({ params }: Props) {
  const { id } = await params;
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const sb = getServiceClient();
  const { data: p } = await sb
    .from("prospects")
    .select(`
      id, first_name, last_name, full_name, email, email_verified, phone, linkedin_url,
      title, seniority, job_function, lead_score, status, tracking_token,
      apollo_person_id, attio_record_id,
      first_contact_at, last_engagement_at, download_at, call_booked_at, call_held_at, conversion_at, opt_out_at, opt_out_reason,
      conversion_value_eur, metadata, created_at, updated_at,
      companies(id, nom, domain, country, description, sector_tags),
      reports(id, sous_categorie, created_at, status)
    `)
    .eq("id", id)
    .maybeSingle();

  if (!p) notFound();
  const prospect = p as any;

  const { data: events } = await sb
    .from("prospect_events")
    .select("id, event_type, channel, direction, metadata, created_at")
    .eq("prospect_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  const meta = STATUS_META[prospect.status] || { label: prospect.status, color: "bg-gray-100" };
  const company = prospect.companies as any;
  const report = prospect.reports as any;

  const headerRight = (
    <div className="flex items-center gap-4">
      <span className="font-mono text-xs text-ink-muted hidden sm:inline">{user.email}</span>
      <a href="/admin" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy">← Pipeline</a>
      <form action={logout}>
        <button type="submit" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy transition">Logout</button>
      </form>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Header rightSlot={headerRight} />

      <Section py="md" tone="white">
        <div className="flex items-start justify-between mb-2 flex-wrap gap-3">
          <div>
            <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-2">PROSPECT · {company?.nom || "—"}</p>
            <h1 className="font-serif text-3xl text-navy">{prospect.full_name || `${prospect.first_name || ""} ${prospect.last_name || ""}`}</h1>
            <p className="text-sm text-ink-muted mt-1">{prospect.title}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-3 py-1 text-sm ${meta.color} mb-2`}>{meta.label}</span>
            <div className="font-serif text-3xl text-navy">{prospect.lead_score}<span className="text-base text-ink-muted">/100</span></div>
            <div className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">Lead score</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
          <div className="bg-cream p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-1">Email {prospect.email_verified ? "· verified" : ""}</div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm text-navy break-all">{prospect.email || "(non enrichi)"}</span>
              {prospect.email && <CopyButton text={prospect.email} label="copy" />}
            </div>
          </div>
          <div className="bg-cream p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-1">LinkedIn</div>
            {prospect.linkedin_url ? (
              <a href={prospect.linkedin_url} target="_blank" rel="noopener" className="font-mono text-sm text-navy-light break-all hover:underline">{prospect.linkedin_url}</a>
            ) : (<span className="text-ink-muted text-sm">—</span>)}
          </div>
          <div className="bg-cream p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-1">Société</div>
            <div className="text-sm">
              {company?.nom} <span className="text-ink-muted">· {company?.domain}</span>
              {company?.country && <span className="text-ink-muted"> · {company.country}</span>}
            </div>
            {company?.domain && (
              <a href={`/profile/${company.domain}`} target="_blank" rel="noopener" className="font-mono text-xs text-navy-light hover:underline mt-1 inline-block">→ Voir profil SEO public</a>
            )}
          </div>
          <div className="bg-cream p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-1">Étude source</div>
            <div className="text-sm">{report?.sous_categorie} <span className="text-ink-muted">· {fmt(report?.created_at)}</span></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
          <div className="bg-cream p-3"><div className="text-[10px] font-mono uppercase text-ink-muted">Created</div><div className="text-xs">{fmt(prospect.created_at)}</div></div>
          <div className="bg-cream p-3"><div className="text-[10px] font-mono uppercase text-ink-muted">1er contact</div><div className="text-xs">{fmt(prospect.first_contact_at)}</div></div>
          <div className="bg-cream p-3"><div className="text-[10px] font-mono uppercase text-ink-muted">Download</div><div className="text-xs">{fmt(prospect.download_at)}</div></div>
          <div className="bg-cream p-3"><div className="text-[10px] font-mono uppercase text-ink-muted">Call book</div><div className="text-xs">{fmt(prospect.call_booked_at)}</div></div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {prospect.tracking_token && (
            <a href={`/portal?t=${prospect.tracking_token}`} target="_blank" rel="noopener" className="text-xs px-3 py-1.5 bg-navy text-white hover:bg-navy-light transition">Voir portal client →</a>
          )}
          {prospect.tracking_token && report?.sous_categorie && (
            <a href={`/${(report.sous_categorie || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")}?t=${prospect.tracking_token}`} target="_blank" rel="noopener" className="text-xs px-3 py-1.5 border border-navy text-navy hover:bg-navy hover:text-white transition">Voir landing perso →</a>
          )}
        </div>
      </Section>

      <Section py="md" tone="cream">
        <h2 className="font-serif text-2xl text-navy mb-4">Historique événements ({events?.length || 0})</h2>
        <div className="space-y-1">
          {(events || []).map((e: any) => (
            <div key={e.id} className="bg-white px-4 py-2 text-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs px-2 py-0.5 bg-navy text-white whitespace-nowrap">{e.event_type}</span>
                <span className="font-mono text-[10px] text-ink-muted whitespace-nowrap">{e.channel}{e.direction ? ` · ${e.direction}` : ""}</span>
                {e.metadata && Object.keys(e.metadata).length > 0 && (
                  <span className="text-xs text-ink-muted truncate">{JSON.stringify(e.metadata).substring(0, 120)}</span>
                )}
              </div>
              <span className="text-xs text-ink-muted font-mono whitespace-nowrap">{fmt(e.created_at)}</span>
            </div>
          ))}
          {(!events || events.length === 0) && <p className="text-ink-muted text-sm">Aucun événement enregistré pour ce prospect.</p>}
        </div>
      </Section>

      <Section py="md" tone="white">
        <details className="bg-cream p-4">
          <summary className="cursor-pointer text-sm font-medium text-navy">Métadonnées brutes (Apollo + enrichment)</summary>
          <pre className="mt-3 text-[11px] font-mono overflow-auto max-h-96 bg-white p-3 border border-navy/10">{JSON.stringify(prospect.metadata, null, 2)}</pre>
        </details>
      </Section>

      <Footer showLegalLinks={false} />
    </main>
  );
}
