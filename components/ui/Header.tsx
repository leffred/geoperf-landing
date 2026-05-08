// S23 — Header avec logo SVG (logo_master par defaut, sub-brands optionnels).
// Variants : "on-light" (default) | "on-dark" → swap automatique master/primary_white.
// Sub-brands optionnels via prop `logo` : "master" | "monitoring" | "conseil" | "etudes" | "audit".
// S28 — i18n : NAV + CTA + aria-label via getTranslations. <Link> next-intl pour
// preserver la locale URL active. LanguageSwitcher auto-cache sur /admin/* + /app/*.

import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

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
  /** S28 : masquer le switcher FR/EN sur les scopes FR-only (/admin, /app). */
  showLanguageSwitcher?: boolean;
};

export async function Header({
  variant = "on-light",
  rightSlot,
  logo = "master",
  showLanguageSwitcher = true,
}: Props) {
  const t = await getTranslations("header");
  const onDark = variant === "on-dark";
  const text = onDark ? "text-white" : "text-ink";
  const navMuted = onDark
    ? "text-white/70 hover:text-white"
    : "text-ink-muted hover:text-ink";
  const border = onDark ? "border-white/10" : "border-DEFAULT";
  const bg = onDark ? "bg-ink/85" : "bg-white/85";

  // Sur fond dark, le logo_master a un wordmark navy → on swap pour la version
  // blanche dédiée. Les sub-brands gardent leur couleur.
  const logoSrc = onDark && logo === "master" ? "/logos/logo_primary_white.svg" : LOGO_PATHS[logo];

  const NAV: { label: string; href: string }[] = [
    { label: t("guide"), href: "/guide/visibilite-llm" },
    { label: t("etudes"), href: "/etude-sectorielle" },
    { label: t("methodologie"), href: "/sample" },
    { label: t("tarifs"), href: "/saas" },
  ];

  return (
    <header className={`sticky top-0 z-40 border-b ${border} ${bg} backdrop-blur-md`}>
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center" aria-label={t("ariaLabel")}>
          <Image
            src={logoSrc}
            alt="Geoperf"
            width={140}
            height={32}
            priority
            className="h-8 w-auto md:h-10"
          />
        </Link>
        <div className="flex items-center gap-6">
          {/* NAV principal (toujours visible sur desktop, FR-EN i18n) */}
          <nav className="hidden md:flex items-center gap-5 text-sm">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={`${navMuted} transition-colors`}>
                {n.label}
              </Link>
            ))}
          </nav>
          {/* Right slot : CTAs login/signup, ou bouton "Demander une étude" par défaut */}
          <div className="flex items-center gap-4">
            {showLanguageSwitcher && <LanguageSwitcher variant={variant} />}
            {rightSlot ? (
              <div className={`text-sm ${text}`}>{rightSlot}</div>
            ) : (
              <Link
                href="/contact"
                className="bg-ink text-white text-sm font-medium px-3.5 py-2 rounded-md hover:bg-ink/90 transition-colors"
              >
                {t("demanderEtude")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
