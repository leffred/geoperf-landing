// S20 §4.5 — Detection du mode demo (user.id == DEMO_USER_ID).
// A appeller depuis server actions / route handlers pour bloquer les mutations.

import { headers } from "next/headers";
import { getSupabaseServerClient } from "./supabase-server-auth";

export const DEMO_USER_ID = "d3403d3e-d3d3-d3d3-d3d3-d3d3d3d30000";

/**
 * Source primaire : header x-geoperf-demo posé par le middleware.
 * Source secondaire : direct DB lookup. Utiliser la 1re par defaut (perf).
 */
export async function isDemoMode(): Promise<boolean> {
  try {
    const h = await headers();
    if (h.get("x-geoperf-demo") === "1") return true;
  } catch {
    // headers() peut throw hors contexte request — fallback DB lookup
  }
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data?.user?.id === DEMO_USER_ID;
}

/**
 * Sentinel a thrower depuis une server action quand on detecte le demo.
 * L'UI doit afficher un toast "Mode demo : action indisponible".
 */
export class DemoModeError extends Error {
  constructor() {
    super("demo_mode_readonly");
    this.name = "DemoModeError";
  }
}

/**
 * Helper a appeler en debut de toute server action mutation.
 * Throws DemoModeError si l'user est demo.
 */
export async function assertNotDemo(): Promise<void> {
  if (await isDemoMode()) {
    throw new DemoModeError();
  }
}
