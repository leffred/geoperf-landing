// V2 — AppShell : Topbar + Sidebar + main content area.
// Used by app/app/layout.tsx. Fetches sidebar brand list once per request.

import type { ReactNode } from "react";
import { getServiceClient } from "@/lib/supabase";
import { Topbar } from "./Topbar";
import { Sidebar, type SidebarBrand } from "./Sidebar";

const SIDEBAR_BRAND_COLORS = [
  "#2563EB", // brand-500
  "#7A5AE0", // violet
  "#10A37F", // green
  "#C77D2C", // amber-warm
  "#D97706", // warning
  "#5B6478", // ink-muted
  "#8C94A6", // ink-subtle
  "#20808D", // perplexity teal
  "#4285F4", // gemini blue
  "#DC2626", // danger
];

interface AppShellProps {
  children: ReactNode;
  userId: string;
  userEmail: string;
  initials: string;
  tier: string;
  brandsLimit: number;
  canPickWeekly?: boolean;
}

export async function AppShell({
  children,
  userId,
  userEmail,
  initials,
  tier,
  brandsLimit,
  canPickWeekly = true,
}: AppShellProps) {
  const sb = getServiceClient();

  // Fetch sidebar brands list — view filters by user_id (RLS).
  const [brandRes, alertRes, recoRes] = await Promise.all([
    sb.from("v_saas_brand_latest")
      .select("id, name, domain, visibility_score")
      .eq("user_id", userId)
      .limit(10),
    sb.from("saas_alerts").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("is_read", false),
    sb.from("saas_recommendations").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("is_read", false),
  ]);
  const brandRows = (brandRes.data as Array<{ id: string; name: string; domain: string; visibility_score: number | null }> | null) ?? [];
  const unreadAlerts = (alertRes as { count?: number | null }).count ?? 0;
  const unreadRecos = (recoRes as { count?: number | null }).count ?? 0;

  const brands: SidebarBrand[] = brandRows.map((b, i) => ({
    id: b.id,
    name: b.name,
    color: SIDEBAR_BRAND_COLORS[i % SIDEBAR_BRAND_COLORS.length],
    visibilityScore: b.visibility_score,
  }));

  const paletteBrands = brandRows.map((b) => ({ id: b.id, name: b.name, domain: b.domain }));

  // Next snapshot label — naive: next Monday 06:15 CET if no specific data.
  const nextSnapshotLabel = computeNextSnapshotLabel();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Topbar
        userEmail={userEmail}
        initials={initials}
        canPickWeekly={canPickWeekly}
        paletteBrands={paletteBrands}
      />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          brands={brands}
          tier={tier}
          brandsLimit={brandsLimit}
          nextSnapshotLabel={nextSnapshotLabel}
          unreadAlerts={unreadAlerts}
          pendingRecos={unreadRecos}
        />
        <main className="flex-1 overflow-auto bg-white" style={{ padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function computeNextSnapshotLabel(): string {
  const now = new Date();
  const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilMonday);
  next.setHours(6, 15, 0, 0);
  return next.toLocaleString("fr-FR", { weekday: "long", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
