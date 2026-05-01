import type { SaasTier } from "@/lib/saas-auth";

const STYLES: Record<SaasTier, string> = {
  free:    "bg-surface text-ink-muted border border-DEFAULT",
  starter: "bg-brand-50 text-brand-600 border border-brand-500/20",
  growth:  "bg-brand-500 text-white",
  pro:     "bg-ink text-white",
  agency:  "bg-ink text-amber border border-amber/40",
  solo:    "bg-brand-50 text-brand-600 border border-brand-500/20",
};
const LABELS: Record<SaasTier, string> = {
  free: "Free",
  starter: "Starter",
  growth: "Growth",
  pro: "Pro",
  agency: "Agency",
  solo: "Starter",
};

export function TierBadge({ tier, size = "sm" }: { tier: SaasTier; size?: "sm" | "md" }) {
  const padding = size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
  return (
    <span className={`inline-block font-mono uppercase tracking-eyebrow rounded-md ${padding} ${STYLES[tier]}`}>
      {LABELS[tier]}
    </span>
  );
}
