// S28 — next-intl routing config (locales + defaultLocale + localePrefix).
// Importe depuis i18n/request.ts (server config) et middleware.ts (locale detection).

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"] as const,
  defaultLocale: "fr",
  // 'as-needed' : /saas reste FR par defaut (pas de redirect 301 cassant la prod existante)
  // /en/saas affiche la version EN. /fr/saas est canonisé vers /saas.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
