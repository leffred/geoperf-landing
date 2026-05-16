"use client";

import { useActionState } from "react";
import { refreshGscData, type RefreshGscState } from "./actions";

export default function GscRefreshButton() {
  const [state, action, isPending] = useActionState<RefreshGscState | undefined, FormData>(
    refreshGscData,
    undefined
  );

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={isPending}
        className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Actualisation…" : "↻ Rafraîchir les données GSC"}
      </button>
      {state?.ok && (
        <span className="ml-3 text-xs text-green-600">
          {state.inserted} requêtes importées ✓
        </span>
      )}
      {state && !state.ok && (
        <span className="ml-3 text-xs text-red-500">
          Erreur : {state.error}
        </span>
      )}
    </form>
  );
}
