// S28 hotfix /demo - Next 15 interdit cookieStore.set() dans un Server Component.
// Solution : page.tsx redirect serveur vers /api/demo-login (route handler /api).
// Le handler /api pose les cookies puis redirect /app/dashboard?demo=1.

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Démo Geoperf — Découvrez le SaaS sans inscription",
  description:
    "Explorez Geoperf en mode démo : 6 mois de données fictives sur Demo Corp, 4 LLM, 26 snapshots hebdomadaires. Aucune inscription requise.",
  alternates: { canonical: "https://geoperf.com/demo" },
};

export const dynamic = "force-dynamic";

export default async function DemoPage() {
  const cookieStore = await cookies();
  const existing = cookieStore.get("sb-access-token") || cookieStore.get("supabase-auth-token");
  if (existing) {
    redirect("/app/dashboard?demo=1");
  }
  // Pas de set cookie ici (Server Component) : le route handler s'en charge
  redirect("/api/demo-login");
}
