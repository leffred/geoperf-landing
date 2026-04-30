// Layout commun à toutes les pages /app/*. Ajoute le header user + nav top.

import type { ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { TierBadge } from "@/components/saas/TierBadge";
import { loadSaasContext } from "@/lib/saas-auth";
import { logout } from "../login/actions";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const ctx = await loadSaasContext();

  const right = (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-ink-muted hidden md:inline">{ctx.user.email}</span>
      <TierBadge tier={ctx.tier} />
      <form action={logout}>
        <button type="submit" className="font-mono text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy transition">
          Logout
        </button>
      </form>
    </div>
  );

  const navItems = [
    { href: "/app/dashboard", label: "Dashboard" },
    { href: "/app/brands", label: "Marques" },
    { href: "/app/alerts", label: "Alertes" },
    { href: "/app/billing", label: "Abonnement" },
    { href: "/app/settings", label: "Réglages" },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Header rightSlot={right} />

      <nav className="bg-white border-b border-navy/10 px-8">
        <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-3 text-sm font-medium text-navy hover:bg-cream transition border-b-2 border-transparent hover:border-amber whitespace-nowrap"
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
