// S34 — Page Settings CMS : liste configs + formulaires Add (WordPress + Shopify).
// Server Component, tabs gérées via ?tab=wordpress|shopify.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, Trash2, X } from "lucide-react";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { addWordpressCms, addShopifyCms, addWebflowCms, deleteCms } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "CMS connectés — Geoperf", robots: { index: false, follow: false } };

interface CmsRow {
  id: string;
  cms_type: string;
  site_url: string | null;
  is_active: boolean;
  last_test_at: string | null;
  last_test_status: string | null;
  extra_config: Record<string, unknown> | null;
  created_at: string;
}

const ERROR_LABELS: Record<string, string> = {
  missing_site_url: "URL du site requise.",
  missing_username: "Identifiant WP requis.",
  missing_password: "App password requis.",
  missing_domain: "Domaine Shopify requis.",
  missing_token: "Access token requis.",
  missing_blog_id: "Blog ID requis.",
  missing_collection_id: "Collection ID Webflow requis.",
  missing_id: "Configuration introuvable.",
  insert_failed: "Échec de l'ajout du CMS.",
  delete_failed: "Échec de la suppression.",
};

const SUCCESS_LABELS: Record<string, string> = {
  added: "CMS ajouté avec succès.",
  deleted: "CMS supprimé.",
};

export default async function CmsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; error?: string; success?: string }>;
}) {
  const sp = await searchParams;
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data: configs } = await sb
    .from("client_cms_config")
    .select("id, cms_type, site_url, is_active, last_test_at, last_test_status, extra_config, created_at")
    .eq("client_id", ctx.user.id)
    .order("created_at", { ascending: false });
  const rows = (configs as CmsRow[] | null) ?? [];

  const tab: "wordpress" | "shopify" | "webflow" =
    sp.tab === "shopify" ? "shopify" :
    sp.tab === "webflow" ? "webflow" :
    "wordpress";
  const errorMsg = sp.error ? ERROR_LABELS[sp.error] ?? `Erreur : ${sp.error}` : null;
  const successMsg = sp.success ? SUCCESS_LABELS[sp.success] ?? null : null;

  return (
    <div className="px-6 md:px-8 py-6 md:py-8 max-w-3xl mx-auto">
      <Link
        href="/app/settings"
        className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink mb-4 transition-colors"
        style={{ fontSize: 12 }}
      >
        <ArrowLeft size={13} strokeWidth={1.8} />
        Réglages
      </Link>

      <div className="mb-6">
        <div className="font-mono uppercase text-brand-500 mb-1" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
          // Intégrations CMS
        </div>
        <h1 className="text-ink leading-tight tracking-tight" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>
          CMS connectés
        </h1>
        <p className="text-ink-muted mt-1" style={{ fontSize: 13 }}>
          Configurez vos CMS pour publier des articles GEO en 1 clic depuis <Link href="/app/content" className="text-brand-500 hover:text-brand-600 underline">Mes articles</Link>.
        </p>
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

      {/* Section : CMS configurés */}
      <section className="mb-8">
        <h2 className="text-ink mb-3" style={{ fontSize: 14, fontWeight: 600 }}>
          CMS configurés
        </h2>
        {rows.length === 0 ? (
          <div className="bg-white border border-DEFAULT rounded-xl shadow-card p-6 text-center">
            <p className="text-ink-muted" style={{ fontSize: 13 }}>
              Aucun CMS configuré. Ajoutez-en un ci-dessous pour publier vos articles.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-DEFAULT rounded-xl shadow-card overflow-hidden">
            {rows.map((r, idx) => (
              <CmsRowItem key={r.id} row={r} isLast={idx === rows.length - 1} />
            ))}
          </div>
        )}
      </section>

      {/* Section : Ajouter un CMS */}
      <section>
        <h2 className="text-ink mb-3" style={{ fontSize: 14, fontWeight: 600 }}>
          Ajouter un CMS
        </h2>

        {/* Tabs */}
        <div className="inline-flex bg-surface rounded-lg p-1 mb-4">
          <TabLink href="/app/settings/cms" active={tab === "wordpress"}>
            WordPress
          </TabLink>
          <TabLink href="/app/settings/cms?tab=shopify" active={tab === "shopify"}>
            Shopify
          </TabLink>
          <TabLink href="/app/settings/cms?tab=webflow" active={tab === "webflow"}>
            Webflow
          </TabLink>
          <DisabledTab label="Wix" hint="S35" />
        </div>

        {tab === "wordpress" && <WordpressForm />}
        {tab === "shopify" && <ShopifyForm />}
        {tab === "webflow" && <WebflowForm />}
      </section>
    </div>
  );
}

function CmsRowItem({ row, isLast }: { row: CmsRow; isLast: boolean }) {
  const blogId = (row.extra_config as { blog_id?: string } | null)?.blog_id;
  return (
    <div className={`px-4 py-3 flex items-center gap-4 ${isLast ? "" : "border-b border-DEFAULT"}`}>
      <CmsBadge type={row.cms_type} />
      <div className="flex-1 min-w-0">
        <div className="text-ink truncate font-mono" style={{ fontSize: 12 }}>
          {row.site_url ?? "—"}
        </div>
        {blogId && (
          <div className="text-ink-subtle font-mono mt-0.5" style={{ fontSize: 10 }}>
            blog_id : {blogId}
          </div>
        )}
      </div>
      <TestStatus status={row.last_test_status} />
      <form action={deleteCms}>
        <input type="hidden" name="cms_id" value={row.id} />
        <button
          type="submit"
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-ink-subtle hover:text-danger hover:bg-danger/5 transition-colors"
          title="Supprimer cette configuration"
          aria-label="Supprimer"
          style={{ fontSize: 12 }}
        >
          <Trash2 size={13} strokeWidth={1.8} />
        </button>
      </form>
    </div>
  );
}

function CmsBadge({ type }: { type: string }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    wordpress: { bg: "#21759B", fg: "#FFFFFF", label: "WordPress" },
    shopify:   { bg: "#95BF47", fg: "#FFFFFF", label: "Shopify" },
    webflow:   { bg: "#146EF5", fg: "#FFFFFF", label: "Webflow" },
    wix:       { bg: "#000000", fg: "#FFFFFF", label: "Wix" },
  };
  const s = map[type] ?? { bg: "#5B6478", fg: "#FFFFFF", label: type };
  return (
    <span
      className="inline-block font-mono uppercase rounded shrink-0"
      style={{
        fontSize: 10,
        letterSpacing: "0.08em",
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

function TestStatus({ status }: { status: string | null }) {
  if (status === "ok") {
    return (
      <span className="inline-flex items-center gap-1 text-success font-mono" style={{ fontSize: 10 }}>
        <Check size={11} strokeWidth={2.4} /> OK
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1 text-danger font-mono" style={{ fontSize: 10 }}>
        <X size={11} strokeWidth={2.4} /> erreur
      </span>
    );
  }
  return <span className="text-ink-subtle font-mono" style={{ fontSize: 10 }}>—</span>;
}

function TabLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-md transition-colors ${
        active ? "bg-white text-ink shadow-card font-medium" : "text-ink-muted hover:text-ink"
      }`}
      style={{ fontSize: 12 }}
    >
      {children}
    </Link>
  );
}

function DisabledTab({ label, hint }: { label: string; hint: string }) {
  return (
    <span
      className="px-3 py-1.5 text-ink-subtle cursor-not-allowed inline-flex items-center gap-1.5"
      style={{ fontSize: 12 }}
      title={`Disponible en ${hint}`}
    >
      {label}
      <span className="font-mono text-ink-subtle bg-white rounded" style={{ fontSize: 9, padding: "1px 5px" }}>
        {hint}
      </span>
    </span>
  );
}

function WordpressForm() {
  return (
    <form action={addWordpressCms} className="bg-white border border-DEFAULT rounded-xl shadow-card p-5 md:p-6 space-y-4">
      <Field label="URL du site" htmlFor="wp_site_url" hint="ex : https://monsite.com">
        <input
          id="wp_site_url"
          name="site_url"
          type="url"
          required
          placeholder="https://monsite.com"
          className="w-full bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors text-ink"
          style={{ fontSize: 14 }}
        />
      </Field>
      <Field label="Identifiant WordPress" htmlFor="wp_username" hint="le username avec capacité publish_posts (Editor / Admin)">
        <input
          id="wp_username"
          name="username"
          type="text"
          required
          autoComplete="off"
          placeholder="admin"
          className="w-full bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors text-ink"
          style={{ fontSize: 14 }}
        />
      </Field>
      <Field
        label="Application Password"
        htmlFor="wp_app_password"
        hint={
          <>
            Générer dans WP Admin → Profil → <em>Application Passwords</em>. Format <code className="font-mono">xxxx xxxx xxxx xxxx xxxx xxxx</code>.
          </>
        }
      >
        <input
          id="wp_app_password"
          name="app_password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
          className="w-full bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors text-ink font-mono"
          style={{ fontSize: 13 }}
        />
      </Field>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-md transition-colors"
        style={{ fontSize: 13, fontWeight: 600 }}
      >
        Ajouter WordPress
      </button>
    </form>
  );
}

function ShopifyForm() {
  return (
    <form action={addShopifyCms} className="bg-white border border-DEFAULT rounded-xl shadow-card p-5 md:p-6 space-y-4">
      <Field label="Domaine Shopify" htmlFor="sh_domain" hint="format : mystore.myshopify.com (sans https://)">
        <input
          id="sh_domain"
          name="domain"
          type="text"
          required
          placeholder="mystore.myshopify.com"
          className="w-full bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors text-ink"
          style={{ fontSize: 14 }}
        />
      </Field>
      <Field
        label="Access Token"
        htmlFor="sh_token"
        hint={
          <>
            Token Admin API d&apos;une Custom App. Format <code className="font-mono">shpat_xxxxxxxxxxxx</code>.
            Scope requis : <code className="font-mono">write_content</code>.
          </>
        }
      >
        <input
          id="sh_token"
          name="access_token"
          type="password"
          required
          autoComplete="new-password"
          placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          className="w-full bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors text-ink font-mono"
          style={{ fontSize: 13 }}
        />
      </Field>
      <Field
        label="Blog ID"
        htmlFor="sh_blog_id"
        hint={
          <>
            💡 Admin Shopify → Online Store → Blog Posts → cliquez sur un blog. L&apos;URL contient <code className="font-mono">/blogs/&#123;blog_id&#125;</code>.
            Ou via API : <code className="font-mono">GET /admin/api/2024-01/blogs.json</code>.
          </>
        }
      >
        <input
          id="sh_blog_id"
          name="blog_id"
          type="text"
          required
          inputMode="numeric"
          placeholder="12345678"
          className="w-full bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors text-ink font-mono"
          style={{ fontSize: 14 }}
        />
      </Field>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-md transition-colors"
        style={{ fontSize: 13, fontWeight: 600 }}
      >
        Ajouter Shopify
      </button>
    </form>
  );
}

function WebflowForm() {
  return (
    <form action={addWebflowCms} className="bg-white border border-DEFAULT rounded-xl shadow-card p-5 md:p-6 space-y-4">
      <Field
        label="API Token"
        htmlFor="wf_token"
        hint={
          <>
            Webflow Dashboard → Account Settings → Integrations → <em>API Access</em>. Scope requis : <code className="font-mono">CMS write</code> sur le site cible.
          </>
        }
      >
        <input
          id="wf_token"
          name="api_token"
          type="password"
          required
          autoComplete="new-password"
          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          className="w-full bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors text-ink font-mono"
          style={{ fontSize: 13 }}
        />
      </Field>
      <Field
        label="Collection ID"
        htmlFor="wf_collection_id"
        hint={
          <>
            💡 Webflow Designer → CMS → Blog Posts collection → <em>Settings</em> → bas du panneau, <code className="font-mono">Collection ID</code>.
          </>
        }
      >
        <input
          id="wf_collection_id"
          name="collection_id"
          type="text"
          required
          placeholder="64a1b2c3d4e5f6a7b8c9d0e1"
          className="w-full bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors text-ink font-mono"
          style={{ fontSize: 13 }}
        />
      </Field>
      <Field
        label="Site ID (optionnel)"
        htmlFor="wf_site_id"
        hint="Pour générer le lien retour vers Webflow Designer après publication. Visible dans l'URL du Designer."
      >
        <input
          id="wf_site_id"
          name="site_id"
          type="text"
          placeholder="64a1b2c3d4e5f6a7b8c9d0e1"
          className="w-full bg-white px-3.5 py-2.5 rounded-md border border-DEFAULT hover:border-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors text-ink font-mono"
          style={{ fontSize: 13 }}
        />
      </Field>

      <div className="rounded-md bg-surface px-3 py-2.5 text-ink-muted" style={{ fontSize: 11, lineHeight: 1.5 }}>
        ⚠️ La collection Webflow doit utiliser les <strong>field slugs</strong> standards du template Blog :
        <code className="font-mono ml-1">name</code>, <code className="font-mono">slug</code>, <code className="font-mono">post-body</code>, <code className="font-mono">post-summary</code>.
        Si vos slugs diffèrent, la publication échouera en 422 (mapping custom prévu S35).
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-md transition-colors"
        style={{ fontSize: 13, fontWeight: 600 }}
      >
        Ajouter Webflow
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-mono uppercase text-ink-subtle mb-1.5" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 text-ink-subtle" style={{ fontSize: 11, lineHeight: 1.4 }}>
          {hint}
        </p>
      )}
    </div>
  );
}
