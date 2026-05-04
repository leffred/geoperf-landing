// Sentry server-side config (Next.js Node runtime).
// S17 §4.8.

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
});
