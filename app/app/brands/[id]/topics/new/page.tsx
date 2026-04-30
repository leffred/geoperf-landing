import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { createTopic } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nouveau topic — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  missing_name: "Le nom du topic est requis.",
  duplicate_slug: "Un topic avec un slug similaire existe déjà.",
  bad_prompts_json: "Les prompts custom doivent être un JSON array valide.",
  unknown: "Une erreur est survenue.",
};

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> };

export default async function NewTopicPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: brand } = await sb.from("saas_tracked_brands").select("id, user_id, name").eq("id", id).maybeSingle();
  if (!brand || (brand as any).user_id !== ctx.account_owner_id) notFound();

  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;

  return (
    <Section py="md" tone="cream">
      <div className="max-w-xl">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
          <Link href={`/app/brands/${id}/topics`} className="hover:underline">Topics</Link> / Nouveau
        </p>
        <h1 className="font-serif text-3xl text-navy mb-2">Nouveau topic</h1>
        <p className="text-sm text-ink-muted mb-6">
          Crée un sous-sujet pour {brand.name}. Tu pourras lancer des snapshots dédiés à ce topic.
        </p>

        {errorMsg && (
          <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">{errorMsg}</div>
        )}

        <form action={createTopic} className="bg-white p-6 space-y-5">
          <input type="hidden" name="brand_id" value={id} />

          <div>
            <label htmlFor="name" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Nom du topic</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="ex: ESG, Innovation digitale, Performance financière..."
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Description (optionnelle)</label>
            <textarea
              id="description"
              name="description"
              rows={2}
              placeholder="Quel angle de la marque tu veux explorer..."
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none"
            />
          </div>

          <div>
            <label htmlFor="prompts" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Prompts custom (JSON, optionnel)</label>
            <textarea
              id="prompts"
              name="prompts"
              rows={5}
              placeholder='Vide = utilise les 30 prompts standards. Sinon JSON array : [{"id":"esg_01","category":"direct_search","template":"Quels {category} ont la meilleure note ESG ?"}]'
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none font-mono text-xs"
            />
            <p className="text-xs text-ink-muted mt-1">
              Avancé. Variables disponibles : <code>{"{brand}"}</code>, <code>{"{category}"}</code>, <code>{"{competitors[0..N]}"}</code>.
              Vide = utilise les 30 prompts par défaut.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-navy text-white py-2.5 text-sm font-medium hover:bg-navy-light transition">
              Créer le topic
            </button>
            <Link href={`/app/brands/${id}/topics`} className="px-4 py-2.5 text-sm text-ink-muted hover:text-navy">
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </Section>
  );
}
