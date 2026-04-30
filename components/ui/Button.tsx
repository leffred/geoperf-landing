import Link from "next/link";
import { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline-light";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 focus-visible:ring-brand-500 shadow-card hover:shadow-cardHover",
  secondary:
    "bg-white text-ink border border-strong hover:bg-surface focus-visible:ring-ink/30",
  ghost:
    "bg-transparent text-ink hover:bg-surface focus-visible:ring-ink/20",
  danger:
    "bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger",
  // Legacy — utilisé sur sections dark (saas, sample, portal). Outline blanc translucide.
  "outline-light":
    "bg-transparent border border-white/30 text-white hover:bg-white/10 focus-visible:ring-white/60",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2.5 text-sm rounded-md",
  lg: "px-5 py-3 text-base rounded-md",
};

const BASE =
  "inline-flex items-center justify-center font-medium transition-all duration-150 ease-out " +
  "active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type LinkProps = CommonProps & ComponentProps<typeof Link> & { href: string };
type ButtonProps = CommonProps & ComponentProps<"button"> & { href?: undefined };

export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", size = "md", children, className = "", ...rest } = props;
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest as LinkProps;
    const isExternal =
      typeof href === "string" && (href.startsWith("http") || href.startsWith("mailto:"));
    if (isExternal) {
      return (
        <a href={href as string} className={cls} {...(linkRest as any)}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...(linkRest as any)}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...(rest as ButtonProps)}>
      {children}
    </button>
  );
}
