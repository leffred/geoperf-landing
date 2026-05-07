import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
  params: Promise<{ locale: string; secteur: string }>;
};

async function getCategoryAndReport(slug: string) {
  const sb = getServiceClient();
  const { data: cat } = await sb
    .from("categories")
    .select("id, slug, nom, nom_en, parent_id")
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

  return { cat: cat as { id: string; slug: string; nom: string; nom_en: string | null }, report };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, secteur } = await params;
  const t = await getTranslations({ locale, namespace: "leaderboard" });
  const data = await getCategoryAndReport(secteur);
  if (!data) {
    return { title: t("secteurNotFoundTitle"), robots: { index: false } };
  }
  const name = locale === "en" && data.cat.nom_en ? data.cat.nom_en : data.cat.nom;
  const topN = data.report?.top_n ?? 10;
  return {
    title: t("secteurMetaTitle", { topN, name }),
    description: t("secteurMetaDescription", { name }),
    alternates: { canonical: `${SITE}/leaderboard/${secteur}` },
    openGraph: {
      title: t("secteurMetaTitle", { topN, name }),
      description: t("secteurMetaDescription", { name }),
      url: `${SITE}/leaderboard/${secteur}`,
      images: [`${SITE}/api/og?title=${encodeURIComponent(`Top ${topN} ${name}`)}&type=leaderboard`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("secteurMetaTitle", { topN, name }),
      description: t("secteurMetaDescription", { name }),
    },
  };
}

export default async function LeaderboardCategoryPage({ params }: Props) {
  const { locale, secteur } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("leaderboard");
  const data = await getCategoryAndReport(secteur);
  if (!data) notFound();

  const sb = getServiceClient();
  const { cat, report } = data;
  const name = locale === "en" && cat.nom_en ? cat.nom_en : cat.nom;
  const topN = (report as any)?.top_n ?? 10;

  let rows: LeaderboardRow[] = [];
  let companiesWithProfile: Set<string> = new Set();

  if (report) {
    const { data: rcRows } = await sb
      .from("report_companies")
      .select("rank, visibility_score, ai_saturation_gap, market_rank_estimate, companies!inner(id, nom, domain)")
      .eq("report_id", (report as any).id)
      .order("rank", { ascending: true })
      .limit(topN);

    rows = ((rcRows as any[] | null) ?? []).map((r) => ({
      rank: r.rank,
      companyId: r.companies?.id ?? "",
      companyName: r.companies?.nom ?? "—",
      domain: r.companies?.domain ?? null,
      visibilityScore: r.visibility_score,
      saturationGap: r.ai_saturation_gap,
      marketRankEstimate: r.market_rank_estimate,
      hasProfilePage: false,
    }));

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

  const dateStr = report?.completed_at
    ? new Date(report.completed_at).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header logo="etudes" />

      <Section py="lg" tone="white">
        <div className="max-w-3xl">
          <Eyebrow className="mb-3">
            <Link href="/leaderboard" className="hover:underline">{t("breadcrumbHome")}</Link>
            <span className="opacity-50"> / </span>
            <span>{name}</span>
          </Eyebrow>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-ink mb-4 leading-tight text-balance">
            {t("secteurH1Prefix")} {topN} {name} {t("secteurH1Suffix")} — {new Date().getFullYear()}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">
            {t("secteurSubtitleStart")}
            {dateStr && (
              <>
                {" "}{t("secteurSubtitleDate")}{" "}
                <span className="font-mono text-ink">{dateStr}</span>.
              </>
            )}
          </p>
        </div>
      </Section>

      {report ? (
        <>
          <Section py="md" tone="surface">
            <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
              <Eyebrow>{t("rankingEyebrow")}</Eyebrow>
              <Button href="/sample" variant="primary" size="sm">{t("downloadCta")}</Button>
            </div>
            <LeaderboardTable rows={rows} topN={topN} reportDate={(report as any).completed_at ?? (report as any).created_at} />
          </Section>

          <Section py="md" tone="white">
            <Card variant="default" className="max-w-3xl">
              <Eyebrow className="mb-2">{t("auditEyebrow", { topN })}</Eyebrow>
              <h2 className="text-2xl font-medium tracking-tight text-ink mb-3">{t("auditTitle")}</h2>
              <p className="text-sm text-ink-muted leading-relaxed mb-4">{t("auditBody")}</p>
              <Button href="/contact" variant="primary" size="md">{t("auditCta")}</Button>
            </Card>
          </Section>
        </>
      ) : (
        <Section py="md" tone="surface">
          <Card variant="default" className="max-w-2xl">
            <Eyebrow className="mb-2">{t("pendingEyebrow")}</Eyebrow>
            <h2 className="text-2xl font-medium tracking-tight text-ink mb-3">{t("pendingTitle", { name })}</h2>
            <p className="text-sm text-ink-muted leading-relaxed mb-5">{t("pendingBody", { name })}</p>
            <div className="flex flex-wrap gap-3">
              <Button href="/sample" variant="primary" size="md">{t("pendingCtaSample")}</Button>
              <Button href="/contact" variant="secondary" size="md">{t("pendingCtaNotify", { name })}</Button>
            </div>
          </Card>
        </Section>
      )}

      <Footer />
    </main>
  );
}
