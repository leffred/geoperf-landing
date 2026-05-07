// S28 hotfix — HeaderStatic FR-only pour les routes hors [locale] (admin/*, app/*).
// Pas de hooks next-intl (getTranslations/Link i18n) car ces routes ne passent pas
// par intlMiddleware et n'ont pas de RequestLocale provider → crash 500.
// Labels FR hardcodes. Pas de language switcher (admin/app sont FR-only par design).
// showLanguageSwitcher prop accepted pour compat API mais ignored.

import Image from "next/image";
import Link from "next/link";

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
  logo?: LogoVariant;
  /** Compat avec Header i18n: ignored (pas de switcher en FR-only). */
  showLanguageSwitcher?: boolean;
};

export function Header({ variant = "on-light", rightSlot, logo = "master" }: Props) {
  const onDark = variant === "on-dark";
  const text = onDark ? "text-white" : "text-ink";
  const navMuted = onDark
    ? "text-white/70 hover:text-white"
    : "text-ink-muted hover:text-ink";
  const border = onDark ? "border-white/10" : "border-DEFAULT";
  const bg = onDark ? "bg-ink/85" : "bg-white/85";

  const logoSrc = onDark && logo === "master" ? "/logos/logo_primary_white.svg" : LOGO_PATHS[logo];

  const NAV: { label: string; href: string }[] = [
    { label: "Etudes", href: "/etude-sectorielle" },
    { label: "Methodologie", href: "/sample" },
    { label: "Tarifs", href: "/saas" },
  ];

  return (
    <header className={`sticky top-0 z-40 border-b ${border} ${bg} backdrop-blur-md`}>
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center" aria-label="Geoperf - Accueil">
          <Image
            src={logoSrc}
            alt="Geoperf"
            width={140}
            height={32}
            priority
            className="h-8 w-auto md:h-10"
          />
        </Link>
        <div className="flex items-center gap-4">
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
                Demander une etude
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
