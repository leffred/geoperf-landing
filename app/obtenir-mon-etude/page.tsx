// S32 Ticket 5 — Landing page paid ads "Obtenir mon étude".
// Standalone : pas de Header/Footer (page isolée pour maximiser la conversion).
// Pattern : reuse de l'action existante `requestStudy` (qui gère déjà UTM cookie,
// anti-abus 30j, dispatch email + Apollo CRM hook, redirect /sent ou /pending).
// Le GA4 event `form_submit_etude` (= lead_etude_sectorielle) est poussé sur la
// page /sent via le `<GtmPageEvent>` déjà en place.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { getServiceClient } from "@/lib/supabase";
import { requestStudy } from "../[locale]/etude-sectorielle/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Que dit ChatGPT de votre marque ? — Étude sectorielle gratuite | Geoperf",
  description:
    "Recevez votre étude sectorielle gratuite : comment ChatGPT, Claude, Gemini et Perplexity perçoivent les marques de votre secteur en 2026. PDF complet, ~30 pages, livraison instantanée.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Que dit ChatGPT de votre marque ? — Étude sectorielle gratuite",
    description: "PDF gratuit · 4 LLMs analysés · 30 prompts par secteur · 30 marques benchmarkées",
    url: "https://geoperf.com/obtenir-mon-etude",
    type: "website",
    siteName: "Geoperf",
  },
};

// 6 secteurs proposés. Slugs alignés sur public.categories.slug pour que requestStudy
// trouve un report ready (si dispo) ou trigger Phase 1 n8n (sinon).
const SECTORS: Array<{ slug: string; label: string }> = [
  { slug: "computer-software", label: "SaaS / Éditeur de logiciels" },
  { slug: "banking", label: "Banque / Finance" },
  { slug: "insurance", label: "Assurance" },
  { slug: "retail", label: "Retail / E-commerce" },
  { slug: "management-consulting", label: "Conseil / Stratégie" },
  { slug: "marketing-advertising", label: "Marketing & Publicité" },
];

type SearchParams = Promise<{ error?: string }>;

const ERROR_LABELS: Record<string, string> = {
  email_invalid: "Email invalide. Vérifie le format.",
  missing_sous_cat: "Sélectionne ton secteur.",
};

async function loadDownloadCount(): Promise<number | null> {
  try {
    const sb = getServiceClient();
    const { count } = await sb
      .from("lead_magnet_downloads")
      .select("id", { count: "exact", head: true });
    return count ?? null;
  } catch {
    return null;
  }
}

export default async function ObtenirMonEtudePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const errorMsg = sp.error ? ERROR_LABELS[sp.error] ?? "Une erreur est survenue." : null;
  const downloadCount = await loadDownloadCount();
  const socialProof = downloadCount && downloadCount > 50
    ? `${downloadCount}+ décideurs ont déjà téléchargé leur étude`
    : null;

  return (
    <main className="min-h-screen bg-white text-ink antialiased">
      {/* Mini header simplifié : juste le wordmark, pas de nav */}
      <header className="border-b border-DEFAULT bg-white">
        <div className="max-w-3xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="Geoperf">
            <span
              className="grid place-items-center text-white rounded-[5px] bg-ink"
              style={{ width: 18, height: 18, fontSize: 10, fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}
            >
              G
            </span>
            <span className="text-ink" style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>
              Geoperf
              <span style={{ color: "#EF9F27", marginLeft: -2 }}>·</span>
            </span>
          </Link>
          <span className="font-mono text-ink-subtle hidden sm:inline" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
            ÉTUDE SECTORIELLE 2026 · GRATUITE
          </span>
        </div>
      </header>

      {/* Hero + form */}
      <section className="px-5 md:px-8 pt-10 md:pt-16 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="font-mono uppercase text-brand-500 mb-3" style={{ fontSize: 10, letterSpacing: "0.16em" }}>
            // Que dit l&apos;IA de votre marque ?
          </div>
          <h1 className="text-ink leading-[1.05] tracking-tight text-balance" style={{ fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
            Découvrez comment <span className="text-brand-500">ChatGPT</span>,{" "}
            <span style={{ color: "#C77D2C" }}>Claude</span> et{" "}
            <span style={{ color: "#4285F4" }}>Gemini</span> présentent votre secteur à vos prospects.
          </h1>
          <p className="mt-5 text-ink-muted leading-relaxed max-w-2xl" style={{ fontSize: "clamp(16px, 2vw, 18px)" }}>
            En 2026, 1 acheteur B2B sur 3 consulte un LLM avant un acte d&apos;achat structurant.
            Recevez gratuitement l&apos;étude de votre secteur — 30 prompts × 4 LLMs × 30 marques benchmarkées.
          </p>

          {socialProof && (
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-DEFAULT" style={{ fontSize: 12 }}>
              <Sparkles size={12} strokeWidth={1.8} className="text-brand-500" />
              <span className="text-ink-muted font-mono">{socialProof}</span>
            </div>
          )}

          {/* Form */}
          <form action={requestStudy} className="mt-8 bg-surface border border-DEFAULT rounded-2xl p-5 md:p-7 shadow-card">
            <input type="hidden" name="source_path" value="/obtenir-mon-etude" />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block font-mono uppercase text-ink-subtle mb-1.5" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
                  Votre email pro
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="prenom.nom@entreprise.com"
                  className="w-full bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors"
                  style={{ fontSize: 14 }}
                />
              </div>
              <div>
                <label htmlFor="sous_categorie_slug" className="block font-mono uppercase text-ink-subtle mb-1.5" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
                  Votre secteur
                </label>
                <select
                  id="sous_categorie_slug"
                  name="sous_categorie_slug"
                  required
                  defaultValue=""
                  className="w-full bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors text-ink"
                  style={{ fontSize: 14 }}
                >
                  <option value="" disabled>Sélectionnez…</option>
                  {SECTORS.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-brand-500 text-white px-5 py-3 rounded-md hover:bg-brand-600 transition-colors"
              style={{ fontSize: 15, fontWeight: 600 }}
            >
              Recevoir mon étude gratuite
              <ArrowRight size={16} strokeWidth={2} />
            </button>

            <p className="mt-3 text-ink-subtle text-center" style={{ fontSize: 11 }}>
              PDF de 30 pages · Livraison instantanée · Sans engagement · RGPD-friendly
            </p>

            {errorMsg && (
              <div className="mt-3 px-3 py-2 rounded-md text-danger" style={{ background: "color-mix(in srgb, #DC2626 12%, transparent)", fontSize: 13 }}>
                {errorMsg}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* 3 points de valeur */}
      <section className="px-5 md:px-8 py-12 bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="font-mono uppercase text-brand-500 mb-3" style={{ fontSize: 10, letterSpacing: "0.16em" }}>
            // Pourquoi cette étude
          </div>
          <h2 className="text-ink leading-tight tracking-tight mb-8" style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
            3 raisons de la télécharger maintenant
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <ValueCard
              eyebrow="01 · Benchmark"
              title="30 marques de votre secteur classées"
              body="Score de visibilité, rang moyen, share-of-voice cross-LLM. Vos concurrents directs et les outsiders qui montent."
            />
            <ValueCard
              eyebrow="02 · Méthodologie"
              title="4 LLMs analysés en parallèle"
              body="ChatGPT, Claude, Gemini, Perplexity sur 30 prompts représentatifs des questions de vos prospects B2B."
            />
            <ValueCard
              eyebrow="03 · Actionnable"
              title="Sources d'autorité par LLM"
              body="Quels domaines citent vos concurrents. Où publier pour entrer dans les corpus des LLMs en 2026."
            />
          </div>
        </div>
      </section>

      {/* Quote / testimonial leger */}
      <section className="px-5 md:px-8 py-12 bg-white">
        <div className="max-w-2xl mx-auto">
          <blockquote className="text-ink leading-relaxed text-balance" style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 500 }}>
            « En 2026, ignorer comment ChatGPT cite votre marque, c&apos;est l&apos;équivalent d&apos;ignorer le ranking Google en 2008.
            Les early movers gagneront un avantage structurel de 3 à 5 ans. »
          </blockquote>
          <p className="mt-4 text-ink-muted font-mono" style={{ fontSize: 12 }}>
            — Frédéric Lefebvre, fondateur Geoperf
          </p>
        </div>
      </section>

      {/* Mini-FAQ + reassurance */}
      <section className="px-5 md:px-8 py-12 bg-surface">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          <FaqItem
            q="C'est vraiment gratuit ?"
            a="Oui. L'étude est un lead-magnet trimestriel. Vous recevez le PDF par email immédiatement, sans engagement."
          />
          <FaqItem
            q="Que recevrai-je exactement ?"
            a="Un PDF de ~30 pages : top 30 marques de votre secteur, scores cross-LLM, méthodologie complète, sources citées."
          />
          <FaqItem
            q="Mon secteur n'est pas listé"
            a="Pas grave — sélectionnez le plus proche. Nous lancerons un nouvel audit en ~5 minutes et vous serez notifié quand le PDF est prêt."
          />
          <FaqItem
            q="Et mes données ?"
            a="Email uniquement, hébergé en Allemagne (RGPD-friendly). Pas de revente, désinscription en 1 clic à tout moment."
          />
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="border-t border-DEFAULT bg-white">
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-6 flex flex-wrap items-center justify-between gap-3 text-ink-subtle" style={{ fontSize: 11 }}>
          <span className="font-mono">© 2026 Geoperf · Jourdechance SAS</span>
          <nav className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-ink transition-colors no-underline">Confidentialité</Link>
            <Link href="/terms" className="hover:text-ink transition-colors no-underline">CGU</Link>
            <Link href="/contact" className="hover:text-ink transition-colors no-underline">Contact</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function ValueCard({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="bg-white rounded-xl border border-DEFAULT p-5 shadow-card">
      <div className="font-mono uppercase text-brand-500 mb-2" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
        {eyebrow}
      </div>
      <h3 className="text-ink leading-snug mb-2" style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
        {title}
      </h3>
      <p className="text-ink-muted leading-relaxed" style={{ fontSize: 13 }}>
        {body}
      </p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <div className="flex items-start gap-2 mb-1.5">
        <Check size={14} strokeWidth={2} className="text-brand-500 mt-0.5 shrink-0" />
        <h3 className="text-ink leading-tight" style={{ fontSize: 14, fontWeight: 600 }}>
          {q}
        </h3>
      </div>
      <p className="text-ink-muted leading-relaxed pl-6" style={{ fontSize: 13 }}>
        {a}
      </p>
    </div>
  );
}
