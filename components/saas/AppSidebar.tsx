// Sidebar gauche hiérarchique pour /app/*. Spec : SPRINTS_S8_S9_S10_PLAN.md S8.3
//
// Sections, dans l'ordre :
//   1. Brand selector (dropdown haut) avec score actuel
//   2. TOPICS — liste topics de la brand courante
//   3. VIEWS — Visibility / Sources / By Model / By Prompt / Competition
//   4. BRAND HEALTH (S9 placeholder) — Sentiment / Alignment
//   5. OPTIMIZATION (S9 placeholder) — Content Studio
//   6. SETTINGS — Prompts / Brand Setup
//   7. Other brands (mini-list) + + Add Brand
//
// Côté UX :
//   - Sidebar fixe à gauche en desktop (lg+), drawer en mobile (toggle button)
//   - Item courant highlighted
//   - Topic sélectionné highlighted
//
// Note : si l'user n'est pas sur une page brand-specific, on affiche un état "Choisis une marque"
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TierBadge } from "./TierBadge";
import type { SaasTier } from "@/lib/saas-auth";
import { assignBrandColor, ownerBrandColor } from "@/lib/brand-colors";

export type SidebarBrand = {
  id: string;
  name: string;
  domain: string;
  visibility_score: number | null;
  unread_alerts: number;
};

export type SidebarTopic = {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  is_default: boolean;
};

type Props = {
  /** Email de l'user pour le footer */
  userEmail: string | null | undefined;
  /** Tier pour TierBadge */
  tier: SaasTier;
  /** Toutes les brands accessibles à l'user (owner + member of) */
  brands: SidebarBrand[];
  /** Topics groupés par brand_id */
  topicsByBrand: Record<string, SidebarTopic[]>;
  /** Total alertes non lues (badge dashboard) */
  unreadAlertsTotal: number;
  /** Total seats utilisés (pour gating Team item) */
  showTeam: boolean;
  /** Action server form pour logout */
  logoutAction: (formData: FormData) => Promise<void> | void;
  /** Si membre, email de l'owner pour affichage dans header sidebar */
  ownerEmail?: string | null;
};

// SVG icons compactes pour la sidebar (pas de lib externe)
const Icon = {
  dashboard: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><rect x="2" y="2" width="5" height="5"/><rect x="9" y="2" width="5" height="5"/><rect x="2" y="9" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/></svg>,
  topic: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path d="M3 4h10M3 8h10M3 12h7"/></svg>,
  visibility: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path d="M2 8s2-5 6-5 6 5 6 5-2 5-6 5-6-5-6-5z"/><circle cx="8" cy="8" r="2"/></svg>,
  sources: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path d="M3 3h7l3 3v7H3z"/><path d="M10 3v3h3" strokeOpacity="0.6"/></svg>,
  llm: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><circle cx="8" cy="8" r="5"/><path d="M3 8h10M8 3v10" strokeOpacity="0.5"/></svg>,
  prompt: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path d="M3 4h10v6H7l-3 3v-3H3z"/></svg>,
  competition: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><rect x="2" y="6" width="3" height="7"/><rect x="6.5" y="3" width="3" height="10"/><rect x="11" y="8" width="3" height="5"/></svg>,
  alerts: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path d="M8 2c-2 0-4 1-4 5v2l-1 1.5h10L12 9V7c0-4-2-5-4-5z"/><path d="M6.5 13a1.5 1.5 0 0 0 3 0"/></svg>,
  sentiment: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><circle cx="8" cy="8" r="6"/><circle cx="6" cy="7" r="0.6" fill="currentColor"/><circle cx="10" cy="7" r="0.6" fill="currentColor"/><path d="M5.5 10.5c.7.6 1.7 1 2.5 1s1.8-.4 2.5-1"/></svg>,
  alignment: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path d="M3 3h10M3 8h6M3 13h10"/></svg>,
  studio: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path d="M11.5 3.5l1 1L5 12l-2 .5L3.5 11z"/></svg>,
  team: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><circle cx="6" cy="6" r="2.5"/><circle cx="11" cy="7" r="1.6" strokeOpacity="0.7"/><path d="M2 13c0-2 2-3.5 4-3.5s4 1.5 4 3.5"/><path d="M10 13c0-1.4 1-2.5 2.5-2.5S15 11.6 15 13" strokeOpacity="0.7"/></svg>,
  billing: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><rect x="2" y="4" width="12" height="8"/><line x1="2" y1="7" x2="14" y2="7"/></svg>,
  settings: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><circle cx="8" cy="8" r="2"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4"/></svg>,
  add: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-3.5 h-3.5"><path d="M8 3v10M3 8h10"/></svg>,
  burger: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M3 6h18M3 12h18M3 18h18"/></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M5 5l14 14M19 5L5 19"/></svg>,
};

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export function AppSidebar({
  userEmail,
  tier,
  brands,
  topicsByBrand,
  unreadAlertsTotal,
  showTeam,
  logoutAction,
  ownerEmail,
}: Props) {
  const pathname = usePathname() || "/app/dashboard";
  const [mobileOpen, setMobileOpen] = useState(false);

  // Détection brand courante depuis l'URL
  const brandIdFromUrl = useMemo(() => {
    const m = pathname.match(/^\/app\/brands\/([0-9a-f-]{36})/i);
    return m ? m[1] : null;
  }, [pathname]);

  const topicIdFromUrl = useMemo(() => {
    const m = pathname.match(/^\/app\/brands\/[0-9a-f-]{36}\/topics\/([0-9a-f-]{36})/i);
    return m ? m[1] : null;
  }, [pathname]);

  const currentBrand = useMemo(() => {
    if (brandIdFromUrl) return brands.find(b => b.id === brandIdFromUrl) ?? null;
    return brands[0] ?? null;
  }, [brandIdFromUrl, brands]);

  const currentBrandTopics = currentBrand ? (topicsByBrand[currentBrand.id] ?? []) : [];
  const otherBrands = currentBrand ? brands.filter(b => b.id !== currentBrand.id) : brands;

  function NavItem({ href, icon, label, active, badge }: { href: string; icon: React.ReactNode; label: string; active?: boolean; badge?: number | string | null }) {
    return (
      <Link
        href={href}
        onClick={() => setMobileOpen(false)}
        className={classNames(
          "flex items-center gap-2.5 px-3 py-2 text-[13px] transition rounded-sm",
          active
            ? "bg-navy text-white"
            : "text-navy hover:bg-cream"
        )}
      >
        <span className="shrink-0">{icon}</span>
        <span className="flex-1 truncate">{label}</span>
        {badge !== null && badge !== undefined && badge !== "" && badge !== 0 ? (
          <span className={classNames(
            "font-mono text-[10px] px-1.5 py-0.5 rounded-sm",
            active ? "bg-white/20 text-white" : "bg-amber/30 text-navy"
          )}>{badge}</span>
        ) : null}
      </Link>
    );
  }

  function SectionLabel({ children }: { children: React.ReactNode }) {
    return <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted px-3 mt-4 mb-1.5">{children}</p>;
  }

  const sidebarBody = (
    <div className="flex flex-col h-full bg-white border-r border-navy/10">
      {/* Header logo + user */}
      <div className="px-4 py-4 border-b border-navy/10">
        <Link href="/app/dashboard" onClick={() => setMobileOpen(false)} className="font-serif text-lg text-navy block leading-tight">
          Ge<span className="text-amber">·</span>perf
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <TierBadge tier={tier} />
          {ownerEmail && <span className="font-mono text-[10px] text-ink-muted truncate" title={`Membre du compte de ${ownerEmail}`}>de {ownerEmail}</span>}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {/* Section : Top-level */}
        <div className="px-2 space-y-0.5">
          <NavItem href="/app/dashboard" icon={Icon.dashboard} label="Dashboard" active={pathname === "/app/dashboard"} />
          <NavItem href="/app/alerts" icon={Icon.alerts} label="Alertes" active={pathname.startsWith("/app/alerts")} badge={unreadAlertsTotal > 0 ? unreadAlertsTotal : null} />
        </div>

        {/* Section : Brand selector + topics + views */}
        {currentBrand ? (
          <>
            <SectionLabel>Marque sélectionnée</SectionLabel>
            <div className="px-2">
              <div className="bg-cream/70 px-3 py-2 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-2.5 h-2.5 inline-block rounded-sm shrink-0"
                    style={{ background: assignBrandColor(currentBrand.domain || currentBrand.name).hex }}
                    aria-hidden
                  />
                  <Link href={`/app/brands/${currentBrand.id}`} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-navy truncate hover:underline">
                    {currentBrand.name}
                  </Link>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-mono text-ink-muted truncate">{currentBrand.domain}</span>
                  <span className="font-serif text-lg text-navy">{currentBrand.visibility_score?.toFixed(0) ?? "—"}</span>
                </div>
                {brands.length > 1 && (
                  <details className="mt-2 group">
                    <summary className="text-[10px] text-ink-muted cursor-pointer hover:text-navy font-mono uppercase tracking-widest">Changer ▾</summary>
                    <ul className="mt-2 space-y-1">
                      {otherBrands.map(b => (
                        <li key={b.id}>
                          <Link
                            href={`/app/brands/${b.id}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 text-xs text-navy hover:underline py-0.5"
                          >
                            <span
                              className="w-2 h-2 inline-block rounded-sm shrink-0"
                              style={{ background: assignBrandColor(b.domain || b.name).hex }}
                              aria-hidden
                            />
                            <span className="truncate flex-1">{b.name}</span>
                            <span className="font-mono text-[10px] text-ink-muted shrink-0">{b.visibility_score?.toFixed(0) ?? "—"}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </div>

            <SectionLabel>Topics ({currentBrandTopics.length})</SectionLabel>
            <div className="px-2 space-y-0.5">
              {currentBrandTopics.slice(0, 8).map(t => (
                <NavItem
                  key={t.id}
                  href={`/app/brands/${currentBrand.id}/topics/${t.id}`}
                  icon={Icon.topic}
                  label={t.name}
                  active={topicIdFromUrl === t.id}
                />
              ))}
              <Link
                href={`/app/brands/${currentBrand.id}/topics`}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-1.5 text-[11px] text-ink-muted hover:text-navy"
              >
                Tout gérer →
              </Link>
            </div>

            <SectionLabel>Vues</SectionLabel>
            <div className="px-2 space-y-0.5">
              <NavItem href={`/app/brands/${currentBrand.id}`} icon={Icon.visibility} label="Visibility" active={pathname === `/app/brands/${currentBrand.id}`} />
              <NavItem href={`/app/brands/${currentBrand.id}/sources`} icon={Icon.sources} label="Sources" active={pathname.startsWith(`/app/brands/${currentBrand.id}/sources`)} />
              <NavItem href={`/app/brands/${currentBrand.id}/by-model`} icon={Icon.llm} label="Par LLM" active={pathname.startsWith(`/app/brands/${currentBrand.id}/by-model`)} />
              <NavItem href={`/app/brands/${currentBrand.id}/by-prompt`} icon={Icon.prompt} label="Par prompt" active={pathname.startsWith(`/app/brands/${currentBrand.id}/by-prompt`)} />
            </div>

            <SectionLabel>Brand Health</SectionLabel>
            <div className="px-2 space-y-0.5">
              <span className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-ink-muted/60 cursor-not-allowed" title="Sentiment analysis (Sprint S9)">
                <span className="shrink-0">{Icon.sentiment}</span>
                <span className="flex-1">Sentiment</span>
                <span className="font-mono text-[9px] uppercase tracking-widest opacity-70">Soon</span>
              </span>
              <span className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-ink-muted/60 cursor-not-allowed" title="Brand alignment (Sprint S9)">
                <span className="shrink-0">{Icon.alignment}</span>
                <span className="flex-1">Alignment</span>
                <span className="font-mono text-[9px] uppercase tracking-widest opacity-70">Soon</span>
              </span>
            </div>

            <SectionLabel>Optimization</SectionLabel>
            <div className="px-2 space-y-0.5">
              <span className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-ink-muted/60 cursor-not-allowed" title="Content Studio (Sprint S9)">
                <span className="shrink-0">{Icon.studio}</span>
                <span className="flex-1">Content Studio</span>
                <span className="font-mono text-[9px] uppercase tracking-widest opacity-70">Soon</span>
              </span>
            </div>
          </>
        ) : (
          <div className="px-4 mt-4">
            <p className="text-xs text-ink-muted mb-2">Aucune marque suivie.</p>
            <Link
              href="/app/brands/new"
              onClick={() => setMobileOpen(false)}
              className="inline-block bg-amber text-navy px-3 py-1.5 text-xs font-medium hover:bg-amber/90 transition"
            >
              + Suivre ma 1re marque
            </Link>
          </div>
        )}

        <SectionLabel>Settings</SectionLabel>
        <div className="px-2 space-y-0.5">
          {showTeam && <NavItem href="/app/team" icon={Icon.team} label="Équipe" active={pathname.startsWith("/app/team")} />}
          <NavItem href="/app/billing" icon={Icon.billing} label="Abonnement" active={pathname.startsWith("/app/billing")} />
          <NavItem href="/app/brands" icon={Icon.competition} label="Toutes les marques" active={pathname === "/app/brands"} />
          <NavItem href="/app/settings" icon={Icon.settings} label="Réglages" active={pathname.startsWith("/app/settings")} />
        </div>

        {brands.length > 0 && (
          <>
            <SectionLabel>Autres marques</SectionLabel>
            <div className="px-2 space-y-0.5">
              {brands.slice(0, 6).map(b => {
                const active = currentBrand?.id === b.id;
                if (active) return null;
                return (
                  <Link
                    key={b.id}
                    href={`/app/brands/${b.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-navy hover:bg-cream transition rounded-sm"
                  >
                    <span
                      className="w-2 h-2 inline-block rounded-sm shrink-0"
                      style={{ background: assignBrandColor(b.domain || b.name).hex }}
                      aria-hidden
                    />
                    <span className="truncate flex-1">{b.name}</span>
                    {b.unread_alerts > 0 && <span className="font-mono text-[10px] text-amber">{b.unread_alerts}</span>}
                  </Link>
                );
              })}
              <Link
                href="/app/brands/new"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-amber hover:underline"
              >
                <span className="shrink-0">{Icon.add}</span>
                <span>Add Brand</span>
              </Link>
            </div>
          </>
        )}
      </nav>

      {/* Footer : email + logout */}
      <div className="px-4 py-3 border-t border-navy/10">
        <p className="font-mono text-[11px] text-ink-muted truncate mb-2" title={userEmail || ""}>
          {userEmail}
        </p>
        <form action={logoutAction}>
          <button type="submit" className="w-full text-left font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy transition">
            Logout
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile burger */}
      <button
        type="button"
        aria-label="Ouvrir le menu"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-white border border-navy/15 text-navy hover:bg-cream"
      >
        {Icon.burger}
      </button>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-navy/40"
        />
      )}

      {/* Sidebar — desktop : sticky ; mobile : drawer */}
      <aside
        className={classNames(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-30"
        )}
      >
        {/* Mobile close button */}
        <button
          type="button"
          aria-label="Fermer"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-2 right-2 z-10 p-1.5 text-navy hover:bg-cream"
        >
          {Icon.close}
        </button>
        {sidebarBody}
      </aside>
    </>
  );
}
