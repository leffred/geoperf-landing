import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1.5";
const FIELD_INPUT = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";

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
    <Section py="md" tone="white">
      <div className="max-w-xl">
        <Eyebrow className="mb-2">
          <Link href={`/app/brands/${id}/topics`} className="hover:underline">Topics</Link>
          <span className="opacity-50"> / </span>
          <span>Nouveau</span>
        </Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3 leading-tight">
          Nouveau topic
        </h1>
        <p className="text-sm text-ink-muted mb-8 leading-relaxed">
          Crée un sous-sujet pour {brand.name}. Tu pourras lancer des snapshots dédiés à ce topic.
        </p>

        {errorMsg && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
            {errorMsg}
          </div>
        )}

        <Card variant="default">
          <form action={createTopic} className="space-y-5">
            <input type="hidden" name="brand_id" value={id} />

            <div>
              <label htmlFor="name" className={FIELD_LABEL}>Nom du topic</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="ex: ESG, Innovation digitale, Performance financière..."
                className={FIELD_INPUT}
              />
            </div>

            <div>
              <label htmlFor="description" className={FIELD_LABEL}>Description (optionnelle)</label>
              <textarea
                id="description"
                name="description"
                rows={2}
                placeholder="Quel angle de la marque tu veux explorer..."
                className={FIELD_INPUT}
              />
            </div>

            <div>
              <label htmlFor="prompts" className={FIELD_LABEL}>Prompts custom (JSON, optionnel)</label>
              <textarea
                id="prompts"
                name="prompts"
                rows={5}
                placeholder='Vide = utilise les 30 prompts standards. Sinon JSON array : [{"id":"esg_01","category":"direct_search","template":"Quels {category} ont la meilleure note ESG ?"}]'
                className={`${FIELD_INPUT} font-mono text-xs`}
              />
              <p className="text-xs text-ink-subtle mt-1.5">
                Avancé. Variables disponibles : <code>{"{brand}"}</code>, <code>{"{category}"}</code>, <code>{"{competitors[0..N]}"}</code>.
                Vide = utilise les 30 prompts par défaut.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" size="md" className="flex-1">Créer le topic</Button>
              <Link href={`/app/brands/${id}/topics`} className="px-4 py-2.5 text-sm text-ink-muted hover:text-ink transition-colors">
                Annuler
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </Section>
  );
}
