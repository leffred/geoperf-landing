import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { BrandEvolutionChart, type Point } from "@/components/saas/BrandEvolutionChart";
import { RecommendationList } from "@/components/saas/RecommendationList";
import { AlertBanner } from "@/components/saas/AlertBanner";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Topic — Geoperf", robots: { index: false, follow: false } };

type Props = { params: Promise<{ id: string; topicId: string }> };

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

  // Pour le topic default : on inclut aussi les snapshots avec topic_id NULL (legacy)
  const isDefault = (topic as any).is_default;
  const snapshotFilter = isDefault ? null : topicId;

  let snapshotsQuery = sb
    .from("saas_brand_snapshots")
    .select("id, status, visibility_score, avg_rank, citation_rate, share_of_voice, total_cost_usd, raw_response_count, created_at, completed_at, error_message, topic_id")
    .eq("brand_id", id);
  if (isDefault) {
    // OR clause : default topic OR no topic (legacy snapshots pre-S7)
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

  // Évolution
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
    <Section py="md" tone="cream">
      <div className="mb-4">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
          <Link href="/app/brands" className="hover:underline">Marques</Link>
          {" / "}<Link href={`/app/brands/${id}`} className="hover:underline">{brand.name}</Link>
          {" / "}<Link href={`/app/brands/${id}/topics`} className="hover:underline">Topics</Link>
          {" / "}{topic.name}
        </p>
        <h1 className="font-serif text-3xl text-navy">{topic.name}</h1>
        <p className="text-sm text-ink-muted">
          {(topic as any).is_default && <span className="font-mono text-[10px] uppercase tracking-widest text-amber mr-2">Default</span>}
          {(topic as any).description || "Aucune description."}
          {" · "}
          <span className="font-mono">{promptsCount > 0 ? `${promptsCount} prompts custom` : "30 prompts standards"}</span>
        </p>
      </div>

      {latest ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Stat label="Visibility" value={Number(latest.visibility_score).toFixed(0)} variant="highlight" />
            <Stat label="Rang moy." value={latest.avg_rank?.toFixed(1) ?? "—"} />
            <Stat label="Citation" value={`${latest.citation_rate?.toFixed(0) ?? 0}%`} />
            <Stat label="Share-of-voice" value={`${latest.share_of_voice?.toFixed(0) ?? 0}%`} />
          </div>

          {points.length > 0 && (
            <div className="mb-6">
              <BrandEvolutionChart points={points} brandName={`${brand.name} · ${topic.name}`} />
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Recommandations ({recos.length})</p>
              <RecommendationList recos={recos} />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Alertes ({alerts.length})</p>
              {alerts.length === 0 ? (
                <p className="text-sm text-ink-muted italic">Aucune alerte sur ce topic.</p>
              ) : (
                <AlertBanner alerts={alerts} />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 text-center text-ink-muted text-sm mb-6">
          Aucun snapshot completed pour ce topic.{" "}
          {ctx.is_owner && (
            <span>
              Lance un run depuis <Link href={`/app/brands/${id}`} className="underline">la page de la marque</Link>.
            </span>
          )}
        </div>
      )}

      <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Historique snapshots</p>
      <div className="bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-ink-muted border-b border-navy/15">
            <tr>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">Status</th>
              <th className="text-right py-2 px-4">Score</th>
              <th className="text-right py-2 px-4">Rang</th>
              <th className="text-right py-2 px-4">Cit.%</th>
              <th className="text-right py-2 px-4 hidden md:table-cell">Coût</th>
            </tr>
          </thead>
          <tbody>
            {snapList.map(s => (
              <tr key={s.id} className="border-b border-navy/5 hover:bg-cream/30">
                <td className="py-2 px-4 font-mono text-xs">
                  <Link href={`/app/brands/${id}/snapshots/${s.id}`} className="hover:underline">{fmtDate(s.created_at)}</Link>
                </td>
                <td className="py-2 px-4">
                  <span className={`text-xs px-2 py-0.5 ${s.status === "completed" ? "bg-green-100 text-green-800" : s.status === "failed" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>{s.status}</span>
                </td>
                <td className="py-2 px-4 text-right font-mono">{s.visibility_score?.toFixed(0) ?? "—"}</td>
                <td className="py-2 px-4 text-right font-mono">{s.avg_rank?.toFixed(1) ?? "—"}</td>
                <td className="py-2 px-4 text-right font-mono">{s.citation_rate?.toFixed(0) ?? "—"}</td>
                <td className="py-2 px-4 text-right font-mono hidden md:table-cell text-xs">{s.total_cost_usd ? `$${Number(s.total_cost_usd).toFixed(4)}` : "—"}</td>
              </tr>
            ))}
            {snapList.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-ink-muted text-sm">Aucun snapshot pour ce topic.</td></tr>}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
