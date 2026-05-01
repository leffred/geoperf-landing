import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
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

type Props = { searchParams: Promise<{ error?: string; created?: string; revoked?: string }> };

const ALLOWED = new Set(["agency"]);

export default async function ApiKeysPage({ searchParams }: Props) {
  const sp = await searchParams;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  // Lecture du cookie pour afficher la clé full créée à l'instant (one-shot)
  const cookieStore = await cookies();
  const justCreated = cookieStore.get("saas_api_key_just_created")?.value;
  if (justCreated) {
    // On consomme le cookie en le supprimant côté server
    cookieStore.set({ name: "saas_api_key_just_created", value: "", maxAge: 0, path: "/app/api-keys" });
  }

  if (!ALLOWED.has(ctx.tier)) {
    return (
      <Section py="md" tone="cream">
        <div className="mb-4">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">API Keys</p>
          <h1 className="font-serif text-3xl text-navy">API REST publique</h1>
        </div>
        <EmptyState
          icon="topics"
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
    <Section py="md" tone="cream">
      <div className="mb-6 flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">API Keys</p>
          <h1 className="font-serif text-3xl text-navy">API REST publique</h1>
          <p className="text-sm text-ink-muted">
            Clés Bearer pour ton intégration custom. Format : <code className="font-mono">gp_live_xxxxxxxxxxxxxxxxxxxxxxxx</code>. Rate limit : 60 req/min/clé.
          </p>
        </div>
        <Link href="/saas/api-docs" target="_blank" className="bg-cream border border-navy/15 text-navy px-4 py-2 text-sm font-medium hover:bg-navy/5 transition">
          Documentation API ↗
        </Link>
      </div>

      {sp.created === "1" && justCreated && (
        <div className="mb-6 p-5 bg-amber/20 border-l-2 border-amber">
          <p className="font-mono text-xs uppercase tracking-widest text-navy mb-2">Clé créée — copie-la maintenant</p>
          <p className="text-sm text-navy mb-3">Cette clé ne s&apos;affichera plus jamais. Stocke-la dans un secret manager (1Password, Doppler, AWS Secrets Manager…) avant de quitter cette page.</p>
          <pre className="bg-white p-3 font-mono text-xs text-navy overflow-x-auto border border-navy/10 select-all">{justCreated}</pre>
        </div>
      )}
      {sp.revoked === "1" && <div className="mb-4 px-4 py-3 bg-cream border-l-2 border-navy/20 text-sm text-ink-muted">Clé révoquée. Les requêtes avec cette clé seront refusées immédiatement.</div>}
      {errorMsg && <div className="mb-4 px-4 py-3 bg-red-50 border-l-2 border-red-600 text-sm text-red-900">{errorMsg}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Clés actives" value={`${activeKeys.length} / 10`} variant="highlight" />
        <Stat label="Usage cumulé" value={String(activeKeys.reduce((s, k) => s + (k.use_count ?? 0), 0))} />
        <Stat label="Plan" value={ctx.tier.toUpperCase()} variant="highlight" />
        <Stat label="Rate limit" value="60/min" />
      </div>

      {ctx.is_owner && (
        <div className="bg-white p-6 mb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-light mb-3">Créer une clé</p>
          <form action={createApiKey} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-ink-muted mb-1.5">Nom (pour repérer la clé)</label>
              <input name="name" type="text" required maxLength={100} placeholder="ex: Looker prod / Script ETL daily / Notion automations"
                className="w-full text-sm bg-cream px-3 py-2.5 border border-navy/15 focus:border-navy outline-none" />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="write" className="mt-1 w-4 h-4 accent-navy" />
              <span className="text-sm text-ink">
                <span className="font-medium">Activer scope <code className="font-mono">write</code></span>
                <span className="block text-xs text-ink-muted mt-0.5">Permet POST /v1/brands/:id/snapshots (déclencher un snapshot via API). Sans cette case, la clé est read-only.</span>
              </span>
            </label>
            <button type="submit" className="bg-navy text-white px-5 py-2.5 text-sm font-medium hover:bg-navy-light transition">
              Créer une clé API
            </button>
          </form>
        </div>
      )}

      {list.length === 0 ? (
        <EmptyState
          icon="search"
          title="Aucune clé créée"
          body={ctx.is_owner ? "Génère ta 1re clé ci-dessus pour commencer à intégrer Geoperf à ton stack." : "Le propriétaire du compte gère les clés API."}
        />
      ) : (
        <div className="bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-muted border-b border-navy/15">
              <tr>
                <th className="text-left py-2 px-3">Nom</th>
                <th className="text-left py-2 px-3">Préfixe</th>
                <th className="text-left py-2 px-3">Scopes</th>
                <th className="text-right py-2 px-3">Calls</th>
                <th className="text-left py-2 px-3 hidden md:table-cell">Dernier appel</th>
                <th className="text-left py-2 px-3 hidden md:table-cell">Créée</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-right py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {list.map(k => {
                const revoked = !!k.revoked_at;
                return (
                  <tr key={k.id} className={`border-b border-navy/5 ${revoked ? "opacity-50" : ""}`}>
                    <td className="py-2 px-3 text-navy">{k.name}</td>
                    <td className="py-2 px-3 font-mono text-xs text-ink-muted">{k.key_prefix}…</td>
                    <td className="py-2 px-3">
                      <div className="flex gap-1">
                        {(k.scopes as string[]).map(s => (
                          <span key={s} className={`text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 ${s === "write" ? "bg-amber text-navy" : "bg-navy/10 text-navy"}`}>{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right font-mono">{k.use_count ?? 0}</td>
                    <td className="py-2 px-3 hidden md:table-cell font-mono text-xs">{k.last_used_at ? new Date(k.last_used_at).toLocaleString("fr-FR") : "—"}</td>
                    <td className="py-2 px-3 hidden md:table-cell font-mono text-xs">{new Date(k.created_at).toLocaleDateString("fr-FR")}</td>
                    <td className="py-2 px-3">
                      <span className={`text-xs px-2 py-0.5 ${revoked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                        {revoked ? `révoquée ${new Date(k.revoked_at).toLocaleDateString("fr-FR")}` : "active"}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      {!revoked && ctx.is_owner && (
                        <form action={revokeApiKey}>
                          <input type="hidden" name="id" value={k.id} />
                          <button type="submit" className="text-xs text-ink-muted hover:text-red-600 underline">Révoquer</button>
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

      <p className="text-xs text-ink-muted mt-6">
        Note : la clé full n&apos;est jamais re-affichée après création. Stocke-la dans un secret manager. Si tu la perds, révoque-la et créée-en une nouvelle.
        <br />
        Endpoint API : <code className="font-mono">https://qfdvdcvqknoqfxetttch.supabase.co/functions/v1/saas_api_v1_router/v1/...</code>
      </p>
    </Section>
  );
}
