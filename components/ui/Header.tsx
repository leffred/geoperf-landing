// S23 — Header avec logo SVG (logo_master par defaut, sub-brands optionnels).
// Variants : "on-light" (default) | "on-dark" → swap automatique master/primary_white.
// Sub-brands optionnels via prop `logo` : "master" | "monitoring" | "conseil" | "etudes" | "audit".

import Link from "next/link";
import Image from "next/image";

type NavItem = { label: string; href: string };

const NAV: NavItem[] = [
  { label: "Études", href: "/etudes" },
  { label: "Méthodologie", href: "/methodologie" },
  { label: "Tarifs", href: "/tarifs" },
];

type LogoVariant = "master" | "monitoring" | "conseil" | "etudes" | "audit";

const LOGO_PATHS: Record<LogoVariant, string> = {
  master: "/logos/logo_master.svg",
  monitoring: "/logos/logo_monitoring.svg",
  conseil: "/logos/logo_conseil.svg",
  etudes: "/logos/logo_etudes.svg",
  audit: "/logos/logo_audit.svg",
};

type Props = {
  variant?: "on-light" | "on-dark";
  rightSlot?: React.ReactNode;
  /** Sub-brand logo variant. `master` (default) sur les pages génériques. */
  logo?: LogoVariant;
};

export function Header({ variant = "on-light", rightSlot, logo = "master" }: Props) {
  const onDark = variant === "on-dark";
  const text = onDark ? "text-white" : "text-ink";
  const navMuted = onDark
    ? "text-white/70 hover:text-white"
    : "text-ink-muted hover:text-ink";
  const border = onDark ? "border-white/10" : "border-DEFAULT";
  const bg = onDark ? "bg-ink/85" : "bg-white/85";

  // Sur fond dark, le logo_master a un wordmark navy → on swap pour la version
  // blanche dédiée. Les sub-brands gardent leur couleur (conseil/etudes/audit ont
  // des baselines amber qui passent OK sur ink).
  const logoSrc = onDark && logo === "master" ? "/logos/logo_primary_white.svg" : LOGO_PATHS[logo];

  return (
    <header className={`sticky top-0 z-40 border-b ${border} ${bg} backdrop-blur-md`}>
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center" aria-label="Geoperf — accueil">
          <Image
            src={logoSrc}
            alt="Geoperf"
            width={140}
            height={32}
            priority
            className="h-8 w-auto md:h-10"
          />
        </Link>
        {rightSlot ? (
          <div className={`text-sm ${text}`}>{rightSlot}</div>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={`${navMuted} transition-colors`}>
                {n.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-ink text-white text-sm font-medium px-3.5 py-2 rounded-md hover:bg-ink/90 transition-colors"
            >
              Demander une étude
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
