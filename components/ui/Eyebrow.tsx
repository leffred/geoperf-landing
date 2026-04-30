import { ReactNode } from "react";

type Variant = "brand" | "muted" | "code";

const COLORS: Record<Variant, string> = {
  brand: "text-brand-500",
  muted: "text-ink-subtle",
  code: "text-ink-muted",
};

export function Eyebrow({
  children,
  variant = "brand",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const prefix = variant === "code" ? <span className="opacity-60">// </span> : null;
  return (
    <p className={`font-mono text-xs uppercase tracking-eyebrow ${COLORS[variant]} ${className}`}>
      {prefix}
      {children}
    </p>
  );
}
