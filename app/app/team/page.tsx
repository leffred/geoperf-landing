import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { loadSaasContext, tierLabel } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { revokeInvitation, removeMember, leaveAccount } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Équipe — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  not_owner: "Action réservée au propriétaire du compte.",
  seats_full: "Tu as atteint le nombre maximum de seats pour ton plan. Upgrade pour inviter plus de membres.",
  cannot_leave_own: "Tu es propriétaire — tu ne peux pas quitter ton propre compte.",
};

type Props = { searchParams: Promise<{ error?: string; invited?: string; revoked?: string; removed?: string }> };

const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com";

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function TeamPage({ searchParams }: Props) {
  const { error, invited, revoked, removed } = await searchParams;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();
  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;

  // Charge members + invitations de l'owner
  const ownerId = ctx.account_owner_id;
  const [{ data: members }, { data: invitations }] = await Promise.all([
    sb.from("saas_account_members")
      .select("id, member_user_id, role, invited_at, accepted_at, saas_profiles!saas_account_members_member_user_id_fkey(email, full_name)")
      .eq("account_owner_id", ownerId),
    ctx.is_owner
      ? sb.from("saas_account_invitations")
          .select("id, invitee_email, role, token, created_at, accepted_at")
          .eq("account_owner_id", ownerId)
          .is("accepted_at", null)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: null }),
  ]);

  const memberList = (members as any[] | null) ?? [];
  const acceptedMembers = memberList.filter(m => m.accepted_at);
  const pendingInvitations = (invitations as any[] | null) ?? [];

  const seatsCap = ctx.limits.seats;
  const usedSeats = 1 /* owner */ + acceptedMembers.length + pendingInvitations.length;
  const canInvite = ctx.is_owner && usedSeats < seatsCap;

  return (
    <Section py="md" tone="cream">
      <div className="mb-4">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase">Équipe</p>
        <h1 className="font-serif text-3xl text-navy">Membres du compte</h1>
        <p className="text-sm text-ink-muted">
          {usedSeats} / {seatsCap === 999 ? "∞" : seatsCap} seats utilisés sur ton plan {tierLabel(ctx.tier)}
          {!ctx.is_owner && <span> · Tu es membre du compte de <strong>{ctx.owner_profile?.email ?? "?"}</strong></span>}
        </p>
      </div>

      {invited === "1" && <div className="mb-4 px-4 py-3 bg-amber/20 border-l-2 border-amber text-sm text-navy">Invitation créée. L&apos;email de l&apos;invité sera contacté (via email transactionnel à brancher S7+).</div>}
      {revoked === "1" && <div className="mb-4 px-4 py-3 bg-cream border-l-2 border-navy/20 text-sm text-ink-muted">Invitation révoquée.</div>}
      {removed === "1" && <div className="mb-4 px-4 py-3 bg-cream border-l-2 border-navy/20 text-sm text-ink-muted">Membre retiré.</div>}
      {errorMsg && <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">{errorMsg}</div>}

      {ctx.is_owner && (
        <div className="mb-6 flex flex-wrap gap-3">
          {canInvite ? (
            <Link href="/app/team/invite" className="bg-amber text-navy px-4 py-2 text-sm font-medium hover:bg-amber/90 transition">+ Inviter un membre</Link>
          ) : (
            <Link href="/app/billing" className="bg-navy text-white px-4 py-2 text-sm font-medium hover:bg-navy-light transition">Upgrade pour plus de seats</Link>
          )}
        </div>
      )}

      <div className="bg-white p-5 mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Membres ({acceptedMembers.length + 1})</p>
        <ul className="divide-y divide-navy/5">
          <li className="py-3 flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <p className="font-medium text-navy">{ctx.profile?.full_name || ctx.user.email}</p>
              <p className="font-mono text-xs text-ink-muted">{ctx.user.email}</p>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 bg-amber text-navy uppercase tracking-widest">Owner</span>
          </li>
          {acceptedMembers.map(m => (
            <li key={m.id} className="py-3 flex items-baseline justify-between flex-wrap gap-2">
              <div>
                <p className="font-medium text-navy">{m.saas_profiles?.full_name || m.saas_profiles?.email}</p>
                <p className="font-mono text-xs text-ink-muted">{m.saas_profiles?.email} · accepté {fmtDate(m.accepted_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-2 py-0.5 bg-navy/10 text-navy uppercase tracking-widest">{m.role}</span>
                {ctx.is_owner && (
                  <form action={removeMember}>
                    <input type="hidden" name="member_id" value={m.id} />
                    <button type="submit" className="text-xs text-ink-muted hover:text-red-600 underline">Retirer</button>
                  </form>
                )}
              </div>
            </li>
          ))}
          {acceptedMembers.length === 0 && !ctx.is_owner && (
            <li className="py-3 text-sm text-ink-muted italic">(Tu es seul membre acceptée pour l&apos;instant.)</li>
          )}
        </ul>
      </div>

      {ctx.is_owner && pendingInvitations.length > 0 && (
        <div className="bg-white p-5 mb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Invitations en attente ({pendingInvitations.length})</p>
          <ul className="divide-y divide-navy/5">
            {pendingInvitations.map(inv => (
              <li key={inv.id} className="py-3 flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <p className="font-medium text-navy">{inv.invitee_email}</p>
                  <p className="font-mono text-xs text-ink-muted">Invité {fmtDate(inv.created_at)} · rôle {inv.role}</p>
                  <p className="font-mono text-[10px] text-ink-muted mt-1">
                    Lien à transmettre :{" "}
                    <code className="bg-cream px-1.5 py-0.5">{APP_URL}/auth/accept?token={inv.token.slice(0, 8)}…</code>
                  </p>
                </div>
                <form action={revokeInvitation}>
                  <input type="hidden" name="invitation_id" value={inv.id} />
                  <button type="submit" className="text-xs text-ink-muted hover:text-red-600 underline">Révoquer</button>
                </form>
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink-muted mt-4">
            <strong>Note S7 v1 :</strong> les emails d&apos;invitation auto sont à brancher via une Edge Function dédiée
            (saas_send_invitation_email). En attendant, copie-colle le lien ci-dessus et envoie-le manuellement.
          </p>
        </div>
      )}

      {!ctx.is_owner && (
        <div className="bg-white p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-2">Quitter ce compte</p>
          <p className="text-sm text-ink-muted mb-3">
            Si tu quittes, tu reviens sur un compte personnel Free. Tu pourras être ré-invité plus tard.
          </p>
          <form action={leaveAccount}>
            <button type="submit" className="bg-cream border border-navy/15 text-navy px-4 py-2 text-sm hover:bg-navy/5 transition">
              Quitter le compte de {ctx.owner_profile?.email}
            </button>
          </form>
        </div>
      )}
    </Section>
  );
}
