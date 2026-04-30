import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { BrandEvolutionChart, type Point } from "@/components/saas/BrandEvolutionChart";
import { AlertBanner } from "@/components/saas/AlertBanner";
import { loadSaasContext, TIER_LIMITS, relativeVisibility } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard — Geoperf", robots: { index: false, follow: false } };

type BrandLatest = {
  id: string;
  name: string;
  domain: string;
  category_slug: string;
  visibility_score: number | null;
  avg_rank: number | null;
  citation_rate: number | null;
  share_of_voice: number | null;
  last_snapshot_at: string | null;
  unread_alerts: number;
  unread_recos: number;
};

function fmtScore(v: number | null): string {
  if (v === null || v === undefined) return "—";
  return Number(v).toFixed(0);
}

function fmtDate(iso: string | null): string {
  if (!iso) return "Jamais";
  const d = new Date(iso);
  const now = Date.now();
  const diff = (now - d.getTime()) / 86400000;
  if (diff < 1) return "aujourd'hui";
  if (diff < 2) return "hier";
  if (diff < 7) return `il y a ${Math.floor(diff)}j`;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export default async function DashboardPage() {
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const [{ data: brands }, { data: alerts }, { data: evolution }] = await Promise.all([
    sb.from("v_saas_brand_latest").select("id, name, domain, category_slug, visibility_score, avg_rank, citation_rate, share_of_voice, last_snapshot_at, unread_alerts, unread_recos").eq("user_id", ctx.user.id),
    sb.from("saas_alerts").select("id, alert_type, severity, title, body, brand_id, created_at").eq("user_id", ctx.user.id).eq("is_read", false).order("created_at", { ascending: false }).limit(5),
    sb.from("v_saas_brand_evolution").select("brand_id, name, snapshot_date, visibility_score, citation_rate, avg_rank").eq("user_id", ctx.user.id).order("snapshot_date", { ascending: false }).limit(50),
  ]);

  const brandList = (brands as BrandLatest[] | null) ?? [];
  const alertList = (alerts as any[] | null) ?? [];
  const evolutionRows = (evolution as any[] | null) ?? [];

  // Pick the brand with most data points for the headline chart
  const evoByBrand: Record<string, Point[]> = {};
  const nameByBrand: Record<string, string> = {};
  for (const e of evolutionRows) {
    (evoByBrand[e.brand_id] ||= []).push({
      snapshot_date: e.snapshot_date,
      visibility_score: e.visibility_score,
      citation_rate: e.citation_rate,
      avg_rank: e.avg_rank,
    });
    nameByBrand[e.brand_id] = e.name;
  }
  const featuredBrandId = Object.entries(evoByBrand).sort((a, b) => b[1].length - a[1].length)[0]?.[0];
  const featuredPoints = featuredBrandId ? evoByBrand[featuredBrandId] : [];
  const featuredName = featuredBrandId ? nameByBrand[featuredBrandId] : "";

  const limits = TIER_LIMITS[ctx.tier];
  const brandsUsed = brandList.length;

  return (
    <Section py="md" tone="cream">
      <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">Dashboard</p>
          <h1 className="font-serif text-3xl text-navy">Bonjour {ctx.profile?.full_name?.split(" ")[0] || ctx.user.email?.split("@")[0]}</h1>
        </div>
        <Link href="/app/brands/new" className="bg-amber text-navy px-4 py-2 text-sm font-medium hover:bg-amber/90 transition">
          + Suivre une marque
        </Link>
      </div>

      {alertList.length > 0 && (
        <div className="mb-6">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-2">Alertes non lues ({alertList.length})</p>
          <AlertBanner alerts={alertList} />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat label="Marques suivies" value={`${brandsUsed} / ${limits.brands}`} variant="highlight" />
        <Stat label="Cadence" value={limits.cadence === "weekly" ? "Hebdo" : "Mensuel"} />
        <Stat label="LLMs" value={String(limits.llms)} />
        <Stat label="Plan" value={ctx.tier.toUpperCase()} variant={ctx.tier === "free" ? "default" : "highlight"} />
      </div>

      {brandList.length === 0 ? (
        <div className="bg-white p-8 text-center">
          <h2 className="font-serif text-xl text-navy mb-2">Aucune marque suivie</h2>
          <p className="text-sm text-ink-muted mb-4">Commence par ajouter ta marque pour voir comment les LLM la perçoivent.</p>
          <Link href="/app/brands/new" className="inline-block bg-amber text-navy px-6 py-2.5 text-sm font-medium hover:bg-amber/90 transition">
            Suivre ma 1re marque
          </Link>
        </div>
      ) : (
        <>
          {featuredPoints.length > 0 && (
            <div className="mb-8">
              <BrandEvolutionChart points={featuredPoints} brandName={featuredName} />
            </div>
          )}

          <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-2">Mes marques</p>
          <div className="grid gap-3 md:grid-cols-2">
            {brandList.map(b => (
              <Link key={b.id} href={`/app/brands/${b.id}`} className="bg-white p-5 hover:bg-navy/5 transition border border-transparent hover:border-navy/10">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <h3 className="font-serif text-lg text-navy">{b.name}</h3>
                    <p className="font-mono text-xs text-ink-muted">{b.domain}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl text-navy">{fmtScore(b.visibility_score)}</span>
                    <span className="text-xs text-ink-muted ml-1">/100</span>
                    {(() => {
                      const rv = relativeVisibility(b.visibility_score, b.citation_rate);
                      return rv !== null ? (
                        <div className="text-[10px] text-ink-muted font-mono mt-0.5" title="visibility / citation_rate — quand effectivement cité">
                          {rv.toFixed(0)} quand cité
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><div className="text-ink-muted">Rang moy.</div><div className="font-mono">{b.avg_rank?.toFixed(1) ?? "—"}</div></div>
                  <div><div className="text-ink-muted">Citation</div><div className="font-mono">{b.citation_rate?.toFixed(0) ?? "0"}%</div></div>
                  <div><div className="text-ink-muted">SOV</div><div className="font-mono">{b.share_of_voice?.toFixed(0) ?? "0"}%</div></div>
                </div>
                <div className="mt-3 pt-3 border-t border-navy/5 flex items-center justify-between text-xs text-ink-muted">
                  <span>Maj {fmtDate(b.last_snapshot_at)}</span>
                  <div className="flex gap-3">
                    {b.unread_alerts > 0 && <span className="text-amber font-medium">{b.unread_alerts} alerte{b.unread_alerts > 1 ? "s" : ""}</span>}
                    {b.unread_recos > 0 && <span>{b.unread_recos} reco{b.unread_recos > 1 ? "s" : ""}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </Section>
  );
}
