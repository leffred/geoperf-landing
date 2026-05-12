"use client";

// Formulaire Brand Setup — config générale + alignment.
// Bouton "Prégénérer avec l'IA" pour pré-remplir description/keywords/value_props.

import { useState, useRef } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { updateBrandSetup } from "./actions";

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1.5";
const FIELD_INPUT = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";

interface Props {
  brandId: string;
  brandName: string;
  initialCategory: string;
  initialCompetitors: string[];
  initialCadence: string;
  isFree: boolean;
  initialDescription: string;
  initialKeywords: string[];
  initialValueProps: string[];
}

export function BrandSetupForm({
  brandId,
  brandName,
  initialCategory,
  initialCompetitors,
  initialCadence,
  isFree,
  initialDescription,
  initialKeywords,
  initialValueProps,
}: Props) {
  const [description, setDescription] = useState(initialDescription);
  const [keywords, setKeywords] = useState(initialKeywords.join(", "));
  const [valueProps, setValueProps] = useState(initialValueProps.join("\n"));
  const [loading, setLoading] = useState(false);
  const [prefillError, setPrefillError] = useState<string | null>(null);
  const [prefillDone, setPrefillDone] = useState(false);
  const descRef = useRef<HTMLTextAreaElement>(null);

  async function handlePrefill() {
    setLoading(true);
    setPrefillError(null);
    setPrefillDone(false);
    try {
      const res = await fetch("/api/saas/prefill-brand-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_id: brandId }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        if (data.error === "rate_limited") {
          setPrefillError("1 génération par minute. Réessaie dans quelques secondes.");
        } else {
          setPrefillError(data.error ?? "Erreur inattendue. Réessaie.");
        }
        return;
      }
      if (data.description) setDescription(data.description);
      if (Array.isArray(data.keywords) && data.keywords.length > 0) {
        setKeywords(data.keywords.join(", "));
      }
      if (Array.isArray(data.value_props) && data.value_props.length > 0) {
        setValueProps(data.value_props.join("\n"));
      }
      setPrefillDone(true);
      setTimeout(() => descRef.current?.focus(), 100);
    } catch {
      setPrefillError("Erreur réseau. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={updateBrandSetup} className="space-y-6">
      <input type="hidden" name="brand_id" value={brandId} />

      {/* ── Section 1 : Config générale ── */}
      <div>
        <p className="font-mono text-ink-subtle uppercase mb-4" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
          Configuration générale
        </p>
        <div className="space-y-4">

          <div>
            <label htmlFor="category" className={FIELD_LABEL}>Catégorie / secteur</label>
            <input
              id="category"
              name="category"
              type="text"
              defaultValue={initialCategory}
              placeholder="asset management, agence marketing, SaaS B2B..."
              className={FIELD_INPUT}
            />
            <p className="text-xs text-ink-subtle mt-1.5">Cadre le contexte dans les prompts LLM.</p>
          </div>

          <div>
            <label htmlFor="competitors" className={FIELD_LABEL}>Concurrents suivis (max 10 domaines)</label>
            <textarea
              id="competitors"
              name="competitors"
              rows={3}
              defaultValue={initialCompetitors.join(", ")}
              placeholder="amundi.fr, blackrock.com, bnpparibas-am.fr"
              className={`${FIELD_INPUT} font-mono`}
            />
            <p className="text-xs text-ink-subtle mt-1.5">Séparés par virgules. Les 2-3 premiers alimentent les prompts concurrentiels.</p>
          </div>

          <div>
            <label htmlFor="cadence" className={FIELD_LABEL}>Cadence des snapshots</label>
            <select
              id="cadence"
              name="cadence"
              defaultValue={initialCadence}
              className={FIELD_INPUT}
            >
              <option value="weekly" disabled={isFree}>Hebdomadaire {isFree ? "(Starter+)" : ""}</option>
              <option value="monthly">Mensuelle</option>
            </select>
          </div>

        </div>
      </div>

      {/* ── Section 2 : Brand Alignment ── */}
      <div className="border-t border-DEFAULT pt-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="font-mono text-ink-subtle uppercase" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
            Brand Alignment
          </p>
          <button
            type="button"
            onClick={handlePrefill}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-brand-200 bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? <><Loader2 size={12} className="animate-spin" /> Génération…</>
              : <><Sparkles size={12} /> Prégénérer avec l&apos;IA</>
            }
          </button>
        </div>

        {prefillError && (
          <div className="mb-3 rounded-md border border-DEFAULT border-l-2 border-l-danger bg-white px-3 py-2 text-xs text-danger">
            {prefillError}
          </div>
        )}
        {prefillDone && (
          <div className="mb-3 rounded-md border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-3 py-2 text-xs text-brand-600">
            Champs pré-remplis. Vérifie et ajuste avant de sauvegarder.
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="brand_description" className={FIELD_LABEL}>Description de la marque</label>
            <textarea
              ref={descRef}
              id="brand_description"
              name="brand_description"
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={1000}
              placeholder="Ex: Agence marketing B2B spécialisée PME/ETI. Accompagne les équipes commerciales sur la stratégie de marque et les campagnes digitales."
              className={FIELD_INPUT}
            />
            <p className="text-xs text-ink-subtle mt-1.5">2-4 phrases. Utilisée pour calculer le score d&apos;alignement.</p>
          </div>

          <div>
            <label htmlFor="brand_keywords" className={FIELD_LABEL}>Keywords ciblés (max 20)</label>
            <textarea
              id="brand_keywords"
              name="brand_keywords"
              rows={3}
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="agence marketing, stratégie de marque, PME, ETI, digital, branding"
              className={`${FIELD_INPUT} font-mono`}
            />
            <p className="text-xs text-ink-subtle mt-1.5">Séparés par virgules. Le score alignment compte combien apparaissent dans les réponses LLM.</p>
          </div>

          <div>
            <label htmlFor="brand_value_props" className={FIELD_LABEL}>Propositions de valeur (max 10)</label>
            <textarea
              id="brand_value_props"
              name="brand_value_props"
              rows={5}
              value={valueProps}
              onChange={e => setValueProps(e.target.value)}
              placeholder={"Construire une stratégie marketing alignée avec vos objectifs\nCréer des campagnes impactantes et mémorables\nGénérer des résultats mesurables et ROI"}
              className={FIELD_INPUT}
            />
            <p className="text-xs text-ink-subtle mt-1.5">1 par ligne. Ce que tu veux que les LLM disent de toi.</p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary" size="md" className="w-full">Sauvegarder</Button>
      </div>
    </form>
  );
}
