import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { loadSaasContext, tierLabel } from "@/lib/saas-auth";
import { inviteMember } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Inviter un membre — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  bad_email: "Email invalide.",
  self_invite: "Tu ne peux pas t'inviter toi-même.",
  already_invited: "Cette adresse a déjà été invitée.",
  unknown: "Erreur. Réessaie.",
};

type Props = { searchParams: Promise<{ error?: string }> };

export default async function InviteMemberPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const ctx = await loadSaasContext();
  if (!ctx.is_owner) redirect("/app/team?error=not_owner");

  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;

  return (
    <Section py="md" tone="cream">
      <div className="max-w-xl">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase">
          <Link href="/app/team" className="hover:underline">Équipe</Link> / Inviter
        </p>
        <h1 className="font-serif text-3xl text-navy mb-2">Inviter un membre</h1>
        <p className="text-sm text-ink-muted mb-6">
          Plan {tierLabel(ctx.tier)} : {ctx.limits.seats === 999 ? "seats illimités" : `${ctx.limits.seats} seats max`}.
          L&apos;invité aura accès à tes brands, snapshots et alertes (lecture). Les rôles{" "}
          <code className="font-mono text-xs bg-white px-1">admin</code> peuvent en plus lancer des snapshots.
        </p>

        {errorMsg && <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">{errorMsg}</div>}

        <form action={inviteMember} className="bg-white p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="collegue@entreprise.com"
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none" />
          </div>

          <div>
            <label htmlFor="role" className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Rôle</label>
            <select id="role" name="role" defaultValue="viewer"
              className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none">
              <option value="viewer">Viewer (lecture seule)</option>
              <option value="admin">Admin (peut lancer des snapshots)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-navy text-white py-2.5 text-sm font-medium hover:bg-navy-light transition">
              Créer l&apos;invitation
            </button>
            <Link href="/app/team" className="px-4 py-2.5 text-sm text-ink-muted hover:text-navy">Annuler</Link>
          </div>

          <p className="text-xs text-ink-muted">
            S7 v1 : l&apos;email d&apos;invitation n&apos;est pas envoyé automatiquement. Tu copieras manuellement
            le lien <code className="font-mono">/auth/accept?token=...</code> depuis la liste après création.
          </p>
        </form>
      </div>
    </Section>
  );
}
