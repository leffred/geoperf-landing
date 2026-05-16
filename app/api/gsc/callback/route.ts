// app/api/gsc/callback/route.ts
// Reçoit le redirect OAuth Google : GET ?code=...&state=user_id
// Appelle l'Edge Function saas_gsc_oauth_callback, puis redirect /app/settings/gsc

import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export async function GET(req: NextRequest) {
  const code   = req.nextUrl.searchParams.get("code");
  const userId = req.nextUrl.searchParams.get("state"); // user_id passé comme state

  if (!code || !userId) {
    return NextResponse.redirect(
      new URL("/app/settings/gsc?error=missing_params", req.url)
    );
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/functions/v1/saas_gsc_oauth_callback`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, user_id: userId }),
        signal: AbortSignal.timeout(15_000),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "unknown" }));
      console.error("[gsc/callback] edge function error:", err);
      return NextResponse.redirect(
        new URL(`/app/settings/gsc?error=${err.error ?? "callback_failed"}`, req.url)
      );
    }

    return NextResponse.redirect(
      new URL("/app/settings/gsc?connected=true", req.url)
    );
  } catch (e) {
    console.error("[gsc/callback] fetch failed:", e);
    return NextResponse.redirect(
      new URL("/app/settings/gsc?error=network", req.url)
    );
  }
}
