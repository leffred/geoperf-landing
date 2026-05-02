import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
  const usedSeats = 1 + acceptedMembers.length + pendingInvitations.length;
  const canInvite = ctx.is_owner && usedSeats < seatsCap;

  return (
    <Section py="md" tone="white">
      <div className="mb-6 flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <Eyebrow className="mb-2">Équipe</Eyebrow>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
            Membres du compte
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            {usedSeats} / {seatsCap === 999 ? "∞" : seatsCap} seats utilisés sur ton plan {tierLabel(ctx.tier)}
            {!ctx.is_owner && (
              <span> · Tu es membre du compte de <strong className="text-ink">{ctx.owner_profile?.email ?? "?"}</strong></span>
            )}
          </p>
        </div>
        {ctx.is_owner && (
          canInvite ? (
            <Button href="/app/team/invite" variant="primary" size="md">+ Inviter un membre</Button>
          ) : (
            <Button href="/app/billing" variant="secondary" size="md">Upgrade pour plus de seats</Button>
          )
        )}
      </div>

      {invited === "1" && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
          Invitation créée. L&apos;email de l&apos;invité sera contacté (via email transactionnel à brancher S7+).
        </div>
      )}
      {revoked === "1" && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-ink/15 bg-surface px-4 py-3 text-sm text-ink-muted">
          Invitation révoquée.
        </div>
      )}
      {removed === "1" && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-ink/15 bg-surface px-4 py-3 text-sm text-ink-muted">
          Membre retiré.
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      <Card variant="default" className="mb-6">
        <Eyebrow className="mb-3">Membres ({acceptedMembers.length + 1})</Eyebrow>
        <ul className="divide-y divide-DEFAULT">
          <li className="py-3 flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <p className="font-medium text-ink">{ctx.profile?.full_name || ctx.user.email}</p>
              <p className="font-mono text-xs text-ink-subtle">{ctx.user.email}</p>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-ink text-white uppercase tracking-eyebrow">Owner</span>
          </li>
          {acceptedMembers.map(m => (
            <li key={m.id} className="py-3 flex items-baseline justify-between flex-wrap gap-2">
              <div>
                <p className="font-medium text-ink">{m.saas_profiles?.full_name || m.saas_profiles?.email}</p>
                <p className="font-mono text-xs text-ink-subtle">{m.saas_profiles?.email} · accepté {fmtDate(m.accepted_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-surface text-ink-muted uppercase tracking-eyebrow">{m.role}</span>
                {ctx.is_owner && (
                  <form action={removeMember}>
                    <input type="hidden" name="member_id" value={m.id} />
                    <button type="submit" className="text-xs text-ink-muted hover:text-danger underline transition-colors">
                      Retirer
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
          {acceptedMembers.length === 0 && !ctx.is_owner && (
            <li className="py-3 text-sm text-ink-muted italic">(Tu es seul membre acceptée pour l&apos;instant.)</li>
          )}
        </ul>
      </Card>

      {ctx.is_owner && pendingInvitations.length > 0 && (
        <Card variant="default" className="mb-6">
          <Eyebrow className="mb-3">Invitations en attente ({pendingInvitations.length})</Eyebrow>
          <ul className="divide-y divide-DEFAULT">
            {pendingInvitations.map(inv => (
              <li key={inv.id} className="py-3 flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <p className="font-medium text-ink">{inv.invitee_email}</p>
                  <p className="font-mono text-xs text-ink-subtle">Invité {fmtDate(inv.created_at)} · rôle {inv.role}</p>
                  <p className="font-mono text-[10px] text-ink-subtle mt-1">
                    Lien à transmettre :{" "}
                    <code className="bg-surface px-1.5 py-0.5 rounded">{APP_URL}/auth/accept?token={inv.token.slice(0, 8)}…</code>
                  </p>
                </div>
                <form action={revokeInvitation}>
                  <input type="hidden" name="invitation_id" value={inv.id} />
                  <button type="submit" className="text-xs text-ink-muted hover:text-danger underline transition-colors">
                    Révoquer
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink-muted mt-4">
            <strong className="text-ink">Note S7 v1 :</strong> les emails d&apos;invitation auto sont à brancher via une Edge Function dédiée
            (saas_send_invitation_email). En attendant, copie-colle le lien ci-dessus et envoie-le manuellement.
          </p>
        </Card>
      )}

      {!ctx.is_owner && (
        <Card variant="default">
          <Eyebrow className="mb-2">Quitter ce compte</Eyebrow>
          <p className="text-sm text-ink-muted mb-4">
            Si tu quittes, tu reviens sur un compte personnel Free. Tu pourras être ré-invité plus tard.
          </p>
          <form action={leaveAccount}>
            <Button type="submit" variant="secondary" size="md">
              Quitter le compte de {ctx.owner_profile?.email}
            </Button>
          </form>
        </Card>
      )}
    </Section>
  );
}
