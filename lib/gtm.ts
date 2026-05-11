// S32 Ticket 3 — Helper GTM client-side.
// Push events vers window.dataLayer (sGTM les forwarde vers GA4/Google Ads/LinkedIn/Meta CAPI).
// Usage uniquement côté Client Components (Server Components n'ont pas accès à window).

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Push un event vers window.dataLayer si GTM est chargé.
 * No-op silencieux côté SSR ou si GTM est bloqué (AdBlocker).
 */
export function pushGtmEvent(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

/**
 * Helper pour les events de conversion avec valeur €. La valeur sert
 * à attribuer une revenue côté Google Ads / LinkedIn Conversion API.
 */
export function pushGtmConversion(
  event: string,
  valueEur: number,
  params: Record<string, unknown> = {},
): void {
  pushGtmEvent(event, { ...params, value: valueEur, currency: "EUR" });
}

// Events Geoperf standardisés (TypeScript autocomplete)
export const GtmEvents = {
  // Top funnel
  QUICK_CHECK_RUN: "quick_check_run",
  QUICK_CHECK_EMAIL_CAPTURE: "quick_check_email_capture",
  // Middle funnel
  FORM_SUBMIT_ETUDE: "form_submit_etude",
  // Auth
  SIGNUP_COMPLETE: "signup_complete",
  LOGIN_OAUTH: "login_oauth",
  // Bottom funnel
  CHECKOUT_STARTED: "checkout_started",
  SUBSCRIPTION_ACTIVE: "subscription_active",
} as const;

// Default conversion values (€) — alignés avec S32 brief
export const ConversionValues = {
  QUICK_CHECK_RUN: 5,
  QUICK_CHECK_EMAIL_CAPTURE: 10,
  FORM_SUBMIT_ETUDE: 20,
  SIGNUP_COMPLETE: 50,
  // CHECKOUT/SUBSCRIPTION : valeur dynamique (passée en paramètre)
} as const;
