// Helper isomorphique (server + client) pour résoudre la période ?period=...
// Sortie de PeriodToggle.tsx pour permettre l'import server-side (RSC).

export type Period = "1m" | "3m" | "6m" | "12m";

export function periodToDays(p: string | undefined): { days: number; label: string; period: Period } {
  const period: Period = (p === "1m" || p === "3m" || p === "6m" || p === "12m") ? (p as Period) : "3m";
  const days = period === "1m" ? 30 : period === "3m" ? 90 : period === "6m" ? 180 : 365;
  const label = period === "1m" ? "1 mois" : period === "3m" ? "3 mois" : period === "6m" ? "6 mois" : "12 mois";
  return { days, label, period };
}
