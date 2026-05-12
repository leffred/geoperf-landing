// /app/recos — Vue centralisée des recommandations cross-marques.

import type { Metadata } from "next";
import Link from "next/link";
import { CheckCheck, ExternalLink } from "lucide-react";
import { requireSaasUser } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { markAllRecosRead, markOneRecoRead } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Recommandations — Geoperf", robots: { index: false, follow: false } };

type Reco = {
  id: string;
  brand_id: string;
  snapshot_id: string;
  priority: "high" | "medium" | "low";
  category: string;
  title: string;
  body: string;
  authority_sources: Array<{ domain: string; why?: string; example_url?: string }> | null;
  is_read: boolean;
  created_at: string;
};

type Brand = { id: string; name: string; domain: string };

const PRIO_BORDER: Record<string, string> = {
  high: "border-l-danger",
  medium: "border-l-warning",
  low: "border-l-ink/20",
};
const PRIO_LABEL: Record<string, string> = {
  high: "text-danger",
  medium: "text-warning",
  low: "text-ink-subtle",
};
const PRIO_SORT: Record<string, number> = { high: 0, medium: 1, low: 2 };
const CAT_LABELS: Record<string, string> = {
  authority_source: "Source autorité",
  content_gap: "Gap contenu",
  competitor_threat: "Concurrent",
  positioning: "Positionnement",
};

export default async function RecosPage() {
  const user = await requireSaasUser();
  const sb = getServiceClient();

  const { data: brandsData } = await sb
    .from("saas_tracked_brands")
    .select("id, name, domain")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("name");
  const brands = (brandsData ?? []) as Brand[];
  const brandIds = brands.map(b => b.id);
  const brandMap = new Map(brands.map(b => [b.id, b]));

  if (brandIds.length === 0) {
    return (
      <div>
        <h1 className="text-ink mb-4" style={{ fontSize: 26, fontWeight: 600 }}>Recommandations</h1>
        <p className="text-sm text-ink-muted">Aucune marque suivie. <Link href="/app/brands/new" className="text-brand-500 hover:underline">Ajouter une marque</Link>.</p>
      </div>
    );
  }

  const { data: recosData } = await sb
    .from("saas_recommendations")
    .select("id, brand_id, snapshot_id, priority, category, title, body, authority_sources, is_read, created_at")
    .in("brand_id", brandIds)
    .order("created_at", { ascending: false });
  const recos = (recosData ?? []) as Reco[];

  const unreadCount = recos.filter(r => !r.is_read).length;
  const totalCount = recos.length;

  // Groupe par brand, trié par priorité au sein de chaque groupe
  const grouped = new Map<string, Reco[]>();
  for (const r of recos) {
    if (!grouped.has(r.brand_id)) grouped.set(r.brand_id, []);
    grouped.get(r.brand_id)!.push(r);
  }
  // Trie chaque groupe : high → medium → low, puis date desc
  for (const [, list] of grouped) {
    list.sort((a, b) => {
      const pd = (PRIO_SORT[a.priority] ?? 2) - (PRIO_SORT[b.priority] ?? 2);
      if (pd !== 0) return pd;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="font-mono uppercase text-brand-500 mb-1" style={{ fontSize: 10, letterSpacing: "0.16em" }}>
            // Recommandations prioritaires
          </div>
          <h1 className="text-ink leading-tight" style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Recommandations
          </h1>
          <p className="text-ink-muted mt-1" style={{ fontSize: 13 }}>
            {totalCount} recommandation{totalCount !== 1 ? "s" : ""} · {unreadCount} non lue{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <form action={markAllRecosRead}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-strong bg-white text-ink hover:bg-surface transition-colors"
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              <CheckCheck size={13} strokeWidth={1.8} />
              Tout marquer comme lu
            </button>
          </form>
        )}
      </div>

      {totalCount === 0 ? (
        <div className="bg-surface border border-DEFAULT rounded-xl text-ink-subtle text-center" style={{ padding: 40, fontSize: 13 }}>
          Aucune recommandation pour le moment. Lance un snapshot pour en générer.
        </div>
      ) : (
        <div className="space-y-8">
          {[...grouped.entries()].map(([brandId, brandRecos]) => {
            const brand = brandMap.get(brandId);
            if (!brand) return null;
            const brandUnread = brandRecos.filter(r => !r.is_read).length;
            return (
              <section key={brandId}>
                {/* Brand header */}
                <div className="flex items-center gap-2 mb-3">
                  <Link
                    href={`/app/brands/${brandId}`}
                    className="font-medium text-ink hover:text-brand-500 transition-colors"
                    style={{ fontSize: 15 }}
                  >
                    {brand.name}
                  </Link>
                  <span className="text-ink-subtle font-mono" style={{ fontSize: 11 }}>{brand.domain}</span>
                  {brandUnread > 0 && (
                    <span className="font-mono text-brand-500" style={{ fontSize: 10 }}>
                      {brandUnread} non lue{brandUnread !== 1 ? "s" : ""}
                    </span>
                  )}
                  <Link
                    href={`/app/brands/${brandId}?tab=recos`}
                    className="ml-auto text-ink-subtle hover:text-brand-500 transition-colors"
                    title="Voir la page marque"
                  >
                    <ExternalLink size={12} strokeWidth={1.8} />
                  </Link>
                </div>

                {/* Reco cards */}
                <div className="space-y-2.5">
                  {brandRecos.map(r => (
                    <article
                      key={r.id}
                      className={`rounded-lg border border-DEFAULT border-l-2 shadow-card transition-opacity ${
                        PRIO_BORDER[r.priority] || PRIO_BORDER.low
                      } ${r.is_read ? "opacity-50" : "bg-white"}`}
                      style={{ padding: "14px 16px" }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`font-mono uppercase ${PRIO_LABEL[r.priority] || PRIO_LABEL.low}`} style={{ fontSize: 10, letterSpacing: "0.12em" }}>
                              {r.priority}
                            </span>
                            <span className="font-mono text-ink-subtle" style={{ fontSize: 10 }}>
                              · {CAT_LABELS[r.category] || r.category}
                            </span>
                            <span className="font-mono text-ink-subtle ml-auto" style={{ fontSize: 10 }}>
                              {new Date(r.created_at).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          <h3 className="font-medium text-ink mb-1" style={{ fontSize: 14 }}>{r.title}</h3>
                          <p className="text-ink-muted leading-relaxed" style={{ fontSize: 13 }}>{r.body}</p>
                          {r.authority_sources && r.authority_sources.length > 0 && (
                            <div className="mt-2.5 pt-2.5 border-t border-DEFAULT">
                              <p className="font-mono text-ink-subtle mb-1" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Sources à cibler</p>
                              <ul className="space-y-0.5">
                                {r.authority_sources.map((s, i) => (
                                  <li key={i} className="text-ink" style={{ fontSize: 12 }}>
                                    <span className="font-mono">{s.domain}</span>
                                    {s.why && <span className="text-ink-muted"> — {s.why}</span>}
                                    {s.example_url && (
                                      <a href={s.example_url} target="_blank" rel="noopener" className="ml-1.5 text-brand-500 hover:underline">ex.</a>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        {!r.is_read && (
                          <form action={markOneRecoRead} className="shrink-0">
                            <input type="hidden" name="reco_id" value={r.id} />
                            <button
                              type="submit"
                              title="Marquer comme lue"
                              className="text-ink-subtle hover:text-ink transition-colors mt-0.5"
                            >
                              <CheckCheck size={14} strokeWidth={1.8} />
                            </button>
                          </form>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
