"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/app/dashboard");

  if (!email || !password) redirect("/login?error=missing");

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // S16.2 fix #1.7 : message clair quand l'email n'est pas encore confirmé
    // (typiquement après signup avant click sur le mail de confirmation).
    const msg = error.message.toLowerCase();
    const errCode = (error as { code?: string }).code?.toLowerCase() ?? "";
    let code: string;
    if (msg.includes("email not confirmed") || msg.includes("email_not_confirmed") || errCode === "email_not_confirmed") {
      code = "email_not_confirmed";
    } else if (msg.includes("invalid")) {
      code = "invalid";
    } else {
      code = "unknown";
    }
    redirect(`/login?error=${code}&email=${encodeURIComponent(email)}`);
  }

  redirect(next);
}

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) redirect("/login?error=missing");

  const supabase = await getSupabaseServerClient();
  const h = await headers();
  const origin = h.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/app/dashboard` },
  });
  if (error) redirect("/login?error=unknown");
  redirect("/login?magic_sent=1");
}

export async function logout() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
