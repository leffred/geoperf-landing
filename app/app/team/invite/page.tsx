import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1.5";
const FIELD_INPUT = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function InviteMemberPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const ctx = await loadSaasContext();
  if (!ctx.is_owner) redirect("/app/team?error=not_owner");

  const errorMsg = error ? ERROR_LABELS[error] || "Erreur." : null;

  return (
    <Section py="md" tone="white">
      <div className="max-w-xl">
        <Eyebrow className="mb-2">
          <Link href="/app/team" className="hover:underline">Équipe</Link>
          <span className="opacity-50"> / </span>
          <span>Inviter</span>
        </Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3 leading-tight">
          Inviter un membre
        </h1>
        <p className="text-sm text-ink-muted mb-8 leading-relaxed">
          Plan {tierLabel(ctx.tier)} : {ctx.limits.seats === 999 ? "seats illimités" : `${ctx.limits.seats} seats max`}.
          L&apos;invité aura accès à tes brands, snapshots et alertes (lecture). Les rôles{" "}
          <code className="font-mono text-xs bg-surface px-1.5 py-0.5 rounded">admin</code> peuvent en plus lancer des snapshots.
        </p>

        {errorMsg && (
          <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
            {errorMsg}
          </div>
        )}

        <Card variant="default">
          <form action={inviteMember} className="space-y-4">
            <div>
              <label htmlFor="email" className={FIELD_LABEL}>Email</label>
              <input
                id="email" name="email" type="email" required autoComplete="email"
                placeholder="collegue@entreprise.com"
                className={FIELD_INPUT}
              />
            </div>

            <div>
              <label htmlFor="role" className={FIELD_LABEL}>Rôle</label>
              <select id="role" name="role" defaultValue="viewer" className={FIELD_INPUT}>
                <option value="viewer">Viewer (lecture seule)</option>
                <option value="admin">Admin (peut lancer des snapshots)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" size="md" className="flex-1">
                Créer l&apos;invitation
              </Button>
              <Link href="/app/team" className="px-4 py-2.5 text-sm text-ink-muted hover:text-ink transition-colors">
                Annuler
              </Link>
            </div>

            <p className="text-xs text-ink-subtle">
              S7 v1 : l&apos;email d&apos;invitation n&apos;est pas envoyé automatiquement. Tu copieras manuellement
              le lien <code className="font-mono bg-surface px-1.5 py-0.5 rounded">/auth/accept?token=...</code> depuis la liste après création.
            </p>
          </form>
        </Card>
      </div>
    </Section>
  );
}
