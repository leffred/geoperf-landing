// S34 — Page creation article avec suggestions GSC
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, TrendingUp } from "lucide-react";
import { generateArticle } from "../actions";
import { GenerateButton } from "./GenerateButton";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import GscSuggestions from "./GscSuggestions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Nouvel article — Geoperf Content",
  robots: { index: false, follow: false },
};

const ERROR_LABELS: Record<string, string> = {
  missing_subject: "Indiquez un sujet pour l'article.",
  bad_language: "Langue invalide.",
  generation_failed: "Echec de la generation. Le moteur IA est peut-etre surcharge, reessayez dans une minute.",
};

export default async function NewContentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const errorMsg = sp.error ? ERROR_LABELS[sp.error] ?? "Erreur." : null;

  const ctx = await loadSaasContext();
  const sb  = getServiceClient();

  const { data: profile } = await sb
    .from("saas_profiles")
    .select("gsc_refresh_token, gsc_property_url")
    .eq("id", ctx.user.id)
    .maybeSingle();

  const gscConnected = !!profile?.gsc_refresh_token;

  const { data: suggestions } = gscConnected
    ? await sb
        .from("client_gsc_data")
        .select("query, impressions, position, ctr")
        .eq("client_id", ctx.user.id)
        .gt("impressions", 20)
        .gt("position", 4)
        .lt("position", 21)
        .order("impressions", { ascending: false })
        .limit(5)
    : { data: null };

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
          Generer un article GEO
        </h1>
        <p className="text-ink-muted mt-1" style={{ fontSize: 13 }}>
          L&apos;IA redige un article de 1200-2000 mots optimise pour etre cite par ChatGPT, Claude, Gemini et Perplexity.
          Generation en ~30 secondes.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-danger" style={{ fontSize: 13 }}>
          {errorMsg}
        </div>
      )}

      {gscConnected && suggestions && suggestions.length > 0 && (
        <div className="mb-5 bg-white border border-DEFAULT rounded-xl shadow-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-brand-500" strokeWidth={1.8} />
            <span className="font-mono uppercase text-ink-subtle" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
              Opportunites GSC &mdash; positions 5-20
            </span>
          </div>
          <p className="text-ink-muted mb-3" style={{ fontSize: 12 }}>
            Ces requetes ont du trafic mais pas encore d&apos;article optimise. Cliquez pour pre-remplir le sujet.
          </p>
          <GscSuggestions suggestions={suggestions as { query: string; impressions: number; position: number; ctr: number }[]} />
        </div>
      )}

      {!gscConnected && (
        <div className="mb-5 bg-blue-50/60 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <TrendingUp size={16} className="text-blue-500 mt-0.5 shrink-0" strokeWidth={1.8} />
          <div>
            <p className="text-blue-800 font-medium" style={{ fontSize: 13 }}>Obtenez des suggestions personnalisees</p>
            <p className="text-blue-600 mt-0.5" style={{ fontSize: 12 }}>
              Connectez Google Search Console pour voir vos opportunites reelles.{" "}
              <Link href="/app/settings/gsc" className="underline hover:text-blue-800">Connecter GSC &rarr;</Link>
            </p>
          </div>
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
            Plus le sujet est precis, plus l&apos;article sera cible. Mentionnez le secteur, l&apos;audience, l&apos;angle.
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
            <option value="fr">Francais</option>
            <option value="en">English</option>
          </select>
        </div>

        <GenerateButton />

        <div className="mt-5 pt-5 border-t border-DEFAULT flex items-start gap-2.5 text-ink-muted" style={{ fontSize: 12 }}>
          <Sparkles size={14} strokeWidth={1.8} className="text-brand-500 mt-0.5 shrink-0" />
          <div>
            Pipeline : Brave Search (contexte web frais) &rarr; Claude 3 Haiku (redaction GEO-optimisee) &rarr; enregistrement en brouillon dans <strong>Mes articles</strong>.
            Vous pourrez reviser puis publier sur votre CMS WordPress en 1 clic.
          </div>
        </div>
      </form>
    </div>
  );
}
