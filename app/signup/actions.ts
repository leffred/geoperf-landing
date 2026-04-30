"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";

export async function signup(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  const company = String(formData.get("company") || "").trim();

  if (!email || !password) redirect("/signup?error=missing");
  if (password.length < 8) redirect("/signup?error=password_too_short");

  const supabase = await getSupabaseServerClient();
  const h = await headers();
  const origin = h.get("origin") || h.get("referer")?.replace(/\/[^/]*$/, "") || process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/app/dashboard`,
      data: { full_name: fullName || null, company: company || null },
    },
  });

  if (error) {
    const code = error.message.toLowerCase().includes("already") ? "exists" : "unknown";
    redirect(`/signup?error=${code}`);
  }

  // Si la session est créée tout de suite (email confirmation off), redirect vers dashboard.
  // Sinon (email confirmation requise), rediriger vers une page d'attente.
  if (data.session) {
    redirect("/app/dashboard");
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
