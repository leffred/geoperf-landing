"use server";

// S22 §4.4 — Server actions admin categories.

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServiceClient } from "@/lib/supabase";
import { getAdminUser } from "@/lib/supabase-server-auth";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,80}$/;

export async function createCategory(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login?next=/admin/saas/categories");

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const nom = String(formData.get("nom") ?? "").trim();
  const parentIdRaw = String(formData.get("parent_id") ?? "").trim();
  const parent_id = parentIdRaw === "" ? null : parentIdRaw;
  const ordreRaw = String(formData.get("ordre") ?? "").trim();
  const ordre = ordreRaw === "" ? 100 : Number(ordreRaw);

  if (!SLUG_RE.test(slug)) {
    redirect("/admin/saas/categories?error=" + encodeURIComponent("slug_invalid (a-z 0-9 - seulement, 2-80 chars)"));
  }
  if (!nom || nom.length < 2) {
    redirect("/admin/saas/categories?error=" + encodeURIComponent("nom_invalid"));
  }

  const sb = getServiceClient();
  const { error } = await sb.from("categories").insert({
    slug, nom, parent_id, ordre, is_active: true,
  });
  if (error) {
    redirect("/admin/saas/categories?error=" + encodeURIComponent(error.message));
  }
  revalidatePath("/admin/saas/categories");
  redirect(`/admin/saas/categories?created=${encodeURIComponent(slug)}`);
}

export async function toggleCategoryActive(id: string, currentlyActive: boolean) {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login?next=/admin/saas/categories");

  const sb = getServiceClient();
  const { error } = await sb
    .from("categories")
    .update({ is_active: !currentlyActive })
    .eq("id", id);
  if (error) {
    redirect("/admin/saas/categories?error=" + encodeURIComponent(error.message));
  }
  revalidatePath("/admin/saas/categories");
  redirect(`/admin/saas/categories?toggled=${encodeURIComponent(id.slice(0, 8))}`);
}

export async function updateCategoryOrder(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login?next=/admin/saas/categories");

  const id = String(formData.get("id") ?? "").trim();
  const ordreRaw = String(formData.get("ordre") ?? "").trim();
  const ordre = Number(ordreRaw);
  if (!id || !Number.isFinite(ordre)) {
    redirect("/admin/saas/categories?error=" + encodeURIComponent("invalid_input"));
  }

  const sb = getServiceClient();
  const { error } = await sb.from("categories").update({ ordre }).eq("id", id);
  if (error) {
    redirect("/admin/saas/categories?error=" + encodeURIComponent(error.message));
  }
  revalidatePath("/admin/saas/categories");
  redirect("/admin/saas/categories?updated=ordre");
}
