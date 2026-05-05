"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServiceClient } from "@/lib/supabase";
import { getAdminUser } from "@/lib/supabase-server-auth";

const TIERS = new Set(["starter", "growth", "pro", "agency"]);

export async function createCoupon(formData: FormData) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    redirect("/admin/login?next=/admin/saas/coupons");
  }

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const tier_target = String(formData.get("tier_target") ?? "").trim().toLowerCase();
  const trial_days = Number(formData.get("trial_days") ?? "14");
  const max_uses_raw = String(formData.get("max_uses") ?? "").trim();
  const max_uses = max_uses_raw === "" ? null : Number(max_uses_raw);
  const expires_at_raw = String(formData.get("expires_at") ?? "").trim();
  const expires_at = expires_at_raw === "" ? null : new Date(expires_at_raw).toISOString();
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!/^[A-Z0-9_-]{3,40}$/.test(code)) {
    redirect("/admin/saas/coupons?error=" + encodeURIComponent("code_invalid (3-40 chars A-Z0-9_-)"));
  }
  if (!TIERS.has(tier_target)) {
    redirect("/admin/saas/coupons?error=" + encodeURIComponent("tier_target_invalid"));
  }
  if (!Number.isFinite(trial_days) || trial_days < 0 || trial_days > 365) {
    redirect("/admin/saas/coupons?error=" + encodeURIComponent("trial_days_invalid"));
  }
  if (max_uses !== null && (!Number.isFinite(max_uses) || max_uses < 1)) {
    redirect("/admin/saas/coupons?error=" + encodeURIComponent("max_uses_invalid"));
  }

  const sb = getServiceClient();
  const { error } = await sb.from("saas_coupons").insert({
    code, tier_target, trial_days, max_uses, expires_at, notes,
    is_active: true,
    created_by: adminUser!.id,
  });
  if (error) {
    redirect("/admin/saas/coupons?error=" + encodeURIComponent(error.message));
  }
  revalidatePath("/admin/saas/coupons");
  redirect(`/admin/saas/coupons?created=${encodeURIComponent(code)}`);
}

export async function toggleCouponActive(code: string, currentlyActive: boolean) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    redirect("/admin/login?next=/admin/saas/coupons");
  }
  const sb = getServiceClient();
  const { error } = await sb
    .from("saas_coupons")
    .update({ is_active: !currentlyActive })
    .eq("code", code);
  if (error) {
    redirect("/admin/saas/coupons?error=" + encodeURIComponent(error.message));
  }
  revalidatePath("/admin/saas/coupons");
  redirect(`/admin/saas/coupons?toggled=${encodeURIComponent(code)}`);
}
