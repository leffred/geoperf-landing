"use client";

// S32 — Client Component générique pour push un event GTM au mount d'une page.
// Utilisé sur les pages "success" qui sont des destinations post-conversion
// (ex: /etude-sectorielle/sent, /signup callback page, /app/dashboard?welcome=1).
//
// Pattern : <GtmPageEvent event="form_submit_etude" value={20} params={{ secteur: "imprimerie" }} />
//
// Idempotent : utilise sessionStorage pour éviter double-push si user refresh.

import { useEffect } from "react";
import { pushGtmConversion, pushGtmEvent } from "@/lib/gtm";

type Props = {
  event: string;
  /** Valeur de conversion EUR (optionnel). Si fourni, push via pushGtmConversion. */
  value?: number;
  params?: Record<string, unknown>;
  /** Clé sessionStorage pour dedup. Default: event. */
  dedupKey?: string;
};

export function GtmPageEvent({ event, value, params, dedupKey }: Props) {
  useEffect(() => {
    const key = `_gtm_pushed_${dedupKey || event}`;
    try {
      if (sessionStorage.getItem(key)) return; // déjà pushé cette session
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage indispo (private mode strict) → push quand même
    }
    if (typeof value === "number") {
      pushGtmConversion(event, value, params);
    } else {
      pushGtmEvent(event, params);
    }
  }, [event, value, params, dedupKey]);
  return null;
}
