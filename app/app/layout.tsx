// Layout commun à toutes les pages /app/*. Header user + nav top. Tech crisp.

import type { ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { TierBadge } from "@/components/saas/TierBadge";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { loadSaasContext } from "@/lib/saas-auth";
import { isDemoMode } from "@/lib/demo-mode";
import { logout } from "../login/actions";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const ctx = await loadSaasContext();
  const demo = await isDemoMode();

  const right = (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-ink-muted hidden md:inline">{ctx.user.email}</span>
      <TierBadge tier={ctx.tier} />
      <form action={logout}>
        <button
          type="submit"
          className="font-mono text-xs px-3 py-1.5 rounded-md bg-surface hover:bg-surface-2 text-ink transition-colors duration-150 ease-out"
        >
          Logout
        </button>
      </form>
    </div>
  );

  const seatsCap = ctx.limits.seats;
  const showTeam = ctx.is_owner && (seatsCap > 1);
  const navItems = [
    { href: "/app/dashboard", label: "Dashboard" },
    { href: "/app/brands", label: "Marques" },
    { href: "/app/alerts", label: "Alertes" },
    ...(showTeam ? [{ href: "/app/team", label: "Équipe" }] : []),
    { href: "/app/billing", label: "Abonnement" },
    { href: "/app/settings", label: "Réglages" },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {demo && <DemoBanner />}
      <Header logo="monitoring" rightSlot={right} />

      <nav className="bg-white border-b border-DEFAULT px-6 md:px-8 sticky top-14 z-30 backdrop-blur-md bg-white/85">
        <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-3 text-sm font-medium text-ink hover:bg-surface transition-colors duration-150 ease-out border-b-2 border-transparent hover:border-brand-500 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="flex-1">{children}</div>

      <Footer showLegalLinks={false} />
    </main>
  );
}
