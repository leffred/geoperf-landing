import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { BrandEvolutionChart, type Point } from "@/components/saas/BrandEvolutionChart";
import { AlertBanner } from "@/components/saas/AlertBanner";
import { RecommendationList } from "@/components/saas/RecommendationList";
import { CompetitorMatrix } from "@/components/saas/CompetitorMatrix";
import { requireSaasUser, loadSaasContext, relativeVisibility } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { refreshBrand, markAlertsRead } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Marque — Geoperf", robots: { index: false, follow: false } };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ refreshed?: string; error?: string }>;
};

const ERROR_LABELS: Record<string, string> = {
  refresh_failed: "Le snapshot manuel a échoué. Vérifie les logs Supabase.",
  not_found: "Marque introuvable.",
  confirm_required: "Tape DELETE pour confirmer la suppression.",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function BrandDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { refreshed, error } = await searchParams;
  const ctx = await loadSaasContext();
  const user = ctx.user;
  const sb = getServiceClient();
  const matrixUnlocked = ctx.tier === "pro" || ctx.tier === "agency";

  const { data: brand } = await sb
    .from("saas_tracked_brands")
    .select("id, user_id, name, domain, category_slug, competitor_domains, cadence, is_active, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!brand || (brand as any).user_id !== user.id) notFound();

  const [{ data: snapshots }, { data: alerts }, { data: evolution }] = await Promise.all([
    sb.from("saas_brand_snapshots")
      .select("id, status, visibility_score, avg_rank, citation_rate, share_of_voice, total_cost_usd, raw_response_count, prompts_count, error_message, created_at, completed_at")
      .eq("brand_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
    sb.from("saas_alerts")
      .select("id, alert_type, severity, title, body, brand_id, is_read, created_at")
      .eq("brand_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
    sb.from("v_saas_brand_evolution")
      .select("snapshot_date, visibility_score, citation_rate, avg_rank")
      .eq("brand_id", id)
      .order("snapshot_date", { ascending: true }),
  ]);

  const snapshotList = (snapshots as any[] | null) ?? [];
  const alertList = (alerts as any[] | null) ?? [];
  const evolutionList = (evolution as any[] | null) ?? [];

  const latestSnapshot = snapshotList.find(s => s.status === "completed");
  const points: Point[] = evolutionList.map(e => ({
    snapshot_date: e.snapshot_date,
    visibility_score: e.visibility_score,
    citation_rate: e.citation_rate,
    avg_rank: e.avg_rank,
  }));

  let recos: any[] = [];
  let matrixResponses: any[] = [];
  if (latestSnapshot) {
    const [{ data: recosData }, { data: respData }] = await Promise.all([
      sb.from("saas_recommendations").select("id, priority, category, title, body, authority_sources, is_read, created_at").eq("snapshot_id", latestSnapshot.id).order("priority", { ascending: true }),
      // Pour la matrice : on n'a besoin que des champs minimaux
      sb.from("saas_snapshot_responses").select("llm, brand_mentioned, competitors_mentioned").eq("snapshot_id", latestSnapshot.id),
    ]);
    recos = (recosData as any[] | null) ?? [];
    matrixResponses = (respData as any[] | null) ?? [];
  }

  // Humanise les competitor_domains pour matcher ce qui est stocké dans competitors_mentioned
  function humanizeDomain(d: string): string {
    const root = d.split(".")[0];
    return root.split("-").map(w => w.length === 0 ? "" : w[0].toUpperCase() + w.slice(1)).join(" ");
  }
  const competitorHumans = ((brand.competitor_domains as string[] | null) ?? []).map(humanizeDomain);

  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;

  return (
    <Section py="md" tone="cream">
      <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
            <Link href="/app/brands" className="hover:underline">Marques</Link> / {brand.name}
          </p>
          <h1 className="font-serif text-3xl text-navy">{brand.name}</h1>
          <p className="text-sm text-ink-muted">{brand.domain} · {(brand.category_slug as string).replace(/-/g, " ")} · {brand.cadence === "weekly" ? "Hebdo" : "Mensuel"}</p>
        </div>
        <form action={refreshBrand}>
          <input type="hidden" name="brand_id" value={id} />
          <button
            type="submit"
            className="bg-amber text-navy px-4 py-2 text-sm font-medium hover:bg-amber/90 transition disabled:opacity-50"
          >
            Lancer un snapshot
          </button>
        </form>
      </div>

      {refreshed === "1" && (
        <div className="mb-4 px-4 py-3 bg-amber/20 border-l-2 border-amber text-sm text-navy">
          Snapshot lancé. Le résultat apparaît ci-dessous (les recommandations Haiku peuvent prendre 10-20s de plus).
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">{errorMsg}</div>
      )}

      {latestSnapshot ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
            <Stat label="Visibility absolue" value={Number(latestSnapshot.visibility_score).toFixed(0)} variant="highlight" />
            <Stat label="Rang moy." value={latestSnapshot.avg_rank?.toFixed(1) ?? "—"} />
            <Stat label="Citation" value={`${latestSnapshot.citation_rate?.toFixed(0) ?? 0}%`} />
            <Stat label="Share-of-voice" value={`${latestSnapshot.share_of_voice?.toFixed(0) ?? 0}%`} />
          </div>
          {(() => {
            const rv = relativeVisibility(latestSnapshot.visibility_score, latestSnapshot.citation_rate);
            if (rv === null) return null;
            return (
              <p className="text-xs text-ink-muted mb-6">
                <span className="font-mono uppercase tracking-widest text-navy-light mr-2">Performance quand cité :</span>
                <span className="font-serif text-base text-navy mr-2">{rv.toFixed(0)} / 100</span>
                <span>(visibility absolue {Number(latestSnapshot.visibility_score).toFixed(0)} normalisée par citation rate {latestSnapshot.citation_rate?.toFixed(0)}%)</span>
              </p>
            );
          })()}

          {points.length > 0 && (
            <div className="mb-6">
              <BrandEvolutionChart points={points} brandName={brand.name} />
            </div>
          )}

          {matrixResponses.length > 0 && (
            <div className="mb-6">
              <CompetitorMatrix
                responses={matrixResponses}
                brandName={brand.name}
                competitorHumans={competitorHumans}
                totalPromptsPerLlm={latestSnapshot.prompts_count ?? undefined}
                locked={!matrixUnlocked}
              />
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <p className="font-mono text-xs tracking-widest text-navy-light uppercase">Recommandations</p>
                <span className="text-xs text-ink-muted">{recos.length}</span>
              </div>
              <RecommendationList recos={recos} />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-3">
                <p className="font-mono text-xs tracking-widest text-navy-light uppercase">Alertes</p>
                {alertList.some(a => !a.is_read) && (
                  <form action={markAlertsRead}>
                    <input type="hidden" name="brand_id" value={id} />
                    <button type="submit" className="text-xs text-ink-muted hover:text-navy underline">Marquer toutes lues</button>
                  </form>
                )}
              </div>
              {alertList.length === 0 ? (
                <p className="text-sm text-ink-muted italic">Aucune alerte pour cette marque.</p>
              ) : (
                <AlertBanner alerts={alertList} />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-8 text-center mb-6">
          {snapshotList.some(s => s.status === "running") ? (
            <p className="text-ink-muted">Un snapshot est en cours… revisite cette page dans 30 secondes.</p>
          ) : snapshotList.some(s => s.status === "failed") ? (
            <>
              <p className="text-red-700 mb-2">Le dernier snapshot a échoué :</p>
              <p className="text-xs text-ink-muted font-mono">{snapshotList[0].error_message}</p>
              <p className="text-sm text-ink-muted mt-3">Relance ci-dessus, ou contacte le support si l&apos;erreur persiste.</p>
            </>
          ) : (
            <>
              <p className="text-ink-muted mb-3">Aucun snapshot encore généré.</p>
              <form action={refreshBrand}>
                <input type="hidden" name="brand_id" value={id} />
                <button type="submit" className="inline-block bg-amber text-navy px-6 py-2.5 text-sm font-medium hover:bg-amber/90 transition">
                  Lancer le 1er snapshot
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <div>
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">Historique des snapshots</p>
        <div className="bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-muted border-b border-navy/15">
              <tr>
                <th className="text-left py-2 px-4">Date</th>
                <th className="text-left py-2 px-4">Status</th>
                <th className="text-right py-2 px-4">Score</th>
                <th className="text-right py-2 px-4">Rang</th>
                <th className="text-right py-2 px-4">Cit.%</th>
                <th className="text-right py-2 px-4 hidden md:table-cell">Réponses</th>
                <th className="text-right py-2 px-4 hidden md:table-cell">Coût</th>
              </tr>
            </thead>
            <tbody>
              {snapshotList.map(s => (
                <tr key={s.id} className="border-b border-navy/5 hover:bg-cream/30">
                  <td className="py-2 px-4 font-mono text-xs">
                    <Link href={`/app/brands/${id}/snapshots/${s.id}`} className="hover:underline">{fmtDate(s.created_at)}</Link>
                  </td>
                  <td className="py-2 px-4">
                    <span className={`text-xs px-2 py-0.5 ${s.status === "completed" ? "bg-green-100 text-green-800" : s.status === "failed" ? "bg-red-100 text-red-800" : s.status === "running" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right font-mono">{s.visibility_score?.toFixed(0) ?? "—"}</td>
                  <td className="py-2 px-4 text-right font-mono">{s.avg_rank?.toFixed(1) ?? "—"}</td>
                  <td className="py-2 px-4 text-right font-mono">{s.citation_rate?.toFixed(0) ?? "—"}</td>
                  <td className="py-2 px-4 text-right font-mono hidden md:table-cell text-xs">{s.raw_response_count}</td>
                  <td className="py-2 px-4 text-right font-mono hidden md:table-cell text-xs">{s.total_cost_usd ? `$${Number(s.total_cost_usd).toFixed(4)}` : "—"}</td>
                </tr>
              ))}
              {snapshotList.length === 0 && (
                <tr><td colSpan={7} className="py-6 text-center text-ink-muted text-sm">Aucun snapshot.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-navy/10">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-2">Concurrents suivis</p>
        <ul className="space-y-1">
          {(brand.competitor_domains as string[] | null)?.length ? (
            (brand.competitor_domains as string[]).map(c => (
              <li key={c} className="font-mono text-xs text-ink-muted">{c}</li>
            ))
          ) : (
            <li className="text-xs text-ink-muted italic">Aucun concurrent configuré. Édite la marque pour en ajouter.</li>
          )}
        </ul>
      </div>
    </Section>
  );
}
