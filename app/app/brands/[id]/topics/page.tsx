import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { deleteTopic } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Topics — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  not_found: "Topic introuvable.",
  forbidden: "Action refusée.",
  cannot_delete_default: "Impossible de supprimer le topic par défaut.",
  limit_reached: "Tu as atteint la limite de topics pour ton plan.",
};

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; created?: string }> };

export default async function BrandTopicsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error, created } = await searchParams;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: brand } = await sb.from("saas_tracked_brands").select("id, user_id, name, domain").eq("id", id).maybeSingle();
  if (!brand || (brand as any).user_id !== ctx.account_owner_id) notFound();

  const { data: topics } = await sb
    .from("saas_topics")
    .select("id, name, slug, description, is_default, prompts, created_at")
    .eq("brand_id", id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  const topicList = (topics as any[] | null) ?? [];
  const limit = ctx.limits.topics;
  const canAddMore = topicList.length < limit;
  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;

  // Snapshots count par topic
  const { data: counts } = await sb
    .from("saas_brand_snapshots")
    .select("topic_id")
    .eq("brand_id", id);
  const countByTopic: Record<string, number> = {};
  let nullCount = 0;
  for (const c of (counts as any[] | null) ?? []) {
    if (c.topic_id) countByTopic[c.topic_id] = (countByTopic[c.topic_id] ?? 0) + 1;
    else nullCount++;
  }

  return (
    <Section py="md" tone="cream">
      <div className="mb-4">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
          <Link href="/app/brands" className="hover:underline">Marques</Link>
          {" / "}
          <Link href={`/app/brands/${id}`} className="hover:underline">{brand.name}</Link>
          {" / Topics"}
        </p>
        <h1 className="font-serif text-3xl text-navy">Topics — {brand.name}</h1>
        <p className="text-sm text-ink-muted">
          {topicList.length} / {limit === 999 ? "∞" : limit} topics — un topic = un sous-sujet (ex : ESG, Innovation, etc.) avec ses propres snapshots et recos.
        </p>
      </div>

      {created === "1" && (
        <div className="mb-4 px-4 py-3 bg-amber/20 border-l-2 border-amber text-sm text-navy">
          Topic créé. Lance un snapshot dessus pour démarrer.
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">{errorMsg}</div>
      )}

      <div className="mb-4 flex justify-between items-center flex-wrap gap-3">
        {ctx.is_owner ? (
          canAddMore ? (
            <Link href={`/app/brands/${id}/topics/new`} className="bg-amber text-navy px-4 py-2 text-sm font-medium hover:bg-amber/90 transition">
              + Nouveau topic
            </Link>
          ) : (
            <Link href="/app/billing" className="bg-navy text-white px-4 py-2 text-sm font-medium hover:bg-navy-light transition">
              Upgrade pour plus de topics
            </Link>
          )
        ) : (
          <span className="text-xs text-ink-muted italic">Lecture seule (membre).</span>
        )}
      </div>

      <div className="space-y-3">
        {topicList.map(t => {
          const snapCount = t.is_default ? (countByTopic[t.id] ?? 0) + nullCount : (countByTopic[t.id] ?? 0);
          const promptsCount = Array.isArray(t.prompts) ? t.prompts.length : 0;
          return (
            <article key={t.id} className={`bg-white p-5 ${t.is_default ? "border-l-2 border-amber" : ""}`}>
              <div className="flex items-baseline justify-between mb-2 gap-3 flex-wrap">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <Link href={`/app/brands/${id}/topics/${t.id}`} className="font-serif text-lg text-navy hover:underline">{t.name}</Link>
                  <span className="font-mono text-xs text-ink-muted">{t.slug}</span>
                  {t.is_default && <span className="font-mono text-[10px] uppercase tracking-widest text-amber">Default</span>}
                </div>
                <div className="text-xs text-ink-muted">
                  {snapCount} snapshot{snapCount > 1 ? "s" : ""}
                </div>
              </div>
              {t.description && <p className="text-sm text-ink-muted mb-2">{t.description}</p>}
              <p className="text-xs font-mono text-ink-muted">
                {promptsCount > 0 ? `${promptsCount} prompts custom` : "Utilise les prompts par défaut (30 standards)"}
              </p>
              {ctx.is_owner && !t.is_default && (
                <form action={deleteTopic} className="mt-3">
                  <input type="hidden" name="brand_id" value={id} />
                  <input type="hidden" name="topic_id" value={t.id} />
                  <button type="submit" className="text-xs text-ink-muted hover:text-red-600 underline">Supprimer ce topic</button>
                </form>
              )}
            </article>
          );
        })}
        {topicList.length === 0 && (
          <div className="bg-white p-8 text-center text-ink-muted text-sm">
            Aucun topic encore. Le topic « Général » devrait être créé automatiquement à la prochaine action.
          </div>
        )}
      </div>
    </Section>
  );
}
