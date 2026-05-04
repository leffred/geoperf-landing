"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSaasUser, loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export async function updateProfile(formData: FormData) {
  const user = await requireSaasUser();
  const fullName = String(formData.get("full_name") || "").trim();
  const company = String(formData.get("company") || "").trim();
  // Checkbox HTML : la valeur n'est envoyée que si cochée → "on" si activée, undefined sinon
  const emailNotifsEnabled = formData.get("email_notifs_enabled") === "on";
  const digestWeeklyEnabled = formData.get("digest_weekly_enabled") === "on";

  const sb = getServiceClient();
  const { error } = await sb
    .from("saas_profiles")
    .update({
      full_name: fullName || null,
      company: company || null,
      email_notifs_enabled: emailNotifsEnabled,
      digest_weekly_enabled: digestWeeklyEnabled,
    })
    .eq("id", user.id);

  if (error) {
    console.error("[updateProfile]", error.message);
    redirect("/app/settings?error=update_failed");
  }
  revalidatePath("/app/settings");
  revalidatePath("/app/dashboard");
  redirect("/app/settings?saved=1");
}

/** Insère une fausse alerte sur le dernier snapshot de l'user. Le trigger DB
 *  saas_alert_email_dispatch fire automatiquement saas_send_alert_email via pg_net.
 *  Permet de tester la deliverability sans attendre un vrai snapshot. */
export async function sendTestEmail() {
  const ctx = await loadSaasContext();
  if (ctx.tier === "free") redirect("/app/settings?error=test_free_tier");
  if (ctx.profile?.email_notifs_enabled === false) redirect("/app/settings?error=test_opt_out");

  const sb = getServiceClient();

  const { data: brand } = await sb
    .from("saas_tracked_brands")
    .select("id")
    .eq("user_id", ctx.user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!brand) redirect("/app/settings?error=test_no_brand");

  const { data: snap } = await sb
    .from("saas_brand_snapshots")
    .select("id")
    .eq("brand_id", brand.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!snap) redirect("/app/settings?error=test_no_snapshot");

  // Tente plusieurs alert_type en cas de doublon (uq_saas_alerts_snapshot_type)
  const candidates: Array<"citation_gain" | "rank_gain" | "new_source"> = ["citation_gain", "rank_gain", "new_source"];
  let inserted = false;
  let lastError: string | null = null;
  for (const alert_type of candidates) {
    const { error } = await sb.from("saas_alerts").insert({
      brand_id: brand.id,
      user_id: ctx.user.id,
      snapshot_id: snap.id,
      alert_type,
      severity: "low",
      title: "Email de test — déclenché manuellement",
      body: "Ceci est un email de test envoyé depuis vos réglages Geoperf. Si vous le recevez, vos notifications email fonctionnent correctement. Aucune action n'est requise.",
      metadata: { test: true, sent_from: "settings_test_button", trigger_at: new Date().toISOString() },
    });
    if (!error) { inserted = true; break; }
    lastError = error.message;
    if (!error.message.toLowerCase().includes("duplicate") && !error.message.toLowerCase().includes("unique")) break;
  }

  if (!inserted) {
    console.error("[sendTestEmail]", lastError);
    redirect("/app/settings?error=test_insert_failed");
  }

  revalidatePath("/app/alerts");
  revalidatePath("/app/settings");
  redirect("/app/settings?test_sent=1");
}
