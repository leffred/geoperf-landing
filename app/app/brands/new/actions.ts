"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loadSaasContext, TIER_LIMITS } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

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

export async function createBrand(formData: FormData) {
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const name = String(formData.get("name") || "").trim();
  const domainRaw = String(formData.get("domain") || "").trim();
  const categoryRaw = String(formData.get("category") || "").trim();
  const competitorsRaw = String(formData.get("competitors") || "").trim();
  const cadence = String(formData.get("cadence") || "weekly") === "monthly" ? "monthly" : "weekly";

  if (!name) redirect("/app/brands/new?error=missing_name");
  const domain = normalizeDomain(domainRaw);
  if (!domain || !domain.includes(".")) redirect("/app/brands/new?error=bad_domain");
  if (!categoryRaw) redirect("/app/brands/new?error=missing_category");

  const limits = TIER_LIMITS[ctx.tier];
  if (limits.cadence === "monthly" && cadence === "weekly") {
    redirect("/app/brands/new?error=cadence_locked");
  }

  const { count } = await sb
    .from("saas_tracked_brands")
    .select("id", { count: "exact", head: true })
    .eq("user_id", ctx.user.id);
  if ((count ?? 0) >= limits.brands) {
    redirect("/app/brands/new?error=limit_reached");
  }

  const competitor_domains = competitorsRaw
    .split(/[\s,]+/)
    .map(normalizeDomain)
    .filter(d => d.length > 0 && d.includes("."))
    .slice(0, 10);

  const category_slug = slugify(categoryRaw);

  const { data, error } = await sb
    .from("saas_tracked_brands")
    .insert({
      user_id: ctx.user.id,
      name,
      domain,
      category_slug,
      competitor_domains,
      cadence,
      is_active: true,
    })
    .select("id")
    .single();

  if (error) {
    if (error.message.toLowerCase().includes("duplicate")) {
      redirect("/app/brands/new?error=duplicate");
    }
    redirect(`/app/brands/new?error=unknown`);
  }

  revalidatePath("/app/dashboard");
  revalidatePath("/app/brands");
  redirect(`/app/brands/${data!.id}`);
}
