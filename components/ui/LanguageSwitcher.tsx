"use client";

// S28 — Language switcher FR/EN dans le Header.
// Utilise next-intl router pour preserver le path en switchant la locale.
// localePrefix='as-needed' : /saas (FR) <-> /en/saas, /fr/saas <-> /en/saas, etc.
//
// Auto-cache : si le chemin courant est sous /admin/* ou /app/* (FR-only),
// le switcher retourne null car ces scopes n'ont pas de version EN.

import { useTransition } from "react";
import { usePathname as useNextPathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type Variant = "on-light" | "on-dark";

export function LanguageSwitcher({ variant = "on-light" }: { variant?: Variant }) {
  // All hooks called unconditionally first (rules-of-hooks)
  const rawPath = useNextPathname();
  const locale = useLocale();
  const t = useTranslations("languageSwitcher");
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Hide sur les scopes FR-only (admin/app sont hors [locale])
  if (
    rawPath === "/admin" || rawPath.startsWith("/admin/") ||
    rawPath === "/app" || rawPath.startsWith("/app/")
  ) {
    return null;
  }

  const onDark = variant === "on-dark";
  const inactiveCls = onDark ? "text-white/50 hover:text-white/80" : "text-ink-subtle hover:text-ink";
  const activeCls = onDark ? "text-white font-semibold" : "text-ink font-semibold";

  function switchTo(next: Locale) {
    if (next === locale || pending) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <nav
      aria-label={t("ariaLabel")}
      className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-eyebrow"
    >
      <button
        type="button"
        onClick={() => switchTo("fr")}
        disabled={pending}
        aria-current={locale === "fr" ? "true" : undefined}
        className={`${locale === "fr" ? activeCls : inactiveCls} px-1.5 transition-colors disabled:opacity-50`}
      >
        {t("fr")}
      </button>
      <span className={onDark ? "text-white/30" : "text-ink-subtle/60"}>·</span>
      <button
        type="button"
        onClick={() => switchTo("en")}
        disabled={pending}
        aria-current={locale === "en" ? "true" : undefined}
        className={`${locale === "en" ? activeCls : inactiveCls} px-1.5 transition-colors disabled:opacity-50`}
      >
        {t("en")}
      </button>
    </nav>
  );
}
