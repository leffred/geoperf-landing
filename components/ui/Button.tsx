import Link from "next/link";
import { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline-light";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-amber text-navy hover:bg-amber/90",
  secondary: "bg-navy text-white hover:bg-navy-light",
  ghost: "text-navy hover:bg-cream",
  "outline-light": "border border-white/40 text-white hover:bg-white/10",
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
  const cls = `inline-block font-medium transition disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

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
