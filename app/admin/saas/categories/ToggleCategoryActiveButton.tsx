"use client";

import { useTransition } from "react";
import { toggleCategoryActive } from "./actions";

export function ToggleCategoryActiveButton({ id, isActive }: { id: string; isActive: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleCategoryActive(id, isActive);
        })
      }
      className={`px-2.5 py-1 text-xs rounded-md border transition ${
        isActive
          ? "border-DEFAULT bg-white text-ink hover:bg-surface"
          : "border-DEFAULT bg-surface text-ink-muted hover:bg-white"
      } disabled:opacity-50`}
    >
      {pending ? "…" : isActive ? "Désactiver" : "Activer"}
    </button>
  );
}
