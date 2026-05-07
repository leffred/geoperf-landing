// S28 hotfix - Route handler /api/demo-login : pose les cookies de session demo
// puis redirect /app/dashboard?demo=1. Appele depuis app/[locale]/demo/page.tsx
// car Next 15 interdit cookieStore.set() dans un Server Component (page.tsx).

import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const dynamic = "force-dynamic";

async function fetchDemoSession(): Promise<{
  access_token: string;
  refresh_token: string;
} | null> {
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/saas_demo_login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY,
      },
      body: "{}",
      cache: "no-store",
    });
    if (!resp.ok) {
      console.error("[/api/demo-login] saas_demo_login failed:", resp.status, await resp.text());
      return null;
    }
    const json = await resp.json();
    if (!json.access_token || !json.refresh_token) return null;
    return { access_token: json.access_token, refresh_token: json.refresh_token };
  } catch (e) {
    console.error("[/api/demo-login] fetch err:", e);
    return null;
  }
}

export async function GET(request: Request) {
  const cookieStore = await cookies();

  // Si deja une session, redirect direct
  const existing = cookieStore.get("sb-access-token") || cookieStore.get("supabase-auth-token");
  if (existing) {
    return NextResponse.redirect(new URL("/app/dashboard?demo=1", request.url));
  }

  const session = await fetchDemoSession();
  if (!session) {
    return NextResponse.redirect(new URL("/signup?error=demo_unavailable", request.url));
  }

  // Pose les cookies via createServerClient (sb-{ref}-auth-token)
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, {
            ...(options ?? {}),
            sameSite: "lax",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
        });
      },
    },
  });

  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  return NextResponse.redirect(new URL("/app/dashboard?demo=1", request.url));
}
