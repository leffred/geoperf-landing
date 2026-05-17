// S33 — Page liste articles GEO Content Writer.
// Server Component : fetch geo_articles du user via getServiceClient.

import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ExternalLink, FileText, Plus, Sparkles } from "lucide-react";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { KpiStrip, KpiCell } from "@/components/saas/v2/KpiStrip";
import { CONTENT_PLAN_LIMITS, CONTENT_TIER_LABELS, type ContentTier } from "@/lib/content-plans";
import { publishArticle } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "GEO Content — Geoperf", robots: { index: false, follow: false } };

const ERROR_LABELS: Record<string, string> = {
  quota: "Quota atteint sur votre plan actuel.",
  no_cms: "Aucun CMS WordPress connecté. Configurez une connexion dans Réglages → CMS pour publier.",
  publish_failed: "Échec de la publication WordPress. Vérifiez les credentials CMS et réessayez.",
  not_found: "Article introuvable.",
  already_published: "Cet article est déjà publié.",
  auth: "Session expirée — reconnectez-vous.",
  missing_article: "Article manquant.",
};

const SUCCESS_LABELS: Record<string, string> = {
  generated: "Article généré et ajouté en brouillon.",
  published: "Article publié sur WordPress avec succès.",
  content_subscribed: "Abonnement Content activé — quota mis à jour.",
};

interface ArticleRow {
  id: string;
  title: string | null;
  slug: string | null;
  status: string;
  cms_target: string | null;
  cms_url: string | null;
  created_at: string;
  published_at: string | null;
}

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; tier?: string }>;
}) {
  const sp = await searchParams;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const [articlesRes, contentSubRes] = await Promise.all([
    sb.from("geo_articles")
      .select("id, title, slug, status, cms_target, cms_url, created_at, published_at")
      .eq("client_id", ctx.user.id)
      .order("created_at", { ascending: false })
      .limit(50),
    sb.from("saas_content_subscriptions")
      .select("tier, articles_used_this_period, current_period_end")
      .eq("user_id", ctx.user.id)
      .eq("status", "active")
      .maybeSingle(),
  ]);

  const rows = (articlesRes.data as ArticleRow[] | null) ?? [];
  const contentSub = contentSubRes.data as {
    tier: ContentTier;
    articles_used_this_period: number;
    current_period_end: string | null;
  } | null;

  const total = rows.length;
  const drafts = rows.filter((r) => r.status === "draft" || r.status === "review").length;
  const published = rows.filter((r) => r.status === "published").length;

  // S35 — quota tier-aware. Free : compte total historique. Paid : compteur de période.
  const tier = (contentSub?.tier ?? "free") as ContentTier;
  const limits = CONTENT_PLAN_LIMITS[tier];
  const usedThisPeriod = tier === "free" ? total : (contentSub?.articles_used_this_period ?? 0);
  const quotaReached = usedThisPeriod >= limits.articles_per_month;

  const errorMsg = sp.error ? ERROR_LABELS[sp.error] ?? "Erreur." : null;
  const successMsg = sp.success ? SUCCESS_LABELS[sp.success] ?? null : null;

  return (
    <div className="px-6 md:px-8 py-6 md:py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="font-mono uppercase text-brand-500 mb-1" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
            // GEO Content Writer
          </div>
          <h1 className="text-ink leading-tight tracking-tight" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Mes articles
          </h1>
          <p className="text-ink-muted mt-1" style={{ fontSize: 13 }}>
            Articles optimisés pour ChatGPT, Claude, Gemini, Perplexity — générés par IA, publiables sur votre CMS.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/app/content/analytics"
            className="inline-flex items-center gap-1.5 border border-DEFAULT hover:bg-surface text-ink-muted hover:text-ink px-3 py-2 rounded-md transition-colors"
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            <BarChart3 size={13} strokeWidth={1.8} />
            Analytics
          </Link>
          <Link
            href="/app/content/new"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-md transition-colors"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Plus size={14} strokeWidth={2.2} />
            Nouvel article
          </Link>
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-success bg-emerald-50 px-4 py-3 text-success" style={{ fontSize: 13 }}>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-DEFAULT border-l-2 border-l-danger bg-white px-4 py-3 text-danger" style={{ fontSize: 13 }}>
          {errorMsg}
        </div>
      )}

      {/* Quota banner — tier-aware (S35) */}
      {quotaReached && (
        <div className="mb-6 rounded-lg border border-DEFAULT border-l-2 border-l-brand-500 bg-brand-50 px-4 py-3 flex items-start gap-3" style={{ fontSize: 13 }}>
          <Sparkles size={16} strokeWidth={1.8} className="text-brand-500 mt-0.5 shrink-0" />
          <div className="flex-1 text-brand-600">
            {tier === "free" ? (
              <>
                Vous avez utilisé vos <strong>{limits.articles_per_month} articles gratuits</strong> (crédit unique).{" "}
                Débloquez plus d&apos;articles avec un plan Content.{" "}
                <Link href="/app/content/upgrade" className="underline hover:text-brand-700 font-semibold">Voir les plans →</Link>
              </>
            ) : (
              <>
                Vous avez utilisé vos <strong>{limits.articles_per_month} articles du plan {CONTENT_TIER_LABELS[tier]}</strong> ce mois-ci.
                Le quota se renouvelle au prochain cycle de facturation.{" "}
                <Link href="/app/content/upgrade" className="underline hover:text-brand-700 font-semibold">Upgrader le plan →</Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* KPI strip 3 cells */}
      <KpiStrip className="mb-6">
        <KpiCell label="Brouillons" value={drafts} hint={drafts > 0 ? "à publier" : "—"} />
        <KpiCell label="Publiés" value={published} hint={published > 0 ? "sur CMS" : "—"} />
        <KpiCell
          label={tier === "free" ? "Quota total" : "Ce mois-ci"}
          value={`${usedThisPeriod} / ${limits.articles_per_month}`}
          hint={`plan ${CONTENT_TIER_LABELS[tier]}`}
        />
      </KpiStrip>

      {/* Empty state */}
      {rows.length === 0 ? (
        <div className="bg-white border border-DEFAULT rounded-xl shadow-card p-10 text-center">
          <FileText size={32} strokeWidth={1.5} className="mx-auto mb-3 text-ink-subtle" />
          <h2 className="text-ink mb-2" style={{ fontSize: 18, fontWeight: 600 }}>
            Aucun article pour l&apos;instant
          </h2>
          <p className="text-ink-muted mb-5 max-w-md mx-auto" style={{ fontSize: 13 }}>
            Générez votre premier article GEO en moins de 30 secondes. L&apos;IA rédige un contenu optimisé pour être cité par les LLM, prêt à publier.
          </p>
          <Link
            href="/app/content/new"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-md transition-colors"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            <Plus size={16} strokeWidth={2.2} />
            Créer mon premier article
          </Link>
        </div>
      ) : (
        <ArticlesTable rows={rows} />
      )}
    </div>
  );
}

function ArticlesTable({ rows }: { rows: ArticleRow[] }) {
  return (
    <div className="bg-white border border-DEFAULT rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface border-b border-DEFAULT">
            <tr>
              <Th>Titre</Th>
              <Th>Statut</Th>
              <Th>CMS</Th>
              <Th>Date</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-DEFAULT last:border-b-0 hover:bg-surface/50 transition-colors">
                <Td>
                  <Link
                    href={`/app/content/${r.id}`}
                    className="block text-ink hover:text-brand-500 transition-colors truncate max-w-md"
                    style={{ fontSize: 13, fontWeight: 500 }}
                  >
                    {r.title || "(sans titre)"}
                  </Link>
                  {r.slug && (
                    <div className="text-ink-subtle font-mono truncate max-w-md mt-0.5" style={{ fontSize: 11 }}>
                      /{r.slug}
                    </div>
                  )}
                </Td>
                <Td>
                  <StatusBadge status={r.status} />
                </Td>
                <Td>
                  {r.cms_url ? (
                    <a
                      href={r.cms_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-500 hover:text-brand-600 transition-colors"
                      style={{ fontSize: 12 }}
                    >
                      {r.cms_target || "voir"}
                      <ExternalLink size={11} strokeWidth={2} />
                    </a>
                  ) : (
                    <span className="text-ink-subtle font-mono" style={{ fontSize: 11 }}>—</span>
                  )}
                </Td>
                <Td>
                  <span className="text-ink-muted font-mono" style={{ fontSize: 11 }}>
                    {fmtDate(r.published_at ?? r.created_at)}
                  </span>
                </Td>
                <Td align="right">
                  <RowActions row={r} />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RowActions({ row }: { row: ArticleRow }) {
  if (row.status === "published" && row.cms_url) {
    return (
      <a
        href={row.cms_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-DEFAULT hover:bg-surface text-ink-muted hover:text-ink transition-colors"
        style={{ fontSize: 12, fontWeight: 500 }}
      >
        Voir
        <ExternalLink size={11} strokeWidth={2} />
      </a>
    );
  }
  if (row.status === "draft" || row.status === "review") {
    return (
      <div className="inline-flex items-center gap-2">
        <Link
          href={`/app/content/${row.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-DEFAULT hover:bg-surface text-ink-muted hover:text-ink transition-colors"
          style={{ fontSize: 12, fontWeight: 500 }}
        >
          Éditer
        </Link>
        <form action={publishArticle} className="inline-flex">
          <input type="hidden" name="article_id" value={row.id} />
          <button
            type="submit"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-ink hover:bg-ink/90 text-white transition-colors"
            style={{ fontSize: 12, fontWeight: 500 }}
          >
            Publier
          </button>
        </form>
      </div>
    );
  }
  return <span className="text-ink-subtle font-mono" style={{ fontSize: 11 }}>—</span>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    draft:     { bg: "#F1F5F9", fg: "#5B6478", label: "Brouillon" },
    review:    { bg: "#FEF3C7", fg: "#92400E", label: "Revue" },
    published: { bg: "#D1FAE5", fg: "#065F46", label: "Publié" },
    failed:    { bg: "#FEE2E2", fg: "#991B1B", label: "Échec" },
  };
  const s = map[status] ?? map.draft;
  return (
    <span
      className="inline-block font-mono uppercase rounded"
      style={{
        fontSize: 10,
        letterSpacing: "0.1em",
        padding: "3px 8px",
        background: s.bg,
        color: s.fg,
        fontWeight: 600,
      }}
    >
      {s.label}
    </span>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className="font-mono uppercase text-ink-subtle px-4 py-2.5"
      style={{ fontSize: 10, letterSpacing: "0.14em", textAlign: align, fontWeight: 600 }}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <td className="px-4 py-3 align-middle" style={{ textAlign: align }}>
      {children}
    </td>
  );
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso.slice(0, 10);
  }
}
