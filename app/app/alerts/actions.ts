"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSaasUser } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export async function markAllAlertsRead() {
  const user = await requireSaasUser();
  const sb = getServiceClient();
  await sb.from("saas_alerts").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
  revalidatePath("/app/alerts");
  revalidatePath("/app/dashboard");
  redirect("/app/alerts");
}

export async function markOneAlertRead(formData: FormData) {
  const user = await requireSaasUser();
  const alertId = String(formData.get("alert_id") || "");
  if (!alertId) return;
  const sb = getServiceClient();
  await sb.from("saas_alerts").update({ is_read: true }).eq("id", alertId).eq("user_id", user.id);
  revalidatePath("/app/alerts");
  revalidatePath("/app/dashboard");
}
