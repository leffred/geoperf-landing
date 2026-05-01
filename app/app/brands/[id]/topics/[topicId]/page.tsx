import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BrandEvolutionChart, type Point } from "@/components/saas/BrandEvolutionChart";
import { RecommendationList } from "@/components/saas/RecommendationList";
import { AlertBanner } from "@/components/saas/AlertBanner";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Topic — Geoperf", robots: { index: false, follow: false } };

type Props = { params: Promise<{ id: string; topicId: string }> };

const STATUS_BADGE: Record<string, string> = {
  completed: "bg-emerald-50 text-success",
  failed: "bg-red-50 text-danger",
  running: "bg-brand-50 text-brand-600",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function TopicDetailPage({ params }: Props) {
  const { id, topicId } = await params;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const [{ data: brand }, { data: topic }] = await Promise.all([
    sb.from("saas_tracked_brands").select("id, user_id, name, domain").eq("id", id).maybeSingle(),
    sb.from("saas_topics").select("id, brand_id, name, slug, description, is_default, prompts, created_at").eq("id", topicId).maybeSingle(),
  ]);

  if (!brand || (brand as any).user_id !== ctx.account_owner_id) notFound();
  if (!topic || (topic as any).brand_id !== id) notFound();

  const isDefault = (topic as any).is_default;

  let snapshotsQuery = sb
    .from("saas_brand_snapshots")
    .select("id, status, visibility_score, avg_rank, citation_rate, share_of_voice, total_cost_usd, raw_response_count, created_at, completed_at, error_message, topic_id")
    .eq("brand_id", id);
  if (isDefault) {
    snapshotsQuery = snapshotsQuery.or(`topic_id.eq.${topicId},topic_id.is.null`);
  } else {
    snapshotsQuery = snapshotsQuery.eq("topic_id", topicId);
  }

  const { data: snapshots } = await snapshotsQuery.order("created_at", { ascending: false }).limit(20);
  const snapList = (snapshots as any[] | null) ?? [];

  const latest = snapList.find(s => s.status === "completed");

  let alerts: any[] = [];
  let recos: any[] = [];
  if (latest) {
    const [{ data: alertData }, { data: recoData }] = await Promise.all([
      sb.from("saas_alerts").select("id, alert_type, severity, title, body, brand_id, is_read, created_at").eq("snapshot_id", latest.id).order("created_at", { ascending: false }),
      sb.from("saas_recommendations").select("id, priority, category, title, body, authority_sources, is_read, created_at").eq("snapshot_id", latest.id).order("priority"),
    ]);
    alerts = (alertData as any[] | null) ?? [];
    recos = (recoData as any[] | null) ?? [];
  }

  const points: Point[] = snapList
    .filter(s => s.status === "completed")
    .map(s => ({
      snapshot_date: s.created_at,
      visibility_score: s.visibility_score,
      citation_rate: s.citation_rate,
      avg_rank: s.avg_rank,
    }))
    .reverse();

  const promptsCount = Array.isArray((topic as any).prompts) ? (topic as any).prompts.length : 0;

  return (
    <Section py="md" tone="white">
      <div className="mb-6">
        <Eyebrow className="mb-2">
          <Link href="/app/brands" className="hover:underline">Marques</Link>
          <span className="opacity-50"> / </span>
          <Link href={`/app/brands/${id}`} className="hover:underline">{brand.name}</Link>
          <span className="opacity-50"> / </span>
          <Link href={`/app/brands/${id}/topics`} className="hover:underline">Topics</Link>
          <span className="opacity-50"> / </span>
          <span>{topic.name}</span>
        </Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
          {topic.name}
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          {(topic as any).is_default && (
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-brand-500 mr-2">Default</span>
          )}
          {(topic as any).description || "Aucune description."}
          <span className="mx-2 text-ink-subtle">·</span>
          <span className="font-mono text-ink-muted">
            {promptsCount > 0 ? `${promptsCount} prompts custom` : "30 prompts standards"}
          </span>
        </p>
      </div>

      {latest ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <Stat label="Visibility" value={Number(latest.visibility_score).toFixed(0)} variant="dark" />
            <Stat label="Rang moy." value={latest.avg_rank?.toFixed(1) ?? "—"} />
            <Stat label="Citation" value={`${latest.citation_rate?.toFixed(0) ?? 0}%`} />
            <Stat label="Share-of-voice" value={`${latest.share_of_voice?.toFixed(0) ?? 0}%`} />
          </div>

          {points.length > 0 && (
            <div className="mb-8">
              <BrandEvolutionChart points={points} brandName={`${brand.name} · ${topic.name}`} />
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <Eyebrow className="mb-4">Recommandations ({recos.length})</Eyebrow>
              <RecommendationList recos={recos} />
            </div>
            <div>
              <Eyebrow className="mb-4">Alertes ({alerts.length})</Eyebrow>
              {alerts.length === 0 ? (
                <p className="text-sm text-ink-muted italic">Aucune alerte sur ce topic.</p>
              ) : (
                <AlertBanner alerts={alerts} />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-10 text-center text-ink-muted text-sm mb-8">
          Aucun snapshot completed pour ce topic.{" "}
          {ctx.is_owner && (
            <span>
              Lance un run depuis{" "}
              <Link href={`/app/brands/${id}`} className="text-brand-500 hover:underline">la page de la marque</Link>.
            </span>
          )}
        </div>
      )}

      <Eyebrow className="mb-4">Historique snapshots</Eyebrow>
      <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
            <tr>
              <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">Date</th>
              <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">Status</th>
              <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">Score</th>
              <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">Rang</th>
              <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">Cit.%</th>
              <th className="text-right py-3 px-4 hidden md:table-cell font-mono uppercase tracking-eyebrow">Coût</th>
            </tr>
          </thead>
          <tbody>
            {snapList.map(s => (
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
                <td className="py-3 px-4 text-right font-mono hidden md:table-cell text-xs text-ink-muted">
                  {s.total_cost_usd ? `$${Number(s.total_cost_usd).toFixed(4)}` : "—"}
                </td>
              </tr>
            ))}
            {snapList.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-center text-ink-muted text-sm">Aucun snapshot pour ce topic.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
