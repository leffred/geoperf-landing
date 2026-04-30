// Accept invitation handler.
// 1. Vérifie le token saas_account_invitations
// 2. Si user pas connecté → redirect /signup?invitation=<token>&email=<...>
// 3. Si user connecté → match invitee_email avec auth.email
//    ↳ insert saas_account_members (owner_id, role, member_user_id=auth.uid, accepted_at=now)
//    ↳ update invitation accepted_at=now

import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) return NextResponse.redirect(new URL("/login?error=invitation_missing", req.url));

  const sb = getServiceClient();
  const { data: invitation } = await sb
    .from("saas_account_invitations")
    .select("id, account_owner_id, invitee_email, role, accepted_at")
    .eq("token", token)
    .maybeSingle();

  if (!invitation) {
    return NextResponse.redirect(new URL("/login?error=invitation_invalid", req.url));
  }
  if ((invitation as any).accepted_at) {
    return NextResponse.redirect(new URL("/app/dashboard?info=invitation_already_accepted", req.url));
  }

  // Si pas authentifié → redirect signup avec email pré-rempli + token en param
  const supabase = await getSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) {
    const params = new URLSearchParams({
      invitation_token: token,
      email: (invitation as any).invitee_email,
    });
    return NextResponse.redirect(new URL(`/signup?${params.toString()}`, req.url));
  }

  // Vérifier que l'email du user matches l'invitation (sécurité)
  if (user.email?.toLowerCase() !== (invitation as any).invitee_email.toLowerCase()) {
    return NextResponse.redirect(new URL("/app/dashboard?error=invitation_email_mismatch", req.url));
  }

  // Vérifier qu'il n'est pas déjà membre
  const { data: existing } = await sb
    .from("saas_account_members")
    .select("id, accepted_at")
    .eq("account_owner_id", (invitation as any).account_owner_id)
    .eq("member_user_id", user.id)
    .maybeSingle();

  if (existing && (existing as any).accepted_at) {
    return NextResponse.redirect(new URL("/app/dashboard?info=already_member", req.url));
  }

  const now = new Date().toISOString();

  if (existing) {
    // Update accepted_at sur la row existante (cas où invitation re-créée)
    await sb.from("saas_account_members").update({ accepted_at: now, role: (invitation as any).role }).eq("id", (existing as any).id);
  } else {
    await sb.from("saas_account_members").insert({
      account_owner_id: (invitation as any).account_owner_id,
      member_user_id: user.id,
      role: (invitation as any).role,
      accepted_at: now,
    });
  }

  await sb.from("saas_account_invitations").update({ accepted_at: now }).eq("id", (invitation as any).id);

  return NextResponse.redirect(new URL("/app/dashboard?welcome_team=1", req.url));
}
