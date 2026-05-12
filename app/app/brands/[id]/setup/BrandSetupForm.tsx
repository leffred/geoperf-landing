"use client";

// Formulaire Brand Setup avec bouton "Prégénérer avec l'IA".
// Appelle /api/saas/prefill-brand-setup (POST { brand_id })
// et remplit les champs description, keywords, value_props.

import { useState, useRef } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { updateBrandSetup } from "./actions";

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1.5";
const FIELD_INPUT = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";

interface Props {
  brandId: string;
  brandName: string;
  initialDescription: string;
  initialKeywords: string[];
  initialValueProps: string[];
}

export function BrandSetupForm({
  brandId,
  brandName,
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
      // Scroll vers le premier champ rempli
      setTimeout(() => descRef.current?.focus(), 100);
    } catch {
      setPrefillError("Erreur réseau. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={updateBrandSetup} className="space-y-5">
      <input type="hidden" name="brand_id" value={brandId} />

      {/* Bouton prégénération */}
      <div className="flex items-center justify-between gap-3 pb-1 border-b border-DEFAULT">
        <div>
          <p className="text-sm font-medium text-ink">{brandName}</p>
          <p className="text-xs text-ink-muted mt-0.5">Remplis les champs manuellement ou laisse l&apos;IA générer une base.</p>
        </div>
        <button
          type="button"
          onClick={handlePrefill}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-brand-200 bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {loading
            ? <><Loader2 size={12} className="animate-spin" /> Génération…</>
            : <><Sparkles size={12} /> Prégénérer avec l&apos;IA</>
          }
        </button>
      </div>

      {prefillError && (
        <div className="rounded-md border border-DEFAULT border-l-2 border-l-danger bg-white px-3 py-2 text-xs text-danger">
          {prefillError}
        </div>
      )}
      {prefillDone && (
        <div className="rounded-md border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-3 py-2 text-xs text-brand-600">
          Champs pré-remplis. Vérifie et ajuste avant de sauvegarder.
        </div>
      )}

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
          placeholder="Ex: Asset manager européen spécialisé ESG, focus institutionnels et grandes entreprises."
          className={FIELD_INPUT}
        />
        <p className="text-xs text-ink-subtle mt-1.5">2-4 phrases. Comment tu décris ta marque à un nouveau prospect.</p>
      </div>

      <div>
        <label htmlFor="brand_keywords" className={FIELD_LABEL}>Keywords ciblés (max 20)</label>
        <textarea
          id="brand_keywords"
          name="brand_keywords"
          rows={3}
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          placeholder="ESG, institutionnels, durabilité, France, performance long-terme"
          className={`${FIELD_INPUT} font-mono`}
        />
        <p className="text-xs text-ink-subtle mt-1.5">Séparés par virgules. Le score alignment compte combien apparaissent dans les réponses LLM.</p>
      </div>

      <div>
        <label htmlFor="brand_value_props" className={FIELD_LABEL}>Propositions de valeur (max 10)</label>
        <textarea
          id="brand_value_props"
          name="brand_value_props"
          rows={4}
          value={valueProps}
          onChange={e => setValueProps(e.target.value)}
          placeholder={"Performance long-terme à travers les cycles\nEngagement actionnaires actif\nReporting transparent"}
          className={FIELD_INPUT}
        />
        <p className="text-xs text-ink-subtle mt-1.5">1 par ligne. Ce que tu veux que les LLM disent de toi.</p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" size="md" className="flex-1">Sauvegarder</Button>
      </div>
    </form>
  );
}
