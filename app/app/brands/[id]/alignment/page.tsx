import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { EmptyState } from "@/components/saas/EmptyState";
import { loadSaasContext, tierLabel } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Brand Alignment — Geoperf", robots: { index: false, follow: false } };

const ALLOWED = new Set(["pro", "agency"]);

type Props = { params: Promise<{ id: string }> };

type Gaps = {
  matched_keywords?: string[];
  missing_keywords?: string[];
  matched_value_props?: string[];
  missing_value_props?: string[];
  unexpected_themes?: string[];
};

function GaugeBar({ score }: { score: number }) {
  const w = Math.max(0, Math.min(100, score));
  const color = w >= 70 ? "#1D9E75" : w >= 40 ? "#EF9F27" : "#B91C1C";
  return (
    <div className="w-full">
      <div className="h-3 bg-cream overflow-hidden rounded-sm relative">
        <div className="h-full transition-all duration-500" style={{ width: `${w}%`, background: color }} />
      </div>
      <div className="flex justify-between mt-1 text-[10px] font-mono text-ink-muted">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}

export default async function AlignmentPage({ params }: Props) {
  const { id } = await params;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: brand } = await sb
    .from("saas_tracked_brands")
    .select("id, user_id, name, brand_description, brand_keywords, brand_value_props")
    .eq("id", id).maybeSingle();
  if (!brand || (brand as any).user_id !== ctx.account_owner_id) notFound();

  if (!ALLOWED.has(ctx.tier)) {
    return (
      <Section py="md" tone="cream">
        <div className="mb-4">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
            <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link> / Alignment
          </p>
          <h1 className="font-serif text-3xl text-navy">Brand Health · Alignment</h1>
        </div>
        <EmptyState
          icon="alerts"
          title="Brand Alignment réservé Pro+"
          body={`Tu es en ${tierLabel(ctx.tier)}. L'analyse alignment compare ce que tu dis (description, keywords, value props) à ce que les LLM disent en réalité, et te montre les gaps + thèmes inattendus.`}
          ctaLabel="Voir les plans"
          ctaHref="/app/billing"
        />
      </Section>
    );
  }

  const keywords = ((brand as any).brand_keywords ?? []) as string[];
  const valueProps = ((brand as any).brand_value_props ?? []) as string[];
  const setupEmpty = !((brand as any).brand_description) && keywords.length === 0 && valueProps.length === 0;

  if (setupEmpty) {
    return (
      <Section py="md" tone="cream">
        <div className="mb-4">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
            <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link> / Alignment
          </p>
          <h1 className="font-serif text-3xl text-navy">Brand Health · Alignment</h1>
        </div>
        <EmptyState
          icon="topics"
          title="Configure d'abord ta marque"
          body="Pour calculer un score d'alignment, on a besoin de ta description, de tes keywords cibles et de tes value props. Va sur la page Setup pour les renseigner."
          ctaLabel="Configurer la marque"
          ctaHref={`/app/brands/${id}/setup`}
        />
      </Section>
    );
  }

  const { data: latest } = await sb
    .from("saas_brand_snapshots")
    .select("id, created_at, alignment_score, alignment_gaps, alignment_summary, alignment_computed_at")
    .eq("brand_id", id).eq("status", "completed")
    .not("alignment_computed_at", "is", null)
    .order("created_at", { ascending: false }).limit(1).maybeSingle();

  if (!latest) {
    return (
      <Section py="md" tone="cream">
        <div className="mb-4">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
            <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link> / Alignment
          </p>
          <h1 className="font-serif text-3xl text-navy">Brand Health · Alignment</h1>
        </div>
        <EmptyState
          icon="snapshot"
          title="Pas encore d'analyse alignment"
          body="Lance un snapshot pour cette marque. Le score d'alignment se calcule automatiquement post-snapshot pour les plans Pro+."
          ctaLabel="Retour à la marque"
          ctaHref={`/app/brands/${id}`}
        />
      </Section>
    );
  }

  const score = Number((latest as any).alignment_score ?? 0);
  const gaps = ((latest as any).alignment_gaps ?? {}) as Gaps;
  const summary = (latest as any).alignment_summary as string | null;

  const matchedKw = (gaps.matched_keywords ?? []).length;
  const totalKw = matchedKw + (gaps.missing_keywords ?? []).length;
  const matchedVp = (gaps.matched_value_props ?? []).length;
  const totalVp = matchedVp + (gaps.missing_value_props ?? []).length;

  return (
    <Section py="md" tone="cream">
      <div className="mb-6 flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
            <Link href={`/app/brands/${id}`} className="hover:underline">{(brand as any).name}</Link> / Alignment
          </p>
          <h1 className="font-serif text-3xl text-navy">Brand Health · Alignment</h1>
          <p className="text-sm text-ink-muted">
            Snapshot du {new Date((latest as any).created_at).toLocaleDateString("fr-FR")} ·{" "}
            <Link href={`/app/brands/${id}/setup`} className="underline">Modifier le setup</Link>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Alignment score / 100" value={score.toFixed(0)} variant="highlight" />
        <Stat label="Keywords matchés" value={`${matchedKw} / ${totalKw}`} />
        <Stat label="Value props matchés" value={`${matchedVp} / ${totalVp}`} />
        <Stat label="Themes inattendus" value={String((gaps.unexpected_themes ?? []).length)} />
      </div>

      <div className="bg-white p-5 mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Score d&apos;alignment</p>
        <GaugeBar score={score} />
        {summary && <p className="text-sm mt-4 leading-relaxed">{summary}</p>}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-700 mb-3">Keywords présents dans les LLM ({matchedKw})</p>
          {(gaps.matched_keywords ?? []).length === 0 ? (
            <p className="text-xs text-ink-muted italic">Aucun keyword n&apos;est repris par les LLM.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {(gaps.matched_keywords ?? []).map(k => (
                <span key={k} className="font-mono text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-600/30">{k}</span>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-red-700 mb-3">Keywords absents ({(gaps.missing_keywords ?? []).length})</p>
          {(gaps.missing_keywords ?? []).length === 0 ? (
            <p className="text-xs text-ink-muted italic">Tous tes keywords sont repris.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {(gaps.missing_keywords ?? []).map(k => (
                <span key={k} className="font-mono text-[11px] px-2 py-0.5 bg-red-50 text-red-900 border border-red-600/30">{k}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-700 mb-3">Value props matchés ({matchedVp})</p>
          {(gaps.matched_value_props ?? []).length === 0 ? (
            <p className="text-xs text-ink-muted italic">Aucune value prop reprise.</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {(gaps.matched_value_props ?? []).map((v, i) => (
                <li key={i} className="leading-snug border-l-2 border-emerald-600 pl-2 text-emerald-900">{v}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-red-700 mb-3">Value props absents ({(gaps.missing_value_props ?? []).length})</p>
          {(gaps.missing_value_props ?? []).length === 0 ? (
            <p className="text-xs text-ink-muted italic">Tous repris.</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {(gaps.missing_value_props ?? []).map((v, i) => (
                <li key={i} className="leading-snug border-l-2 border-red-600 pl-2 text-red-900">{v}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {(gaps.unexpected_themes ?? []).length > 0 && (
        <div className="bg-white p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Thèmes inattendus ({(gaps.unexpected_themes ?? []).length})</p>
          <p className="text-xs text-ink-muted mb-3">Sujets récurrents dans les réponses LLM, absents de ta description. Soit à intégrer, soit à corriger en relations presse.</p>
          <div className="flex flex-wrap gap-1.5">
            {(gaps.unexpected_themes ?? []).map((t, i) => (
              <span key={i} className="font-mono text-[11px] px-2 py-0.5 bg-amber/30 text-navy border border-amber">{t}</span>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
