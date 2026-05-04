// Sentry edge runtime config (middleware, API routes runtime=edge).
// S17 §4.8.

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
});
