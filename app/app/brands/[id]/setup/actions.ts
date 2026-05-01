"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

function splitList(raw: string, max: number): string[] {
  return raw
    .split(/[\n,;]/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.length <= 120)
    .slice(0, max);
}

export async function updateBrandSetup(formData: FormData) {
  const ctx = await loadSaasContext();
  const brandId = String(formData.get("brand_id") || "");
  const description = String(formData.get("brand_description") || "").trim().slice(0, 1000);
  const keywords = splitList(String(formData.get("brand_keywords") || ""), 20);
  const valueProps = splitList(String(formData.get("brand_value_props") || ""), 10);

  if (!brandId) redirect("/app/brands");
  if (!ctx.is_owner && ctx.role === "viewer") redirect(`/app/brands/${brandId}/setup?error=forbidden`);

  const sb = getServiceClient();
  const { data: brand } = await sb.from("saas_tracked_brands").select("id, user_id").eq("id", brandId).maybeSingle();
  if (!brand || (brand as any).user_id !== ctx.account_owner_id) redirect("/app/brands?error=not_found");

  const { error } = await sb.from("saas_tracked_brands").update({
    brand_description: description || null,
    brand_keywords: keywords,
    brand_value_props: valueProps,
  }).eq("id", brandId);

  if (error) {
    console.error("[updateBrandSetup]", error.message);
    redirect(`/app/brands/${brandId}/setup?error=update_failed`);
  }

  revalidatePath(`/app/brands/${brandId}`);
  revalidatePath(`/app/brands/${brandId}/setup`);
  revalidatePath(`/app/brands/${brandId}/alignment`);
  redirect(`/app/brands/${brandId}/setup?saved=1`);
}
