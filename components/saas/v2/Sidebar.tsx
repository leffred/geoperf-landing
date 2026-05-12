"use client";

// V2 — Sidebar : 220px column. Overview links + tracked brands list + tier card footer.
// Client component (reads usePathname for active state). Brand list comes from props.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Zap } from "lucide-react";

export interface SidebarBrand {
  id: string;
  name: string;
  /** Resolved CSS color (hex or var). */
  color: string;
  visibilityScore: number | null;
  isActive?: boolean;
}

interface SidebarProps {
  brands: SidebarBrand[];
  tier: string;
  brandsLimit: number;
  nextSnapshotLabel?: string;
  unreadAlerts?: number;
  pendingRecos?: number;
}

export function Sidebar({
  brands,
  tier,
  brandsLimit,
  nextSnapshotLabel,
  unreadAlerts = 0,
  pendingRecos = 0,
}: SidebarProps) {
  const pathname = usePathname() ?? "";
  const isDashboard = pathname === "/app/dashboard";
  const isAlerts = pathname.startsWith("/app/alerts");
  const isRecos = pathname.startsWith("/app/recos");
  const isBrandActive = (id: string) => pathname.startsWith(`/app/brands/${id}`);

  const tierLower = tier.toLowerCase();
  const isFree = tierLower === "free";
  const upgradeLabel = isFree ? "Passer à Starter" : tierLower === "starter" ? "Passer à Pro" : null;

  return (
    <aside
      className="hidden md:flex flex-col border-r border-DEFAULT bg-white shrink-0"
      style={{ width: 220, padding: "16px 12px" }}
    >
      <SidebarSection label="Vue d'ensemble" />
      <SidebarItem href="/app/dashboard" active={isDashboard} dotColor={isDashboard ? "#2563EB" : "#8C94A6"} badge={brands.length > 0 ? String(brands.length) : undefined}>
        Dashboard
      </SidebarItem>
      <SidebarItem href="/app/alerts" active={isAlerts} badge={unreadAlerts > 0 ? String(unreadAlerts) : undefined}>
        Alertes
      </SidebarItem>
      <SidebarItem href="/app/recos" active={isRecos} badge={pendingRecos > 0 ? String(pendingRecos) : undefined}>
        Recommandations
      </SidebarItem>

      <SidebarSection label="Marques suivies" />
      {brands.length === 0 && (
        <div className="px-2.5 py-2 text-ink-subtle" style={{ fontSize: 12 }}>
          Aucune marque
        </div>
      )}
      {brands.map((b) => (
        <SidebarItem
          key={b.id}
          href={`/app/brands/${b.id}`}
          active={isBrandActive(b.id)}
          dotColor={b.color}
          badge={b.visibilityScore !== null ? String(Math.round(b.visibilityScore)) : undefined}
        >
          {b.name}
        </SidebarItem>
      ))}

      <Link
        href="/app/brands/new"
        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-ink-subtle hover:bg-surface hover:text-ink transition-colors duration-fast"
        style={{ fontSize: 13, fontWeight: 500 }}
      >
        <Plus size={12} strokeWidth={1.8} />
        Ajouter une marque
      </Link>

      <div className="mt-auto pt-3" style={{ padding: "12px 6px 4px" }}>
        <div className="bg-white border border-DEFAULT rounded-lg shadow-card" style={{ padding: 12 }}>
          <div className="flex items-center justify-between mb-2">
            <span
              className="font-mono uppercase rounded"
              style={{
                fontSize: 9,
                letterSpacing: "0.14em",
                padding: "2px 6px",
                background: "#EFF4FE",
                color: "#2563EB",
              }}
            >
              {tier.toUpperCase()}
            </span>
            <span className="font-mono text-ink-subtle" style={{ fontSize: 10 }}>
              {brands.length}/{brandsLimit} marques
            </span>
          </div>
          {nextSnapshotLabel && (
            <>
              <div className="text-ink-muted" style={{ fontSize: 11 }}>
                Prochain snapshot
              </div>
              <div className="font-mono text-ink" style={{ fontSize: 11, marginTop: 2 }}>
                {nextSnapshotLabel}
              </div>
            </>
          )}
          <Link
            href="/app/billing"
            className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-md transition-colors duration-fast"
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "5px 8px",
              background: upgradeLabel ? "#2563EB" : "#F1F5F9",
              color: upgradeLabel ? "#fff" : "#5B6478",
            }}
          >
            <Zap size={10} strokeWidth={2.2} />
            {upgradeLabel ?? "Gérer l'abonnement"}
          </Link>
        </div>
      </div>
    </aside>
  );
}

function SidebarSection({ label }: { label: string }) {
  return (
    <div
      className="font-mono uppercase text-ink-subtle"
      style={{ fontSize: 10, letterSpacing: "0.14em", padding: "14px 10px 6px" }}
    >
      {label}
    </div>
  );
}

function SidebarItem({
  href,
  children,
  active,
  dotColor = "#8C94A6",
  badge,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  dotColor?: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors duration-fast ${
        active ? "bg-surface text-ink" : "text-ink-muted hover:bg-surface hover:text-ink"
      }`}
      style={{ fontSize: 13, fontWeight: 500 }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: dotColor,
          flexShrink: 0,
        }}
      />
      <span className="truncate flex-1">{children}</span>
      {badge && (
        <span className="font-mono text-ink-subtle" style={{ fontSize: 10 }}>
          {badge}
        </span>
      )}
    </Link>
  );
}
