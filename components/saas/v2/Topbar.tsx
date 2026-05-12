"use client";

// V2 — Topbar : 52px sticky bar with logo + nav + search + bell + CTA + avatar.
// Client component (reads usePathname for active state).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Plus } from "lucide-react";
import { logout } from "@/app/[locale]/login/actions";

interface TopbarProps {
  userEmail: string;
  initials: string;
}

const NAV_ITEMS = [
  { href: "/app/dashboard", label: "Dashboard", match: (p: string) => p === "/app/dashboard" },
  { href: "/app/brands",    label: "Marques",    match: (p: string) => p.startsWith("/app/brands") },
  { href: "/app/alerts",    label: "Alertes",    match: (p: string) => p.startsWith("/app/alerts") },
];

export function Topbar({ userEmail: _userEmail, initials }: TopbarProps) {
  const pathname = usePathname() ?? "";
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
        {/* Search (mock cmd+K) — non-functional placeholder for V2.1 */}
        <div className="hidden lg:block relative" style={{ width: 220 }}>
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-subtle" size={13} strokeWidth={1.6} />
          <input
            type="text"
            placeholder="Rechercher marque, source, prompt…"
            className="w-full bg-surface border border-DEFAULT rounded-md outline-none transition-colors duration-fast focus:border-brand-500 focus:bg-white text-ink placeholder:text-ink-subtle"
            style={{ paddingLeft: 28, paddingRight: 38, paddingTop: 6, paddingBottom: 6, fontSize: 13 }}
          />
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-ink-subtle bg-white border border-DEFAULT rounded"
            style={{ fontSize: 10, padding: "1px 4px" }}
          >
            ⌘K
          </span>
        </div>

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
        <Link
          href="/app/brands/new"
          className="inline-flex items-center gap-1.5 bg-brand-500 text-white px-3 py-1.5 rounded-md hover:bg-brand-600 transition-colors duration-fast"
          style={{ fontSize: 13, fontWeight: 500 }}
        >
          <Plus size={13} strokeWidth={2} />
          Ajouter une marque
        </Link>

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
    </header>
  );
}
