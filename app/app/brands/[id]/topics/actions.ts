"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

function slugify(s: string): string {
  return s.trim().toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createTopic(formData: FormData) {
  const ctx = await loadSaasContext();
  const brandId = String(formData.get("brand_id") || "");
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const promptsRaw = String(formData.get("prompts") || "").trim();

  if (!brandId) redirect("/app/brands");
  if (!name) redirect(`/app/brands/${brandId}/topics/new?error=missing_name`);
  if (!ctx.is_owner && ctx.role === "viewer") redirect(`/app/brands/${brandId}/topics?error=forbidden`);

  const sb = getServiceClient();

  // Vérifier la brand appartient bien au compte
  const { data: brand } = await sb.from("saas_tracked_brands").select("id, user_id").eq("id", brandId).maybeSingle();
  if (!brand || (brand as any).user_id !== ctx.account_owner_id) {
    redirect(`/app/brands?error=not_found`);
  }

  // Tier-gating : check nb topics autorisés
  const { count: existingCount } = await sb.from("saas_topics").select("id", { count: "exact", head: true }).eq("brand_id", brandId);
  const limit = ctx.limits.topics;
  if ((existingCount ?? 0) >= limit) {
    redirect(`/app/brands/${brandId}/topics?error=limit_reached`);
  }

  // Parse prompts JSON optionnel
  let prompts: unknown = [];
  if (promptsRaw) {
    try {
      const parsed = JSON.parse(promptsRaw);
      if (!Array.isArray(parsed)) throw new Error("not array");
      prompts = parsed;
    } catch {
      redirect(`/app/brands/${brandId}/topics/new?error=bad_prompts_json`);
    }
  }

  const slug = slugify(name);
  if (!slug) redirect(`/app/brands/${brandId}/topics/new?error=missing_name`);

  const { data, error } = await sb.from("saas_topics").insert({
    brand_id: brandId,
    name,
    slug,
    description: description || null,
    is_default: false,
    prompts,
  }).select("id").single();

  if (error) {
    if (error.message.toLowerCase().includes("duplicate") || error.message.toLowerCase().includes("unique")) {
      redirect(`/app/brands/${brandId}/topics/new?error=duplicate_slug`);
    }
    console.error("[createTopic]", error.message);
    redirect(`/app/brands/${brandId}/topics/new?error=unknown`);
  }

  revalidatePath(`/app/brands/${brandId}`);
  revalidatePath(`/app/brands/${brandId}/topics`);
  redirect(`/app/brands/${brandId}/topics/${data!.id}`);
}

export async function deleteTopic(formData: FormData) {
  const ctx = await loadSaasContext();
  const brandId = String(formData.get("brand_id") || "");
  const topicId = String(formData.get("topic_id") || "");
  if (!brandId || !topicId) redirect(`/app/brands/${brandId}/topics`);

  const sb = getServiceClient();
  const { data: topic } = await sb.from("saas_topics").select("id, is_default, brand_id, saas_tracked_brands!inner(user_id)").eq("id", topicId).maybeSingle();
  // Récupère l'ownership via le brand
  const ownerOk = (topic as any)?.saas_tracked_brands?.user_id === ctx.account_owner_id;
  if (!topic || !ownerOk) redirect(`/app/brands/${brandId}/topics?error=not_found`);
  if ((topic as any).is_default) redirect(`/app/brands/${brandId}/topics?error=cannot_delete_default`);

  await sb.from("saas_topics").delete().eq("id", topicId);
  revalidatePath(`/app/brands/${brandId}/topics`);
  redirect(`/app/brands/${brandId}/topics`);
}
