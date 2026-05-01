import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
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
    <Section py="md" tone="cream">
      <div className="mb-6">
        <p className="font-mono text-xs tracking-widest text-navy-light uppercase">Intégrations</p>
        <h1 className="font-serif text-3xl text-navy mb-2">Webhooks vers tes outils</h1>
        <p className="text-sm text-ink-muted">
          Reçois les alertes Geoperf directement dans Slack / Teams / Discord ou via un webhook custom JSON. Tier {tierLabel(ctx.tier)}.
        </p>
      </div>

      {sp.created === "1" && <div className="mb-4 px-4 py-3 bg-amber/20 border-l-2 border-amber text-sm text-navy">Intégration ajoutée. Clique « Tester » pour vérifier qu&apos;elle fonctionne.</div>}
      {sp.updated === "1" && <div className="mb-4 px-4 py-3 bg-cream border-l-2 border-navy/20 text-sm text-ink-muted">Intégration mise à jour.</div>}
      {sp.deleted === "1" && <div className="mb-4 px-4 py-3 bg-cream border-l-2 border-navy/20 text-sm text-ink-muted">Intégration supprimée.</div>}
      {sp.test === "ok" && <div className="mb-4 px-4 py-3 bg-emerald-50 border-l-2 border-emerald-600 text-sm text-emerald-900">Test envoyé avec succès. Vérifie ton canal.</div>}
      {sp.test === "fail" && <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">Test échoué. Voir « last_error » ci-dessous pour le détail.</div>}
      {errorMsg && <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">{errorMsg}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Intégrations actives" value={String(list.filter(i => i.is_active).length)} variant="highlight" />
        <Stat label="Total" value={String(list.length)} />
        <Stat label="Envois OK" value={String(list.reduce((s, i) => s + (i.send_count ?? 0), 0))} />
        <Stat label="Échecs cumulés" value={String(list.reduce((s, i) => s + (i.fail_count ?? 0), 0))} />
      </div>

      {ctx.is_owner && (
        <div className="bg-white p-6 mb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Ajouter une intégration</p>
          <form action={createIntegration} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Type</label>
                <select name="type" required className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none">
                  <option value="slack" disabled={!slackOK}>Slack {!slackOK && "(Growth+)"}</option>
                  <option value="teams" disabled={!teamsOK}>Microsoft Teams {!teamsOK && "(Pro+)"}</option>
                  <option value="discord" disabled={!slackOK}>Discord {!slackOK && "(Growth+)"}</option>
                  <option value="webhook_custom" disabled={!teamsOK}>Webhook custom (raw JSON) {!teamsOK && "(Pro+)"}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Nom</label>
                <input name="name" type="text" required maxLength={100} placeholder="ex: #geoperf-alerts prod"
                  className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">URL webhook</label>
              <input name="webhook_url" type="url" required placeholder="https://hooks.slack.com/services/T00.../B00.../xxx"
                className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none font-mono" />
              <p className="text-xs text-ink-muted mt-1">
                Slack : <code className="font-mono">hooks.slack.com</code> · Teams : Office 365 connector URL · Discord : channel webhook URL · Custom : ton endpoint.
              </p>
            </div>

            <div>
              <p className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-2">Events à recevoir (laisse vide = défauts high-severity)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 text-xs">
                {ALL_EVENTS.map(e => (
                  <label key={e.key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="events" value={e.key} className="w-3.5 h-3.5 accent-navy" />
                    <span>{e.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="bg-navy text-white px-5 py-2.5 text-sm font-medium hover:bg-navy-light transition">
              Créer l&apos;intégration
            </button>
          </form>
        </div>
      )}

      {list.length === 0 ? (
        <EmptyState
          icon="alerts"
          title="Aucune intégration configurée"
          body={ctx.is_owner ? "Connecte ton Slack ou Teams pour recevoir les alertes Geoperf directement dans tes canaux." : "Le propriétaire du compte gère les intégrations."}
        />
      ) : (
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light">Configurées ({list.length})</p>
          {list.map(i => (
            <article key={i.id} className={`bg-white p-5 ${!i.is_active ? "opacity-60" : ""}`}>
              <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-serif text-base text-navy">{i.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{TYPE_LABEL[i.type] ?? i.type} · {TYPE_TIER[i.type] ?? "?"}</span>
                  {!i.is_active && <span className="font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 bg-cream text-ink-muted">disabled</span>}
                </div>
                <div className="text-xs font-mono text-ink-muted">
                  {i.send_count ?? 0} envois · {i.fail_count ?? 0} échecs
                </div>
              </div>
              <p className="font-mono text-xs text-ink-muted truncate" title={i.webhook_url}>{i.webhook_url}</p>
              {i.events?.length > 0 && (
                <p className="text-xs text-ink-muted mt-1">
                  <span className="font-mono uppercase tracking-widest">Events :</span> {(i.events as string[]).slice(0, 8).join(", ")}{(i.events?.length ?? 0) > 8 ? "…" : ""}
                </p>
              )}
              {i.last_error && (
                <p className="text-xs text-red-700 mt-2 font-mono break-all">⚠ {i.last_error}</p>
              )}
              {i.last_sent_at && (
                <p className="text-xs text-emerald-700 mt-1 font-mono">✓ Dernier envoi : {new Date(i.last_sent_at).toLocaleString("fr-FR")}</p>
              )}
              {ctx.is_owner && (
                <div className="flex flex-wrap gap-2 pt-3 mt-3 border-t border-navy/5">
                  <form action={testIntegration}>
                    <input type="hidden" name="id" value={i.id} />
                    <button type="submit" className="text-xs px-3 py-1.5 bg-cream border border-navy/15 text-navy hover:bg-navy/5 transition">Tester</button>
                  </form>
                  <form action={toggleIntegration}>
                    <input type="hidden" name="id" value={i.id} />
                    <input type="hidden" name="enable" value={i.is_active ? "false" : "true"} />
                    <button type="submit" className="text-xs px-3 py-1.5 bg-cream border border-navy/15 text-navy hover:bg-navy/5 transition">
                      {i.is_active ? "Désactiver" : "Réactiver"}
                    </button>
                  </form>
                  <form action={deleteIntegration}>
                    <input type="hidden" name="id" value={i.id} />
                    <button type="submit" className="text-xs px-3 py-1.5 text-ink-muted hover:text-red-600 underline">Supprimer</button>
                  </form>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <p className="text-xs text-ink-muted mt-6">
        Slack/Discord : Growth+ · Teams/Webhook custom : Pro+. Trigger : à chaque insert dans <code className="font-mono">saas_alerts</code>, le DB trigger fire <code className="font-mono">saas_dispatch_integration_webhooks</code> qui filtre par events et POST sur les webhooks actifs.
      </p>
    </Section>
  );
}
