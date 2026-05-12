"use client";

// Bouton "Lancer un snapshot" du dashboard — utilise useFormStatus pour afficher
// un spinner pendant la soumission et désactiver le double-clic.
// Doit être rendu à l'intérieur d'un <form action={runAllSnapshots}>.

import { useFormStatus } from "react-dom";
import { RefreshCw } from "lucide-react";

export function SnapshotAllButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-strong bg-white text-ink hover:bg-surface transition-colors duration-fast disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ fontSize: 13, fontWeight: 500, minWidth: 158 }}
    >
      <RefreshCw
        size={12}
        strokeWidth={1.8}
        className={pending ? "animate-spin" : ""}
      />
      {pending ? "Lancement en cours…" : "Lancer un snapshot"}
    </button>
  );
}
