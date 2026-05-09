"use server";

// S31 Session 2 — Server actions admin LinkedIn drafts.
// Admin-only. Toutes les actions revalident /admin/linkedin et redirigent.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function requireAdmin(returnTo: string) {
  const admin = await getAdminUser();
  if (!admin) redirect(`/admin/login?next=${encodeURIComponent(returnTo)}`);
  return admin;
}

function tabRedirect(tab: string, params: Record<string, string>): string {
  const sp = new URLSearchParams({ tab, ...params });
  return `/admin/linkedin?${sp.toString()}`;
}

export async function generateDrafts(formData: FormData) {
  await requireAdmin("/admin/linkedin");
  const reportId = String(formData.get("report_id") || "").trim();
  if (!reportId) {
    redirect(tabRedirect("pending", { error: "missing_report_id" }));
  }

  let response: { ok?: boolean; generated_count?: number; cost_usd?: number; error?: string } = {};
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/saas_generate_linkedin_drafts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ report_id: reportId }),
    });
    response = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const errMsg = response.error ?? `HTTP ${resp.status}`;
      revalidatePath("/admin/linkedin");
      redirect(tabRedirect("pending", { error: encodeURIComponent(errMsg.slice(0, 80)) }));
    }
  } catch (e) {
    revalidatePath("/admin/linkedin");
    redirect(tabRedirect("pending", { error: encodeURIComponent(e instanceof Error ? e.message.slice(0, 80) : "fetch_failed") }));
  }

  revalidatePath("/admin/linkedin");
  redirect(tabRedirect("pending", {
    generated: String(response.generated_count ?? 0),
    cost: String((response.cost_usd ?? 0).toFixed(3)),
  }));
}

export async function regenerateDraft(formData: FormData) {
  await requireAdmin("/admin/linkedin");
  const draftId = String(formData.get("draft_id") || "").trim();
  if (!draftId) redirect(tabRedirect("pending", { error: "missing_draft_id" }));

  const sb = getServiceClient();
  const { data: draft } = await sb
    .from("saas_linkedin_drafts")
    .select("source_lb_id")
    .eq("id", draftId)
    .maybeSingle();
  const reportId = (draft as { source_lb_id?: string } | null)?.source_lb_id;
  if (!reportId) redirect(tabRedirect("pending", { error: "draft_has_no_source_report" }));

  // Discard the current draft and re-trigger full batch generation
  await sb.from("saas_linkedin_drafts").update({ status: "discarded" }).eq("id", draftId);

  const fd = new FormData();
  fd.set("report_id", reportId);
  await generateDrafts(fd);
}

export async function updateDraft(formData: FormData) {
  await requireAdmin("/admin/linkedin");
  const draftId = String(formData.get("draft_id") || "").trim();
  const draftText = String(formData.get("draft_text") || "").trim();
  const hashtagsRaw = String(formData.get("hashtags") || "").trim();
  const personasRaw = String(formData.get("tagged_personas") || "").trim();
  const tab = String(formData.get("tab") || "pending");

  if (!draftId || !draftText || draftText.length < 50) {
    redirect(tabRedirect(tab, { error: "invalid_input" }));
  }

  const hashtags = hashtagsRaw.split(/[\s,]+/).map(h => h.replace(/^#/, "").trim()).filter(Boolean).slice(0, 12);
  const personas = personasRaw.split(/\n|,/).map(p => p.trim()).filter(Boolean).slice(0, 5);

  const sb = getServiceClient();
  const { error } = await sb
    .from("saas_linkedin_drafts")
    .update({
      draft_text: draftText,
      hashtags,
      tagged_personas: personas,
    })
    .eq("id", draftId);

  if (error) {
    redirect(tabRedirect(tab, { error: encodeURIComponent(error.message.slice(0, 80)) }));
  }

  revalidatePath("/admin/linkedin");
  redirect(tabRedirect(tab, { updated: draftId.slice(0, 8) }));
}

export async function scheduleDraft(formData: FormData) {
  await requireAdmin("/admin/linkedin");
  const draftId = String(formData.get("draft_id") || "").trim();
  const scheduleAt = String(formData.get("scheduled_at") || "").trim();
  const tab = String(formData.get("tab") || "pending");

  if (!draftId || !scheduleAt) {
    redirect(tabRedirect(tab, { error: "missing_schedule_fields" }));
  }

  const dt = new Date(scheduleAt);
  if (isNaN(dt.getTime())) {
    redirect(tabRedirect(tab, { error: "invalid_date" }));
  }
  if (dt.getTime() < Date.now() - 60_000) {
    redirect(tabRedirect(tab, { error: "schedule_in_past" }));
  }

  const sb = getServiceClient();
  const { error } = await sb
    .from("saas_linkedin_drafts")
    .update({
      status: "scheduled",
      scheduled_at: dt.toISOString(),
    })
    .eq("id", draftId);

  if (error) {
    redirect(tabRedirect(tab, { error: encodeURIComponent(error.message.slice(0, 80)) }));
  }

  revalidatePath("/admin/linkedin");
  redirect(tabRedirect("scheduled", { scheduled: draftId.slice(0, 8) }));
}

export async function discardDraft(formData: FormData) {
  await requireAdmin("/admin/linkedin");
  const draftId = String(formData.get("draft_id") || "").trim();
  const tab = String(formData.get("tab") || "pending");

  if (!draftId) redirect(tabRedirect(tab, { error: "missing_draft_id" }));

  const sb = getServiceClient();
  await sb.from("saas_linkedin_drafts").update({ status: "discarded" }).eq("id", draftId);

  revalidatePath("/admin/linkedin");
  redirect(tabRedirect(tab, { discarded: draftId.slice(0, 8) }));
}

export async function markPosted(formData: FormData) {
  await requireAdmin("/admin/linkedin");
  const draftId = String(formData.get("draft_id") || "").trim();
  const postedUrl = String(formData.get("posted_url") || "").trim();
  const tab = String(formData.get("tab") || "pending");

  if (!draftId) redirect(tabRedirect(tab, { error: "missing_draft_id" }));

  const sb = getServiceClient();
  const { error } = await sb
    .from("saas_linkedin_drafts")
    .update({
      status: "posted",
      posted_at: new Date().toISOString(),
      posted_url: postedUrl || null,
    })
    .eq("id", draftId);

  if (error) {
    redirect(tabRedirect(tab, { error: encodeURIComponent(error.message.slice(0, 80)) }));
  }

  revalidatePath("/admin/linkedin");
  redirect(tabRedirect("posted", { posted: draftId.slice(0, 8) }));
}
