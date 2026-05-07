// /sample — page publique avec aperçu du LB Asset Management. S28 i18n.

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getServiceClient } from "@/lib/supabase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sample" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === "fr" ? "https://geoperf.com/sample" : `https://geoperf.com/${locale}/sample`,
      languages: {
        fr: "https://geoperf.com/sample",
        en: "https://geoperf.com/en/sample",
        "x-default": "https://geoperf.com/sample",
      },
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [{ url: "/api/og", width: 1200, height: 630 }],
      type: "article",
    },
  };
}

const SAMPLE_REPORT_ID = "61be49be-8e19-48b4-b50a-9a59f3cb987a";

async function getSampleData() {
  try {
    const sb = getServiceClient();
    const { data } = await sb
      .from("report_companies")
      .select(`
        rank, visibility_score, cited_by, avg_position_in_lists,
        companies(nom, country, domain)
      `)
      .eq("report_id", SAMPLE_REPORT_ID)
      .order("rank")
      .limit(11);
    return (data || []).map((c: any) => ({
      rank: c.rank,
      name: c.companies?.nom,
      country: c.companies?.country,
      domain: c.companies?.domain,
      visibility_score: c.visibility_score,
      cited_by: c.cited_by,
    }));
  } catch {
    return [];
  }
}

type SectionItem = { n: string; t: string; d: string };

type Props = { params: Promise<{ locale: string }> };

export default async function SamplePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sample");
  const companies = await getSampleData();
  const stats = {
    total: companies.length,
    cited_4: companies.filter((c) => c.visibility_score === 4).length,
    cited_3: companies.filter((c) => c.visibility_score === 3).length,
    cited_2: companies.filter((c) => c.visibility_score === 2).length,
    cited_1: companies.filter((c) => c.visibility_score === 1).length,
  };

  const sections = t.raw("sections") as SectionItem[];

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <Section tone="navy" py="lg">
        <div className="font-mono text-xs tracking-widest text-amber uppercase mb-6">
          {t("heroEyebrow")}
        </div>
        <h1 className="text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] mb-6 max-w-3xl">
          {t("heroTitleStart")}<span className="text-amber">.</span>
        </h1>
        <p className="text-xl opacity-85 max-w-2xl leading-relaxed">
          {t("heroSubtitle", { total: stats.total })}
        </p>
        <div className="mt-10 flex gap-4 flex-wrap">
          <Button href="/contact" variant="primary" size="lg">{t("heroCtaPrimary")}</Button>
          <Button
            href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/jourdechance/audit-geo"}
            variant="outline-light"
            size="lg"
          >
            {t("heroCtaSecondary")}
          </Button>
        </div>
      </Section>

      <Section py="md">
        <p className="font-mono text-xs tracking-widest text-brand-500 uppercase mb-3">{t("methodEyebrow")}</p>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-8">{t("methodTitle")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label={t("methodStatLLM")} value="4" variant="highlight" />
          <Stat label={t("methodStatCompanies")} value={stats.total || "—"} />
          <Stat label={t("methodStatConsensus")} value={stats.cited_3 + stats.cited_4 || "—"} />
          <Stat label={t("methodStatLowCit")} value={stats.cited_1 || "—"} />
        </div>
        <p className="text-sm text-ink-muted mt-6 leading-relaxed max-w-2xl">{t("methodNote")}</p>
      </Section>

      <Section tone="cream" py="md">
        <p className="font-mono text-xs tracking-widest text-brand-500 uppercase mb-3">{t("topEyebrow")}</p>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-8">{t("topTitle")}</h2>
        <div className="space-y-3">
          {companies.slice(0, 5).map((c) => (
            <div key={c.rank} className="bg-white border border-DEFAULT rounded-lg p-5 grid grid-cols-[60px_1fr_120px] gap-4 items-center">
              <div className="font-mono text-2xl text-brand-500 font-medium text-center">
                {String(c.rank).padStart(2, "0")}
              </div>
              <div>
                <div className="text-lg font-medium text-ink">{c.name}</div>
                <div className="text-xs text-ink-muted font-mono mt-1">
                  {c.domain} · {c.country}
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full font-mono text-xs ${
                    c.visibility_score === 4 ? "bg-ink text-white" : c.visibility_score === 3 ? "bg-brand-600 text-white" : "bg-ink-muted text-white"
                  }`}
                >
                  {c.visibility_score}/4 LLM
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 border border-DEFAULT border-l-2 border-l-brand-500 bg-white rounded-lg shadow-card">
          <p className="text-ink leading-relaxed">{t("topCallout", { total: stats.total })}</p>
          <div className="mt-4">
            <Button href="/contact" variant="secondary" size="md">{t("topCalloutCta")}</Button>
          </div>
        </div>
      </Section>

      <Section py="md">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-8">{t("insideTitle")}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {sections.map((s) => (
            <div key={s.n} className="border-l-2 border-brand-500 pl-4">
              <div className="font-mono text-xs text-brand-500 mb-1">SECTION {s.n}</div>
              <div className="text-base font-medium text-ink mb-1">{s.t}</div>
              <div className="text-sm text-ink-muted">{s.d}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="navy" py="lg">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-4 max-w-2xl">
          {t("ctaFinalTitle")}<span className="text-amber">.</span>
        </h2>
        <p className="text-lg opacity-85 mb-8 max-w-2xl leading-relaxed">{t("ctaFinalSubtitle")}</p>
        <div className="flex gap-4 flex-wrap">
          <Button href="/contact" variant="primary" size="lg">{t("ctaFinalPrimary")}</Button>
          <Button
            href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/jourdechance/audit-geo"}
            variant="outline-light"
            size="lg"
          >
            {t("ctaFinalSecondary")}
          </Button>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
