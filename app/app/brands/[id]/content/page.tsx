import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
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
  draft: "bg-cream text-ink-muted border-navy/15",
  approved: "bg-amber/30 text-navy border-amber",
  published: "bg-emerald-50 text-emerald-900 border-emerald-600/40",
  archived: "bg-cream/50 text-ink-muted/70 border-navy/10",
};

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ generated?: string; error?: string; updated?: string }> };

export default async function ContentStudioPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { generated, error, updated } = await searchParams;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: brand } = await sb.from("saas_tracked_brands").select("id, user_id, name").eq("id", id).maybeSingle();
  if (!brand || (brand as any).user_id !== ctx.account_owner_id) notFound();

  if (!ALLOWED.has(ctx.tier)) {
    return (
      <Section py="md" tone="cream">
        <div className="mb-4">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
            <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link> / Content Studio
          </p>
          <h1 className="font-serif text-3xl text-navy">Content Studio</h1>
        </div>
        <EmptyState
          icon="topics"
          title="Content Studio réservé Pro+"
          body={`Tu es en ${tierLabel(ctx.tier)}. Content Studio génère des drafts (blog post, press release, LinkedIn, tweet) optimisés pour gagner en référencement IA, à partir de tes snapshots et de ta brand setup.`}
          ctaLabel="Voir les plans"
          ctaHref="/app/billing"
        />
      </Section>
    );
  }

  // Quota mensuel
  let usedThisMonth = 0;
  const { data: countRow } = await sb.rpc("saas_drafts_count_this_month", { p_user_id: ctx.account_owner_id });
  if (typeof countRow === "number") usedThisMonth = countRow;

  // Topics + drafts
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
    <Section py="md" tone="cream">
      <div className="mb-6 flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
            <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link> / Content Studio
          </p>
          <h1 className="font-serif text-3xl text-navy">Content Studio</h1>
          <p className="text-sm text-ink-muted">
            Génère des drafts optimisés pour gagner en visibilité LLM. Source : ta brand setup + dernier snapshot.
          </p>
        </div>
      </div>

      {generated === "1" && <div className="mb-4 px-4 py-3 bg-amber/20 border-l-2 border-amber text-sm text-navy">Draft généré. Vois-le ci-dessous.</div>}
      {updated === "1" && <div className="mb-4 px-4 py-3 bg-cream border-l-2 border-navy/20 text-sm text-ink-muted">Draft mis à jour.</div>}
      {errorMsg && <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">{errorMsg}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Drafts ce mois" value={ctx.tier === "agency" ? `${usedThisMonth}` : `${usedThisMonth} / ${PRO_QUOTA}`} variant="highlight" />
        <Stat label="Total drafts" value={String(draftList.length)} />
        <Stat label="Approuvés" value={String(draftList.filter(d => d.status === "approved").length)} />
        <Stat label="Publiés" value={String(draftList.filter(d => d.status === "published").length)} />
      </div>

      <div className="bg-white p-5 mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Générer un draft</p>
        {!canGenerate ? (
          <p className="text-sm text-amber-900 bg-amber/10 px-3 py-2">Quota mensuel atteint ({usedThisMonth}/{PRO_QUOTA}). <Link href="/app/billing" className="underline">Upgrade Agency</Link> pour drafts illimités.</p>
        ) : (
          <form action={generateDraft} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="brand_id" value={id} />
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-mono uppercase text-ink-muted mb-1">Type</label>
              <select name="draft_type" required className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none">
                <option value="blog_post">Blog post (600-900 mots)</option>
                <option value="press_release">Press release (250-400 mots)</option>
                <option value="linkedin_post">LinkedIn post (150-250 mots)</option>
                <option value="tweet">Tweet (280 chars)</option>
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-mono uppercase text-ink-muted mb-1">Topic (optionnel)</label>
              <select name="focus_topic_id" className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none">
                <option value="">Aucun (général)</option>
                {topicList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <button type="submit" className="bg-navy text-white px-5 py-2.5 text-sm font-medium hover:bg-navy-light transition">
              Générer ($0.05 ~ Sonnet 4.6)
            </button>
          </form>
        )}
        <p className="text-xs text-ink-muted mt-3">
          Le draft inclut : un titre, un corps de texte format-adapté, des keywords cibles, et 2-3 sources autorités où pitcher le contenu. Source d&apos;inspiration : <Link href={`/app/brands/${id}/setup`} className="underline">ta brand setup</Link>.
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
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light">Drafts ({draftList.length})</p>
          {draftList.map(d => {
            const sources = ((d.target_authority_sources ?? []) as string[]);
            return (
              <article key={d.id} className="bg-white p-5">
                <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{TYPE_LABEL[d.draft_type] ?? d.draft_type}</span>
                    <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border ${STATUS_STYLES[d.status] ?? STATUS_STYLES.draft}`}>{d.status}</span>
                    <span className="font-mono text-[10px] text-ink-muted">{new Date(d.created_at).toLocaleDateString("fr-FR")}</span>
                    {d.cost_usd && <span className="font-mono text-[10px] text-ink-muted">${Number(d.cost_usd).toFixed(4)}</span>}
                  </div>
                </div>
                <h2 className="font-serif text-lg text-navy mb-2">{d.title}</h2>
                <details className="mb-3">
                  <summary className="cursor-pointer text-xs font-mono uppercase tracking-widest text-navy-light">Voir le draft complet</summary>
                  <pre className="text-sm leading-relaxed font-sans whitespace-pre-wrap mt-3 bg-cream/50 p-3 max-h-96 overflow-y-auto">{d.body}</pre>
                </details>
                {(d.target_keywords ?? []).length > 0 && (
                  <div className="mb-2">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-1">Keywords ciblés</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(d.target_keywords as string[]).map((k, i) => <span key={i} className="font-mono text-[11px] px-2 py-0.5 bg-cream text-navy">{k}</span>)}
                    </div>
                  </div>
                )}
                {sources.length > 0 && (
                  <div className="mb-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-1">Sources autorité suggérées</p>
                    <ul className="text-xs space-y-0.5">
                      {sources.map((s, i) => <li key={i} className="font-mono text-ink-muted">· {s}</li>)}
                    </ul>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-navy/5">
                  {d.status === "draft" && (
                    <form action={updateDraftStatus}>
                      <input type="hidden" name="draft_id" value={d.id} />
                      <input type="hidden" name="brand_id" value={id} />
                      <input type="hidden" name="status" value="approved" />
                      <button type="submit" className="text-xs px-3 py-1.5 bg-amber text-navy hover:bg-amber/90 transition">Approuver</button>
                    </form>
                  )}
                  {d.status === "approved" && (
                    <form action={updateDraftStatus}>
                      <input type="hidden" name="draft_id" value={d.id} />
                      <input type="hidden" name="brand_id" value={id} />
                      <input type="hidden" name="status" value="published" />
                      <button type="submit" className="text-xs px-3 py-1.5 bg-emerald-700 text-white hover:bg-emerald-800 transition">Marquer publié</button>
                    </form>
                  )}
                  {d.status !== "archived" && (
                    <form action={updateDraftStatus}>
                      <input type="hidden" name="draft_id" value={d.id} />
                      <input type="hidden" name="brand_id" value={id} />
                      <input type="hidden" name="status" value="archived" />
                      <button type="submit" className="text-xs px-3 py-1.5 text-ink-muted hover:text-red-600 underline">Archiver</button>
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
