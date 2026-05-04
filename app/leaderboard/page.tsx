import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { CategoryCard } from "@/components/leaderboard/CategoryCard";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 3600;  // re-générer 1 fois par heure côté Vercel

export const metadata: Metadata = {
  title: "Leaderboards LLM par secteur — Geoperf",
  description: "Classements officiels des marques par secteur dans ChatGPT, Claude, Gemini et Perplexity. Études Jourdechance gratuites.",
  alternates: { canonical: "https://geoperf.com/leaderboard" },
};

type CategoryRow = {
  id: string;
  slug: string;
  nom: string;
};

type ReportRow = {
  id: string;
  category_id: string;
  status: string;
  top_n: number | null;
  completed_at: string | null;
  created_at: string;
};

export default async function LeaderboardIndexPage() {
  const sb = getServiceClient();

  const [{ data: catsData }, { data: reportsData }] = await Promise.all([
    sb.from("categories")
      .select("id, slug, nom, parent_id")
      .not("parent_id", "is", null)
      .order("nom"),
    sb.from("reports")
      .select("id, category_id, status, top_n, completed_at, created_at")
      .eq("status", "ready")
      .order("completed_at", { ascending: false }),
  ]);

  const cats = (catsData as CategoryRow[] | null) ?? [];
  const reports = (reportsData as ReportRow[] | null) ?? [];

  // Map category_id → latest ready report
  const reportByCategory: Record<string, ReportRow> = {};
  for (const r of reports) {
    if (!reportByCategory[r.category_id]) reportByCategory[r.category_id] = r;
  }

  // Pour chaque cat avec report : récupérer les top 3 companies en preview
  const previewByCategory: Record<string, string[]> = {};
  const reportIdsWithCat = Object.entries(reportByCategory);
  if (reportIdsWithCat.length > 0) {
    const { data: previewRows } = await sb
      .from("report_companies")
      .select("report_id, rank, companies!inner(nom)")
      .in("report_id", reportIdsWithCat.map(([, r]) => r.id))
      .lte("rank", 3)
      .order("rank", { ascending: true });
    for (const row of (previewRows as any[] | null) ?? []) {
      const cat = reportIdsWithCat.find(([, r]) => r.id === row.report_id);
      if (!cat) continue;
      (previewByCategory[cat[0]] ||= []).push(row.companies?.nom ?? "—");
    }
  }

  const withReport = cats.filter(c => reportByCategory[c.id]);
  const withoutReport = cats.filter(c => !reportByCategory[c.id]);

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <Section py="lg" tone="white">
        <div className="max-w-3xl">
          <Eyebrow className="mb-3">Leaderboards sectoriels</Eyebrow>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-ink mb-4 leading-tight text-balance">
            Classements officiels par secteur dans les LLMs
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">
            Comment les LLMs (ChatGPT, Claude, Gemini, Perplexity) classent les marques dans votre secteur ?
            Études indépendantes Jourdechance, basées sur 30 prompts par catégorie, 4 LLMs en parallèle. Mise à jour trimestrielle.
          </p>
        </div>
      </Section>

      {withReport.length > 0 && (
        <Section py="md" tone="surface" eyebrow={`${withReport.length} études disponibles`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {withReport.map(cat => (
              <CategoryCard
                key={cat.id}
                slug={cat.slug}
                name={cat.nom}
                hasReport={true}
                topCompaniesPreview={previewByCategory[cat.id] ?? []}
                reportDate={reportByCategory[cat.id]?.completed_at ?? reportByCategory[cat.id]?.created_at}
                topN={reportByCategory[cat.id]?.top_n ?? 10}
              />
            ))}
          </div>
        </Section>
      )}

      {withoutReport.length > 0 && (
        <Section py="md" tone="white" eyebrow="Études à venir">
          <p className="text-sm text-ink-muted mb-6 max-w-2xl">
            Vous travaillez dans un de ces secteurs et souhaitez recevoir l'étude au lancement ?
            <a href="/contact" className="text-brand-500 hover:underline ml-1">Indiquez-nous votre secteur</a>{" "}
            on vous prévient dès la publication (gratuit).
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {withoutReport.slice(0, 16).map(cat => (
              <CategoryCard
                key={cat.id}
                slug={cat.slug}
                name={cat.nom}
                hasReport={false}
              />
            ))}
          </div>
        </Section>
      )}

      <Section py="lg" tone="dark">
        <div className="max-w-2xl">
          <Eyebrow variant="muted" className="mb-3 text-amber">Geoperf SaaS</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white text-balance mb-4 leading-tight">
            Suivez votre marque en continu, pas juste 1× par trimestre.
          </h2>
          <p className="text-base text-white/85 mb-6 leading-relaxed">
            Les leaderboards sectoriels sont des photos. Geoperf SaaS prend des snapshots hebdomadaires de votre marque,
            détecte les dérives et propose des actions concrètes pour améliorer votre référencement génératif.
          </p>
          <Button href="/saas" variant="primary" size="lg">Voir les plans Geoperf SaaS</Button>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
