"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";
import { requireSaasUser } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/** Trigger a fresh snapshot for the brand. Calls the saas_run_brand_snapshot Edge Function.
 *  Rate-limit safety :
 *   - Skip si un snapshot 'running' ou 'queued' existe déjà pour cette marque (anti-spam clic)
 *   - Skip si le dernier snapshot completed a moins de 60 sec (cooldown) */
const REFRESH_COOLDOWN_SEC = 60;

export async function refreshBrand(formData: FormData) {
  const user = await requireSaasUser();
  const brandId = String(formData.get("brand_id") || "");
  if (!brandId) redirect("/app/brands");

  const sb = getServiceClient();
  const { data: brand } = await sb
    .from("saas_tracked_brands")
    .select("id, user_id")
    .eq("id", brandId)
    .maybeSingle();
  if (!brand || brand.user_id !== user.id) {
    redirect("/app/brands?error=not_found");
  }

  // Anti-spam : pas de double run si un snapshot est déjà en vol
  const { data: inFlight } = await sb
    .from("saas_brand_snapshots")
    .select("id, status, created_at")
    .eq("brand_id", brandId)
    .in("status", ["queued", "running"])
    .limit(1)
    .maybeSingle();
  if (inFlight) {
    redirect(`/app/brands/${brandId}?info=already_running`);
  }

  // Cooldown : pas de re-run dans les 60 sec qui suivent un snapshot completed
  const cooldownThreshold = new Date(Date.now() - REFRESH_COOLDOWN_SEC * 1000).toISOString();
  const { data: recent } = await sb
    .from("saas_brand_snapshots")
    .select("id, completed_at")
    .eq("brand_id", brandId)
    .eq("status", "completed")
    .gte("completed_at", cooldownThreshold)
    .limit(1)
    .maybeSingle();
  if (recent) {
    redirect(`/app/brands/${brandId}?info=cooldown`);
  }

  // Call the edge function with the user's JWT (anon role suffit pour passer verify_jwt)
  const supabase = await getSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const resp = await fetch(`${SUPABASE_URL}/functions/v1/saas_run_brand_snapshot`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ brand_id: brandId, mode: "manual" }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.error("[refreshBrand]", resp.status, text);
    redirect(`/app/brands/${brandId}?error=refresh_failed`);
  }

  revalidatePath(`/app/brands/${brandId}`);
  revalidatePath("/app/dashboard");
  redirect(`/app/brands/${brandId}?refreshed=1`);
}

export async function toggleBrandActive(formData: FormData) {
  const user = await requireSaasUser();
  const brandId = String(formData.get("brand_id") || "");
  const next = formData.get("is_active") === "true";

  const sb = getServiceClient();
  await sb
    .from("saas_tracked_brands")
    .update({ is_active: next })
    .eq("id", brandId)
    .eq("user_id", user.id);

  revalidatePath(`/app/brands/${brandId}`);
  redirect(`/app/brands/${brandId}`);
}

export async function deleteBrand(formData: FormData) {
  const user = await requireSaasUser();
  const brandId = String(formData.get("brand_id") || "");
  const confirm = String(formData.get("confirm") || "");
  if (confirm !== "DELETE") redirect(`/app/brands/${brandId}?error=confirm_required`);

  const sb = getServiceClient();
  await sb
    .from("saas_tracked_brands")
    .delete()
    .eq("id", brandId)
    .eq("user_id", user.id);

  revalidatePath("/app/brands");
  revalidatePath("/app/dashboard");
  redirect("/app/brands");
}

export async function markRecosRead(formData: FormData) {
  const user = await requireSaasUser();
  const snapshotId = String(formData.get("snapshot_id") || "");
  if (!snapshotId) return { ok: false, error: "missing_snapshot_id" };

  const sb = getServiceClient();

  // Sécurité : vérifier que le snapshot appartient bien à l'user avant l'UPDATE
  // (en service_role on bypass RLS, donc ce check explicite est obligatoire)
  const { data: snap } = await sb
    .from("saas_brand_snapshots")
    .select("id, user_id")
    .eq("id", snapshotId)
    .maybeSingle();
  if (!snap || snap.user_id !== user.id) {
    return { ok: false, error: "not_found_or_forbidden" };
  }

  await sb
    .from("saas_recommendations")
    .update({ is_read: true })
    .eq("snapshot_id", snapshotId);

  revalidatePath(`/app/brands`);
  return { ok: true };
}

export async function markAlertsRead(formData: FormData) {
  const user = await requireSaasUser();
  const brandId = String(formData.get("brand_id") || "");
  const sb = getServiceClient();
  await sb.from("saas_alerts").update({ is_read: true }).eq("brand_id", brandId).eq("user_id", user.id);
  revalidatePath(`/app/brands/${brandId}`);
  revalidatePath("/app/dashboard");
}
