import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { EmptyState } from "@/components/saas/EmptyState";
import { CitationsSankey } from "@/components/saas/CitationsSankey";
import { TopicSelector } from "@/components/saas/TopicSelector";
import { loadSaasContext, tierLabel } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Citations Flow — Geoperf", robots: { index: false, follow: false } };

const ALLOWED = new Set(["pro", "agency"]);

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ topic?: string }> };

export default async function CitationsFlowPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { topic: topicFilter } = await searchParams;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: brand } = await sb.from("saas_tracked_brands")
    .select("id, user_id, name, domain")
    .eq("id", id).maybeSingle();
  if (!brand || (brand as any).user_id !== ctx.account_owner_id) notFound();

  if (!ALLOWED.has(ctx.tier)) {
    return (
      <Section py="md" tone="cream">
        <div className="mb-4">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
            <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link> / Citations Flow
          </p>
          <h1 className="font-serif text-3xl text-navy">Citations Flow</h1>
        </div>
        <EmptyState
          icon="chart"
          title="Citations Flow réservé Pro+"
          body={`Tu es en ${tierLabel(ctx.tier)}. Le diagramme Sankey 4-colonnes montre le flux Catégorie de prompt → LLM → Mention de la marque → Sources autorité citées. Réservé Pro+.`}
          ctaLabel="Voir les plans"
          ctaHref="/app/billing"
        />
      </Section>
    );
  }

  const { data: topicsData } = await sb
    .from("saas_topics")
    .select("id, name, slug, is_default")
    .eq("brand_id", id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });
  const topicList = (topicsData as any[] | null) ?? [];

  // Last completed snapshot (filtré par topic si fourni)
  let snapQ = sb.from("saas_brand_snapshots").select("id, created_at, topic_id").eq("brand_id", id).eq("status", "completed");
  if (topicFilter) snapQ = snapQ.eq("topic_id", topicFilter);
  const { data: latest } = await snapQ.order("created_at", { ascending: false }).limit(1).maybeSingle();

  if (!latest) {
    return (
      <Section py="md" tone="cream">
        <div className="mb-4">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
            <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link> / Citations Flow
          </p>
          <h1 className="font-serif text-3xl text-navy">Citations Flow</h1>
        </div>
        <EmptyState
          icon="snapshot"
          title="Pas encore de snapshot pour visualiser le flow"
          body="Lance un snapshot sur cette marque. La visualisation Sankey s'affichera ensuite avec les flux Prompt → LLM → Mention → Sources."
          ctaLabel="Retour à la marque"
          ctaHref={`/app/brands/${id}`}
        />
      </Section>
    );
  }

  const { data: responses } = await sb
    .from("saas_snapshot_responses")
    .select("llm, prompt_text, brand_mentioned, sources_cited")
    .eq("snapshot_id", (latest as any).id);
  const respList = (responses as any[] | null) ?? [];

  // Build prompt_text → category map (deviné depuis le contenu — heuristique simple)
  // Si on avait les prompts indexés en DB on pourrait join. À défaut : keyword spotting.
  const promptCategoryByText: Record<string, string> = {};
  for (const r of respList) {
    const t = String(r.prompt_text ?? "").toLowerCase();
    if (!t || promptCategoryByText[t]) continue;
    if (t.includes("alternative") || t.includes("vs ") || t.includes("concurrent") || t.includes("rival")) {
      promptCategoryByText[r.prompt_text] = "competitive";
    } else if (t.includes("je cherche") || t.includes("comment choisir") || t.includes("appel d'offres") || t.includes("optimiser") || t.includes("centraliser")) {
      promptCategoryByText[r.prompt_text] = "use_case";
    } else if (t.includes("top ") || t.includes("meilleur") || t.includes("classement") || t.includes("référence") || t.includes("recommand")) {
      promptCategoryByText[r.prompt_text] = "direct_search";
    } else {
      promptCategoryByText[r.prompt_text] = "unknown";
    }
  }

  return (
    <Section py="md" tone="cream">
      <div className="mb-4">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
          <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link> / Citations Flow
        </p>
        <h1 className="font-serif text-3xl text-navy">Citations Flow</h1>
        <p className="text-sm text-ink-muted">
          Snapshot du {new Date((latest as any).created_at).toLocaleDateString("fr-FR")} · {respList.length} réponses analysées
        </p>
      </div>

      {topicList.length > 0 && (
        <TopicSelector brandId={id} topics={topicList} currentTopicId={topicFilter ?? null} isOwner={ctx.is_owner} topicLimit={ctx.limits.topics} />
      )}

      <CitationsSankey
        responses={respList}
        brandName={(brand as any).name}
        promptCategoryByText={promptCategoryByText}
        height={520}
      />

      <div className="bg-white p-5 mt-4">
        <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-2">Comment lire ce diagramme</p>
        <ol className="text-xs text-ink-muted leading-relaxed space-y-1.5 list-decimal list-inside">
          <li>Colonne 1 : <strong>catégorie du prompt</strong> (recherche directe / use-case / concurrentielle).</li>
          <li>Colonne 2 : <strong>LLM</strong> qui a répondu (4 à 7 selon ton plan).</li>
          <li>Colonne 3 : la marque a-t-elle été <strong>mentionnée</strong> dans la réponse, oui ou non.</li>
          <li>Colonne 4 : <strong>top 5 sources autorité</strong> citées dans les réponses où la marque est mentionnée.</li>
        </ol>
        <p className="text-xs text-ink-muted mt-3">
          La largeur des flux est proportionnelle au nombre d&apos;observations. Idéal pour identifier (a) les catégories où ta marque sort le plus, (b) les LLMs où tu es le plus visible, et (c) les médias/sites qui co-citent ton secteur.
        </p>
      </div>
    </Section>
  );
}
