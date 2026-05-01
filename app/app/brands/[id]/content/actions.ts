"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ALLOWED_DRAFT_TYPES = new Set(["blog_post", "press_release", "linkedin_post", "tweet"]);
const ALLOWED_TIERS = new Set(["pro", "agency"]);

export async function generateDraft(formData: FormData) {
  const ctx = await loadSaasContext();
  const brandId = String(formData.get("brand_id") || "");
  const draftType = String(formData.get("draft_type") || "");
  const focusTopicId = String(formData.get("focus_topic_id") || "") || null;

  if (!brandId) redirect("/app/brands");
  if (!ALLOWED_DRAFT_TYPES.has(draftType)) redirect(`/app/brands/${brandId}/content?error=bad_type`);
  if (!ALLOWED_TIERS.has(ctx.tier)) redirect(`/app/brands/${brandId}/content?error=tier_too_low`);

  // Edge Function attend le user JWT
  const supabase = await getSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const resp = await fetch(`${SUPABASE_URL}/functions/v1/saas_generate_content_draft`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ brand_id: brandId, draft_type: draftType, focus_topic_id: focusTopicId }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.error("[generateDraft]", resp.status, text);
    let errCode: string;
    try {
      const j = JSON.parse(text);
      errCode = j?.error === "tier_too_low" ? "tier_too_low" : j?.error === "quota_exceeded" ? "quota_exceeded" : "generation_failed";
    } catch {
      errCode = "generation_failed";
    }
    redirect(`/app/brands/${brandId}/content?error=${errCode}`);
  }

  revalidatePath(`/app/brands/${brandId}/content`);
  redirect(`/app/brands/${brandId}/content?generated=1`);
}

export async function updateDraftStatus(formData: FormData) {
  const ctx = await loadSaasContext();
  const draftId = String(formData.get("draft_id") || "");
  const brandId = String(formData.get("brand_id") || "");
  const status = String(formData.get("status") || "");
  if (!draftId || !brandId) redirect("/app/brands");
  if (!["draft", "approved", "published", "archived"].includes(status)) redirect(`/app/brands/${brandId}/content?error=bad_status`);

  const sb = getServiceClient();
  await sb.from("saas_content_drafts")
    .update({ status })
    .eq("id", draftId)
    .eq("user_id", ctx.account_owner_id);

  revalidatePath(`/app/brands/${brandId}/content`);
  redirect(`/app/brands/${brandId}/content?updated=1`);
}

export async function updateDraftBody(formData: FormData) {
  const ctx = await loadSaasContext();
  const draftId = String(formData.get("draft_id") || "");
  const brandId = String(formData.get("brand_id") || "");
  const title = String(formData.get("title") || "").trim().slice(0, 200);
  const body = String(formData.get("body") || "").trim().slice(0, 10000);
  if (!draftId || !brandId) redirect("/app/brands");

  const sb = getServiceClient();
  await sb.from("saas_content_drafts")
    .update({ title, body })
    .eq("id", draftId)
    .eq("user_id", ctx.account_owner_id);

  revalidatePath(`/app/brands/${brandId}/content`);
  redirect(`/app/brands/${brandId}/content?updated=1`);
}
