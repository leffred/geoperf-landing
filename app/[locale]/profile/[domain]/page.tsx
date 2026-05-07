import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { getServiceClient } from "@/lib/supabase";

type Props = { params: Promise<{ domain: string }> };

const LLM_LABELS: Record<string, { label: string; provider: string }> = {
  openai: { label: "ChatGPT", provider: "OpenAI" },
  google: { label: "Gemini", provider: "Google" },
  anthropic: { label: "Claude", provider: "Anthropic" },
  perplexity: { label: "Perplexity", provider: "Perplexity" },
};

async function loadProfile(rawDomain: string) {
  const domain = decodeURIComponent(rawDomain).toLowerCase().replace(/^www\./, "");
  const sb = getServiceClient();
  const { data: company } = await sb.from("companies").select("*").eq("domain", domain).maybeSingle();
  if (!company) return null;
  const { data: rcRows } = await sb
    .from("report_companies")
    .select("id, rank, cited_by, visibility_score, market_rank_estimate, ai_saturation_gap, report_id, reports(id, sous_categorie, created_at, status, slug_public)")
    .eq("company_id", company.id);
  const filtered = (rcRows || []).filter((r: any) => r.reports?.status === "ready");
  filtered.sort((a: any, b: any) => new Date(b.reports.created_at).getTime() - new Date(a.reports.created_at).getTime());
  const latest = filtered[0] || null;
  const others = filtered.slice(1, 6);

  // Competitors: top 5 other companies in the same latest report (for SEO cross-linking)
  let competitors: any[] = [];
  if (latest?.report_id) {
    const { data: competitorRows } = await sb
      .from("report_companies")
      .select("rank, visibility_score, ai_saturation_gap, companies(nom, domain, country)")
      .eq("report_id", latest.report_id)
      .neq("company_id", company.id)
      .order("rank", { ascending: true })
      .limit(8);
    competitors = (competitorRows || []).filter((c: any) => c.companies?.domain).slice(0, 5);
  }

  return { company, latest, others, competitors };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain: raw } = await params;
  const data = await loadProfile(raw);
  if (!data) return { title: "Profil introuvable — Geoperf", robots: { index: false } };
  const c = data.company as any;
  const latest: any = data.latest;
  const score = latest?.visibility_score ?? 0;
  const cat = latest?.reports?.sous_categorie || "B2B";
  const rank = latest?.rank ?? null;
  // S17 §4.4 : OG image dynamique avec score visibility (type=profile).
  const ogUrl = `/api/og?type=profile&title=${encodeURIComponent(c.nom)}&score=${encodeURIComponent(String(score))}`;
  return {
    title: `${c.nom} — Visibilité LLM ${score}/4 | Geoperf`,
    description: `Comment ${c.nom} apparaît dans ChatGPT, Claude, Gemini et Perplexity. ${rank ? `Rang ${rank} dans la catégorie ${cat}. ` : ""}Étude indépendante Jourdechance.`,
    robots: { index: true, follow: true },
    alternates: { canonical: `/profile/${c.domain}` },
    openGraph: {
      title: `${c.nom} dans les LLMs — score ${score}/4`,
      description: `Score visibility, citation rate, saturation IA pour ${c.nom}.`,
      type: "article",
      images: [{ url: ogUrl, width: 1200, height: 630, alt: `${c.nom} — score visibility ${score}/4` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${c.nom} dans les LLMs`,
      description: `Score ${score}/4 — analyse Geoperf.`,
      images: [ogUrl],
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { domain: raw } = await params;
  const data = await loadProfile(raw);
  if (!data) notFound();

  const c = data.company as any;
  const latest = data.latest as any;
  const cited = latest?.cited_by || {};
  const score = latest?.visibility_score ?? 0;
  const reportDate = latest?.reports?.created_at ? new Date(latest.reports.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : null;
  const gap = latest?.ai_saturation_gap !== null && latest?.ai_saturation_gap !== undefined ? Number(latest.ai_saturation_gap) : null;

  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": `${c.nom} dans les LLM IA — Étude ${latest?.reports?.sous_categorie || "B2B"}`,
          "datePublished": latest?.reports?.created_at,
          "author": { "@type": "Organization", "name": "Geoperf", "url": "https://geoperf.com" },
          "publisher": { "@type": "Organization", "name": "Geoperf", "logo": { "@type": "ImageObject", "url": "https://geoperf.com/favicon.svg" } },
          "about": { "@type": "Organization", "name": c.nom, "url": `https://${c.domain}`, "address": c.country },
          "description": `Score visibilité IA ${score}/4 pour ${c.nom}. Comment ChatGPT, Gemini, Claude et Perplexity citent ${c.nom} sur le secteur ${latest?.reports?.sous_categorie || "B2B"}.`
        }) }}
      />

      <Section py="md" tone="white">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">PROFIL · {c.country || "—"}</p>
        <h1 className="font-serif text-4xl md:text-5xl text-navy mb-3">{c.nom}</h1>
        <p className="text-sm text-ink-muted">{c.domain}{latest?.reports?.sous_categorie ? ` · ${latest.reports.sous_categorie}` : ""}{reportDate ? ` · Étude ${reportDate}` : ""}</p>
        {c.description && <p className="mt-4 text-base text-ink max-w-2xl">{c.description}</p>}
      </Section>

      {latest && (
        <Section py="md" tone="cream">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">SCORE 02</p>
          <h2 className="font-serif text-2xl text-navy mb-6">Visibilité dans les IA génératives</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-navy text-white p-6">
              <div className="font-serif text-5xl font-medium">{score}<span className="text-2xl opacity-60">/4</span></div>
              <div className="text-xs opacity-80 mt-2 font-mono uppercase tracking-widest">LLM citant la marque</div>
            </div>
            <div className="bg-white p-6 border-l-2 border-amber">
              <div className="font-serif text-3xl text-navy">#{latest.rank}</div>
              <div className="text-xs text-ink-muted mt-2">Rang dans l'étude {latest.reports?.sous_categorie}</div>
            </div>
            <div className="bg-white p-6 border-l-2 border-amber">
              <div className="font-serif text-3xl text-navy">{latest.market_rank_estimate ? `#${latest.market_rank_estimate}` : "—"}</div>
              <div className="text-xs text-ink-muted mt-2">Rang marché estimé</div>
              {gap !== null && (
                <div className={`text-xs mt-1 font-mono ${gap < 0 ? "text-red-700" : gap > 0 ? "text-green-700" : "text-ink-muted"}`}>
                  Gap IA : {gap > 0 ? "+" : ""}{gap.toFixed(1)}%
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(LLM_LABELS).map(([key, meta]) => {
              const isCited = cited[key] === true;
              return (
                <div key={key} className={`p-4 ${isCited ? "bg-amber" : "bg-white border border-navy/10"}`}>
                  <div className={`font-serif text-lg ${isCited ? "text-navy" : "text-navy/40"}`}>{meta.label}</div>
                  <div className={`text-xs font-mono uppercase tracking-widest mt-1 ${isCited ? "text-navy" : "text-ink-muted"}`}>{meta.provider}</div>
                  <div className={`text-xs mt-3 ${isCited ? "text-navy font-medium" : "text-ink-muted"}`}>
                    {isCited ? "✓ Cite la marque" : "× Ne cite pas"}
                  </div>
                </div>
              );
            })}
          </div>

          {gap !== null && gap < -10 && (
            <div className="mt-6 bg-white p-5 border-l-2 border-amber">
              <p className="text-sm text-ink leading-relaxed">
                <strong className="text-navy">Diagnostic.</strong>{" "}
                {c.nom} occupe le rang <strong>#{latest.market_rank_estimate}</strong> sur son marché mais seulement{" "}
                <strong>#{latest.rank}</strong> dans l'agrégat des LLM — sous-représentation de{" "}
                <strong>{Math.abs(gap).toFixed(1)} %</strong>. Une opportunité GEO claire : pousser des contenus citables (études, comparatifs, glossaires) que les modèles d'IA pourront référencer dans leurs réponses.
              </p>
            </div>
          )}
        </Section>
      )}

      {!latest && (
        <Section py="md" tone="cream">
          <p className="text-ink-muted">Pas encore d'étude publiée pour cette société. Reviens après notre prochain trimestriel.</p>
        </Section>
      )}

      {data.competitors.length > 0 && (
        <Section py="md" tone="white">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">CONCURRENTS 03</p>
          <h2 className="font-serif text-2xl text-navy mb-4">Autres acteurs dans cette étude</h2>
          <p className="text-sm text-ink-muted mb-6">Top {data.competitors.length} autres sociétés benchmarkées dans le rapport {latest?.reports?.sous_categorie}.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.competitors.map((c: any) => {
              const cgap = c.ai_saturation_gap !== null && c.ai_saturation_gap !== undefined ? Number(c.ai_saturation_gap) : null;
              return (
                <a key={c.companies.domain} href={`/profile/${c.companies.domain}`} className="block bg-cream hover:bg-white border border-navy/10 hover:border-navy/30 p-4 transition">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-serif text-lg text-navy">{c.companies.nom}</h3>
                    <span className="font-mono text-xs text-ink-muted">#{c.rank}</span>
                  </div>
                  <div className="font-mono text-xs text-navy-light mb-2">{c.companies.domain}</div>
                  <div className="text-xs text-ink-muted">Score IA {c.visibility_score ?? 0}/4{cgap !== null ? ` · gap ${cgap > 0 ? "+" : ""}${cgap.toFixed(1)}%` : ""}</div>
                </a>
              );
            })}
          </div>
        </Section>
      )}

      {data.others.length > 0 && (
        <Section py="md" tone="cream">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">HISTORIQUE 04</p>
          <h2 className="font-serif text-2xl text-navy mb-4">Études précédentes</h2>
          <ul className="space-y-2">
            {data.others.map((r: any) => (
              <li key={r.id} className="flex items-baseline justify-between py-2 border-b border-navy/10 text-sm">
                <span className="text-ink">{r.reports?.sous_categorie} <span className="text-ink-muted">— {new Date(r.reports?.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</span></span>
                <span className="font-mono text-xs text-navy">Rang #{r.rank} · Score {r.visibility_score}/4</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section py="md" tone="navy">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-widest text-amber uppercase mb-3">CTA 05</p>
          <h2 className="font-serif text-3xl text-white mb-4">Tu travailles chez {c.nom} ?</h2>
          <p className="text-white/80 mb-6">Reçois ton audit GEO personnalisé : reco précises pour pousser ton score IA, benchmark vs concurrents directs, et roadmap éditoriale 90 jours.</p>
          <a href={`/contact?company=${encodeURIComponent(c.nom)}`} className="inline-block bg-amber text-navy px-6 py-3 text-sm font-medium hover:bg-amber/90 transition">
            Demander un audit
          </a>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
