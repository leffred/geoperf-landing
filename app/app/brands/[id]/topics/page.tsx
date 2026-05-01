import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
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
    <Section py="md" tone="white">
      <div className="mb-6 flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <Eyebrow className="mb-2">
            <Link href="/app/brands" className="hover:underline">Marques</Link>
            <span className="opacity-50"> / </span>
            <Link href={`/app/brands/${id}`} className="hover:underline">{brand.name}</Link>
            <span className="opacity-50"> / </span>
            <span>Topics</span>
          </Eyebrow>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
            Topics — {brand.name}
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            {topicList.length} / {limit === 999 ? "∞" : limit} topics — un topic = un sous-sujet (ex : ESG, Innovation, etc.) avec ses propres snapshots et recos.
          </p>
        </div>
        {ctx.is_owner ? (
          canAddMore ? (
            <Button href={`/app/brands/${id}/topics/new`} variant="primary" size="md">+ Nouveau topic</Button>
          ) : (
            <Button href="/app/billing" variant="secondary" size="md">Upgrade pour plus de topics</Button>
          )
        ) : (
          <span className="text-xs text-ink-subtle italic">Lecture seule (membre).</span>
        )}
      </div>

      {created === "1" && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
          Topic créé. Lance un snapshot dessus pour démarrer.
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      <div className="space-y-3">
        {topicList.map(t => {
          const snapCount = t.is_default ? (countByTopic[t.id] ?? 0) + nullCount : (countByTopic[t.id] ?? 0);
          const promptsCount = Array.isArray(t.prompts) ? t.prompts.length : 0;
          return (
            <article
              key={t.id}
              className={`bg-white rounded-lg border border-DEFAULT shadow-card p-5 ${t.is_default ? "border-l-2 border-l-brand-500" : ""}`}
            >
              <div className="flex items-baseline justify-between mb-2 gap-3 flex-wrap">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <Link
                    href={`/app/brands/${id}/topics/${t.id}`}
                    className="text-lg font-medium text-ink hover:text-brand-500 transition-colors tracking-tightish"
                  >
                    {t.name}
                  </Link>
                  <span className="font-mono text-xs text-ink-subtle">{t.slug}</span>
                  {t.is_default && (
                    <span className="font-mono text-[10px] uppercase tracking-eyebrow text-brand-500">Default</span>
                  )}
                </div>
                <div className="text-xs text-ink-subtle font-mono">
                  {snapCount} snapshot{snapCount > 1 ? "s" : ""}
                </div>
              </div>
              {t.description && <p className="text-sm text-ink-muted mb-2">{t.description}</p>}
              <p className="text-xs font-mono text-ink-subtle">
                {promptsCount > 0 ? `${promptsCount} prompts custom` : "Utilise les prompts par défaut (30 standards)"}
              </p>
              {ctx.is_owner && !t.is_default && (
                <form action={deleteTopic} className="mt-3">
                  <input type="hidden" name="brand_id" value={id} />
                  <input type="hidden" name="topic_id" value={t.id} />
                  <button type="submit" className="text-xs text-ink-muted hover:text-danger underline transition-colors">
                    Supprimer ce topic
                  </button>
                </form>
              )}
            </article>
          );
        })}
        {topicList.length === 0 && (
          <div className="bg-white rounded-lg border border-DEFAULT p-10 text-center text-ink-muted text-sm">
            Aucun topic encore. Le topic « Général » devrait être créé automatiquement à la prochaine action.
          </div>
        )}
      </div>
    </Section>
  );
}
