// S32 — Helper UTM attribution.
// Lit le cookie `_geoperf_utm` posé par le middleware (first-touch 30j).
// Réutilisable dans toutes les server actions (signup, OAuth) pour pousser les UTM
// dans options.data → raw_user_meta_data → trigger DB → saas_profiles.acquisition_*.

import { cookies } from "next/headers";

export type UtmPayload = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  first_touch_at: string;
};

export async function readUtmFromCookie(): Promise<UtmPayload | null> {
  try {
    const store = await cookies();
    const raw = store.get("_geoperf_utm")?.value;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UtmPayload>;
    if (!parsed.utm_source) return null;
    return {
      utm_source: parsed.utm_source,
      utm_medium: parsed.utm_medium || "",
      utm_campaign: parsed.utm_campaign || "",
      utm_content: parsed.utm_content || "",
      utm_term: parsed.utm_term || "",
      first_touch_at: parsed.first_touch_at || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Aplatit le payload UTM pour merge dans options.data Supabase signUp/signInWithOAuth.
 * Retourne {} si pas de UTM (signup organique).
 */
export async function utmMetadataForSupabase(): Promise<Record<string, string>> {
  const utm = await readUtmFromCookie();
  if (!utm) return {};
  return {
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_content: utm.utm_content,
    utm_term: utm.utm_term,
    utm_first_touch_at: utm.first_touch_at,
  };
}
