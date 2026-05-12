"use server";

// Dashboard-level server actions.
// runAllSnapshots : lance un snapshot pour chaque marque éligible (tier cooldown).
// Cooldown par tier :  free = 28 j · starter = 7 j · pro = 1 j

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loadSaasContext } from "@/lib/saas-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Cooldown dashboard "run all" par tier (en secondes).
// free = 28j · starter = 7j · pro = 1h (le bouton par-marque reste à 60s)
const COOLDOWN_SEC: Record<string, number> = {
  free: 28 * 86400,
  starter: 7 * 86400,
  pro: 3600,
};

export async function runAllSnapshots() {
  const ctx = await loadSaasContext();
  const sb = getServiceClient();
  const tier = ctx.tier ?? "free";
  const cooldownSec = COOLDOWN_SEC[tier] ?? COOLDOWN_SEC.free;
  const cooldownThreshold = new Date(Date.now() - cooldownSec * 1000).toISOString();

  // 1. Toutes les marques actives de l'user
  const { data: brands } = await sb
    .from("saas_tracked_brands")
    .select("id")
    .eq("user_id", ctx.account_owner_id)
    .eq("is_active", true);

  if (!brands || brands.length === 0) {
    redirect("/app/dashboard?snapshot=none");
  }
  const brandIds = brands.map((b) => b.id);

  // 2. Marques déjà en vol (queued/running) → skip
  const { data: inFlightRows } = await sb
    .from("saas_brand_snapshots")
    .select("brand_id")
    .in("brand_id", brandIds)
    .in("status", ["queued", "running"]);
  const inFlightIds = new Set((inFlightRows ?? []).map((r) => r.brand_id));

  // 3. Marques récemment complétées (dans le cooldown) → skip
  const { data: recentRows } = await sb
    .from("saas_brand_snapshots")
    .select("brand_id")
    .in("brand_id", brandIds)
    .eq("status", "completed")
    .gte("completed_at", cooldownThreshold);
  const recentIds = new Set((recentRows ?? []).map((r) => r.brand_id));

  // 4. Marques éligibles = ni en vol, ni récentes
  const eligible = brandIds.filter((id) => !inFlightIds.has(id) && !recentIds.has(id));

  if (eligible.length === 0) {
    redirect("/app/dashboard?snapshot=cooldown");
  }

  // 5. Trigger edge function pour chaque marque éligible
  const supabase = await getSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  let triggered = 0;
  for (const brandId of eligible) {
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/saas_run_brand_snapshot`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brand_id: brandId, mode: "manual" }),
      });
      if (resp.ok) triggered++;
    } catch (e) {
      console.error("[runAllSnapshots] edge fn error", brandId, e);
    }
  }

  revalidatePath("/app/dashboard");
  redirect(`/app/dashboard?snapshot=queued&count=${triggered}`);
}
