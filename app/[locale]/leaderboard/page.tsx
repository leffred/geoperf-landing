import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { CategoryCard } from "@/components/leaderboard/CategoryCard";
import { Link } from "@/i18n/navigation";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "leaderboard" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

type CategoryRow = {
  id: string;
  slug: string;
  nom: string;
  nom_en: string | null;
};

type ReportRow = {
  id: string;
  category_id: string;
  status: string;
  top_n: number | null;
  completed_at: string | null;
  created_at: string;
};

type Props = { params: Promise<{ locale: string }> };

export default async function LeaderboardIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("leaderboard");
  const sb = getServiceClient();

  const [{ data: catsData }, { data: reportsData }] = await Promise.all([
    sb.from("categories")
      .select("id, slug, nom, nom_en, parent_id")
      .not("parent_id", "is", null)
      .order("nom"),
    sb.from("reports")
      .select("id, category_id, status, top_n, completed_at, created_at")
      .eq("status", "ready")
      .order("completed_at", { ascending: false }),
  ]);

  const cats = (catsData as CategoryRow[] | null) ?? [];
  const reports = (reportsData as ReportRow[] | null) ?? [];

  // S28a : pickName fallback FR si nom_en NULL
  const pickName = (c: CategoryRow) => (locale === "en" && c.nom_en ? c.nom_en : c.nom);

  const reportByCategory: Record<string, ReportRow> = {};
  for (const r of reports) {
    if (!reportByCategory[r.category_id]) reportByCategory[r.category_id] = r;
  }

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
      <Header logo="etudes" />

      <Section py="lg" tone="white">
        <div className="max-w-3xl">
          <Eyebrow className="mb-3">{t("heroEyebrow")}</Eyebrow>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-ink mb-4 leading-tight text-balance">
            {t("heroTitle")}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">{t("heroSubtitle")}</p>
        </div>
      </Section>

      {withReport.length > 0 && (
        <Section py="md" tone="surface" eyebrow={t("studiesAvailable", { count: withReport.length })}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {withReport.map(cat => (
              <CategoryCard
                key={cat.id}
                slug={cat.slug}
                name={pickName(cat)}
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
        <Section py="md" tone="white" eyebrow={t("comingSoonEyebrow")}>
          <p className="text-sm text-ink-muted mb-6 max-w-2xl">
            {t("comingSoonNoteBefore")}{" "}
            <Link href="/contact" className="text-brand-500 hover:underline">
              {t("comingSoonNoteCta")}
            </Link>{" "}
            {t("comingSoonNoteAfter")}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {withoutReport.slice(0, 16).map(cat => (
              <CategoryCard
                key={cat.id}
                slug={cat.slug}
                name={pickName(cat)}
                hasReport={false}
              />
            ))}
          </div>
        </Section>
      )}

      <Section py="lg" tone="dark">
        <div className="max-w-2xl">
          <Eyebrow variant="muted" className="mb-3 text-amber">{t("ctaFinalEyebrow")}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white text-balance mb-4 leading-tight">
            {t("ctaFinalTitle")}
          </h2>
          <p className="text-base text-white/85 mb-6 leading-relaxed">{t("ctaFinalSubtitle")}</p>
          <Button href="/saas" variant="primary" size="lg">{t("ctaFinalCta")}</Button>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
