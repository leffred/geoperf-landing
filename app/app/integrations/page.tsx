import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/saas/EmptyState";
import { loadSaasContext, tierLabel } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { createIntegration, toggleIntegration, deleteIntegration, testIntegration } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Intégrations — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  not_owner: "Action réservée au propriétaire du compte.",
  bad_type: "Type d'intégration invalide.",
  missing_name: "Le nom est requis.",
  tier_too_low: "Cette intégration n'est pas disponible sur ton plan.",
  bad_url: "URL invalide.",
  insert_failed: "Impossible d'enregistrer l'intégration.",
  not_found: "Intégration introuvable.",
};

const TYPE_LABEL: Record<string, string> = {
  slack: "Slack",
  teams: "Microsoft Teams",
  discord: "Discord",
  webhook_custom: "Webhook personnalisé",
};

const TYPE_TIER: Record<string, string> = {
  slack: "Growth+",
  discord: "Growth+",
  teams: "Pro+",
  webhook_custom: "Pro+",
};

const ALL_EVENTS = [
  { key: "rank_drop_high", label: "Rank drop sévère" },
  { key: "rank_drop", label: "Rank drop tous niveaux" },
  { key: "competitor_overtake_high", label: "Concurrent qui passe devant" },
  { key: "competitor_overtake", label: "Concurrent (tous niveaux)" },
  { key: "citation_loss_high", label: "Chute citation sévère" },
  { key: "citation_loss", label: "Chute citation (tous niveaux)" },
  { key: "rank_gain", label: "Rank gain (positif)" },
  { key: "citation_gain", label: "Citation gain (positif)" },
  { key: "new_source", label: "Nouvelles sources autorité" },
  { key: "*", label: "Toutes les alertes" },
];

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1.5";
const FIELD_INPUT = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";

type Props = { searchParams: Promise<{ error?: string; msg?: string; created?: string; updated?: string; deleted?: string; test?: string; type?: string }> };

export default async function IntegrationsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: integrations } = await sb
    .from("saas_integrations")
    .select("id, type, name, webhook_url, events, is_active, send_count, fail_count, last_sent_at, last_error, created_at")
    .eq("user_id", ctx.account_owner_id)
    .order("created_at", { ascending: false });
  const list = (integrations as any[] | null) ?? [];

  const errorMsg = sp.error ? `${ERROR_LABELS[sp.error] || "Erreur."}${sp.msg ? ` (${decodeURIComponent(sp.msg)})` : ""}` : null;
  const slackOK = (["growth", "pro", "agency"] as const).includes(ctx.tier as never);
  const teamsOK = (["pro", "agency"] as const).includes(ctx.tier as never);

  return (
    <Section py="md" tone="white">
      <div className="mb-8">
        <Eyebrow className="mb-2">Intégrations</Eyebrow>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3 leading-tight">
          Webhooks vers tes outils
        </h1>
        <p className="text-sm text-ink-muted">
          Reçois les alertes Geoperf directement dans Slack / Teams / Discord ou via un webhook custom JSON. Tier {tierLabel(ctx.tier)}.
        </p>
      </div>

      {sp.created === "1" && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 text-sm text-brand-600">
          Intégration ajoutée. Clique « Tester » pour vérifier qu&apos;elle fonctionne.
        </div>
      )}
      {sp.updated === "1" && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-ink/15 bg-surface px-4 py-3 text-sm text-ink-muted">
          Intégration mise à jour.
        </div>
      )}
      {sp.deleted === "1" && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-ink/15 bg-surface px-4 py-3 text-sm text-ink-muted">
          Intégration supprimée.
        </div>
      )}
      {sp.test === "ok" && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-success bg-emerald-50 px-4 py-3 text-sm text-success">
          Test envoyé avec succès. Vérifie ton canal.
        </div>
      )}
      {sp.test === "fail" && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
          Test échoué. Voir « last_error » ci-dessous pour le détail.
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat label="Intégrations actives" value={String(list.filter(i => i.is_active).length)} variant="dark" />
        <Stat label="Total" value={String(list.length)} />
        <Stat label="Envois OK" value={String(list.reduce((s, i) => s + (i.send_count ?? 0), 0))} />
        <Stat label="Échecs cumulés" value={String(list.reduce((s, i) => s + (i.fail_count ?? 0), 0))} />
      </div>

      {ctx.is_owner && (
        <Card variant="default" className="mb-8">
          <Eyebrow className="mb-4">Ajouter une intégration</Eyebrow>
          <form action={createIntegration} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={FIELD_LABEL}>Type</label>
                <select name="type" required className={FIELD_INPUT}>
                  <option value="slack" disabled={!slackOK}>Slack {!slackOK && "(Growth+)"}</option>
                  <option value="teams" disabled={!teamsOK}>Microsoft Teams {!teamsOK && "(Pro+)"}</option>
                  <option value="discord" disabled={!slackOK}>Discord {!slackOK && "(Growth+)"}</option>
                  <option value="webhook_custom" disabled={!teamsOK}>Webhook custom (raw JSON) {!teamsOK && "(Pro+)"}</option>
                </select>
              </div>
              <div>
                <label className={FIELD_LABEL}>Nom</label>
                <input name="name" type="text" required maxLength={100} placeholder="ex: #geoperf-alerts prod" className={FIELD_INPUT} />
              </div>
            </div>

            <div>
              <label className={FIELD_LABEL}>URL webhook</label>
              <input
                name="webhook_url"
                type="url"
                required
                placeholder="https://hooks.slack.com/services/T00.../B00.../xxx"
                className={`${FIELD_INPUT} font-mono`}
              />
              <p className="text-xs text-ink-subtle mt-1.5">
                Slack : <code className="font-mono">hooks.slack.com</code> · Teams : Office 365 connector URL · Discord : channel webhook URL · Custom : ton endpoint.
              </p>
            </div>

            <div>
              <p className={FIELD_LABEL}>Events à recevoir (laisse vide = défauts high-severity)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 text-xs">
                {ALL_EVENTS.map(e => (
                  <label key={e.key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="events" value={e.key} className="w-3.5 h-3.5 accent-brand-500" />
                    <span className="text-ink">{e.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" variant="primary" size="md">Créer l&apos;intégration</Button>
          </form>
        </Card>
      )}

      {list.length === 0 ? (
        <EmptyState
          icon="alerts"
          title="Aucune intégration configurée"
          body={ctx.is_owner ? "Connecte ton Slack ou Teams pour recevoir les alertes Geoperf directement dans tes canaux." : "Le propriétaire du compte gère les intégrations."}
        />
      ) : (
        <div className="space-y-3">
          <Eyebrow>Configurées ({list.length})</Eyebrow>
          {list.map(i => (
            <article key={i.id} className={`bg-white rounded-lg border border-DEFAULT shadow-card p-5 ${!i.is_active ? "opacity-60" : ""}`}>
              <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-base font-medium text-ink tracking-tightish">{i.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-subtle">
                    {TYPE_LABEL[i.type] ?? i.type} · {TYPE_TIER[i.type] ?? "?"}
                  </span>
                  {!i.is_active && (
                    <span className="font-mono text-[10px] uppercase tracking-eyebrow rounded-md px-1.5 py-0.5 bg-surface text-ink-subtle">disabled</span>
                  )}
                </div>
                <div className="text-xs font-mono text-ink-subtle">
                  {i.send_count ?? 0} envois · {i.fail_count ?? 0} échecs
                </div>
              </div>
              <p className="font-mono text-xs text-ink-muted truncate" title={i.webhook_url}>{i.webhook_url}</p>
              {i.events?.length > 0 && (
                <p className="text-xs text-ink-muted mt-1">
                  <span className="font-mono uppercase tracking-eyebrow text-ink-subtle">Events :</span>{" "}
                  {(i.events as string[]).slice(0, 8).join(", ")}{(i.events?.length ?? 0) > 8 ? "…" : ""}
                </p>
              )}
              {i.last_error && (
                <p className="text-xs text-danger mt-2 font-mono break-all">⚠ {i.last_error}</p>
              )}
              {i.last_sent_at && (
                <p className="text-xs text-success mt-1 font-mono">✓ Dernier envoi : {new Date(i.last_sent_at).toLocaleString("fr-FR")}</p>
              )}
              {ctx.is_owner && (
                <div className="flex flex-wrap gap-2 pt-3 mt-3 border-t border-DEFAULT">
                  <form action={testIntegration}>
                    <input type="hidden" name="id" value={i.id} />
                    <Button type="submit" variant="secondary" size="sm">Tester</Button>
                  </form>
                  <form action={toggleIntegration}>
                    <input type="hidden" name="id" value={i.id} />
                    <input type="hidden" name="enable" value={i.is_active ? "false" : "true"} />
                    <Button type="submit" variant="secondary" size="sm">
                      {i.is_active ? "Désactiver" : "Réactiver"}
                    </Button>
                  </form>
                  <form action={deleteIntegration}>
                    <input type="hidden" name="id" value={i.id} />
                    <button type="submit" className="text-xs px-3 py-1.5 text-ink-muted hover:text-danger underline transition-colors">
                      Supprimer
                    </button>
                  </form>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <p className="text-xs text-ink-subtle mt-8">
        Slack/Discord : Growth+ · Teams/Webhook custom : Pro+. Trigger : à chaque insert dans <code className="font-mono">saas_alerts</code>, le DB trigger fire <code className="font-mono">saas_dispatch_integration_webhooks</code> qui filtre par events et POST sur les webhooks actifs.
      </p>
    </Section>
  );
}
