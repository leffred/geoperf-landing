// Next.js 15 instrumentation hook for Sentry registration.
// S17 §4.8.

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Next.js 15 onRequestError hook → Sentry captureRequestError.
export { captureRequestError as onRequestError } from "@sentry/nextjs";
