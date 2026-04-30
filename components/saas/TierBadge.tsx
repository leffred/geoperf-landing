import type { SaasTier } from "@/lib/saas-auth";

const STYLES: Record<SaasTier, string> = {
  free:   "bg-cream text-ink-muted border border-navy/10",
  solo:   "bg-navy text-white",
  pro:    "bg-amber text-navy",
  agency: "bg-navy text-amber",
};
const LABELS: Record<SaasTier, string> = {
  free: "Free", solo: "Solo", pro: "Pro", agency: "Agency",
};

export function TierBadge({ tier, size = "sm" }: { tier: SaasTier; size?: "sm" | "md" }) {
  const padding = size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
  return (
    <span className={`inline-block font-mono uppercase tracking-widest ${padding} ${STYLES[tier]}`}>
      {LABELS[tier]}
    </span>
  );
}
