// /sample — page publique avec aperçu du LB Asset Management.
// Indexée par Google (contrairement aux landings personnalisées).
// Capture les visiteurs qui n'ont pas reçu d'email mais sont intéressés.

import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getServiceClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Étude Asset Management 2026 — Aperçu — Geoperf",
  description: "Comment ChatGPT, Gemini, Claude et Perplexity classent les acteurs de l'asset management mondial en 2026. Aperçu de l'étude Geoperf.",
  alternates: { canonical: "https://geoperf.com/sample" },
  openGraph: {
    title: "Étude Geoperf — Asset Management 2026",
    description: "14 sociétés benchmarkées sur 4 LLM. Le top tier, les outsiders, les grands absents.",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
    type: "article",
  },
};

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

const LLM_PRETTY: Record<string, string> = {
  perplexity: "Perplexity",
  openai: "ChatGPT",
  google: "Gemini",
  anthropic: "Claude",
};

export default async function SamplePage() {
  const companies = await getSampleData();
  const stats = {
    total: companies.length,
    cited_4: companies.filter((c) => c.visibility_score === 4).length,
    cited_3: companies.filter((c) => c.visibility_score === 3).length,
    cited_2: companies.filter((c) => c.visibility_score === 2).length,
    cited_1: companies.filter((c) => c.visibility_score === 1).length,
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <Section tone="navy" py="lg">
        <div className="font-mono text-xs tracking-widest text-amber uppercase mb-6">
          Édition Asset Management · 2026
        </div>
        <h1 className="font-serif text-5xl leading-tight mb-6 max-w-3xl">
          Comment les LLM perçoivent l'industrie de la gestion d'actifs<span className="text-amber">.</span>
        </h1>
        <p className="text-xl opacity-85 max-w-2xl leading-relaxed font-serif">
          Geoperf a interrogé en parallèle ChatGPT, Gemini, Claude et Perplexity. Voici les {stats.total} sociétés
          qu'au moins un modèle cite spontanément, classées par niveau de consensus inter-LLM.
        </p>
        <div className="mt-10 flex gap-4 flex-wrap">
          <Button href="/contact" variant="primary" size="lg">
            Recevoir l'étude complète
          </Button>
          <Button
            href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/jourdechance/audit-geo"}
            variant="outline-light"
            size="lg"
          >
            Réserver un audit gratuit
          </Button>
        </div>
      </Section>

      {/* Stats */}
      <Section py="md">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">Méthodologie en chiffres</p>
        <h2 className="font-serif text-3xl text-navy mb-8">Une mesure simple, reproductible</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="LLM interrogés" value="4" variant="highlight" />
          <Stat label="Sociétés identifiées" value={stats.total || "—"} />
          <Stat label="Consensus 3-4 LLM" value={stats.cited_3 + stats.cited_4 || "—"} />
          <Stat label="Cités par 1 LLM" value={stats.cited_1 || "—"} />
        </div>
        <p className="text-sm text-ink-muted mt-6 leading-relaxed max-w-2xl">
          Le score de visibilité IA va de <strong>1</strong> (cité par un seul modèle, donc perception fragile) à <strong>4</strong> (cité par les
          quatre, donc consensus universel). Plus le score est élevé, plus la marque domine durablement la perception
          générative.
        </p>
      </Section>

      {/* Top 5 preview */}
      <Section tone="cream" py="md">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">Aperçu — Top 5</p>
        <h2 className="font-serif text-3xl text-navy mb-8">
          Le quatuor qui domine la perception IA
        </h2>
        <div className="space-y-3">
          {companies.slice(0, 5).map((c) => (
            <div key={c.rank} className="bg-white p-5 grid grid-cols-[60px_1fr_120px] gap-4 items-center">
              <div className="font-serif text-3xl text-navy font-medium text-center">
                {String(c.rank).padStart(2, "0")}
              </div>
              <div>
                <div className="font-serif text-xl text-navy">{c.name}</div>
                <div className="text-xs text-ink-muted font-mono mt-1">
                  {c.domain} · {c.country}
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 font-mono text-xs ${
                    c.visibility_score === 4 ? "bg-navy text-white" : c.visibility_score === 3 ? "bg-navy-light text-white" : "bg-ink-muted text-white"
                  }`}
                >
                  {c.visibility_score}/4 LLM
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 border-l-2 border-amber bg-white">
          <p className="text-ink leading-relaxed">
            <strong className="text-navy">L'étude complète</strong> couvre les {stats.total} sociétés identifiées,
            détaille les biais par modèle (Gemini sur-représente les sociétés US-listed), et propose 5 recommandations
            actionnables pour améliorer votre score IA.
          </p>
          <div className="mt-4">
            <Button href="/contact" variant="secondary" size="md">
              Recevoir le rapport complet (PDF, 12 pages)
            </Button>
          </div>
        </div>
      </Section>

      {/* What's inside */}
      <Section py="md">
        <h2 className="font-serif text-3xl text-navy mb-8">Ce que contient l'étude complète</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { n: "01", t: "Méthodologie inter-LLM", d: "Comment les 4 LLM ont été interrogés. Reproductible par n'importe quelle équipe data." },
            { n: "02", t: "Vue d'ensemble Asset Management 2026", d: "Dynamiques de marché, géographie, enjeux ESG et passifs/actifs." },
            { n: "03", t: "Pyramide de visibilité IA", d: "Décomposition des 14 sociétés par niveau de consensus. Graphiques, biais identifiés." },
            { n: "04", t: "Top 14 — analyses individuelles", d: "Pour chaque société : positionnement IA, sources citées, score, country." },
            { n: "05", t: "5 insights actionnables", d: "Recommandations concrètes pour CMO et Head of Brand." },
            { n: "06", t: "Glossaire & FAQ", d: "GEO, score IA, méthodologie, sources." },
          ].map((s) => (
            <div key={s.n} className="border-l-2 border-amber pl-4">
              <div className="font-mono text-xs text-amber mb-1">SECTION {s.n}</div>
              <div className="font-serif text-lg text-navy mb-1">{s.t}</div>
              <div className="text-sm text-ink-muted">{s.d}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Why personalized */}
      <Section tone="navy" py="lg">
        <h2 className="font-serif text-3xl mb-4 text-white max-w-2xl">
          Une étude par secteur. Une lecture par marque<span className="text-amber">.</span>
        </h2>
        <p className="text-lg opacity-85 mb-8 max-w-2xl leading-relaxed">
          Quand vous demandez l'étude, nous vous générons une lecture personnalisée pour votre marque : votre rang
          précis, vos forces, les LLM où vous êtes invisible, et 3 actions concrètes.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Button href="/contact" variant="primary" size="lg">Demander pour ma marque</Button>
          <Button
            href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/jourdechance/audit-geo"}
            variant="outline-light"
            size="lg"
          >
            30 min d'audit gratuit
          </Button>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
