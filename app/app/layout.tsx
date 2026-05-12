// V2 — Layout commun à toutes les pages /app/*. Topbar + Sidebar shell.
// Pré-fetch contexte utilisateur + tier + brands sidebar.

import type { ReactNode } from "react";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { AppShell } from "@/components/saas/v2/AppShell";
import { ThemeProvider } from "@/components/saas/v2/ThemeProvider";
import { loadSaasContext, tierLimits, tierLabel } from "@/lib/saas-auth";
import { isDemoMode } from "@/lib/demo-mode";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const ctx = await loadSaasContext();
  const demo = await isDemoMode();
  const limits = tierLimits(ctx.tier);

  const firstName = ctx.profile?.full_name?.trim() || ctx.user.email || "";
  const initials = firstName
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || firstName.slice(0, 2).toUpperCase() || "U";

  return (
    <ThemeProvider>
      {demo && <DemoBanner />}
      <AppShell
        userId={ctx.user.id}
        userEmail={ctx.user.email ?? ""}
        initials={initials}
        tier={tierLabel(ctx.tier)}
        brandsLimit={limits.brands}
        canPickWeekly={limits.cadence === "weekly"}
      >
        {children}
      </AppShell>
    </ThemeProvider>
  );
}
