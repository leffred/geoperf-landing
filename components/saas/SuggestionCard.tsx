// Action suggérée cliquable pour la ROW 2 du dashboard (server component).
// 3 variantes : alerts (rouge si unread), recos (brand-500), idle (gris muted).

import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Variant = "alerts" | "recos" | "context" | "idle";

type Props = {
  variant: Variant;
  eyebrow: string;
  title: string;
  body?: string;
  href?: string;
  count?: number;
};

const ACCENT: Record<Variant, string> = {
  alerts: "border-l-2 border-l-warning",
  recos: "border-l-2 border-l-brand-500",
  context: "border-l-2 border-l-ink",
  idle: "",
};

export function SuggestionCard({ variant, eyebrow, title, body, href, count }: Props) {
  const inner = (
    <div className={`bg-white rounded-lg border border-ink/[0.08] p-5 h-full transition-all duration-150 ${ACCENT[variant]} ${href ? "hover:shadow-cardHover hover:border-strong" : ""}`}>
      <div className="flex items-baseline justify-between mb-2">
        <Eyebrow>{eyebrow}</Eyebrow>
        {typeof count === "number" && count > 0 && (
          <span className="text-xs font-mono tabular-nums text-ink-subtle">{count}</span>
        )}
      </div>
      <h3 className="text-base font-medium text-ink tracking-tight mb-1">{title}</h3>
      {body && <p className="text-sm text-ink-muted leading-snug">{body}</p>}
      {href && (
        <p className="mt-3 text-xs font-mono text-brand-500 group-hover:underline">→</p>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="group block h-full">{inner}</Link>;
  }
  return <div className="h-full">{inner}</div>;
}
