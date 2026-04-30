"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export async function startCheckout(formData: FormData) {
  const tier = String(formData.get("tier") || "");
  if (!["solo", "pro", "agency"].includes(tier)) redirect("/app/billing?error=bad_tier");

  const supabase = await getSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const resp = await fetch(`${SUPABASE_URL}/functions/v1/saas_create_checkout_session`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ tier }),
  });

  if (!resp.ok) {
    console.error("[startCheckout]", resp.status, await resp.text());
    redirect("/app/billing?error=checkout_failed");
  }
  const json = await resp.json();
  if (!json.checkout_url) redirect("/app/billing?error=checkout_no_url");
  redirect(json.checkout_url);
}

export async function openCustomerPortal() {
  const supabase = await getSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const resp = await fetch(`${SUPABASE_URL}/functions/v1/saas_create_portal_session`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
  });

  if (!resp.ok) {
    console.error("[openCustomerPortal]", resp.status, await resp.text());
    redirect("/app/billing?error=portal_failed");
  }
  const json = await resp.json();
  if (!json.portal_url) redirect("/app/billing?error=portal_no_url");
  redirect(json.portal_url);
}
