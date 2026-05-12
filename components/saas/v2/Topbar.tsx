"use client";

// V2 — Topbar : 52px sticky bar with logo + nav + search + bell + CTA + avatar dropdown.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, Bell, Plus, Settings, FileText, LogOut, ChevronDown } from "lucide-react";
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

export function Topbar({ userEmail, initials, canPickWeekly = true, paletteBrands = [] }: TopbarProps) {
  const pathname = usePathname() ?? "";
  const [wizardOpen, setWizardOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Close dropdown on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
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
        {/* Search ⌘K */}
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="hidden lg:flex items-center gap-2 relative bg-surface hover:bg-surface-2 border border-DEFAULT rounded-md text-left text-ink-subtle transition-colors duration-fast"
          style={{ width: 220, paddingLeft: 10, paddingRight: 8, paddingTop: 6, paddingBottom: 6, fontSize: 13 }}
          aria-label="Recherche (Cmd+K)"
        >
          <Search size={13} strokeWidth={1.6} />
          <span className="flex-1">Rechercher…</span>
          <span className="font-mono bg-white border border-DEFAULT rounded text-ink-subtle" style={{ fontSize: 10, padding: "1px 4px" }}>
            ⌘K
          </span>
        </button>

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

        {/* CTA */}
        <button
          type="button"
          onClick={() => setWizardOpen(true)}
          className="inline-flex items-center gap-1.5 bg-brand-500 text-white px-3 py-1.5 rounded-md hover:bg-brand-600 transition-colors duration-fast"
          style={{ fontSize: 13, fontWeight: 500 }}
        >
          <Plus size={13} strokeWidth={2} />
          Ajouter une marque
        </button>

        {/* Avatar dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-1 rounded-full focus:outline-none"
            aria-label="Menu compte"
            aria-expanded={dropdownOpen}
          >
            <span
              className="grid place-items-center rounded-full text-white"
              style={{
                width: 28,
                height: 28,
                background: "linear-gradient(135deg, #C77D2C, #2563EB)",
                fontSize: 11,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {initials}
            </span>
            <ChevronDown
              size={12}
              strokeWidth={2}
              className={`text-ink-subtle transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 bg-white border border-DEFAULT rounded-lg shadow-card z-50"
              style={{ minWidth: 200, top: "100%" }}
            >
              {/* User info header */}
              <div className="px-4 py-3 border-b border-DEFAULT">
                <div className="text-xs font-mono text-ink-subtle truncate">{userEmail}</div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link
                  href="/app/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-surface transition-colors"
                >
                  <Settings size={14} strokeWidth={1.6} className="text-ink-subtle" />
                  Paramètres
                </Link>
                <Link
                  href="/app/billing"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-surface transition-colors"
                >
                  <FileText size={14} strokeWidth={1.6} className="text-ink-subtle" />
                  Factures &amp; abonnement
                </Link>
              </div>

              {/* Separator + Logout */}
              <div className="border-t border-DEFAULT py-1">
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors"
                  >
                    <LogOut size={14} strokeWidth={1.6} />
                    Déconnexion
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddBrandWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        canPickWeekly={canPickWeekly}
      />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        brands={paletteBrands}
      />
    </header>
  );
}
