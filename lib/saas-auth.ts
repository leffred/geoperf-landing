// Helpers for SaaS user pages (/app/*).
// Server-only — import from server components, route handlers, server actions.

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "./supabase-server-auth";
import { getServiceClient } from "./supabase";

// 5 tiers v2 (S7) + legacy 'solo' (gardé en DB par immutabilité ENUM, mais traité comme 'starter')
export type SaasTier = "free" | "starter" | "growth" | "pro" | "agency" | "solo";
export type SaasMemberRole = "owner" | "admin" | "viewer";

export type SaasProfile = {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  stripe_customer_id: string | null;
  email_notifs_enabled: boolean;
  digest_weekly_enabled: boolean;
  welcome_email_sent_at: string | null;
  created_at: string;
};

export type SaasSubStatus = "active" | "trialing" | "past_due" | "canceled" | "incomplete";

export type SaasSubscription = {
  id: string;
  user_id: string;
  tier: SaasTier;
  status: SaasSubStatus;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

export type TierLimits = {
  brands: number;
  prompts_per_brand: number;
  llms: number;
  topics: number;          // 999 = unlimited
  seats: number;           // 999 = unlimited
  cadence: "weekly" | "monthly";
  price_eur: number;
};

// Spec : SPRINT_S7_BRIEF.md "Pricing nouvelle grille"
export const TIER_LIMITS: Record<Exclude<SaasTier, "solo">, TierLimits> = {
  free:    { brands: 1,  prompts_per_brand: 30,  llms: 1, topics: 1,   seats: 1,   cadence: "monthly", price_eur: 0 },
  starter: { brands: 1,  prompts_per_brand: 50,  llms: 4, topics: 3,   seats: 1,   cadence: "weekly",  price_eur: 79 },
  growth:  { brands: 1,  prompts_per_brand: 200, llms: 4, topics: 9,   seats: 5,   cadence: "weekly",  price_eur: 199 },
  pro:     { brands: 3,  prompts_per_brand: 200, llms: 6, topics: 999, seats: 999, cadence: "weekly",  price_eur: 399 },
  agency:  { brands: 10, prompts_per_brand: 300, llms: 6, topics: 999, seats: 999, cadence: "weekly",  price_eur: 799 },
};

// Helper : retourne les limits pour un tier (résout legacy 'solo' → 'starter')
export function tierLimits(tier: SaasTier): TierLimits {
  if (tier === "solo") return TIER_LIMITS.starter;
  return TIER_LIMITS[tier];
}

// Pour affichage UX : nom canonique du tier (legacy solo affiché comme "Starter")
export function tierLabel(tier: SaasTier): string {
  const map: Record<SaasTier, string> = {
    free: "Free", starter: "Starter", growth: "Growth", pro: "Pro", agency: "Agency", solo: "Starter",
  };
  return map[tier];
}

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
    .select("id, email, full_name, company, stripe_customer_id, email_notifs_enabled, digest_weekly_enabled, welcome_email_sent_at, created_at")
    .eq("id", userId)
    .maybeSingle();
  return (data as SaasProfile | null) ?? null;
}

/**
 * loadSaasContext (S7+) — charge user + résout l'account_owner (si membre) + tier effectif.
 *
 * Retourne :
 *   user               : auth user (toujours)
 *   profile            : saas_profile du user lui-même
 *   account_owner_id   : user.id si owner ; sinon l'id de l'owner du compte qu'il a rejoint
 *   role               : owner | admin | viewer
 *   subscription       : la sub active de l'account_owner (donc tier effectif)
 *   tier               : tier effectif (= subscription.tier ?? 'free')
 *   limits             : TIER_LIMITS du tier effectif
 */
export async function loadSaasContext() {
  const user = await requireSaasUser();
  const sb = getServiceClient();

  // 1. Résoudre account_owner_id via v_saas_user_account
  const { data: acctRow } = await sb
    .from("v_saas_user_account")
    .select("user_id, account_owner_id, role, joined_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const accountOwnerId = (acctRow as any)?.account_owner_id ?? user.id;
  const role = ((acctRow as any)?.role ?? "owner") as SaasMemberRole;
  const joinedAt = (acctRow as any)?.joined_at ?? null;
  const isOwner = role === "owner" || accountOwnerId === user.id;

  // 2. Charger profile (du user lui-même, pour affichage email/nom)
  const { data: profileRow } = await sb
    .from("saas_profiles")
    .select("id, email, full_name, company, stripe_customer_id, email_notifs_enabled, digest_weekly_enabled, welcome_email_sent_at, created_at")
    .eq("id", user.id)
    .maybeSingle();

  // 3. Charger sub active de l'account_owner (et profile owner si différent du user)
  const [{ data: subRow }, { data: ownerProfileRow }] = await Promise.all([
    // S16.2 fix : ordre par tier-priority desc + created_at desc + limit(1) pour gérer
    // gracefully le cas transient où l'user a plusieurs subs actives (ex: pendant un upgrade,
    // l'ancienne row n'est pas encore déclassée). Sinon .maybeSingle() retournait null sur
    // multi-row, et le `?? "free"` faisait fallback silencieux → l'user payait Pro mais
    // voyait son interface en Free.
    sb.from("saas_subscriptions")
      .select("id, user_id, tier, status, stripe_subscription_id, current_period_end, cancel_at_period_end")
      .eq("user_id", accountOwnerId)
      .in("status", ["active", "trialing"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    !isOwner
      ? sb.from("saas_profiles").select("id, email, full_name, company").eq("id", accountOwnerId).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const tier = (((subRow as SaasSubscription | null)?.tier ?? "free") as SaasTier);
  const limits = tierLimits(tier);

  return {
    user,
    profile: (profileRow as SaasProfile | null) ?? null,
    account_owner_id: accountOwnerId as string,
    role,
    is_owner: isOwner,
    joined_at: joinedAt,
    owner_profile: (ownerProfileRow as { id: string; email: string; full_name: string | null; company: string | null } | null) ?? null,
    subscription: (subRow as SaasSubscription | null) ?? null,
    tier,
    limits,
  };
}

/**
 * "Performance quand cité" — visibility_score normalisé par citation_rate.
 * Formule : si citation_rate=0 → null. Sinon : visibility_score / (citation_rate / 100), plafonné à 100.
 * Exemple : visibility=25, citation=30% → quality = 83.3.
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
