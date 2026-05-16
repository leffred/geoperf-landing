"use server";

// S34 — Server Actions pour /app/settings/cms.
// - addWordpressCms : INSERT client_cms_config (cms_type=wordpress, api_key_encrypted="user:pass")
// - addShopifyCms   : INSERT client_cms_config (cms_type=shopify, api_key_encrypted=token, extra_config={blog_id})
// - deleteCms       : DELETE WHERE id + client_id

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

function normalizeUrl(raw: string): string {
  let v = raw.trim();
  if (!v) return "";
  if (!/^https?:\/\//i.test(v)) v = "https://" + v;
  return v.replace(/\/+$/, "");
}

function normalizeShopifyDomain(raw: string): string {
  return raw.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

export async function addWordpressCms(formData: FormData) {
  const siteUrl = normalizeUrl(String(formData.get("site_url") ?? ""));
  const username = String(formData.get("username") ?? "").trim();
  const appPassword = String(formData.get("app_password") ?? "");

  if (!siteUrl) redirect("/app/settings/cms?error=missing_site_url");
  if (!username) redirect("/app/settings/cms?error=missing_username");
  if (!appPassword.trim()) redirect("/app/settings/cms?error=missing_password");

  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { error } = await sb.from("client_cms_config").insert({
    client_id: ctx.user.id,
    cms_type: "wordpress",
    site_url: siteUrl,
    api_key_encrypted: `${username}:${appPassword}`,
    extra_config: null,
    is_active: true,
  });
  if (error) {
    console.error("[addWordpressCms]", error.message);
    redirect("/app/settings/cms?error=insert_failed");
  }

  revalidatePath("/app/settings/cms");
  redirect("/app/settings/cms?success=added");
}

export async function addShopifyCms(formData: FormData) {
  const domain = normalizeShopifyDomain(String(formData.get("domain") ?? ""));
  const accessToken = String(formData.get("access_token") ?? "").trim();
  const blogId = String(formData.get("blog_id") ?? "").trim();

  if (!domain) redirect("/app/settings/cms?tab=shopify&error=missing_domain");
  if (!accessToken) redirect("/app/settings/cms?tab=shopify&error=missing_token");
  if (!blogId) redirect("/app/settings/cms?tab=shopify&error=missing_blog_id");

  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { error } = await sb.from("client_cms_config").insert({
    client_id: ctx.user.id,
    cms_type: "shopify",
    site_url: domain, // stocké sans https://, normalisé côté edge fn
    api_key_encrypted: accessToken,
    extra_config: { blog_id: blogId },
    is_active: true,
  });
  if (error) {
    console.error("[addShopifyCms]", error.message);
    redirect("/app/settings/cms?tab=shopify&error=insert_failed");
  }

  revalidatePath("/app/settings/cms");
  redirect("/app/settings/cms?success=added");
}

export async function deleteCms(formData: FormData) {
  const id = String(formData.get("cms_id") ?? "").trim();
  if (!id) redirect("/app/settings/cms?error=missing_id");

  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { error } = await sb
    .from("client_cms_config")
    .delete()
    .eq("id", id)
    .eq("client_id", ctx.user.id);
  if (error) {
    console.error("[deleteCms]", error.message);
    redirect("/app/settings/cms?error=delete_failed");
  }

  revalidatePath("/app/settings/cms");
  redirect("/app/settings/cms?success=deleted");
}
