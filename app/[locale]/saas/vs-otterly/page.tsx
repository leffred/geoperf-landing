// S32 Ticket 6 — Page comparaison Geoperf vs Otterly.
// Cloné du pattern vs-getmint (S29). Cible : visiteurs Google Ads Group A
// (recherche "otterly alternative", "otterly concurrent", etc.).
// Structure : Hero · 3 reasons · Table 15 critères · When-Otterly · CTA dual.
// Translations FR + EN dans messages/{fr,en}.json sous "vsOtterly".

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
  const t = await getTranslations({ locale, namespace: "vsOtterly" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === "fr" ? "https://geoperf.com/saas/vs-otterly" : `https://geoperf.com/${locale}/saas/vs-otterly`,
      languages: {
        fr: "https://geoperf.com/saas/vs-otterly",
        en: "https://geoperf.com/en/saas/vs-otterly",
        "x-default": "https://geoperf.com/saas/vs-otterly",
      },
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: locale === "fr" ? "https://geoperf.com/saas/vs-otterly" : `https://geoperf.com/${locale}/saas/vs-otterly`,
      type: "article",
    },
  };
}

type Cell = {
  feature: string;
  otterly: string;
  geoperf: string;
  edge?: "geoperf" | "otterly" | "tie";
};

// ⚠️ Données Otterly à compléter par Fred. Les placeholders [À COMPLÉTER] indiquent
// les data qu'il faut vérifier sur la page tarifs publique d'Otterly + leur docs.
// Pour Geoperf : valeurs réelles connues. Pour edge : best-effort sur les data connues,
// "tie" par défaut si data incertaine.
const FEATURES: Cell[] = [
  { feature: "Prix de base mensuel", otterly: "[À COMPLÉTER — vérifier otterly.ai/pricing]", geoperf: "79€ HT/mois (Starter)", edge: "tie" },
  { feature: "Prix de base annuel", otterly: "[À COMPLÉTER]", geoperf: "59€ HT/mois (−25%, 3 mois offerts)", edge: "geoperf" },
  { feature: "Plan le plus cher", otterly: "[À COMPLÉTER]", geoperf: "799€ HT/mois Agency (599€ HT en annuel)", edge: "tie" },
  { feature: "Marché cible", otterly: "[À COMPLÉTER — sans doute US/UK]", geoperf: "France + Europe francophone", edge: "tie" },
  { feature: "Langues prompts", otterly: "[À COMPLÉTER — EN principal probable]", geoperf: "FR principal (EN à venir)", edge: "tie" },
  { feature: "LLMs supportés", otterly: "[À COMPLÉTER — typiquement 4-6 LLMs]", geoperf: "4 (ChatGPT, Claude, Gemini, Perplexity) + 2 (Mistral, Grok) en Pro+", edge: "tie" },
  { feature: "Études sectorielles gratuites", otterly: "[À COMPLÉTER — probablement non]", geoperf: "✅ (lead-magnet trimestriel, 30 marques/secteur)", edge: "geoperf" },
  { feature: "Audit GEO consulting", otterly: "[À COMPLÉTER — non a priori]", geoperf: "✅ (offre 500€ à la mission)", edge: "geoperf" },
  { feature: "Funnel étude→audit→SaaS", otterly: "[À COMPLÉTER]", geoperf: "✅ (parcours complet Jourdechance)", edge: "geoperf" },
  { feature: "Sentiment analysis", otterly: "[À COMPLÉTER — généralement ✅]", geoperf: "✅", edge: "tie" },
  { feature: "Recommendations IA (Haiku/Sonnet)", otterly: "[À COMPLÉTER]", geoperf: "✅ (auto-générées chaque snapshot)", edge: "tie" },
  { feature: "API publique REST", otterly: "[À COMPLÉTER]", geoperf: "✅ (plan Agency, 599€ HT en annuel)", edge: "tie" },
  { feature: "Webhooks Slack/Teams", otterly: "[À COMPLÉTER]", geoperf: "✅ (Slack Growth+, Teams Pro+)", edge: "tie" },
  { feature: "Plan Free permanent", otterly: "[À COMPLÉTER — trial 14j probable]", geoperf: "✅ (1 marque, 1 LLM, snapshot mensuel)", edge: "geoperf" },
  { feature: "Hébergement données", otterly: "[À COMPLÉTER — US a priori]", geoperf: "UE (Frankfurt, Supabase)", edge: "geoperf" },
  { feature: "Conformité RGPD native", otterly: "[À COMPLÉTER — DPA sur demande probable]", geoperf: "✅ DPA standard, données EU only", edge: "geoperf" },
  { feature: "Support en français", otterly: "[À COMPLÉTER — non a priori]", geoperf: "✅", edge: "geoperf" },
  { feature: "Essai gratuit", otterly: "[À COMPLÉTER — trial typique]", geoperf: "✅ (plan Free permanent, pas de CB)", edge: "geoperf" },
];

type Reason = { title: string; body: string };
type FaqItem = { q: string; a: string };

type Props = { params: Promise<{ locale: string }> };

export default async function VsOtterlyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("vsOtterly");
  const tHeader = await getTranslations("header");

  const reasons = t.raw("reasons") as Reason[];
  const whenOtterlyReasons = t.raw("whenOtterlyReasons") as string[];
  const faqs = t.raw("faqs") as FaqItem[];

  function EdgeBadge({ edge }: { edge?: "geoperf" | "otterly" | "tie" }) {
    if (edge === "geoperf") {
      return (
        <span className="font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 rounded-md bg-brand-50 text-brand-600">
          {t("edgeGeoperf")}
        </span>
      );
    }
    if (edge === "otterly") {
      return (
        <span className="font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 rounded-md bg-surface text-ink-muted">
          {t("edgeOtterly")}
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
    gp: FEATURES.filter((f) => f.edge === "geoperf").length,
    tie: FEATURES.filter((f) => f.edge === "tie").length,
    ot: FEATURES.filter((f) => f.edge === "otterly").length,
  };
  const dateStr = new Date().toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header
        logo="monitoring"
        rightSlot={
          <div className="flex items-center gap-4">
            <Link href="/saas/faq" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">
              {tHeader("faq")}
            </Link>
            <Link href="/login" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">
              {tHeader("login")}
            </Link>
            <Button href="/signup" variant="primary" size="sm">
              {tHeader("signup")}
            </Button>
          </div>
        }
      />

      <Section py="lg" tone="white">
        <div className="max-w-4xl">
          <Eyebrow className="mb-3">{t("heroEyebrow")}</Eyebrow>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.05] text-ink text-balance mb-6">
            {t("heroTitleStart")} <span className="text-ink-subtle">{t("heroTitleVs")}</span>{" "}
            <span className="text-brand-500">Otterly</span> {t("heroTitleSuffix")}
          </h1>
          <p
            className="text-lg text-ink-muted leading-relaxed max-w-2xl"
            dangerouslySetInnerHTML={{ __html: t("heroSubtitle") }}
          />
          <p className="mt-4 text-sm text-ink-subtle font-mono">{t("heroDisclaimer")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/obtenir-mon-etude" variant="primary" size="lg">
              {t("heroCtaPrimary")}
            </Button>
            <Button href="#table" variant="secondary" size="lg">
              {t("heroCtaSecondary")}
            </Button>
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
              <span className="font-mono text-xs text-brand-500 tracking-eyebrow uppercase">
                {String(i + 1).padStart(2, "0")}
              </span>
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
          <a href="mailto:hello@geoperf.com" className="text-brand-500 hover:underline">
            hello@geoperf.com
          </a>
          .
        </p>

        <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
              <tr>
                <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">{t("thFeature")}</th>
                <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">{t("thOtterly")}</th>
                <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">{t("thGeoperf")}</th>
                <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">{t("thEdge")}</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, i) => (
                <tr key={i} className="border-b border-DEFAULT last:border-b-0 hover:bg-surface transition-colors">
                  <td className="py-3 px-4 text-ink font-medium">{f.feature}</td>
                  <td className="py-3 px-4 text-ink-muted">{f.otterly}</td>
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
          {t("tableScore", { gp: score.gp, tie: score.tie, ot: score.ot })}
        </p>
      </Section>

      <Section py="lg" tone="surface">
        <div className="max-w-3xl">
          <Eyebrow className="mb-3">{t("whenOtterlyEyebrow")}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-6 leading-tight">
            {t("whenOtterlyTitle")}
          </h2>
          <ul className="space-y-3">
            {whenOtterlyReasons.map((r, i) => (
              <li key={i} className="flex items-start gap-3 bg-white rounded-lg border border-DEFAULT p-4 shadow-card">
                <span className="font-mono text-xs text-ink-subtle tabular-nums shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-ink leading-relaxed">{r}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-muted leading-relaxed">{t("whenOtterlyFooter")}</p>
        </div>
      </Section>

      <Section py="lg" tone="white">
        <div className="max-w-3xl">
          <Eyebrow className="mb-3">{t("faqEyebrow")}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-8 leading-tight">
            {t("faqTitle")}
          </h2>
          <div className="space-y-3">
            {faqs.map((item, i) => (
              <details key={i} className="bg-surface rounded-lg border border-DEFAULT p-5 group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-3 text-ink font-medium text-base">
                  <span>{item.q}</span>
                  <span className="text-ink-subtle group-open:rotate-45 transition-transform" style={{ fontSize: 18 }}>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      <Section py="lg" tone="dark">
        <div className="max-w-2xl">
          <Eyebrow variant="muted" className="mb-3 text-amber">
            {t("ctaFinalEyebrow")}
          </Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-4 leading-tight">
            {t("ctaFinalTitle")}
          </h2>
          <p className="text-base text-white/85 mb-6 leading-relaxed">{t("ctaFinalSubtitle")}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/obtenir-mon-etude" variant="primary" size="lg">
              {t("ctaFinalPrimary")}
            </Button>
            <Button href="/signup" variant="outline-light" size="lg">
              {t("ctaFinalSecondary")}
            </Button>
            <Button href="/saas" variant="outline-light" size="lg">
              {t("ctaFinalTertiary")}
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
