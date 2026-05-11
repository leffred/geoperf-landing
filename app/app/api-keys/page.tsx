import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/saas/EmptyState";
import { loadSaasContext, tierLabel } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { createApiKey, revokeApiKey } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "API Keys — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  not_owner: "Action réservée au propriétaire du compte.",
  tier_too_low: "L'API REST est réservée au plan Agency.",
  missing_name: "Le nom de la clé est requis.",
  max_keys: "Limite de 10 clés actives par compte. Révoque-en une avant d'en créer une nouvelle.",
  insert_failed: "Impossible de créer la clé.",
};

const FIELD_LABEL = "block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1.5";
const FIELD_INPUT = "w-full text-sm bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors duration-150 ease-out";

type Props = { searchParams: Promise<{ error?: string; created?: string; revoked?: string }> };

const ALLOWED = new Set(["agency"]);

export default async function ApiKeysPage({ searchParams }: Props) {
  const sp = await searchParams;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const cookieStore = await cookies();
  const justCreated = cookieStore.get("saas_api_key_just_created")?.value;
  if (justCreated) {
    cookieStore.set({ name: "saas_api_key_just_created", value: "", maxAge: 0, path: "/app/api-keys" });
  }

  if (!ALLOWED.has(ctx.tier)) {
    return (
      <Section py="md" tone="white">
        <div className="mb-8">
          <Eyebrow className="mb-2">API Keys</Eyebrow>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
            API REST publique
          </h1>
        </div>
        <EmptyState
          icon="topics"
          eyebrow="Tier verrouillé"
          title="API REST réservée au plan Agency"
          body={`Tu es en ${tierLabel(ctx.tier)}. L'API REST permet d'intégrer Geoperf à ton stack interne (Looker, Tableau, scripts) avec auth Bearer + rate limit 60 req/min.`}
          ctaLabel="Voir les plans"
          ctaHref="/app/billing"
          secondaryLabel="Voir la doc API"
          secondaryHref="/saas/api-docs"
        />
      </Section>
    );
  }

  const { data: keys } = await sb.from("saas_api_keys")
    .select("id, key_prefix, name, scopes, last_used_at, use_count, created_at, revoked_at")
    .eq("user_id", ctx.account_owner_id)
    .order("created_at", { ascending: false });
  const list = (keys as any[] | null) ?? [];

  const errorMsg = sp.error ? ERROR_LABELS[sp.error] || "Erreur." : null;
  const activeKeys = list.filter(k => !k.revoked_at);

  return (
    <Section py="md" tone="white">
      <div className="mb-8 flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <Eyebrow className="mb-2">API Keys</Eyebrow>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
            API REST publique
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Clés Bearer pour ton intégration custom. Format :{" "}
            <code className="font-mono">gp_live_xxxxxxxxxxxxxxxxxxxxxxxx</code>. Rate limit : 60 req/min/clé.
          </p>
        </div>
        <Button href="/saas/api-docs" variant="secondary" size="md">Documentation API ↗</Button>
      </div>

      {sp.created === "1" && justCreated && (
        <div className="mb-6 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 p-5">
          <Eyebrow className="mb-2 text-brand-600">Clé créée — copie-la maintenant</Eyebrow>
          <p className="text-sm text-ink mb-3">
            Cette clé ne s&apos;affichera plus jamais. Stocke-la dans un secret manager (1Password, Doppler, AWS Secrets Manager…) avant de quitter cette page.
          </p>
          <pre className="bg-white p-3 font-mono text-xs text-ink overflow-x-auto rounded-md border border-DEFAULT select-all">
            {justCreated}
          </pre>
        </div>
      )}
      {sp.revoked === "1" && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-ink/15 bg-surface px-4 py-3 text-sm text-ink-muted">
          Clé révoquée. Les requêtes avec cette clé seront refusées immédiatement.
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat label="Clés actives" value={`${activeKeys.length} / 10`} variant="dark" />
        <Stat label="Usage cumulé" value={String(activeKeys.reduce((s, k) => s + (k.use_count ?? 0), 0))} />
        <Stat label="Plan" value={ctx.tier.toUpperCase()} variant="dark" />
        <Stat label="Rate limit" value="60/min" />
      </div>

      {ctx.is_owner && (
        <Card variant="default" className="mb-8">
          <Eyebrow className="mb-4">Créer une clé</Eyebrow>
          <form action={createApiKey} className="space-y-4">
            <div>
              <label className={FIELD_LABEL}>Nom (pour repérer la clé)</label>
              <input
                name="name" type="text" required maxLength={100}
                placeholder="ex: Looker prod / Script ETL daily / Notion automations"
                className={FIELD_INPUT}
              />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="write" className="mt-1 w-4 h-4 accent-brand-500" />
              <span className="text-sm text-ink">
                <span className="font-medium">Activer scope <code className="font-mono">write</code></span>
                <span className="block text-xs text-ink-muted mt-0.5">
                  Permet POST /v1/brands/:id/snapshots (déclencher un snapshot via API). Sans cette case, la clé est read-only.
                </span>
              </span>
            </label>
            <Button type="submit" variant="primary" size="md">Créer une clé API</Button>
          </form>
        </Card>
      )}

      {list.length === 0 ? (
        <EmptyState
          icon="search"
          title="Aucune clé créée"
          body={ctx.is_owner ? "Génère ta 1re clé ci-dessus pour commencer à intégrer Geoperf à ton stack." : "Le propriétaire du compte gère les clés API."}
        />
      ) : (
        <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
              <tr>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Nom</th>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Préfixe</th>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Scopes</th>
                <th className="text-right py-3 px-3 font-mono uppercase tracking-eyebrow">Calls</th>
                <th className="text-left py-3 px-3 hidden md:table-cell font-mono uppercase tracking-eyebrow">Dernier appel</th>
                <th className="text-left py-3 px-3 hidden md:table-cell font-mono uppercase tracking-eyebrow">Créée</th>
                <th className="text-left py-3 px-3 font-mono uppercase tracking-eyebrow">Status</th>
                <th className="text-right py-3 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {list.map(k => {
                const revoked = !!k.revoked_at;
                return (
                  <tr key={k.id} className={`border-b border-DEFAULT last:border-b-0 ${revoked ? "opacity-50" : ""}`}>
                    <td className="py-2 px-3 text-ink">{k.name}</td>
                    <td className="py-2 px-3 font-mono text-xs text-ink-muted">{k.key_prefix}…</td>
                    <td className="py-2 px-3">
                      <div className="flex gap-1">
                        {(k.scopes as string[]).map(s => (
                          <span
                            key={s}
                            className={`text-[10px] font-mono uppercase tracking-eyebrow px-1.5 py-0.5 rounded-md ${
                              s === "write" ? "bg-brand-500 text-white" : "bg-surface text-ink-muted"
                            }`}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-ink tabular-nums">{k.use_count ?? 0}</td>
                    <td className="py-2 px-3 hidden md:table-cell font-mono text-xs text-ink-muted">
                      {k.last_used_at ? new Date(k.last_used_at).toLocaleString("fr-FR") : "—"}
                    </td>
                    <td className="py-2 px-3 hidden md:table-cell font-mono text-xs text-ink-muted">
                      {new Date(k.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono uppercase tracking-eyebrow ${revoked ? "bg-red-50 text-danger" : "bg-emerald-50 text-success"}`}>
                        {revoked ? `révoquée ${new Date(k.revoked_at).toLocaleDateString("fr-FR")}` : "active"}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      {!revoked && ctx.is_owner && (
                        <form action={revokeApiKey}>
                          <input type="hidden" name="id" value={k.id} />
                          <button type="submit" className="text-xs text-ink-muted hover:text-danger underline transition-colors">
                            Révoquer
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-ink-subtle mt-8">
        Note : la clé full n&apos;est jamais re-affichée après création. Stocke-la dans un secret manager. Si tu la perds, révoque-la et créée-en une nouvelle.
        <br />
        Endpoint API : <code className="font-mono">https://saas.geoperf.com/functions/v1/saas_api_v1_router/v1/...</code>
      </p>
    </Section>
  );
}
