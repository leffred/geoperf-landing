import { Suspense, cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EmptyState } from "@/components/saas/EmptyState";
import { Button } from "@/components/ui/Button";
import { CitationsSankey } from "@/components/saas/CitationsSankey";
import { TopicSelector } from "@/components/saas/TopicSelector";
import { SankeySkeleton } from "@/components/saas/skeletons/SankeySkeleton";
import { loadSaasContext, tierLabel } from "@/lib/saas-auth";
import { isDemoMode } from "@/lib/demo-mode";
import { getServiceClient } from "@/lib/supabase";
import { refreshBrand } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Citations Flow — Geoperf", robots: { index: false, follow: false } };

const ALLOWED = new Set(["pro", "agency"]);

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ topic?: string }> };

const getBrand = cache(async (id: string) => {
  const sb = getServiceClient();
  const { data } = await sb
    .from("saas_tracked_brands")
    .select("id, user_id, name, domain")
    .eq("id", id)
    .maybeSingle();
  return data as any | null;
});

function Header({ id, brandName, subtitle }: { id: string; brandName: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <Eyebrow className="mb-2">
        <Link href={`/app/brands/${id}`} className="hover:underline">{brandName}</Link>
        <span className="opacity-50"> / </span>
        <span>Citations Flow</span>
      </Eyebrow>
      <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
        Citations Flow
      </h1>
      {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
    </div>
  );
}

export default async function CitationsFlowPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { topic: topicFilter } = await searchParams;
  const ctx = await loadSaasContext();
  const brand = await getBrand(id);
  if (!brand || brand.user_id !== ctx.account_owner_id) notFound();

  const demo = await isDemoMode();

  if (!ALLOWED.has(ctx.tier)) {
    return (
      <Section py="md" tone="white">
        <Header id={id} brandName={brand.name} />
        <EmptyState
          icon="chart"
          eyebrow="Tier verrouillé"
          title="Citations Flow réservé Pro+"
          body={`Tu es en ${tierLabel(ctx.tier)}. Le diagramme Sankey 4-colonnes montre le flux Catégorie de prompt → LLM → Mention de la marque → Sources autorité citées. Réservé Pro+.`}
          ctaLabel="Voir les plans"
          ctaHref="/app/billing"
        />
      </Section>
    );
  }

  return (
    <Section py="md" tone="white">
      <Header id={id} brandName={brand.name} />

      <Suspense fallback={<div className="mb-6 h-9 bg-surface rounded-lg animate-pulse" />}>
        <AsyncTopicSelector brandId={id} ctx={ctx} topicFilter={topicFilter ?? null} />
      </Suspense>

      <Suspense fallback={<SankeySkeleton height={520} />}>
        <AsyncSankeyBlock
          brandId={id}
          brandName={brand.name}
          topicFilter={topicFilter ?? null}
          isOwner={ctx.is_owner}
          demo={demo}
        />
      </Suspense>
    </Section>
  );
}

async function AsyncTopicSelector({
  brandId,
  ctx,
  topicFilter,
}: {
  brandId: string;
  ctx: any;
  topicFilter: string | null;
}) {
  const sb = getServiceClient();
  const { data: topicsData } = await sb
    .from("saas_topics")
    .select("id, name, slug, is_default")
    .eq("brand_id", brandId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });
  const topicList = (topicsData as any[] | null) ?? [];
  if (topicList.length === 0) return null;
  return (
    <TopicSelector
      brandId={brandId}
      topics={topicList}
      currentTopicId={topicFilter}
      isOwner={ctx.is_owner}
      topicLimit={ctx.limits.topics}
    />
  );
}

async function AsyncSankeyBlock({
  brandId,
  brandName,
  topicFilter,
  isOwner,
  demo,
}: {
  brandId: string;
  brandName: string;
  topicFilter: string | null;
  isOwner: boolean;
  demo: boolean;
}) {
  const sb = getServiceClient();
  let snapQ = sb
    .from("saas_brand_snapshots")
    .select("id, created_at, topic_id")
    .eq("brand_id", brandId)
    .eq("status", "completed");
  if (topicFilter) snapQ = snapQ.eq("topic_id", topicFilter);
  const { data: latest } = await snapQ.order("created_at", { ascending: false }).limit(1).maybeSingle();

  if (!latest) {
    return (
      <EmptyState
        icon="snapshot"
        title="Pas encore de snapshot pour visualiser le flow"
        body="Lance un snapshot sur cette marque. La visualisation Sankey s'affichera ensuite avec les flux Prompt → LLM → Mention → Sources."
        secondaryLabel="Retour à la marque"
        secondaryHref={`/app/brands/${brandId}`}
        actionSlot={
          isOwner && !demo ? (
            <form action={refreshBrand}>
              <input type="hidden" name="brand_id" value={brandId} />
              <Button type="submit" variant="primary" size="md">Lancer un snapshot</Button>
            </form>
          ) : null
        }
      />
    );
  }

  const { data: responses } = await sb
    .from("saas_snapshot_responses")
    .select("llm, prompt_text, brand_mentioned, sources_cited")
    .eq("snapshot_id", (latest as any).id);
  const respList = (responses as any[] | null) ?? [];

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

  const subtitle = `Snapshot du ${new Date((latest as any).created_at).toLocaleDateString("fr-FR")} · ${respList.length} réponses analysées`;

  return (
    <>
      <p className="text-sm text-ink-muted -mt-4 mb-6">{subtitle}</p>

      <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-5 mb-6">
        <CitationsSankey
          responses={respList}
          brandName={brandName}
          promptCategoryByText={promptCategoryByText}
          height={520}
        />
      </div>

      <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-5">
        <Eyebrow className="mb-3">Comment lire ce diagramme</Eyebrow>
        <ol className="text-xs text-ink-muted leading-relaxed space-y-1.5 list-decimal list-inside">
          <li>Colonne 1 : <strong className="text-ink">catégorie du prompt</strong> (recherche directe / use-case / concurrentielle).</li>
          <li>Colonne 2 : <strong className="text-ink">LLM</strong> qui a répondu (4 à 7 selon ton plan).</li>
          <li>Colonne 3 : la marque a-t-elle été <strong className="text-ink">mentionnée</strong> dans la réponse, oui ou non.</li>
          <li>Colonne 4 : <strong className="text-ink">top 5 sources autorité</strong> citées dans les réponses où la marque est mentionnée.</li>
        </ol>
        <p className="text-xs text-ink-muted mt-3">
          La largeur des flux est proportionnelle au nombre d&apos;observations. Idéal pour identifier (a) les catégories où ta marque sort le plus, (b) les LLMs où tu es le plus visible, et (c) les médias/sites qui co-citent ton secteur.
        </p>
      </div>
    </>
  );
}
