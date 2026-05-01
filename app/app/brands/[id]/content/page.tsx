import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/saas/EmptyState";
import { loadSaasContext, tierLabel } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { generateDraft, updateDraftStatus } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Content Studio — Geoperf", robots: { index: false, follow: false } };

const ALLOWED = new Set(["pro", "agency"]);
const PRO_QUOTA = 10;

const ERROR_LABELS: Record<string, string> = {
  bad_type: "Type de draft invalide.",
  tier_too_low: "Content Studio est réservé Pro+.",
  quota_exceeded: "Quota mensuel dépassé (10 drafts/mois Pro). Upgrade Agency pour illimité.",
  generation_failed: "La génération a échoué. Réessaie ou contacte le support.",
  bad_status: "Statut invalide.",
};

const TYPE_LABEL: Record<string, string> = {
  blog_post: "Blog post",
  press_release: "Press release",
  linkedin_post: "LinkedIn post",
  tweet: "Tweet",
};
const STATUS_STYLES: Record<string, string> = {
  draft: "bg-surface text-ink-muted border-DEFAULT",
  approved: "bg-brand-50 text-brand-600 border-brand-500/30",
  published: "bg-emerald-50 text-success border-success/30",
  archived: "bg-surface-2 text-ink-subtle border-DEFAULT",
};

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1.5";
const FIELD_INPUT = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ generated?: string; error?: string; updated?: string }> };

function PageHeader({ id, brandName, subtitle }: { id: string; brandName: string; subtitle?: string }) {
  return (
    <div className="mb-8 flex items-baseline justify-between flex-wrap gap-3">
      <div>
        <Eyebrow className="mb-2">
          <Link href={`/app/brands/${id}`} className="hover:underline">{brandName}</Link>
          <span className="opacity-50"> / </span>
          <span>Content Studio</span>
        </Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">Content Studio</h1>
        {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

export default async function ContentStudioPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { generated, error, updated } = await searchParams;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: brand } = await sb.from("saas_tracked_brands").select("id, user_id, name").eq("id", id).maybeSingle();
  if (!brand || (brand as any).user_id !== ctx.account_owner_id) notFound();

  if (!ALLOWED.has(ctx.tier)) {
    return (
      <Section py="md" tone="white">
        <PageHeader id={id} brandName={(brand as any).name} />
        <EmptyState
          icon="topics"
          eyebrow="Tier verrouillé"
          title="Content Studio réservé Pro+"
          body={`Tu es en ${tierLabel(ctx.tier)}. Content Studio génère des drafts (blog post, press release, LinkedIn, tweet) optimisés pour gagner en référencement IA, à partir de tes snapshots et de ta brand setup.`}
          ctaLabel="Voir les plans"
          ctaHref="/app/billing"
        />
      </Section>
    );
  }

  let usedThisMonth = 0;
  const { data: countRow } = await sb.rpc("saas_drafts_count_this_month", { p_user_id: ctx.account_owner_id });
  if (typeof countRow === "number") usedThisMonth = countRow;

  const [{ data: topics }, { data: drafts }] = await Promise.all([
    sb.from("saas_topics").select("id, name, is_default").eq("brand_id", id).order("is_default", { ascending: false }).order("name"),
    sb.from("saas_content_drafts")
      .select("id, draft_type, title, body, target_keywords, target_authority_sources, status, cost_usd, llm_used, created_at, updated_at")
      .eq("brand_id", id).order("created_at", { ascending: false }),
  ]);
  const topicList = (topics as any[] | null) ?? [];
  const draftList = (drafts as any[] | null) ?? [];

  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;
  const quotaCap = ctx.tier === "agency" ? Infinity : PRO_QUOTA;
  const canGenerate = usedThisMonth < quotaCap;

  return (
    <Section py="md" tone="white">
      <PageHeader
        id={id}
        brandName={(brand as any).name}
        subtitle="Génère des drafts optimisés pour gagner en visibilité LLM. Source : ta brand setup + dernier snapshot."
      />

      {generated === "1" && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
          Draft généré. Vois-le ci-dessous.
        </div>
      )}
      {updated === "1" && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-ink/15 bg-surface px-4 py-3 text-sm text-ink-muted">
          Draft mis à jour.
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat
          label="Drafts ce mois"
          value={ctx.tier === "agency" ? `${usedThisMonth}` : `${usedThisMonth} / ${PRO_QUOTA}`}
          variant="dark"
        />
        <Stat label="Total drafts" value={String(draftList.length)} />
        <Stat label="Approuvés" value={String(draftList.filter(d => d.status === "approved").length)} />
        <Stat label="Publiés" value={String(draftList.filter(d => d.status === "published").length)} />
      </div>

      <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-5 mb-8">
        <Eyebrow className="mb-4">Générer un draft</Eyebrow>
        {!canGenerate ? (
          <p className="text-sm text-warning bg-amber/10 rounded-md px-3 py-2">
            Quota mensuel atteint ({usedThisMonth}/{PRO_QUOTA}).{" "}
            <Link href="/app/billing" className="underline hover:text-ink">Upgrade Agency</Link> pour drafts illimités.
          </p>
        ) : (
          <form action={generateDraft} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="brand_id" value={id} />
            <div className="flex-1 min-w-[180px]">
              <label className={FIELD_LABEL}>Type</label>
              <select name="draft_type" required className={FIELD_INPUT}>
                <option value="blog_post">Blog post (600-900 mots)</option>
                <option value="press_release">Press release (250-400 mots)</option>
                <option value="linkedin_post">LinkedIn post (150-250 mots)</option>
                <option value="tweet">Tweet (280 chars)</option>
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className={FIELD_LABEL}>Topic (optionnel)</label>
              <select name="focus_topic_id" className={FIELD_INPUT}>
                <option value="">Aucun (général)</option>
                {topicList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <Button type="submit" variant="primary" size="md">Générer ($0.05 ~ Sonnet 4.6)</Button>
          </form>
        )}
        <p className="text-xs text-ink-muted mt-3">
          Le draft inclut : un titre, un corps de texte format-adapté, des keywords cibles, et 2-3 sources autorités où pitcher le contenu. Source d&apos;inspiration :{" "}
          <Link href={`/app/brands/${id}/setup`} className="text-brand-500 hover:underline">ta brand setup</Link>.
        </p>
      </div>

      {draftList.length === 0 ? (
        <EmptyState
          icon="topics"
          title="Aucun draft pour l'instant"
          body="Lance ta 1re génération ci-dessus. Tu pourras ensuite éditer, approuver et marquer comme publié."
        />
      ) : (
        <div className="space-y-4">
          <Eyebrow>Drafts ({draftList.length})</Eyebrow>
          {draftList.map(d => {
            const sources = ((d.target_authority_sources ?? []) as string[]);
            return (
              <article key={d.id} className="bg-white rounded-lg border border-DEFAULT shadow-card p-5">
                <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-subtle">{TYPE_LABEL[d.draft_type] ?? d.draft_type}</span>
                    <span className={`font-mono text-[10px] uppercase tracking-eyebrow rounded-md px-2 py-0.5 border ${STATUS_STYLES[d.status] ?? STATUS_STYLES.draft}`}>
                      {d.status}
                    </span>
                    <span className="font-mono text-[10px] text-ink-subtle">{new Date(d.created_at).toLocaleDateString("fr-FR")}</span>
                    {d.cost_usd && <span className="font-mono text-[10px] text-ink-subtle">${Number(d.cost_usd).toFixed(4)}</span>}
                  </div>
                </div>
                <h2 className="text-lg font-medium text-ink mb-2 tracking-tightish">{d.title}</h2>
                <details className="mb-3">
                  <summary className="cursor-pointer text-xs font-mono uppercase tracking-eyebrow text-brand-500">
                    Voir le draft complet
                  </summary>
                  <pre className="text-sm leading-relaxed font-sans whitespace-pre-wrap mt-3 bg-surface p-3 rounded-md max-h-96 overflow-y-auto text-ink">
                    {d.body}
                  </pre>
                </details>
                {(d.target_keywords ?? []).length > 0 && (
                  <div className="mb-2">
                    <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-subtle mb-1">Keywords ciblés</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(d.target_keywords as string[]).map((k, i) => (
                        <span key={i} className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-surface text-ink">{k}</span>
                      ))}
                    </div>
                  </div>
                )}
                {sources.length > 0 && (
                  <div className="mb-3">
                    <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-subtle mb-1">Sources autorité suggérées</p>
                    <ul className="text-xs space-y-0.5">
                      {sources.map((s, i) => <li key={i} className="font-mono text-ink-muted">· {s}</li>)}
                    </ul>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-DEFAULT">
                  {d.status === "draft" && (
                    <form action={updateDraftStatus}>
                      <input type="hidden" name="draft_id" value={d.id} />
                      <input type="hidden" name="brand_id" value={id} />
                      <input type="hidden" name="status" value="approved" />
                      <Button type="submit" variant="primary" size="sm">Approuver</Button>
                    </form>
                  )}
                  {d.status === "approved" && (
                    <form action={updateDraftStatus}>
                      <input type="hidden" name="draft_id" value={d.id} />
                      <input type="hidden" name="brand_id" value={id} />
                      <input type="hidden" name="status" value="published" />
                      <button type="submit" className="text-xs px-3 py-1.5 bg-success text-white rounded-md hover:opacity-90 transition">
                        Marquer publié
                      </button>
                    </form>
                  )}
                  {d.status !== "archived" && (
                    <form action={updateDraftStatus}>
                      <input type="hidden" name="draft_id" value={d.id} />
                      <input type="hidden" name="brand_id" value={id} />
                      <input type="hidden" name="status" value="archived" />
                      <button type="submit" className="text-xs px-3 py-1.5 text-ink-muted hover:text-danger underline transition-colors">
                        Archiver
                      </button>
                    </form>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Section>
  );
}
