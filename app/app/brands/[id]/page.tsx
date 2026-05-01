import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { BrandEvolutionChart, type Point } from "@/components/saas/BrandEvolutionChart";
import { AlertBanner } from "@/components/saas/AlertBanner";
import { RecommendationList } from "@/components/saas/RecommendationList";
import { CompetitorMatrix } from "@/components/saas/CompetitorMatrix";
import { TopicSelector } from "@/components/saas/TopicSelector";
import { loadSaasContext, relativeVisibility } from "@/lib/saas-auth";
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

const STATUS_BADGE: Record<string, string> = {
  completed: "bg-emerald-50 text-success",
  failed: "bg-red-50 text-danger",
  running: "bg-brand-50 text-brand-600",
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

  const { data: topicsData } = await sb
    .from("saas_topics")
    .select("id, name, slug, is_default")
    .eq("brand_id", id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });
  const topicList = (topicsData as any[] | null) ?? [];

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
      sb.from("saas_snapshot_responses").select("llm, brand_mentioned, competitors_mentioned").eq("snapshot_id", latestSnapshot.id),
    ]);
    recos = (recosData as any[] | null) ?? [];
    matrixResponses = (respData as any[] | null) ?? [];
  }

  function humanizeDomain(d: string): string {
    const root = d.split(".")[0];
    return root.split("-").map(w => w.length === 0 ? "" : w[0].toUpperCase() + w.slice(1)).join(" ");
  }
  const competitorHumans = ((brand.competitor_domains as string[] | null) ?? []).map(humanizeDomain);

  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;

  return (
    <Section py="md" tone="white">
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
        <div>
          <Eyebrow className="mb-2">
            <Link href="/app/brands" className="hover:underline">Marques</Link>
            <span className="opacity-50"> / </span>
            <span>{brand.name}</span>
          </Eyebrow>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
            {brand.name}
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            <span className="font-mono">{brand.domain}</span>
            <span className="mx-2 text-ink-subtle">·</span>
            {(brand.category_slug as string).replace(/-/g, " ")}
            <span className="mx-2 text-ink-subtle">·</span>
            {brand.cadence === "weekly" ? "Hebdo" : "Mensuel"}
          </p>
        </div>
        <form action={refreshBrand}>
          <input type="hidden" name="brand_id" value={id} />
          <Button type="submit" variant="primary" size="md">Lancer un snapshot</Button>
        </form>
      </div>

      {topicList.length > 0 && (
        <TopicSelector
          brandId={id}
          topics={topicList}
          currentTopicId={null}
          isOwner={ctx.is_owner}
          topicLimit={ctx.limits.topics}
        />
      )}

      <div className="bg-white rounded-lg border border-DEFAULT p-3 mb-6 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono uppercase tracking-eyebrow text-brand-500 shrink-0">Vues</span>
        <Link href={`/app/brands/${id}/sources`} className="px-2.5 py-1 rounded-md text-ink hover:bg-surface transition-colors">Sources</Link>
        <Link href={`/app/brands/${id}/by-model`} className="px-2.5 py-1 rounded-md text-ink hover:bg-surface transition-colors">Par LLM</Link>
        <Link href={`/app/brands/${id}/by-prompt`} className="px-2.5 py-1 rounded-md text-ink hover:bg-surface transition-colors">Par prompt</Link>
        <Link href={`/app/brands/${id}/topics`} className="px-2.5 py-1 rounded-md text-ink hover:bg-surface transition-colors">Topics</Link>
      </div>

      {refreshed === "1" && (
        <div className="mb-6 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
          Snapshot lancé. Le résultat apparaît ci-dessous (les recommandations Haiku peuvent prendre 10-20s de plus).
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      {latestSnapshot ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <Stat label="Visibility absolue" value={Number(latestSnapshot.visibility_score).toFixed(0)} variant="dark" />
            <Stat label="Rang moy." value={latestSnapshot.avg_rank?.toFixed(1) ?? "—"} />
            <Stat label="Citation" value={`${latestSnapshot.citation_rate?.toFixed(0) ?? 0}%`} />
            <Stat label="Share-of-voice" value={`${latestSnapshot.share_of_voice?.toFixed(0) ?? 0}%`} />
          </div>
          {(() => {
            const rv = relativeVisibility(latestSnapshot.visibility_score, latestSnapshot.citation_rate);
            if (rv === null) return null;
            return (
              <p className="text-xs text-ink-muted mb-8">
                <span className="font-mono uppercase tracking-eyebrow text-brand-500 mr-2">Performance quand cité :</span>
                <span className="text-base text-ink font-medium mr-2">{rv.toFixed(0)} / 100</span>
                <span>(visibility absolue {Number(latestSnapshot.visibility_score).toFixed(0)} normalisée par citation rate {latestSnapshot.citation_rate?.toFixed(0)}%)</span>
              </p>
            );
          })()}

          {points.length > 0 && (
            <div className="mb-8">
              <BrandEvolutionChart points={points} brandName={brand.name} />
            </div>
          )}

          {matrixResponses.length > 0 && (
            <div className="mb-8">
              <CompetitorMatrix
                responses={matrixResponses}
                brandName={brand.name}
                competitorHumans={competitorHumans}
                totalPromptsPerLlm={latestSnapshot.prompts_count ?? undefined}
                locked={!matrixUnlocked}
              />
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <Eyebrow>Recommandations</Eyebrow>
                <span className="text-xs text-ink-subtle font-mono">{recos.length}</span>
              </div>
              <RecommendationList recos={recos} />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-4">
                <Eyebrow>Alertes</Eyebrow>
                {alertList.some(a => !a.is_read) && (
                  <form action={markAlertsRead}>
                    <input type="hidden" name="brand_id" value={id} />
                    <button type="submit" className="text-xs text-ink-muted hover:text-ink underline transition-colors">
                      Marquer toutes lues
                    </button>
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
        <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-10 text-center mb-8">
          {snapshotList.some(s => s.status === "running") ? (
            <p className="text-ink-muted">Un snapshot est en cours… revisite cette page dans 30 secondes.</p>
          ) : snapshotList.some(s => s.status === "failed") ? (
            <>
              <p className="text-danger mb-2 font-medium">Le dernier snapshot a échoué :</p>
              <p className="text-xs text-ink-muted font-mono">{snapshotList[0].error_message}</p>
              <p className="text-sm text-ink-muted mt-3">Relance ci-dessus, ou contacte le support si l&apos;erreur persiste.</p>
            </>
          ) : (
            <>
              <p className="text-ink-muted mb-4">Aucun snapshot encore généré.</p>
              <form action={refreshBrand}>
                <input type="hidden" name="brand_id" value={id} />
                <Button type="submit" variant="primary" size="md">Lancer le 1er snapshot</Button>
              </form>
            </>
          )}
        </div>
      )}

      <div>
        <Eyebrow className="mb-4">Historique des snapshots</Eyebrow>
        <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
              <tr>
                <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">Date</th>
                <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">Status</th>
                <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">Score</th>
                <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">Rang</th>
                <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">Cit.%</th>
                <th className="text-right py-3 px-4 hidden md:table-cell font-mono uppercase tracking-eyebrow">Réponses</th>
                <th className="text-right py-3 px-4 hidden md:table-cell font-mono uppercase tracking-eyebrow">Coût</th>
              </tr>
            </thead>
            <tbody>
              {snapshotList.map(s => (
                <tr key={s.id} className="border-b border-DEFAULT last:border-b-0 hover:bg-surface transition-colors">
                  <td className="py-3 px-4 font-mono text-xs">
                    <Link href={`/app/brands/${id}/snapshots/${s.id}`} className="hover:text-brand-500 transition-colors">
                      {fmtDate(s.created_at)}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono uppercase tracking-eyebrow ${STATUS_BADGE[s.status] || "bg-surface text-ink-muted"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-ink tabular-nums">{s.visibility_score?.toFixed(0) ?? "—"}</td>
                  <td className="py-3 px-4 text-right font-mono text-ink tabular-nums">{s.avg_rank?.toFixed(1) ?? "—"}</td>
                  <td className="py-3 px-4 text-right font-mono text-ink tabular-nums">{s.citation_rate?.toFixed(0) ?? "—"}</td>
                  <td className="py-3 px-4 text-right font-mono hidden md:table-cell text-xs text-ink-muted">{s.raw_response_count}</td>
                  <td className="py-3 px-4 text-right font-mono hidden md:table-cell text-xs text-ink-muted">{s.total_cost_usd ? `$${Number(s.total_cost_usd).toFixed(4)}` : "—"}</td>
                </tr>
              ))}
              {snapshotList.length === 0 && (
                <tr><td colSpan={7} className="py-6 text-center text-ink-muted text-sm">Aucun snapshot.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-DEFAULT">
        <Eyebrow className="mb-3">Concurrents suivis</Eyebrow>
        <ul className="space-y-1">
          {(brand.competitor_domains as string[] | null)?.length ? (
            (brand.competitor_domains as string[]).map(c => (
              <li key={c} className="font-mono text-xs text-ink-muted">{c}</li>
            ))
          ) : (
            <li className="text-xs text-ink-subtle italic">Aucun concurrent configuré. Édite la marque pour en ajouter.</li>
          )}
        </ul>
      </div>
    </Section>
  );
}
