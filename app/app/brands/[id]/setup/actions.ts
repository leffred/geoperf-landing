"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loadSaasContext, tierLimits } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

function splitList(raw: string, max: number): string[] {
  return raw
    .split(/[\n,;]/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.length <= 120)
    .slice(0, max);
}

function normalizeDomain(input: string): string {
  return input.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

function slugify(input: string): string {
  return input.trim().toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function updateBrandSetup(formData: FormData) {
  const ctx = await loadSaasContext();
  const brandId = String(formData.get("brand_id") || "");

  const description = String(formData.get("brand_description") || "").trim().slice(0, 1000);
  const keywords = splitList(String(formData.get("brand_keywords") || ""), 20);
  const valueProps = splitList(String(formData.get("brand_value_props") || ""), 10);

  // Champs généraux
  const categoryRaw = String(formData.get("category") || "").trim();
  const competitorsRaw = String(formData.get("competitors") || "").trim();
  const cadenceRaw = String(formData.get("cadence") || "").trim();

  if (!brandId) redirect("/app/brands");
  if (!ctx.is_owner && ctx.role === "viewer") redirect(`/app/brands/${brandId}/setup?error=forbidden`);

  const sb = getServiceClient();
  const { data: brand } = await sb
    .from("saas_tracked_brands")
    .select("id, user_id")
    .eq("id", brandId)
    .maybeSingle();
  if (!brand || (brand as any).user_id !== ctx.account_owner_id) redirect("/app/brands?error=not_found");

  // Cadence : respecter les limites du tier
  const limits = tierLimits(ctx.tier);
  const cadence: "weekly" | "monthly" = cadenceRaw === "weekly" && limits.cadence !== "monthly"
    ? "weekly"
    : "monthly";

  const competitor_domains = competitorsRaw
    .split(/[\s,]+/)
    .map(normalizeDomain)
    .filter(d => d.length > 0 && d.includes("."))
    .slice(0, 10);

  // Lookup slug réel en DB (ex: "Agriculture" → "farming"). Fallback slugify si libre.
  let category_slug: string | undefined;
  if (categoryRaw) {
    const { data: catMatch } = await sb.from("categories").select("slug").eq("nom", categoryRaw).maybeSingle();
    category_slug = (catMatch as any)?.slug ?? slugify(categoryRaw);
  }

  const patch: Record<string, unknown> = {
    brand_description: description || null,
    brand_keywords: keywords,
    brand_value_props: valueProps,
    cadence,
    competitor_domains,
  };
  if (category_slug) patch.category_slug = category_slug;

  const { error } = await sb.from("saas_tracked_brands").update(patch).eq("id", brandId);

  if (error) {
    console.error("[updateBrandSetup]", error.message);
    redirect(`/app/brands/${brandId}/setup?error=update_failed`);
  }

  revalidatePath(`/app/brands/${brandId}`);
  revalidatePath(`/app/brands/${brandId}/setup`);
  revalidatePath(`/app/brands/${brandId}/alignment`);
  redirect(`/app/brands/${brandId}/setup?saved=1`);
}
