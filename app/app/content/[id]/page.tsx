// S34/S35 — Page édition d'un article GEO Content.
// Server Component shell : fetch article + visibility LLM + meta panel + ArticleEditor.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { ArticleEditor } from "./ArticleEditor";
import { LlmVisibilityPanel } from "./LlmVisibilityPanel";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Éditer l'article — Geoperf Content", robots: { index: false, follow: false } };

interface ArticleRow {
  id: string;
  title: string | null;
  slug: string | null;
  body_markdown: string | null;
  body_html: string | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: unknown;
  status: string;
  cms_url: string | null;
  cms_target: string | null;
  created_at: string;
  updated_at: string;
}

export interface LlmVisibilityRow {
  id: string;
  llm_name: string;
  query: string;
  appeared: boolean;
  response_excerpt: string | null;
  checked_at: string;
}

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  // Fetch article + LLM visibility en parallèle
  const [{ data }, { data: visibilityData }] = await Promise.all([
    sb
      .from("geo_articles")
      .select("id, title, slug, body_markdown, body_html, meta_title, meta_description, keywords, status, cms_url, cms_target, created_at, updated_at")
      .eq("id", id)
      .eq("client_id", ctx.user.id)
      .maybeSingle(),
    sb
      .from("geo_article_llm_visibility")
      .select("id, llm_name, query, appeared, response_excerpt, checked_at")
      .eq("article_id", id)
      .eq("client_id", ctx.user.id)
      .order("checked_at", { ascending: false }),
  ]);

  if (!data) notFound();
  const article = data as ArticleRow;
  const keywords = Array.isArray(article.keywords)
    ? (article.keywords as unknown[]).filter((k): k is string => typeof k === "string")
    : [];
  const isPublished = article.status === "published";
  const llmVisibility = (visibilityData as LlmVisibilityRow[] | null) ?? [];

  return (
    <div className="px-6 md:px-8 py-6 md:py-8 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/app/content"
        className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink mb-4 transition-colors"
        style={{ fontSize: 12 }}
      >
        <ArrowLeft size={13} strokeWidth={1.8} />
        Mes articles
      </Link>

      {/* Header titre + badge status */}
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <h1 className="text-ink leading-tight tracking-tight" style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>
          {article.title || "(sans titre)"}
        </h1>
        <StatusBadge status={article.status} />
      </div>
      {article.slug && (
        <p className="text-ink-subtle font-mono mb-5" style={{ fontSize: 11 }}>
          /{article.slug}
        </p>
      )}

      {/* Banner published */}
      {isPublished && article.cms_url && (
        <div className="mb-5 rounded-lg border border-DEFAULT border-l-2 border-l-success bg-emerald-50 px-4 py-3 flex items-start gap-3" style={{ fontSize: 13 }}>
          <div className="flex-1 text-success">
            Cet article est publié sur {article.cms_target ?? "votre CMS"}.{" "}
            <a
              href={article.cms_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-emerald-800 inline-flex items-center gap-1"
            >
              Voir en ligne
              <ExternalLink size={11} strokeWidth={2} />
            </a>
          </div>
        </div>
      )}

      {/* Layout 2 colonnes : éditeur + sidebar */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div>
          <ArticleEditor
            articleId={article.id}
            initialTitle={article.title ?? ""}
            initialHtml={article.body_html ?? ""}
            status={article.status}
          />
        </div>

        <aside className="space-y-4">
          <MetaPanel
            metaTitle={article.meta_title}
            metaDescription={article.meta_description}
            keywords={keywords}
            createdAt={article.created_at}
            updatedAt={article.updated_at}
          />

          {/* LLM Visibility — visible uniquement si publié */}
          {isPublished && (
            <LlmVisibilityPanel
              articleId={article.id}
              rows={llmVisibility}
            />
          )}
        </aside>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    draft:     { bg: "#F3F4F6", fg: "#6B7280", label: "Brouillon" },
    published: { bg: "#D1FAE5", fg: "#059669", label: "Publié" },
    generating:{ bg: "#FEF3C7", fg: "#D97706", label: "En génération…" },
  };
  const s = map[status] ?? { bg: "#F3F4F6", fg: "#6B7280", label: status };
  return (
    <span
      className="inline-block rounded-full font-mono uppercase"
      style={{ fontSize: 10, letterSpacing: "0.1em", padding: "3px 10px", background: s.bg, color: s.fg, fontWeight: 600 }}
    >
      {s.label}
    </span>
  );
}

function MetaPanel({
  metaTitle, metaDescription, keywords, createdAt, updatedAt,
}: {
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}) {
  return (
    <div className="bg-white border border-DEFAULT rounded-xl shadow-card p-4 space-y-4">
      <div>
        <div className="font-mono uppercase text-ink-subtle mb-1.5" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
          Meta SEO
        </div>
        <p className="text-ink-muted" style={{ fontSize: 11, lineHeight: 1.5 }}>
          Généré par l&apos;IA — non éditable en S34.
        </p>
      </div>
      <MetaField label="Meta title" value={metaTitle} max={60} />
      <MetaField label="Meta description" value={metaDescription} max={160} />
      <div>
        <div className="font-mono uppercase text-ink-subtle mb-1.5" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
          Keywords
        </div>
        {keywords.length === 0 ? (
          <span className="text-ink-subtle font-mono" style={{ fontSize: 11 }}>—</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((k) => (
              <span
                key={k}
                className="inline-block bg-surface text-ink-muted rounded"
                style={{ fontSize: 10, padding: "2px 7px", fontFamily: "monospace" }}
              >
                {k}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="pt-2 border-t border-DEFAULT space-y-1">
        <DateField label="Créé le" value={createdAt} />
        <DateField label="Modifié le" value={updatedAt} />
      </div>
    </div>
  );
}

function MetaField({ label, value, max }: { label: string; value: string | null; max: number }) {
  const len = value?.length ?? 0;
  const over = len > max;
  return (
    <div>
      <div className="font-mono uppercase text-ink-subtle mb-1" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
        {label}
        <span className={`ml-1 ${over ? "text-danger" : "text-ink-subtle"}`}>({len}/{max})</span>
      </div>
      {value ? (
        <p className="text-ink" style={{ fontSize: 12, lineHeight: 1.5 }}>{value}</p>
      ) : (
        <p className="text-ink-subtle" style={{ fontSize: 12 }}>—</p>
      )}
    </div>
  );
}

function DateField({ label, value }: { label: string; value: string }) {
  const d = new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-subtle font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.1em" }}>{label}</span>
      <span className="text-ink-muted font-mono" style={{ fontSize: 11 }}>{d}</span>
    </div>
  );
}
