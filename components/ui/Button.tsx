import Link from "next/link";
import { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline-light";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-amber text-navy hover:bg-amber/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
  secondary: "bg-navy text-white hover:bg-navy-light active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
  ghost: "text-navy hover:bg-cream active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-navy",
  "outline-light": "border border-white/40 text-white hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-base",
};

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
  const cls = `inline-block font-medium transition-all duration-150 disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest as LinkProps;
    const isExternal = typeof href === "string" && (href.startsWith("http") || href.startsWith("mailto:"));
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
