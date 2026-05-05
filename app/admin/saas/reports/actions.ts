"use server";

// S22 §4.4 — Server actions admin reports.
//   - launchExtraction : POST n8n webhook /webhook/geoperf-extract
//   - regenerateSynthesis : POST n8n webhook /webhook/geoperf-synthesis (relance Phase 1.1)

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase-server-auth";

const N8N_PHASE1_WEBHOOK_URL =
  process.env.N8N_PHASE1_WEBHOOK_URL ||
  "https://fredericlefebvre.app.n8n.cloud/webhook/geoperf-extract";

const N8N_SYNTHESIS_WEBHOOK_URL =
  process.env.N8N_SYNTHESIS_WEBHOOK_URL ||
  "https://fredericlefebvre.app.n8n.cloud/webhook/geoperf-synthesis";

export async function launchExtraction(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login?next=/admin/saas/reports");

  const slug = String(formData.get("category_slug") || "").trim();
  const topN = Math.max(10, Math.min(100, parseInt(String(formData.get("top_n") || "30"), 10) || 30));
  const year = parseInt(String(formData.get("year") || "2026"), 10) || 2026;

  if (!slug) {
    redirect("/admin/saas/reports?error=missing_slug");
  }

  fetch(N8N_PHASE1_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sous_categorie: slug,
      category_slug: slug,
      top_n: topN,
      year,
      owner_email: admin.email,
      source: "admin_manual",
    }),
  }).catch((e) => console.warn("[admin/reports] launchExtraction:", e));

  revalidatePath("/admin/saas/reports");
  redirect(`/admin/saas/reports?launched=${encodeURIComponent(slug)}`);
}

export async function regenerateSynthesis(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login?next=/admin/saas/reports");

  const reportId = String(formData.get("report_id") || "").trim();
  const topN = Math.max(10, Math.min(50, parseInt(String(formData.get("top_n") || "30"), 10) || 30));

  if (!reportId) {
    redirect("/admin/saas/reports?error=missing_report_id");
  }

  fetch(N8N_SYNTHESIS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      report_id: reportId,
      top_n: topN,
      model: "anthropic/claude-haiku-4.5",
      triggered_by: "admin_manual",
    }),
  }).catch((e) => console.warn("[admin/reports] regenerateSynthesis:", e));

  revalidatePath("/admin/saas/reports");
  redirect(`/admin/saas/reports?regen=${encodeURIComponent(reportId.slice(0, 8))}`);
}
