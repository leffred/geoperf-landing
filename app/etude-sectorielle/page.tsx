// S19 §4.1.a — Page lead-magnet /etude-sectorielle.
// Server component : preload categories + map availabilité reports → passe au client.

import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getServiceClient } from "@/lib/supabase";
import { StudyForm, type ParentCat, type SousCat } from "./StudyForm";

export const metadata: Metadata = {
  title: "Recevoir une étude sectorielle gratuite — Geoperf",
  description:
    "Téléchargez gratuitement nos études sectorielles 2026 : visibilité de votre secteur dans ChatGPT, Claude, Gemini et Perplexity. Étude indépendante Jourdechance, hébergée FR.",
  alternates: { canonical: "https://geoperf.com/etude-sectorielle" },
};

// Force dynamique : la liste de reports change quand on lance Phase 1
export const dynamic = "force-dynamic";

async function loadCatalog(): Promise<{ parents: ParentCat[]; sousCats: SousCat[] }> {
  const sb = getServiceClient();

  // Parents (catégories racine)
  const { data: rawCats } = await sb
    .from("categories")
    .select("id, slug, nom, parent_id, ordre, is_active")
    .order("ordre", { ascending: true });

  const cats = (rawCats ?? []) as Array<{
    id: string;
    slug: string;
    nom: string;
    parent_id: string | null;
    ordre: number;
    is_active: boolean;
  }>;

  const parents: ParentCat[] = cats
    .filter((c) => c.parent_id === null && c.is_active !== false)
    .map((c) => ({ id: c.id, slug: c.slug, nom: c.nom }));

  // Map availabilité : tous les slug_public de reports status=ready avec pdf_url
  const { data: ready } = await sb
    .from("reports")
    .select("slug_public")
    .eq("status", "ready")
    .not("pdf_url", "is", null);
  const readySlugs = new Set((ready ?? []).map((r) => (r.slug_public ?? "").toLowerCase()));

  const sousCats: SousCat[] = cats
    .filter((c) => c.parent_id !== null && c.is_active !== false)
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      nom: c.nom,
      parent_id: c.parent_id as string,
      has_report: readySlugs.has(c.slug.toLowerCase()),
    }));

  return { parents, sousCats };
}

export default async function EtudeSectoriellePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sous_cat?: string }>;
}) {
  const sp = await searchParams;
  const { parents, sousCats } = await loadCatalog();

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header logo="etudes" />

      <Section py="lg" tone="white">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-16 items-start max-w-5xl">
          {/* Pitch */}
          <div>
            <Eyebrow className="mb-3">Étude sectorielle gratuite</Eyebrow>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink mb-5 leading-tight text-balance">
              Téléchargez gratuitement nos études sectorielles 2026.
            </h1>
            <p className="text-base text-ink-muted leading-relaxed mb-6 max-w-xl">
              Visibilité de votre secteur dans ChatGPT, Claude, Gemini et Perplexity. Études
              indépendantes Jourdechance, méthodologie publique, données hébergées Frankfurt
              (UE).
            </p>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>30 marques benchmarkées sur 4 LLM</span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>Score de consensus inter-LLM, sources citées, biais identifiés</span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>5 recommandations actionnables par étude</span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-amber">·</span>
                <span>PDF 12 pages — lien valide 7 jours</span>
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="bg-surface border border-DEFAULT rounded-lg p-6 md:p-8 shadow-card">
            <StudyForm
              parents={parents}
              sousCats={sousCats}
              initialError={sp.error}
              initialSousCat={sp.sous_cat}
            />
          </div>
        </div>
      </Section>

      {/* Reassurance */}
      <Section py="md" tone="surface">
        <Eyebrow className="mb-3">Comment ça marche</Eyebrow>
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-ink mb-8 max-w-2xl leading-tight">
          Trois cas, trois réponses.
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-DEFAULT rounded-lg p-5 border-l-2 border-l-brand-500">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-2">
              01 · Étude prête
            </p>
            <p className="text-sm text-ink-muted leading-relaxed">
              Vous recevez le PDF par email en moins de 30 secondes. Le lien reste actif 7
              jours.
            </p>
          </div>
          <div className="bg-white border border-DEFAULT rounded-lg p-5 border-l-2 border-l-brand-500">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-2">
              02 · Étude à venir
            </p>
            <p className="text-sm text-ink-muted leading-relaxed">
              On lance sa génération à votre demande (24-48h). Vous serez notifié·e par
              email dès qu'elle est prête.
            </p>
          </div>
          <div className="bg-white border border-DEFAULT rounded-lg p-5 border-l-2 border-l-brand-500">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-2">
              03 · Anti-abus
            </p>
            <p className="text-sm text-ink-muted leading-relaxed">
              1 rapport différent / 30 jours par email. Vous pouvez re-télécharger le même
              autant de fois que nécessaire.
            </p>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
