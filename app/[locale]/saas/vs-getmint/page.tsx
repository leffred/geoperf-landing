// /saas/vs-getmint — comparaison Geoperf vs GetMint. S28 i18n :
// Hero/sections/reasons/whenGetmint traduits via t.raw().
// FEATURES table reste en const FR partagé (noms de features techniques + valeurs $/€).

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vsGetmint" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === "fr" ? "https://geoperf.com/saas/vs-getmint" : `https://geoperf.com/${locale}/saas/vs-getmint`,
      languages: {
        fr: "https://geoperf.com/saas/vs-getmint",
        en: "https://geoperf.com/en/saas/vs-getmint",
        "x-default": "https://geoperf.com/saas/vs-getmint",
      },
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: locale === "fr" ? "https://geoperf.com/saas/vs-getmint" : `https://geoperf.com/${locale}/saas/vs-getmint`,
      type: "article",
    },
  };
}

type Cell = {
  feature: string;
  getmint: string;
  geoperf: string;
  edge?: "geoperf" | "getmint" | "tie";
};

const FEATURES: Cell[] = [
  { feature: "Prix de base mensuel", getmint: "$99/mois", geoperf: "79€ HT/mois", edge: "geoperf" },
  { feature: "Prix de base annuel (équiv. mensuel)", getmint: "$79/mois (-20%)", geoperf: "59€ HT/mois (-25%, ~50% moins cher)", edge: "geoperf" },
  { feature: "Plan le plus cher", getmint: "$499+/mois (Enterprise)", geoperf: "799€ HT/mois (Agency, 599€ HT en annuel)", edge: "geoperf" },
  { feature: "Marché cible", getmint: "US/UK enterprise", geoperf: "France + Europe francophone", edge: "tie" },
  { feature: "Langues prompts", getmint: "EN principal", geoperf: "FR principal (EN à venir)", edge: "tie" },
  { feature: "LLMs supportés", getmint: "9 (incl. AI Overviews, Copilot, Meta AI)", geoperf: "7 (AI Overviews/Copilot à venir S14)", edge: "getmint" },
  { feature: "Topics par marque", getmint: "1-9 selon plan", geoperf: "1-∞ selon plan", edge: "geoperf" },
  { feature: "Sentiment analysis", getmint: "✅", geoperf: "✅", edge: "tie" },
  { feature: "Brand Alignment", getmint: "✅", geoperf: "✅", edge: "tie" },
  { feature: "Content Studio", getmint: "✅", geoperf: "✅ (10 drafts/mois Pro, ∞ Agency)", edge: "tie" },
  { feature: "Citations Flow Sankey", getmint: "✅", geoperf: "✅", edge: "tie" },
  { feature: "Multi-seats", getmint: "2-∞ selon plan", geoperf: "1-∞ selon plan", edge: "tie" },
  { feature: "API publique REST", getmint: "Enterprise only ($499+)", geoperf: "Agency (599€ HT en annuel)", edge: "geoperf" },
  { feature: "Webhooks Slack/Teams", getmint: "✅", geoperf: "✅ (Slack Growth+, Teams Pro+)", edge: "tie" },
  { feature: "Publisher Network", getmint: "✅ (150k+ médias indexés)", geoperf: "❌ (à investiguer via aggrégateur)", edge: "getmint" },
  { feature: "Études sectorielles gratuites", getmint: "❌", geoperf: "✅ (lead-magnet trimestriel)", edge: "geoperf" },
  { feature: "Audit GEO consulting", getmint: "❌", geoperf: "✅ (offre 500€ à la mission)", edge: "geoperf" },
  { feature: "Support FR", getmint: "❌", geoperf: "✅", edge: "geoperf" },
  { feature: "Hébergement données", getmint: "US (AWS us-east-1 a priori)", geoperf: "UE (Frankfurt, Supabase)", edge: "geoperf" },
  { feature: "Conformité RGPD native", getmint: "DPA sur demande", geoperf: "✅ DPA standard, données EU only", edge: "geoperf" },
  { feature: "Plan Free permanent", getmint: "❌ (trial 14j seulement)", geoperf: "✅ (1 marque, 1 LLM, monthly)", edge: "geoperf" },
];

type Reason = { title: string; body: string };

type Props = { params: Promise<{ locale: string }> };

export default async function VsGetMintPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("vsGetmint");
  const tHeader = await getTranslations("header");

  const reasons = t.raw("reasons") as Reason[];
  const whenGetmintReasons = t.raw("whenGetmintReasons") as string[];

  function EdgeBadge({ edge }: { edge?: "geoperf" | "getmint" | "tie" }) {
    if (edge === "geoperf") {
      return (
        <span className="font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 rounded-md bg-brand-50 text-brand-600">
          {t("edgeGeoperf")}
        </span>
      );
    }
    if (edge === "getmint") {
      return (
        <span className="font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 rounded-md bg-surface text-ink-muted">
          {t("edgeGetmint")}
        </span>
      );
    }
    return (
      <span className="font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 rounded-md bg-surface-2 text-ink-subtle">
        {t("edgeTie")}
      </span>
    );
  }

  const score = {
    gp: FEATURES.filter(f => f.edge === "geoperf").length,
    tie: FEATURES.filter(f => f.edge === "tie").length,
    gm: FEATURES.filter(f => f.edge === "getmint").length,
  };
  const dateStr = new Date().toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", { month: "long", year: "numeric" });

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header
        logo="monitoring"
        rightSlot={
          <div className="flex items-center gap-4">
            <Link href="/saas/faq" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">{tHeader("faq")}</Link>
            <Link href="/login" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">{tHeader("login")}</Link>
            <Button href="/signup" variant="primary" size="sm">{tHeader("signup")}</Button>
          </div>
        }
      />

      <Section py="lg" tone="white">
        <div className="max-w-4xl">
          <Eyebrow className="mb-3">{t("heroEyebrow")}</Eyebrow>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.05] text-ink text-balance mb-6">
            {t("heroTitleStart")} <span className="text-ink-subtle">{t("heroTitleVs")}</span>{" "}
            <span className="text-brand-500">GetMint</span>{" "}{t("heroTitleSuffix")}
          </h1>
          <p
            className="text-lg text-ink-muted leading-relaxed max-w-2xl"
            dangerouslySetInnerHTML={{ __html: t("heroSubtitle") }}
          />
          <p className="mt-4 text-sm text-ink-subtle font-mono">{t("heroDisclaimer")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/signup" variant="primary" size="lg">{t("heroCtaPrimary")}</Button>
            <Button href="#table" variant="secondary" size="lg">{t("heroCtaSecondary")}</Button>
          </div>
        </div>
      </Section>

      <Section py="lg" tone="surface">
        <Eyebrow className="mb-3">{t("reasonsEyebrow")}</Eyebrow>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-10 max-w-2xl text-balance leading-tight">
          {t("reasonsTitle")}
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {reasons.map((r, i) => (
            <Card key={r.title} variant="default">
              <span className="font-mono text-xs text-brand-500 tracking-eyebrow uppercase">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-xl font-medium text-ink leading-tight tracking-tightish">{r.title}</h3>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">{r.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section py="lg" tone="white" className="scroll-mt-20">
        <a id="table" />
        <Eyebrow className="mb-3">{t("tableEyebrow")}</Eyebrow>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3 leading-tight max-w-2xl">
          {t("tableTitle")}
        </h2>
        <p className="text-sm text-ink-muted mb-8 max-w-2xl leading-relaxed">
          {t("tableSourcesBefore", { date: dateStr })}{" "}
          <a href="mailto:hello@geoperf.com" className="text-brand-500 hover:underline">hello@geoperf.com</a>.
        </p>

        <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
              <tr>
                <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">{t("thFeature")}</th>
                <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">{t("thGetmint")}</th>
                <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">{t("thGeoperf")}</th>
                <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">{t("thEdge")}</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, i) => (
                <tr key={i} className="border-b border-DEFAULT last:border-b-0 hover:bg-surface transition-colors">
                  <td className="py-3 px-4 text-ink font-medium">{f.feature}</td>
                  <td className="py-3 px-4 text-ink-muted">{f.getmint}</td>
                  <td className={`py-3 px-4 ${f.edge === "geoperf" ? "text-ink font-medium" : "text-ink-muted"}`}>
                    {f.geoperf}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <EdgeBadge edge={f.edge} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-ink-subtle font-mono">
          {t("tableScore", { gp: score.gp, tie: score.tie, gm: score.gm })}
        </p>
      </Section>

      <Section py="lg" tone="surface">
        <div className="max-w-3xl">
          <Eyebrow className="mb-3">{t("whenGetmintEyebrow")}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-6 leading-tight">
            {t("whenGetmintTitle")}
          </h2>
          <ul className="space-y-3">
            {whenGetmintReasons.map((r, i) => (
              <li key={i} className="flex items-start gap-3 bg-white rounded-lg border border-DEFAULT p-4 shadow-card">
                <span className="font-mono text-xs text-ink-subtle tabular-nums shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm text-ink leading-relaxed">{r}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-muted leading-relaxed">
            {t("whenGetmintFooter")}
          </p>
        </div>
      </Section>

      <Section py="lg" tone="dark">
        <div className="max-w-2xl">
          <Eyebrow variant="muted" className="mb-3 text-amber">{t("ctaFinalEyebrow")}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-4 leading-tight">
            {t("ctaFinalTitle")}
          </h2>
          <p className="text-base text-white/85 mb-6 leading-relaxed">{t("ctaFinalSubtitle")}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/signup" variant="primary" size="lg">{t("ctaFinalPrimary")}</Button>
            <Button href="/contact" variant="outline-light" size="lg">{t("ctaFinalSecondary")}</Button>
            <Button href="/saas" variant="outline-light" size="lg">{t("ctaFinalTertiary")}</Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
