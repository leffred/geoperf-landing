"use server";

// S35 — Server Action createContentCheckout : appelle l'Edge Function saas_content_checkout
// avec le JWT user et redirige vers la Stripe Checkout URL retournée.

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const ALLOWED_TIERS = new Set(["starter", "pro", "agency"]);

export async function createContentCheckout(formData: FormData) {
  const tier = String(formData.get("tier") ?? "").trim();
  if (!ALLOWED_TIERS.has(tier)) redirect("/app/content/upgrade?error=invalid_tier");

  const ssr = await getSupabaseServerClient();
  const { data: { session } } = await ssr.auth.getSession();
  if (!session) redirect("/login?next=/app/content/upgrade");

  let checkoutUrl: string | null = null;
  let errSlug: string | null = null;
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/saas_content_checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ tier }),
      signal: AbortSignal.timeout(15_000),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      errSlug = typeof data.error === "string" ? data.error : "checkout_failed";
      console.error("[createContentCheckout] edge fn HTTP", resp.status, JSON.stringify(data).slice(0, 200));
    } else {
      checkoutUrl = typeof data.checkout_url === "string" ? data.checkout_url : null;
    }
  } catch (e) {
    console.error("[createContentCheckout] unreachable:", e instanceof Error ? e.message : String(e));
    errSlug = "checkout_unreachable";
  }

  if (errSlug) redirect(`/app/content/upgrade?error=${encodeURIComponent(errSlug)}`);
  if (!checkoutUrl) redirect("/app/content/upgrade?error=no_url");
  redirect(checkoutUrl);
}
