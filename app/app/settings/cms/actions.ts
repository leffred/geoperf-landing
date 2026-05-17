"use server";

// S34/S35 — Server Actions pour /app/settings/cms.
// - addWordpressCms : INSERT client_cms_config (cms_type=wordpress, api_key_encrypted="user:pass")
// - addShopifyCms   : INSERT client_cms_config (cms_type=shopify, api_key_encrypted=token, extra_config={blog_id})
// - addWebflowCms   : INSERT client_cms_config (cms_type=webflow, api_key_encrypted=token, extra_config={collection_id, site_id?})
// - addWixCms       : INSERT client_cms_config (cms_type=wix,     api_key_encrypted=api_key, extra_config={site_id})
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
    site_url: domain,
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

export async function addWebflowCms(formData: FormData) {
  const apiToken = String(formData.get("api_token") ?? "").trim();
  const collectionId = String(formData.get("collection_id") ?? "").trim();
  const siteId = String(formData.get("site_id") ?? "").trim();

  if (!apiToken) redirect("/app/settings/cms?tab=webflow&error=missing_token");
  if (!collectionId) redirect("/app/settings/cms?tab=webflow&error=missing_collection_id");

  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const extra: Record<string, string> = { collection_id: collectionId };
  if (siteId) extra.site_id = siteId;

  const { error } = await sb.from("client_cms_config").insert({
    client_id: ctx.user.id,
    cms_type: "webflow",
    site_url: siteId ? `https://webflow.com/design/${siteId}` : null,
    api_key_encrypted: apiToken,
    extra_config: extra,
    is_active: true,
  });
  if (error) {
    console.error("[addWebflowCms]", error.message);
    redirect("/app/settings/cms?tab=webflow&error=insert_failed");
  }

  revalidatePath("/app/settings/cms");
  redirect("/app/settings/cms?success=added");
}

export async function addWixCms(formData: FormData) {
  const apiKey = String(formData.get("api_key") ?? "").trim();
  const siteId = String(formData.get("site_id") ?? "").trim();

  if (!apiKey) redirect("/app/settings/cms?tab=wix&error=missing_token");
  if (!siteId) redirect("/app/settings/cms?tab=wix&error=missing_site_id");

  // Validation format site_id : UUID Wix (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(siteId)) redirect("/app/settings/cms?tab=wix&error=invalid_site_id");

  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { error } = await sb.from("client_cms_config").insert({
    client_id: ctx.user.id,
    cms_type: "wix",
    site_url: `https://manage.wix.com/dashboard/${siteId}/blog`,
    api_key_encrypted: apiKey,
    extra_config: { site_id: siteId },
    is_active: true,
  });
  if (error) {
    console.error("[addWixCms]", error.message);
    redirect("/app/settings/cms?tab=wix&error=insert_failed");
  }

  revalidatePath("/app/settings/cms");
  redirect("/app/settings/cms?success=added");
}


export async function addPrestashopCms(formData: FormData) {
  const siteUrl = normalizeUrl(String(formData.get("site_url") ?? ""));
  const apiKey = String(formData.get("api_key") ?? "").trim();
  const languageId = String(formData.get("language_id") ?? "1").trim() || "1";
  const cmsCategoryId = String(formData.get("cms_category_id") ?? "1").trim() || "1";

  if (!siteUrl) redirect("/app/settings/cms?tab=prestashop&error=missing_site_url");
  if (!apiKey) redirect("/app/settings/cms?tab=prestashop&error=missing_token");

  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { error } = await sb.from("client_cms_config").insert({
    client_id: ctx.user.id,
    cms_type: "prestashop",
    site_url: siteUrl,
    api_key_encrypted: apiKey,
    extra_config: { language_id: languageId, cms_category_id: cmsCategoryId },
    is_active: true,
  });
  if (error) {
    console.error("[addPrestashopCms]", error.message);
    redirect("/app/settings/cms?tab=prestashop&error=insert_failed");
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
