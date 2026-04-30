import { ReactNode } from "react";

type Variant = "default" | "surface" | "accent" | "dark" | "highlight" | "bordered";

const VARIANTS: Record<Variant, string> = {
  default: "bg-white border border-DEFAULT shadow-card",
  surface: "bg-surface border border-DEFAULT",
  accent: "bg-white border border-DEFAULT border-l-2 border-l-brand-500 shadow-card",
  dark: "bg-ink text-white",
  // Legacy aliases — pages non-migrées utilisent encore ces noms.
  highlight: "bg-ink text-white",
  bordered: "bg-white border border-DEFAULT border-l-2 border-l-brand-500 shadow-card",
};

export function Card({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <div className={`rounded-lg p-6 ${VARIANTS[variant]} ${className}`}>{children}</div>
  );
}

type StatVariant = "default" | "dark" | "highlight";

export function Stat({
  label,
  value,
  hint,
  variant = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  variant?: StatVariant;
}) {
  const isDark = variant === "dark" || variant === "highlight";
  const labelCls = isDark ? "text-white/60" : "text-ink-subtle";
  const valueCls = isDark ? "text-white" : "text-ink";
  const hintCls = isDark ? "text-white/60" : "text-ink-muted";
  return (
    <div className={`rounded-lg p-5 ${isDark ? "bg-ink text-white" : "bg-surface"}`}>
      <div className={`font-mono text-xs uppercase tracking-eyebrow ${labelCls}`}>
        {label}
      </div>
      <div className={`mt-2 text-3xl font-medium leading-none tracking-tightish ${valueCls}`}>
        {value}
      </div>
      {hint && <div className={`mt-2 text-xs ${hintCls}`}>{hint}</div>}
    </div>
  );
}
