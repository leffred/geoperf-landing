"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loadSaasContext, type SaasMemberRole } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

const ALLOWED_ROLES: SaasMemberRole[] = ["admin", "viewer"];

export async function inviteMember(formData: FormData) {
  const ctx = await loadSaasContext();
  if (!ctx.is_owner) redirect("/app/team?error=not_owner");

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const roleRaw = String(formData.get("role") || "viewer");
  const role = (ALLOWED_ROLES.includes(roleRaw as SaasMemberRole) ? roleRaw : "viewer") as SaasMemberRole;

  if (!email || !email.includes("@")) redirect("/app/team/invite?error=bad_email");

  const sb = getServiceClient();

  // Tier-gating : nb seats max
  const cap = ctx.limits.seats;
  const { count: currentMembers } = await sb
    .from("saas_account_members")
    .select("id", { count: "exact", head: true })
    .eq("account_owner_id", ctx.user.id)
    .not("accepted_at", "is", null);
  const { count: pendingInvites } = await sb
    .from("saas_account_invitations")
    .select("id", { count: "exact", head: true })
    .eq("account_owner_id", ctx.user.id)
    .is("accepted_at", null);
  const used = (currentMembers ?? 0) + (pendingInvites ?? 0) + 1; // +1 = owner lui-même
  if (used >= cap) redirect("/app/team?error=seats_full");

  // Empêche d'inviter soi-même
  if (email === ctx.user.email?.toLowerCase()) redirect("/app/team/invite?error=self_invite");

  // Insert (UNIQUE owner+email → on ignore les doublons)
  const { error } = await sb.from("saas_account_invitations").insert({
    account_owner_id: ctx.user.id,
    invitee_email: email,
    role,
  });
  if (error) {
    if (error.message.toLowerCase().includes("duplicate") || error.message.toLowerCase().includes("unique")) {
      redirect("/app/team/invite?error=already_invited");
    }
    console.error("[inviteMember]", error.message);
    redirect("/app/team/invite?error=unknown");
  }

  revalidatePath("/app/team");
  redirect("/app/team?invited=1");
}

export async function revokeInvitation(formData: FormData) {
  const ctx = await loadSaasContext();
  if (!ctx.is_owner) redirect("/app/team?error=not_owner");
  const invitationId = String(formData.get("invitation_id") || "");
  if (!invitationId) redirect("/app/team");
  const sb = getServiceClient();
  await sb.from("saas_account_invitations").delete().eq("id", invitationId).eq("account_owner_id", ctx.user.id);
  revalidatePath("/app/team");
  redirect("/app/team?revoked=1");
}

export async function removeMember(formData: FormData) {
  const ctx = await loadSaasContext();
  if (!ctx.is_owner) redirect("/app/team?error=not_owner");
  const memberId = String(formData.get("member_id") || "");
  if (!memberId) redirect("/app/team");
  const sb = getServiceClient();
  await sb.from("saas_account_members").delete().eq("id", memberId).eq("account_owner_id", ctx.user.id);
  revalidatePath("/app/team");
  redirect("/app/team?removed=1");
}

export async function leaveAccount() {
  const ctx = await loadSaasContext();
  if (ctx.is_owner) redirect("/app/team?error=cannot_leave_own");
  const sb = getServiceClient();
  await sb.from("saas_account_members")
    .delete()
    .eq("member_user_id", ctx.user.id)
    .eq("account_owner_id", ctx.account_owner_id);
  revalidatePath("/app/team");
  revalidatePath("/app/dashboard");
  redirect("/app/dashboard?left_account=1");
}
