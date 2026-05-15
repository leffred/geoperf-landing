"use client";

// S33 — Submit button avec loading state via useFormStatus.
// Pending pendant les 15-30s de génération n8n côté server action.

import { useFormStatus } from "react-dom";
import { Sparkles, Loader2 } from "lucide-react";

export function GenerateButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="w-full inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/60 disabled:cursor-wait text-white px-5 py-3 rounded-md transition-colors"
      style={{ fontSize: 14, fontWeight: 600 }}
    >
      {pending ? (
        <>
          <Loader2 size={16} strokeWidth={2} className="animate-spin" />
          Génération en cours… (~30s)
        </>
      ) : (
        <>
          <Sparkles size={16} strokeWidth={2} />
          Générer l&apos;article
        </>
      )}
    </button>
  );
}
