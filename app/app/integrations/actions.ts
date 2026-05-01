"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

const TYPE_TIER_GATE: Record<string, ReadonlySet<string>> = {
  slack:          new Set(["growth", "pro", "agency"]),
  discord:        new Set(["growth", "pro", "agency"]),
  teams:          new Set(["pro", "agency"]),
  webhook_custom: new Set(["pro", "agency"]),
};

function validateUrl(url: string, type: string): string | null {
  try {
    const u = new URL(url);
    if (!["http:", "https:"].includes(u.protocol)) return "URL doit utiliser https://";
    // Validation domain pour types connus
    if (type === "slack" && !u.host.includes("slack.com")) return "URL doit pointer vers hooks.slack.com";
    if (type === "teams" && !(u.host.includes("office.com") || u.host.includes("microsoft.com"))) return "URL doit pointer vers Microsoft Teams (office.com / microsoft.com)";
    if (type === "discord" && !u.host.includes("discord.com")) return "URL doit pointer vers discord.com";
    return null;
  } catch {
    return "URL invalide";
  }
}

export async function createIntegration(formData: FormData) {
  const ctx = await loadSaasContext();
  if (!ctx.is_owner) redirect("/app/integrations?error=not_owner");

  const type = String(formData.get("type") || "");
  const name = String(formData.get("name") || "").trim().slice(0, 100);
  const webhook_url = String(formData.get("webhook_url") || "").trim();
  const events = (Array.from(formData.getAll("events")) as string[]).map(e => String(e)).slice(0, 20);

  if (!["slack", "teams", "discord", "webhook_custom"].includes(type)) redirect("/app/integrations?error=bad_type");
  if (!name) redirect("/app/integrations?error=missing_name");

  const allowedTiers = TYPE_TIER_GATE[type] ?? new Set(["pro", "agency"]);
  if (!allowedTiers.has(ctx.tier)) {
    redirect(`/app/integrations?error=tier_too_low&type=${type}`);
  }

  const urlErr = validateUrl(webhook_url, type);
  if (urlErr) redirect(`/app/integrations?error=bad_url&msg=${encodeURIComponent(urlErr)}`);

  const sb = getServiceClient();
  const { error } = await sb.from("saas_integrations").insert({
    user_id: ctx.user.id,
    type,
    name,
    webhook_url,
    events: events.length > 0 ? events : ["rank_drop_high", "competitor_overtake_high", "citation_loss_high"],
    is_active: true,
  });
  if (error) {
    console.error("[createIntegration]", error.message);
    redirect("/app/integrations?error=insert_failed");
  }

  revalidatePath("/app/integrations");
  redirect("/app/integrations?created=1");
}

export async function toggleIntegration(formData: FormData) {
  const ctx = await loadSaasContext();
  if (!ctx.is_owner) redirect("/app/integrations?error=not_owner");
  const id = String(formData.get("id") || "");
  const enable = formData.get("enable") === "true";
  if (!id) redirect("/app/integrations");

  const sb = getServiceClient();
  await sb.from("saas_integrations")
    .update({ is_active: enable, last_error: enable ? null : undefined })
    .eq("id", id)
    .eq("user_id", ctx.user.id);

  revalidatePath("/app/integrations");
  redirect("/app/integrations?updated=1");
}

export async function deleteIntegration(formData: FormData) {
  const ctx = await loadSaasContext();
  if (!ctx.is_owner) redirect("/app/integrations?error=not_owner");
  const id = String(formData.get("id") || "");
  if (!id) redirect("/app/integrations");
  const sb = getServiceClient();
  await sb.from("saas_integrations").delete().eq("id", id).eq("user_id", ctx.user.id);
  revalidatePath("/app/integrations");
  redirect("/app/integrations?deleted=1");
}

/** Test send : POST un payload de test sur le webhook configuré, sans toucher à la DB d'alertes. */
export async function testIntegration(formData: FormData) {
  const ctx = await loadSaasContext();
  if (!ctx.is_owner) redirect("/app/integrations?error=not_owner");
  const id = String(formData.get("id") || "");
  if (!id) redirect("/app/integrations");

  const sb = getServiceClient();
  const { data: integ } = await sb.from("saas_integrations")
    .select("id, type, webhook_url, name")
    .eq("id", id).eq("user_id", ctx.user.id).maybeSingle();
  if (!integ) redirect("/app/integrations?error=not_found");

  const t = (integ as any).type as string;
  const url = (integ as any).webhook_url as string;
  let payload: unknown;

  if (t === "slack") {
    payload = {
      attachments: [{
        color: "#0C447C",
        blocks: [
          { type: "header", text: { type: "plain_text", text: "🧪 Test webhook Geoperf", emoji: true } },
          { type: "section", text: { type: "mrkdwn", text: `Si tu vois ce message, l'intégration *${(integ as any).name}* fonctionne.` } },
          { type: "context", elements: [{ type: "mrkdwn", text: `Envoyé par ${ctx.user.email}` }] },
        ],
      }],
    };
  } else if (t === "teams") {
    payload = {
      "@type": "MessageCard",
      "@context": "https://schema.org/extensions",
      themeColor: "0C447C",
      summary: "Geoperf · Test",
      title: "🧪 Test webhook Geoperf",
      text: `Si tu vois ce message, l'intégration ${(integ as any).name} fonctionne. Envoyé par ${ctx.user.email}.`,
    };
  } else if (t === "discord") {
    payload = {
      username: "Geoperf",
      embeds: [{ title: "🧪 Test webhook Geoperf", description: `Intégration ${(integ as any).name} testée par ${ctx.user.email}`, color: 0x0C447C }],
    };
  } else {
    payload = { type: "geoperf.test", version: 1, message: "Test from /app/integrations", user: ctx.user.email };
  }

  let success = true;
  let errorMsg: string | null = null;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      success = false;
      errorMsg = `HTTP ${resp.status}: ${(await resp.text()).slice(0, 200)}`;
    }
  } catch (e) {
    success = false;
    errorMsg = (e as Error).message.slice(0, 200);
  }

  await sb.from("saas_integrations").update({
    last_sent_at: success ? new Date().toISOString() : undefined,
    last_error: success ? null : errorMsg,
    send_count: success ? undefined : undefined,
  }).eq("id", id);

  revalidatePath("/app/integrations");
  redirect(`/app/integrations?test=${success ? "ok" : "fail"}`);
}
