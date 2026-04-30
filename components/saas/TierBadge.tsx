import type { SaasTier } from "@/lib/saas-auth";

const STYLES: Record<SaasTier, string> = {
  free:    "bg-cream text-ink-muted border border-navy/10",
  starter: "bg-navy/10 text-navy border border-navy/20",
  growth:  "bg-amber/30 text-navy border border-amber",
  pro:     "bg-amber text-navy",
  agency:  "bg-navy text-amber",
  // Legacy : 'solo' affiché comme Starter (visuellement)
  solo:    "bg-navy/10 text-navy border border-navy/20",
};
const LABELS: Record<SaasTier, string> = {
  free: "Free",
  starter: "Starter",
  growth: "Growth",
  pro: "Pro",
  agency: "Agency",
  solo: "Starter", // Legacy display
};

export function TierBadge({ tier, size = "sm" }: { tier: SaasTier; size?: "sm" | "md" }) {
  const padding = size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
  return (
    <span className={`inline-block font-mono uppercase tracking-widest ${padding} ${STYLES[tier]}`}>
      {LABELS[tier]}
    </span>
  );
}
