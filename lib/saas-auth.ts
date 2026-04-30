// Helpers for SaaS user pages (/app/*).
// Server-only — import from server components, route handlers, server actions.

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "./supabase-server-auth";
import { getServiceClient } from "./supabase";

export type SaasTier = "free" | "solo" | "pro" | "agency";

export type SaasProfile = {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  stripe_customer_id: string | null;
  email_notifs_enabled: boolean;
  created_at: string;
};

export type SaasSubscription = {
  id: string;
  user_id: string;
  tier: SaasTier;
  status: "active" | "past_due" | "canceled" | "incomplete";
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

export const TIER_LIMITS: Record<SaasTier, { brands: number; cadence: "weekly" | "monthly"; llms: number; price_eur: number }> = {
  free:   { brands: 1,  cadence: "monthly", llms: 1, price_eur: 0 },
  solo:   { brands: 1,  cadence: "weekly",  llms: 4, price_eur: 149 },
  pro:    { brands: 3,  cadence: "weekly",  llms: 4, price_eur: 349 },
  agency: { brands: 10, cadence: "weekly",  llms: 4, price_eur: 899 },
};

export async function getSaasUser() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

export async function requireSaasUser(): Promise<NonNullable<Awaited<ReturnType<typeof getSaasUser>>>> {
  const user = await getSaasUser();
  if (!user) redirect("/login");
  return user;
}

export async function getSaasProfile(userId: string): Promise<SaasProfile | null> {
  const sb = getServiceClient();
  const { data } = await sb
    .from("saas_profiles")
    .select("id, email, full_name, company, stripe_customer_id, email_notifs_enabled, created_at")
    .eq("id", userId)
    .maybeSingle();
  return (data as SaasProfile | null) ?? null;
}

export async function getSaasSubscription(userId: string): Promise<SaasSubscription | null> {
  const sb = getServiceClient();
  const { data } = await sb
    .from("saas_subscriptions")
    .select("id, user_id, tier, status, stripe_subscription_id, current_period_end, cancel_at_period_end")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();
  return (data as SaasSubscription | null) ?? null;
}

/**
 * "Performance quand cité" — visibility_score normalisé par citation_rate.
 * Formule : si citation_rate=0 → null (la marque n'est jamais citée, ratio indéfini).
 *           sinon : visibility_score / (citation_rate / 100), plafonné à 100.
 *
 * Exemple : visibility=25, citation=30% → quality = 25 / 0.30 = 83.3 (clamped à 100).
 * Permet d'expliquer "AXA est citée rarement (30%) mais bien classée quand elle l'est (83/100)".
 */
export function relativeVisibility(visibility: number | null | undefined, citationRate: number | null | undefined): number | null {
  if (visibility === null || visibility === undefined) return null;
  if (citationRate === null || citationRate === undefined || citationRate <= 0) return null;
  const v = Number(visibility);
  const c = Number(citationRate);
  if (!Number.isFinite(v) || !Number.isFinite(c) || c <= 0) return null;
  const q = (v / (c / 100));
  return Math.round(Math.min(100, q) * 10) / 10;
}

/** Convenience: returns user + profile + active sub in one call. Redirects to /login if no user. */
export async function loadSaasContext() {
  const user = await requireSaasUser();
  const sb = getServiceClient();
  const [{ data: profile }, { data: sub }] = await Promise.all([
    sb.from("saas_profiles").select("id, email, full_name, company, stripe_customer_id, email_notifs_enabled, created_at").eq("id", user.id).maybeSingle(),
    sb.from("saas_subscriptions").select("id, user_id, tier, status, stripe_subscription_id, current_period_end, cancel_at_period_end")
      .eq("user_id", user.id).eq("status", "active").maybeSingle(),
  ]);
  const tier = ((sub as SaasSubscription | null)?.tier ?? "free") as SaasTier;
  return {
    user,
    profile: (profile as SaasProfile | null) ?? null,
    subscription: (sub as SaasSubscription | null) ?? null,
    tier,
    limits: TIER_LIMITS[tier],
  };
}
