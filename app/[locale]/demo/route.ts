// S28 hotfix - /demo : route handler GET (au lieu de page.tsx) car Next 15
// interdit cookieStore.set() dans un Server Component. Un route handler peut
// poser des cookies. Comportement conserve : appel saas_demo_login -> set
// session cookie -> redirect /app/dashboard?demo=1.
//
// Tradeoff : pas de meta HTML possible sur route handler. Le sitemap continue
// de pointer /demo (le 302 est crawl-friendly), mais Google n'aura pas de title.
// Acceptable car la page n'a pas de contenu indexable de toute facon.

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
      console.error("[/demo] saas_demo_login failed:", resp.status, await resp.text());
      return null;
    }
    const json = await resp.json();
    if (!json.access_token || !json.refresh_token) return null;
    return { access_token: json.access_token, refresh_token: json.refresh_token };
  } catch (e) {
    console.error("[/demo] fetch err:", e);
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
