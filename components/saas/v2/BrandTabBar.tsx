"use client";

// Barre d'onglets commune à toutes les sous-pages d'une marque.
// Utilise usePathname pour déduire l'onglet actif.

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function BrandTabBar({ id }: { id: string }) {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const isOverview   = pathname === `/app/brands/${id}` && !tab;
  const isSnapshots  = pathname === `/app/brands/${id}` && tab === "snapshots";
  const isRecos      = pathname === `/app/brands/${id}` && tab === "recos";
  const isSources      = pathname.startsWith(`/app/brands/${id}/sources`);
  const isCompetitors  = pathname.startsWith(`/app/brands/${id}/competitors`);
  const isAlignment    = pathname.startsWith(`/app/brands/${id}/alignment`);
  const isSetup        = pathname.startsWith(`/app/brands/${id}/setup`);

  return (
    <div className="flex gap-0 border-b border-DEFAULT mb-5">
      <TabLink href={`/app/brands/${id}`}               active={isOverview}>Overview</TabLink>
      <TabLink href={`/app/brands/${id}?tab=snapshots`} active={isSnapshots}>Snapshots</TabLink>
      <TabLink href={`/app/brands/${id}?tab=recos`}     active={isRecos}>Recommandations</TabLink>
      <TabLink href={`/app/brands/${id}/sources`}       active={isSources}>Sources</TabLink>
      <TabLink href={`/app/brands/${id}/competitors`}   active={isCompetitors}>Concurrents</TabLink>
      <TabLink href={`/app/brands/${id}/alignment`}     active={isAlignment}>Alignement</TabLink>
      <TabLink href={`/app/brands/${id}/setup`}         active={isSetup}>Réglages</TabLink>
    </div>
  );
}

function TabLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3.5 py-2 text-sm font-medium border-b-2 -mb-px transition-colors duration-fast whitespace-nowrap ${
        active
          ? "border-brand-500 text-ink"
          : "border-transparent text-ink-muted hover:text-ink hover:border-DEFAULT"
      }`}
    >
      {children}
    </Link>
  );
}
