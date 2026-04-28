import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "default" | "highlight" | "bordered";
  className?: string;
};

const VARIANTS = {
  default: "bg-cream",
  highlight: "bg-navy text-white",
  bordered: "bg-white border-l-2 border-amber",
};

export function Card({ children, variant = "default", className = "" }: Props) {
  return <div className={`p-5 ${VARIANTS[variant]} ${className}`}>{children}</div>;
}

type StatProps = {
  label: string;
  value: ReactNode;
  variant?: "default" | "highlight";
};

export function Stat({ label, value, variant = "default" }: StatProps) {
  const isHl = variant === "highlight";
  return (
    <div className={`p-5 text-center ${isHl ? "bg-navy text-white" : "bg-cream"}`}>
      <div className={`font-serif text-3xl font-medium leading-none ${isHl ? "text-white" : "text-navy"}`}>
        {value}
      </div>
      <div className={`text-xs mt-2 tracking-wide ${isHl ? "text-white/80" : "text-ink-muted"}`}>
        {label}
      </div>
    </div>
  );
}
