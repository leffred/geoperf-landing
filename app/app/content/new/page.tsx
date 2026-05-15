// S33 — Page création article GEO Content Writer.
// Server Component shell + petit Client Component pour le loading state via useFormStatus.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { generateArticle } from "../actions";
import { GenerateButton } from "./GenerateButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nouvel article — Geoperf Content", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  missing_subject: "Indiquez un sujet pour l'article.",
  bad_language: "Langue invalide.",
  generation_failed: "Échec de la génération. Le moteur IA est peut-être surchargé — réessayez dans une minute.",
};

export default async function NewContentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const errorMsg = sp.error ? ERROR_LABELS[sp.error] ?? "Erreur." : null;

  return (
    <div className="px-6 md:px-8 py-6 md:py-8 max-w-2xl mx-auto">
      <Link
        href="/app/content"
        className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink mb-5 transition-colors"
        style={{ fontSize: 12 }}
      >
        <ArrowLeft size={13} strokeWidth={1.8} />
        Retour aux articles
      </Link>

      <div className="mb-6">
        <div className="font-mono uppercase text-brand-500 mb-1" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
          // Nouvel article
        </div>
        <h1 className="text-ink leading-tight tracking-tight" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Générer un article GEO
        </h1>
        <p className="text-ink-muted mt-1" style={{ fontSize: 13 }}>
          L&apos;IA rédige un article de 1200-2000 mots optimisé pour être cité par ChatGPT, Claude, Gemini et Perplexity.
          Génération en ~30 secondes.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-danger" style={{ fontSize: 13 }}>
          {errorMsg}
        </div>
      )}

      <form action={generateArticle} className="bg-white border border-DEFAULT rounded-xl shadow-card p-5 md:p-6">
        <div className="mb-5">
          <label htmlFor="subject" className="block font-mono uppercase text-ink-subtle mb-1.5" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
            Sujet de l&apos;article
          </label>
          <textarea
            id="subject"
            name="subject"
            required
            rows={3}
            maxLength={500}
            placeholder="Ex: Comment optimiser sa marque B2B pour ChatGPT en 2026"
            className="w-full bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors text-ink resize-none"
            style={{ fontSize: 14, lineHeight: 1.5 }}
          />
          <p className="mt-1.5 text-ink-subtle" style={{ fontSize: 11 }}>
            Plus le sujet est précis, plus l&apos;article sera ciblé. Mentionnez le secteur, l&apos;audience, l&apos;angle.
          </p>
        </div>

        <div className="mb-5">
          <label htmlFor="language" className="block font-mono uppercase text-ink-subtle mb-1.5" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
            Langue
          </label>
          <select
            id="language"
            name="language"
            defaultValue="fr"
            className="w-full md:w-48 bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors text-ink"
            style={{ fontSize: 14 }}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>

        <GenerateButton />

        <div className="mt-5 pt-5 border-t border-DEFAULT flex items-start gap-2.5 text-ink-muted" style={{ fontSize: 12 }}>
          <Sparkles size={14} strokeWidth={1.8} className="text-brand-500 mt-0.5 shrink-0" />
          <div>
            Pipeline : Brave Search (contexte web frais) → Claude 3 Haiku (rédaction GEO-optimisée) → enregistrement en brouillon dans <strong>Mes articles</strong>.
            Vous pourrez réviser puis publier sur votre CMS WordPress en 1 clic.
          </div>
        </div>
      </form>
    </div>
  );
}
