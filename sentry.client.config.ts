// Sentry client-side config (browser).
// S17 §4.8 — minimal init. Si SENTRY_DSN absent, Sentry no-op (pas d'erreur).
// Action Fred : créer projet Sentry, remplir NEXT_PUBLIC_SENTRY_DSN sur Vercel.

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.5,
  // Capture les Replays uniquement sur erreurs pour économiser le quota gratuit.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  // Filtre les erreurs non-actionnable (extensions browser, ad-blockers, etc.).
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
  ],
});
