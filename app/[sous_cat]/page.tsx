// Landing personnalisée par sous-catégorie + token prospect.
// Route exemple : /asset-management?t=ab12cd34ef56...

import { resolveToken, logEvent } from "@/lib/tracking";
import { notFound } from "next/navigation";
import { DownloadButton } from "./DownloadButton";

type Props = {
  params: Promise<{ sous_cat: string }>;
  searchParams: Promise<{ t?: string }>;
};

export default async function LandingPage({ params, searchParams }: Props) {
  const { sous_cat } = await params;
  const { t: token } = await searchParams;

  const ctx = token ? await resolveToken(token) : null;

  // No token or invalid → render generic landing for the category
  if (!ctx) {
    return (
      <main className="min-h-screen px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-4">
            LLM Visibility Research · {sous_cat.replace(/-/g, " ")}
          </p>
          <h1 className="font-serif text-4xl text-navy mb-6">
            Étude {sous_cat.replace(/-/g, " ")} 2026
          </h1>
          <p className="text-ink-muted mb-8">
            Cette page est personnalisée pour les destinataires de notre campagne. Si vous souhaitez
            recevoir l'étude, écrivez-nous à contact@geoperf.com.
          </p>
        </div>
      </main>
    );
  }

  // Sanity check sous_cat matches report's sous_categorie
  const expectedSlug = ctx.sous_categorie.toLowerCase().replace(/\s+/g, "-");
  if (sous_cat !== expectedSlug && sous_cat !== "asset-management") {
    notFound();
  }

  // Log landing visit (server-side, fire and forget)
  logEvent({
    prospect_id: ctx.prospect_id,
    event_type: "landing_visited",
    metadata: { token_used: token, path: sous_cat },
  }).catch(() => {});

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 border-b border-navy/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="font-serif text-2xl text-navy">Ge<span className="text-amber">·</span>perf</div>
          <div className="text-sm text-ink-muted font-mono">{ctx.report_id.substring(0,8).toUpperCase()}</div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-8 py-16 bg-navy text-white">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs tracking-widest text-amber uppercase mb-6">
            Édition réservée — {ctx.full_name || ctx.first_name}
          </p>
          <h1 className="font-serif text-5xl leading-tight mb-6">
            {ctx.first_name && (<>Bonjour {ctx.first_name},<br/></>)}
            voici l'étude qui couvre {ctx.company_name || ctx.sous_categorie}<span className="text-amber">.</span>
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mb-10 leading-relaxed font-serif">
            {ctx.company_name} apparaît en position <strong>#{ctx.ranking_position}</strong>, avec un score
            de visibilité IA de <strong>{ctx.visibility_score}/4</strong>.
          </p>
          <div className="flex gap-4 flex-wrap">
            <DownloadButton
              prospectId={ctx.prospect_id}
              pdfUrl={ctx.pdf_url}
              htmlUrl={ctx.html_url}
            />
            <a
              href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/jourdechance/audit-geo"}
              target="_blank"
              rel="noopener"
              className="inline-block border border-white/40 hover:bg-white/10 px-8 py-4 font-medium transition"
            >
              Réserver 30 min d'audit gratuit
            </a>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">Ce que contient l'étude</p>
          <h2 className="font-serif text-3xl text-navy mb-8">12 pages, 4 LLM, 11 sociétés benchmarkées</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { n: "01", t: "Méthodologie", d: "4 LLM via OpenRouter, dédoublonnage, scoring 0-4." },
              { n: "02", t: "Vue d'ensemble du secteur", d: "Dynamiques, géographie, enjeux 2026." },
              { n: "03", t: "Analyse de visibilité IA", d: "Pyramide visibilité, biais, conséquences CMO." },
              { n: "04", t: "Top 11 sociétés", d: "Description, positionnement IA, sources citées." },
              { n: "05", t: "Insights & recommandations", d: "5 actions concrètes pour améliorer votre score." },
              { n: "06", t: "Glossaire & FAQ", d: "GEO, score IA, méthodologie." },
            ].map((s) => (
              <div key={s.n} className="border-l-2 border-amber pl-4">
                <div className="font-mono text-xs text-amber mb-1">SECTION {s.n}</div>
                <div className="font-serif text-lg text-navy mb-1">{s.t}</div>
                <div className="text-sm text-ink-muted">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why personalized */}
      <section className="px-8 py-16 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-navy mb-4">Pourquoi cette page est personnalisée ?</h2>
          <p className="text-ink-muted leading-relaxed">
            Geoperf publie des études sectorielles trimestrielles sur la perception des marques par les LLM.
            {ctx.company_name && <> Vous recevez celle-ci parce que <strong>{ctx.company_name}</strong> apparaît dans le top des
            sociétés citées par au moins {ctx.visibility_score} LLM sur 4. </>}
            Vous pouvez télécharger le rapport librement, ou réserver un audit gratuit pour discuter de votre
            positionnement spécifique.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-10 border-t border-navy/10 text-xs text-ink-muted bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-2">
            Geoperf est un produit de Jourdechance SAS · SIREN 838 114 619 · RCS Nanterre · 31 rue Diaz, 92100 Boulogne-Billancourt
          </div>
          <div>
            Vous recevez cet accès personnalisé suite à notre étude {ctx.sous_categorie} 2026.
            Pour vous désinscrire : <a href="mailto:contact@geoperf.com?subject=STOP" className="underline">contact@geoperf.com</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
