import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LeaderboardTable, type LeaderboardRow } from "@/components/leaderboard/LeaderboardTable";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const SITE = "https://geoperf.com";

type Props = {
  params: Promise<{ secteur: string }>;
};

async function getCategoryAndReport(slug: string) {
  const sb = getServiceClient();
  const { data: cat } = await sb
    .from("categories")
    .select("id, slug, nom, parent_id")
    .eq("slug", slug)
    .not("parent_id", "is", null)
    .maybeSingle();
  if (!cat) return null;

  const { data: report } = await sb
    .from("reports")
    .select("id, status, top_n, completed_at, created_at, slug_public")
    .eq("category_id", (cat as any).id)
    .eq("status", "ready")
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { cat: cat as { id: string; slug: string; nom: string }, report };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { secteur } = await params;
  const data = await getCategoryAndReport(secteur);
  if (!data) {
    return { title: "Catégorie introuvable — Geoperf", robots: { index: false } };
  }
  const name = data.cat.nom;
  return {
    title: `Top ${data.report?.top_n ?? 10} ${name} dans ChatGPT et Claude — Geoperf`,
    description: `Classement officiel ${name} 2026 selon les LLMs (ChatGPT, Claude, Gemini, Perplexity). Visibility, citation rate, saturation IA. Étude gratuite Jourdechance.`,
    alternates: { canonical: `${SITE}/leaderboard/${secteur}` },
    openGraph: {
      title: `Top ${data.report?.top_n ?? 10} ${name} dans les LLMs`,
      description: `Quelles marques de ${name} sont les plus citées par ChatGPT, Claude, Gemini ?`,
      url: `${SITE}/leaderboard/${secteur}`,
      images: [`${SITE}/api/og?title=${encodeURIComponent(`Top ${data.report?.top_n ?? 10} ${name}`)}&type=leaderboard`],
    },
    twitter: {
      card: "summary_large_image",
      title: `Top ${data.report?.top_n ?? 10} ${name} dans les LLMs`,
      description: `Étude gratuite Geoperf — classement ${name} dans ChatGPT, Claude, Gemini.`,
    },
  };
}

export default async function LeaderboardCategoryPage({ params }: Props) {
  const { secteur } = await params;
  const data = await getCategoryAndReport(secteur);
  if (!data) notFound();

  const sb = getServiceClient();
  const { cat, report } = data;

  let rows: LeaderboardRow[] = [];
  let companiesWithProfile: Set<string> = new Set();

  if (report) {
    const { data: rcRows } = await sb
      .from("report_companies")
      .select("rank, visibility_score, ai_saturation_gap, market_rank_estimate, companies!inner(id, nom, domain)")
      .eq("report_id", (report as any).id)
      .order("rank", { ascending: true })
      .limit((report as any).top_n ?? 10);

    rows = ((rcRows as any[] | null) ?? []).map((r) => ({
      rank: r.rank,
      companyId: r.companies?.id ?? "",
      companyName: r.companies?.nom ?? "—",
      domain: r.companies?.domain ?? null,
      visibilityScore: r.visibility_score,
      saturationGap: r.ai_saturation_gap,
      marketRankEstimate: r.market_rank_estimate,
      hasProfilePage: false,  // résolu juste après
    }));

    // Lookup quels companies ont une page profile (= ils ont un domain et sont dans companies)
    const domains = rows.map(r => r.domain).filter(Boolean) as string[];
    if (domains.length > 0) {
      const { data: prof } = await sb
        .from("companies")
        .select("domain")
        .in("domain", domains);
      companiesWithProfile = new Set(((prof as any[] | null) ?? []).map(p => p.domain));
      rows = rows.map(r => ({ ...r, hasProfilePage: r.domain ? companiesWithProfile.has(r.domain) : false }));
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <Section py="lg" tone="white">
        <div className="max-w-3xl">
          <Eyebrow className="mb-3">
            <Link href="/leaderboard" className="hover:underline">Leaderboards</Link>
            <span className="opacity-50"> / </span>
            <span>{cat.nom}</span>
          </Eyebrow>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-ink mb-4 leading-tight text-balance">
            Top {report?.top_n ?? 10} {cat.nom} dans les LLMs — {new Date().getFullYear()}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">
            Selon ChatGPT, Claude, Gemini et Perplexity. Étude indépendante Jourdechance basée sur 30 prompts représentatifs du secteur.
            {report?.completed_at && (
              <>
                {" "}Données du{" "}
                <span className="font-mono text-ink">
                  {new Date(report.completed_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                </span>.
              </>
            )}
          </p>
        </div>
      </Section>

      {report ? (
        <>
          <Section py="md" tone="surface">
            <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
              <Eyebrow>Classement</Eyebrow>
              <Button href="/sample" variant="primary" size="sm">Téléchargez l&apos;étude complète gratuite</Button>
            </div>
            <LeaderboardTable rows={rows} topN={(report as any).top_n ?? 10} reportDate={(report as any).completed_at ?? (report as any).created_at} />
          </Section>

          <Section py="md" tone="white">
            <Card variant="default" className="max-w-3xl">
              <Eyebrow className="mb-2">Vous êtes dans le top {report.top_n ?? 10} ?</Eyebrow>
              <h2 className="text-2xl font-medium tracking-tight text-ink mb-3">Bénéficiez d&apos;un audit GEO offert</h2>
              <p className="text-sm text-ink-muted leading-relaxed mb-4">
                Si votre marque apparaît dans ce classement, Jourdechance vous offre un audit GEO de 60 minutes :
                analyse de votre visibility par LLM, comparaison vs vos concurrents directs, recommandations actionnables.
                Pas de pitch commercial — juste un avis d&apos;expert.
              </p>
              <Button href="/contact" variant="primary" size="md">Demander mon audit gratuit</Button>
            </Card>
          </Section>
        </>
      ) : (
        <Section py="md" tone="surface">
          <Card variant="default" className="max-w-2xl">
            <Eyebrow className="mb-2">Étude en cours</Eyebrow>
            <h2 className="text-2xl font-medium tracking-tight text-ink mb-3">Le leaderboard {cat.nom} sera publié prochainement</h2>
            <p className="text-sm text-ink-muted leading-relaxed mb-5">
              Nous publions une nouvelle étude sectorielle tous les 1-2 mois. Inscrivez-vous pour recevoir le {cat.nom} dès sa publication
              (et un échantillon d&apos;une étude existante en attendant).
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/sample" variant="primary" size="md">Échantillon Asset Management</Button>
              <Button href="/contact" variant="secondary" size="md">M&apos;avertir au lancement {cat.nom}</Button>
            </div>
          </Card>
        </Section>
      )}

      <Footer />
    </main>
  );
}
