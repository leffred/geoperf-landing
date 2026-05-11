"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";
import { utmMetadataForSupabase } from "@/lib/utm";

export async function signup(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  const company = String(formData.get("company") || "").trim();
  // S7 : query params propagated as hidden fields
  const source = String(formData.get("source") || "").trim();          // ex: "etude"
  const category = String(formData.get("category") || "").trim();      // ex: "asset-management"
  const invitationToken = String(formData.get("invitation_token") || "").trim();
  const couponCode = String(formData.get("coupon_code") || "").trim().toUpperCase() || null;

  if (!email || !password) redirect("/signup?error=missing");
  if (password.length < 8) redirect("/signup?error=password_too_short");

  const supabase = await getSupabaseServerClient();
  const h = await headers();
  const origin = h.get("origin") || h.get("referer")?.replace(/\/[^/]*$/, "") || process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com";

  // Si invitation : redirect post-signup vers /auth/accept?token=... (qui lie au compte owner)
  // Sinon : redirect vers /app/dashboard
  // S20 §4.1 : si coupon present, redirect post-signup vers /app/billing?coupon=...
  // pour activer le trial Starter (au lieu de /app/dashboard).
  const nextPath = invitationToken
    ? `/auth/accept?token=${encodeURIComponent(invitationToken)}`
    : couponCode
    ? `/app/billing?coupon=${encodeURIComponent(couponCode)}&prefill_tier=starter`
    : `/app/dashboard${source === "etude" ? `?welcome_etude=1${category ? `&category=${encodeURIComponent(category)}` : ""}` : ""}`;

  // S32 : récupère les UTM first-touch depuis cookie pour attribution paid ads
  const utmMeta = await utmMetadataForSupabase();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      data: {
        full_name: fullName || null,
        company: company || null,
        // Métadonnées de signup pour le welcome email + lookup ultérieur (S7)
        source: source || null,
        category: category || null,
        invitation_token: invitationToken || null,
        coupon_code: couponCode || null,
        // S32 UTM first-touch attribution
        ...utmMeta,
      },
    },
  });

  if (error) {
    const code = error.message.toLowerCase().includes("already") ? "exists" : "unknown";
    redirect(`/signup?error=${code}`);
  }

  // Si session immédiate (email confirmation off), redirect direct vers nextPath.
  if (data.session) {
    redirect(nextPath);
  }
  redirect("/signup?check_email=1");
}

export async function magicLink(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) redirect("/login?error=missing");

  const supabase = await getSupabaseServerClient();
  const h = await headers();
  const origin = h.get("origin") || h.get("referer")?.replace(/\/[^/]*$/, "") || process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/app/dashboard` },
  });
  if (error) redirect("/login?error=unknown");
  redirect("/login?magic_sent=1");
}
