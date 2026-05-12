"use client";

// Bouton "Lancer un snapshot" sur la page marque.
// Grisé + tooltip si snapshot en cours ou cooldown tier non expiré.
// useFormStatus → spinner pendant la soumission.

import { useFormStatus } from "react-dom";
import { RefreshCw } from "lucide-react";

interface Props {
  /** Désactivé côté serveur (snapshot en cours ou cooldown) */
  disabled?: boolean;
  /** Texte affiché dans la bulle d'aide au survol */
  tooltip?: string;
}

export function RefreshBrandButton({ disabled: serverDisabled, tooltip }: Props) {
  const { pending } = useFormStatus();
  const isDisabled = serverDisabled || pending;

  return (
    // Le span capte les events pointer même quand le button est disabled → tooltip visible
    <span
      title={isDisabled ? tooltip : undefined}
      style={{ display: "inline-flex", cursor: isDisabled ? "not-allowed" : "auto" }}
    >
      <button
        type="submit"
        disabled={isDisabled}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-500 text-white hover:bg-brand-600 transition-colors duration-fast disabled:opacity-40 disabled:pointer-events-none"
        style={{ fontSize: 13, fontWeight: 500, minWidth: 155 }}
      >
        <RefreshCw
          size={12}
          strokeWidth={1.8}
          className={pending ? "animate-spin" : ""}
        />
        {pending ? "Lancement…" : "Lancer un snapshot"}
      </button>
    </span>
  );
}
