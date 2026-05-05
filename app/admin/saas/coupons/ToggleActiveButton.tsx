"use client";

import { useTransition } from "react";
import { toggleCouponActive } from "./actions";

export function ToggleActiveButton({ code, isActive }: { code: string; isActive: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleCouponActive(code, isActive);
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
