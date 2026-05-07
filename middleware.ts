// S28 hotfix — Middleware fusionne : next-intl (i18n routing) + Supabase Auth + Demo flag.
//
// Logique :
//   1. /api/*, /_next/*, /favicon, /logos/*, /robots.txt, /sitemap.xml, /monitoring -> exclu (matcher)
//   2. /admin/*  -> auth Supabase + redirect /admin/login si non auth (FR-only, pas de prefix locale)
//   3. /app/*    -> auth Supabase + redirect /login si non auth (FR-only, pas de prefix locale)
//   4. /login, /signup -> si deja loggue, redirect /app/dashboard
//   5. Toutes autres routes publiques -> next-intl handle (detect/redirect locale)
//
// Demo mode : header x-geoperf-demo pose si user.id == DEMO_USER_ID.

import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { routing } from "./i18n/routing";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

const intlMiddleware = createMiddleware(routing);

const DEMO_USER_ID = "d3403d3e-d3d3-d3d3-d3d3-d3d3d3d30000";

function isAuthenticatedScope(path: string): "admin" | "app" | null {
  if (path === "/admin" || path.startsWith("/admin/")) return "admin";
  if (path === "/app" || path.startsWith("/app/")) return "app";
  return null;
}

function isAuthFormScope(path: string): boolean {
  return path === "/login" || path.startsWith("/login/")
      || path === "/signup" || path.startsWith("/signup/");
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ===== Guard env vars : dev sans .env.local -> skip auth, juste i18n =====
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[middleware] Supabase env vars missing - skipping auth");
    }
    if (isAuthenticatedScope(path)) {
      return NextResponse.next({ request: req });
    }
    return intlMiddleware(req);
  }

  // ===== Cookies/auth Supabase =====
  const baseRes = NextResponse.next({ request: req });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          baseRes.cookies.set(name, value, options ?? {})
        );
      },
    },
  });

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  // ===== Demo mode flag =====
  if (user?.id === DEMO_USER_ID) {
    baseRes.headers.set("x-geoperf-demo", "1");
  }

  // ===== Authenticated scope guards (admin / app) =====
  const scope = isAuthenticatedScope(path);
  if (scope === "admin") {
    if (!user && path !== "/admin/login") {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", path);
      return NextResponse.redirect(loginUrl);
    }
    return baseRes;
  }
  if (scope === "app") {
    const isLoginRedirect = path === "/login" || path.startsWith("/login/");
    if (!user && !isLoginRedirect) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", path);
      return NextResponse.redirect(loginUrl);
    }
    return baseRes;
  }

  // ===== Auth forms : redirect deja-loggues vers app/dashboard =====
  if (isAuthFormScope(path) && user) {
    return NextResponse.redirect(new URL("/app/dashboard", req.url));
  }

  // ===== Routes publiques : delegate next-intl pour locale routing =====
  return intlMiddleware(req);
}

export const config = {
  // Match toutes les routes SAUF :
  //   - /api/*           (API routes Next.js)
  //   - /_next/*         (build assets)
  //   - /favicon.ico, .svg
  //   - /logos/*         (assets statiques)
  //   - /robots.txt, /sitemap.xml
  //   - /monitoring/*    (Sentry endpoint)
  //   - fichiers avec extension (.png, .jpg, .css, .js, etc.)
  matcher: [
    "/((?!api|_next|favicon|logos|robots\\.txt|sitemap\\.xml|monitoring|.*\\..*).*)"
  ],
};
