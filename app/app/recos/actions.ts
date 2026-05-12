"use server";

import { revalidatePath } from "next/cache";
import { requireSaasUser } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

/** Marque TOUTES les recos non lues de l'user comme lues. */
export async function markAllRecosRead() {
  const user = await requireSaasUser();
  const sb = getServiceClient();

  // On passe par les brand_ids de l'user pour ownership
  const { data: brands } = await sb
    .from("saas_tracked_brands")
    .select("id")
    .eq("user_id", user.id);
  const ids = (brands ?? []).map((b: any) => b.id as string);
  if (ids.length === 0) return;

  await sb
    .from("saas_recommendations")
    .update({ is_read: true })
    .in("brand_id", ids)
    .eq("is_read", false);

  revalidatePath("/app/recos");
  revalidatePath("/app/dashboard");
  revalidatePath("/app/brands");
}

/** Marque une reco individuelle comme lue. */
export async function markOneRecoRead(formData: FormData) {
  const user = await requireSaasUser();
  const recoId = String(formData.get("reco_id") || "");
  if (!recoId) return;
  const sb = getServiceClient();

  // Ownership via join
  const { data: reco } = await sb
    .from("saas_recommendations")
    .select("id, brand_id, saas_tracked_brands!inner(user_id)")
    .eq("id", recoId)
    .maybeSingle();

  const brandOwner = (reco as any)?.saas_tracked_brands?.user_id;
  if (!reco || brandOwner !== user.id) return;

  await sb.from("saas_recommendations").update({ is_read: true }).eq("id", recoId);

  revalidatePath("/app/recos");
  revalidatePath("/app/dashboard");
}
