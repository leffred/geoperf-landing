// Empty state visuel + CTA. Remplace les "Aucune donnée" plats.
// Spec : SPRINTS_S8_S9_S10_PLAN.md S8.4
//
// Usage :
//   <EmptyState
//     icon="brands"
//     title="Aucune marque suivie"
//     body="Commence par ajouter ta marque pour voir comment les LLM la perçoivent."
//     ctaLabel="Suivre ma 1re marque"
//     ctaHref="/app/brands/new"
//   />

import Link from "next/link";
import type { ReactNode } from "react";

type IconKey = "brands" | "snapshot" | "sources" | "alerts" | "topics" | "team" | "search" | "calm" | "chart";

const ICONS: Record<IconKey, ReactNode> = {
  // SVG inline minimaliste, navy stroke. Tailwind classes pour size.
  brands: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
      <rect x="8" y="14" width="32" height="22" rx="2" />
      <path d="M16 14V10a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4" />
      <line x1="8" y1="22" x2="40" y2="22" strokeOpacity="0.4" />
    </svg>
  ),
  snapshot: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
      <circle cx="24" cy="24" r="14" />
      <path d="M24 14v10l6 4" />
    </svg>
  ),
  sources: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
      <path d="M12 12h18a4 4 0 0 1 4 4v22H12z" />
      <line x1="16" y1="20" x2="30" y2="20" strokeOpacity="0.4" />
      <line x1="16" y1="26" x2="30" y2="26" strokeOpacity="0.4" />
      <line x1="16" y1="32" x2="24" y2="32" strokeOpacity="0.4" />
    </svg>
  ),
  alerts: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
      <path d="M24 6c-7 0-12 4-12 14v6l-3 4h30l-3-4v-6c0-10-5-14-12-14z" />
      <path d="M19 34a5 5 0 0 0 10 0" />
    </svg>
  ),
  topics: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
      <rect x="8" y="10" width="14" height="14" />
      <rect x="26" y="10" width="14" height="14" strokeOpacity="0.6" />
      <rect x="8" y="28" width="14" height="14" strokeOpacity="0.6" />
      <rect x="26" y="28" width="14" height="14" strokeOpacity="0.4" />
    </svg>
  ),
  team: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
      <circle cx="18" cy="18" r="6" />
      <circle cx="34" cy="20" r="4" strokeOpacity="0.6" />
      <path d="M6 38c0-6 5-10 12-10s12 4 12 10" />
      <path d="M30 38c0-4 3-7 8-7s8 3 8 7" strokeOpacity="0.6" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
      <circle cx="22" cy="22" r="12" />
      <line x1="32" y1="32" x2="40" y2="40" />
    </svg>
  ),
  calm: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
      <circle cx="24" cy="24" r="16" />
      <path d="M16 28c2 2 5 3 8 3s6-1 8-3" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
      <circle cx="30" cy="20" r="1.5" fill="currentColor" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
      <path d="M8 38h32" />
      <path d="M14 32V24" />
      <path d="M22 32V18" />
      <path d="M30 32V12" />
      <path d="M38 32V20" />
    </svg>
  ),
};

type Props = {
  icon?: IconKey;
  title: string;
  body?: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  /** CTA secondaire optionnel */
  secondaryLabel?: string;
  secondaryHref?: string;
  /** Tone clair (fond blanc) ou cream (fond cream) */
  tone?: "white" | "cream";
  className?: string;
};

export function EmptyState({
  icon = "search",
  title,
  body,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
  tone = "white",
  className = "",
}: Props) {
  const bg = tone === "cream" ? "bg-cream" : "bg-white";
  return (
    <div className={`${bg} px-6 py-12 text-center flex flex-col items-center ${className}`}>
      <div className="text-navy/60 mb-4">{ICONS[icon]}</div>
      <h2 className="font-serif text-xl text-navy mb-2 max-w-md">{title}</h2>
      {body && <div className="text-sm text-ink-muted max-w-md mb-5 leading-relaxed">{body}</div>}
      {(ctaLabel || secondaryLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="bg-amber text-navy px-5 py-2.5 text-sm font-medium hover:bg-amber/90 transition"
            >
              {ctaLabel}
            </Link>
          )}
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="border border-navy/15 text-navy px-5 py-2.5 text-sm font-medium hover:bg-navy/5 transition"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
