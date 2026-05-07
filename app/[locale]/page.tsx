// Home — Geoperf. S28 i18n : sections principales + cards detail traduits via t.raw().
// PRICING_PREVIEW reste en const (les noms tier/items pricing ne sont pas marketing localisable —
// l'aspect comparatif rapide reste FR pour les 2 locales, c'est un choix design).

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

type FeatureCard = { label: string; title: string; body: string };
type StatCard = { figure: string; label: string; body: string };
type AudienceCard = { role: string; use: string };
type DiffCard = { title: string; body: string };

const PRICING_PREVIEW = [
  { name: "Free", price: 0, items: ["1 marque", "1 LLM", "30 prompts", "Mensuel"] },
  { name: "Starter", price: 79, items: ["1 marque", "4 LLMs", "50 prompts", "Hebdo"] },
  { name: "Growth", price: 199, items: ["1 marque", "200 prompts", "9 topics", "5 seats"], highlight: true },
  { name: "Pro", price: 399, items: ["3 marques", "6 LLMs", "200 prompts", "Topics ∞"] },
  { name: "Agency", price: 799, items: ["10 marques", "Tous LLMs", "300 prompts", "White-label"] },
];

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("homepage");
  const tHeader = await getTranslations("header");
  // t.raw() pour récupérer les arrays cards en bloc
  const features = t.raw("features") as FeatureCard[];
  const problemStats = t.raw("problemStats") as StatCard[];
  const audiences = t.raw("audiences") as AudienceCard[];
  const differentiators = t.raw("differentiators") as DiffCard[];

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header
        rightSlot={
          <div className="flex items-center gap-4 text-sm">
            <Link href="/saas" className="hover:underline text-navy">{tHeader("tarifs")}</Link>
            <Link href="/saas/faq" className="hover:underline text-navy hidden sm:inline">{tHeader("faq")}</Link>
            <Link href="/login" className="hover:underline text-navy">{tHeader("login")}</Link>
            <Link href="/contact" className="hover:underline text-navy hidden md:inline">{tHeader("contact")}</Link>
            <Link href="/signup" className="bg-amber text-navy px-4 py-2 text-sm font-medium hover:bg-amber/90 transition">
              {tHeader("signup")}
            </Link>
          </div>
        }
      />

      {/* HERO */}
      <section className="px-6 md:px-8 py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.4fr_1fr] gap-12 md:gap-16 items-center">
          <div>
            <Eyebrow variant="code" className="mb-5">{t("heroEyebrow")}</Eyebrow>
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] text-ink text-balance">
              {t("heroTitleStart")} <span className="text-brand-500">{t("heroTitleHighlight")}</span>.
            </h1>
            <p className="mt-6 text-lg text-ink-muted leading-relaxed max-w-xl">
              {t("heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/signup" size="lg">{t("heroCtaPrimary")}</Button>
              <Button href="/etude-sectorielle" variant="secondary" size="lg">{t("heroCtaSecondary")}</Button>
            </div>
            <p className="mt-4 text-xs font-mono text-ink-subtle">
              {t("heroFinePrint")}
            </p>
          </div>

          <Card variant="surface" className="p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-ink">{t("previewTitle")}</span>
              <span className="font-mono text-[11px] text-ink-subtle">{t("previewPeriod")}</span>
            </div>
            <div className="space-y-2.5">
              {[
                { name: "Amundi", v: 78 },
                { name: "BNP AM", v: 62 },
                { name: "AXA IM", v: 48 },
                { name: "CA AM", v: 34 },
              ].map((b, i) => (
                <div key={b.name} className="flex items-center gap-3">
                  <span className="text-xs text-ink-muted w-16 truncate">{b.name}</span>
                  <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${i < 3 ? "bg-brand-500" : "bg-brand-500/40"}`} style={{ width: `${b.v}%` }} />
                  </div>
                  <span className="font-mono text-xs text-ink tabular-nums w-8 text-right">{b.v}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 pt-3 border-t border-DEFAULT text-[11px] text-ink-subtle">
              {t("previewFootnote")}
            </p>
          </Card>
        </div>
      </section>

      {/* SECTION : LE PROBLEME (3 stats factuelles) */}
      <section className="px-6 md:px-8 py-20 md:py-28 bg-surface border-y border-DEFAULT">
        <div className="max-w-6xl mx-auto">
          <Eyebrow className="mb-3">{t("problemEyebrow")}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink max-w-3xl text-balance leading-tight">
            {t("problemTitle")}
          </h2>
          <p className="mt-4 text-base text-ink-muted max-w-2xl leading-relaxed">
            {t("problemSubtitle")}
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {problemStats.map((s) => (
              <Card key={s.label} variant="default" className="border-l-2 border-l-amber">
                <p className="font-serif text-4xl font-medium text-ink tracking-tight">{s.figure}</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-eyebrow text-brand-500">{s.label}</p>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">{s.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION : COMMENT CA MARCHE */}
      <section className="px-6 md:px-8 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <Eyebrow className="mb-3">{t("howItWorksEyebrow")}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink max-w-2xl text-balance">
            {t("howItWorksTitle")}
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {features.map((f) => (
              <Card key={f.label} variant="default">
                <span className="font-mono text-xs text-brand-500">{f.label}</span>
                <h3 className="mt-4 text-xl font-medium text-ink leading-tight">{f.title}</h3>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">{f.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION : POUR QUI */}
      <section className="px-6 md:px-8 py-20 md:py-28 bg-surface border-y border-DEFAULT">
        <div className="max-w-6xl mx-auto">
          <Eyebrow className="mb-3">{t("audienceEyebrow")}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink max-w-2xl text-balance leading-tight">
            {t("audienceTitle")}
          </h2>
          <p className="mt-4 text-base text-ink-muted max-w-2xl leading-relaxed">
            {t("audienceSubtitle")}
          </p>
          <div className="mt-12 grid md:grid-cols-2 gap-4">
            {audiences.map((a) => (
              <Card key={a.role} variant="default">
                <h3 className="text-lg font-medium text-ink leading-tight">{a.role}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{a.use}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION : POURQUOI GEOPERF */}
      <section className="px-6 md:px-8 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <Eyebrow className="mb-3">{t("diffEyebrow")}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink max-w-2xl text-balance leading-tight">
            {t("diffTitle")}
          </h2>
          <div className="mt-12 grid md:grid-cols-2 gap-4">
            {differentiators.map((d) => (
              <Card key={d.title} variant="default" className="border-l-2 border-l-brand-500">
                <h3 className="text-lg font-medium text-ink leading-tight">{d.title}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{d.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION : TARIFS */}
      <section className="px-6 md:px-8 py-20 md:py-28 bg-surface border-y border-DEFAULT">
        <div className="max-w-6xl mx-auto">
          <Eyebrow className="mb-3">{t("pricingEyebrow")}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink max-w-2xl text-balance mb-3">
            {t("pricingTitle")}
          </h2>
          <p className="text-base text-ink-muted max-w-xl mb-10">
            {t("pricingSubtitle")}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {PRICING_PREVIEW.map((p) => (
              <div key={p.name} className={`p-5 ${p.highlight ? "bg-navy text-white ring-2 ring-amber" : "bg-white border border-DEFAULT"}`}>
                <p className={`font-mono text-xs uppercase tracking-widest ${p.highlight ? "text-amber" : "text-ink-muted"} mb-2`}>{p.name}</p>
                <p className="font-serif text-3xl font-medium mb-3">
                  {p.price}<span className={`text-sm ml-1 ${p.highlight ? "opacity-70" : "text-ink-muted"}`}>€/mois</span>
                </p>
                <ul className={`text-xs space-y-1 ${p.highlight ? "" : "text-ink"}`}>
                  {p.items.map((i) => (
                    <li key={i} className="flex items-baseline gap-2">
                      <span className="text-amber">·</span>
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/saas" size="md">{t("pricingCtaDetail")}</Button>
            <Button href="/saas/faq" variant="secondary" size="md">{t("pricingCtaFaq")}</Button>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 md:px-8 py-20 md:py-28 bg-navy text-white">
        <div className="max-w-3xl mx-auto">
          <Eyebrow className="mb-3" variant="code">{t("ctaFinalEyebrow")}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white text-balance mb-4">
            {t("ctaFinalTitle")}
          </h2>
          <p className="text-base text-white/85 leading-relaxed max-w-xl mb-8">
            {t("ctaFinalSubtitle")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="bg-amber text-navy px-6 py-3 text-base font-medium hover:bg-amber/90 transition">
              {t("ctaFinalPrimary")}
            </Link>
            <Link href="/etude-sectorielle" className="border border-white/40 text-white px-6 py-3 text-base font-medium hover:bg-white/10 transition">
              {t("ctaFinalSecondary")}
            </Link>
            <Link href="/contact" className="text-white/85 px-6 py-3 text-base font-medium hover:text-white transition underline-offset-4 hover:underline">
              {t("ctaFinalTertiary")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
