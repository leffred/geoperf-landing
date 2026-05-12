"use client";

// V2 — Topbar : 52px sticky bar with logo + nav + search + bell + CTA + avatar.
// Client component (reads usePathname for active state).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Bell, Plus } from "lucide-react";
import { logout } from "@/app/[locale]/login/actions";
import { AddBrandWizard } from "./AddBrandWizard";
import { CommandPalette } from "./CommandPalette";
import type { PaletteBrand } from "./CommandPalette";
import { ThemeToggle } from "./ThemeToggle";

interface TopbarProps {
  userEmail: string;
  initials: string;
  canPickWeekly?: boolean;
  paletteBrands?: PaletteBrand[];
}

const NAV_ITEMS = [
  { href: "/app/dashboard", label: "Dashboard", match: (p: string) => p === "/app/dashboard" },
  { href: "/app/brands",    label: "Marques",    match: (p: string) => p.startsWith("/app/brands") },
  { href: "/app/alerts",    label: "Alertes",    match: (p: string) => p.startsWith("/app/alerts") },
];

export function Topbar({ userEmail: _userEmail, initials, canPickWeekly = true, paletteBrands = [] }: TopbarProps) {
  const pathname = usePathname() ?? "";
  const [wizardOpen, setWizardOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between border-b border-DEFAULT bg-white px-5"
      style={{ height: 52 }}
    >
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link href="/app/dashboard" className="inline-flex items-center gap-2 text-ink" style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>
          <span
            className="grid place-items-center text-white rounded-[5px] bg-ink"
            style={{ width: 18, height: 18, fontSize: 10, fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}
          >
            G
          </span>
          <span>
            Geoperf
            <span style={{ color: "#EF9F27", marginLeft: -2 }}>·</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center" style={{ gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1.5 rounded-md transition-colors duration-fast ${
                  isActive ? "bg-surface text-ink" : "text-ink-muted hover:bg-surface hover:text-ink"
                }`}
                style={{ fontSize: 13, fontWeight: 500 }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Search trigger → command palette ⌘K */}
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="hidden lg:flex items-center gap-2 relative bg-surface hover:bg-surface-2 border border-DEFAULT rounded-md text-left text-ink-subtle transition-colors duration-fast"
          style={{ width: 220, paddingLeft: 10, paddingRight: 8, paddingTop: 6, paddingBottom: 6, fontSize: 13 }}
          aria-label="Recherche (Cmd+K)"
        >
          <Search size={13} strokeWidth={1.6} />
          <span className="flex-1">Rechercher…</span>
          <span
            className="font-mono bg-white border border-DEFAULT rounded text-ink-subtle"
            style={{ fontSize: 10, padding: "1px 4px" }}
          >
            ⌘K
          </span>
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Bell */}
        <button
          type="button"
          className="grid place-items-center text-ink-muted hover:text-ink hover:bg-surface rounded-md transition-colors duration-fast"
          style={{ width: 32, height: 32 }}
          aria-label="Notifications"
        >
          <Bell size={14} strokeWidth={1.6} />
        </button>

        {/* CTA — opens wizard modal */}
        <button
          type="button"
          onClick={() => setWizardOpen(true)}
          className="inline-flex items-center gap-1.5 bg-brand-500 text-white px-3 py-1.5 rounded-md hover:bg-brand-600 transition-colors duration-fast"
          style={{ fontSize: 13, fontWeight: 500 }}
        >
          <Plus size={13} strokeWidth={2} />
          Ajouter une marque
        </button>

        {/* Avatar — links to settings, logout via form */}
        <form action={logout}>
          <button
            type="submit"
            title="Logout"
            className="grid place-items-center rounded-full text-white"
            style={{
              width: 28,
              height: 28,
              background: "linear-gradient(135deg, #C77D2C, #2563EB)",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {initials}
          </button>
        </form>
      </div>

      {/* Wizard modal — controlled here */}
      <AddBrandWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        canPickWeekly={canPickWeekly}
      />

      {/* Command palette ⌘K */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        brands={paletteBrands}
      />
    </header>
  );
}
