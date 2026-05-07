// S28 — Middleware fusionné : next-intl (i18n routing) + Supabase Auth + Demo flag.
//
// Logique :
//   1. /api/*, /_next/*, /favicon, /logos/*, /robots.txt, /sitemap.xml, /monitoring → laisse passer (matcher exclut)
//   2. /admin/*, /admin → auth Supabase + redirect /admin/login si non auth (FR-only, pas de prefix locale)
//   3. /app/*, /app → auth Supabase + redirect /login si non auth (FR-only, pas de prefix locale)
//   4. /login, /signup → si déjà loggé, redirect /app/dashboard. Sinon next-intl handle (locale prefix).
//   5. Toutes autres routes publiques → next-intl handle (detect/redirect locale).
//
// Demo mode (S20) : header x-geoperf-demo posé si user.id == DEMO_USER_ID — préservé sur toutes scopes.

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

function stripLocalePrefix(path: string): string {
  for (const loc of routing.locales) {
    if (path === `/${loc}`) return "/";
    if (path.startsWith(`/${loc}/`)) return path.slice(`/${loc}`.length);
  }
  return path;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ===== Guard env vars : dev sans .env.local → skip auth, juste i18n =====
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[middleware] Supabase env vars missing — skipping auth (dev mode)");
    }
    // Pour les scopes auth-required (admin/app/login/signup), on ne peut rien faire
    // sans Supabase → laisse passer (les pages elles-mêmes gèreront le redirect).
    if (isAuthenticatedScope(path)) {
      return NextResponse.next({ request: req });
    }
    return intlMiddleware(req);
  }

  // ===== Auth Supabase (exécuté pour TOUTES les requêtes pour refresh cookies) =====
  // Crée une réponse de base qui sera mutée par les redirects ou next-intl.
  const baseRes = NextResponse.next({ request: req });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          baseRes.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const isDemoUser = data.user?.id === DEMO_USER_ID;

  // ===== Branch 1 : /admin/* + /app/* (FR-only, pas de routing i18n) =====
  const authScope = isAuthenticatedScope(path);
  if (authScope) {
    const adminLogin = path === "/admin/login";

    if (authScope === "admin") {
      if (!data.user && !adminLogin) {
        const loginUrl = new URL("/admin/login", req.url);
        if (path !== "/admin") loginUrl.searchParams.set("next", path + req.nextUrl.search);
        return NextResponse.redirect(loginUrl);
      }
      if (data.user && adminLogin) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    } else if (authScope === "app") {
      if (!data.user) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("next", path + req.nextUrl.search);
        // S28 : /app/* est FR-only — force la cookie NEXT_LOCALE=fr pour eviter
        // que next-intl prefixe le redirect vers /en/login (cohérence UX).
        const redirectRes = NextResponse.redirect(loginUrl);
        redirectRes.cookies.set("NEXT_LOCALE", "fr", { path: "/" });
        return redirectRes;
      }
    }

    if (isDemoUser) {
      baseRes.headers.set("x-geoperf-demo", "1");
      req.headers.set("x-geoperf-demo", "1");
    }
    return baseRes;
  }

  // ===== Branch 2 : /login & /signup déjà loggé → /app/dashboard =====
  // /login et /signup peuvent être sous /fr/login, /en/login, ou /login (pas de prefix).
  const stripped = stripLocalePrefix(path);
  if ((stripped === "/login" || stripped === "/signup") && data.user) {
    return NextResponse.redirect(new URL("/app/dashboard", req.url));
  }

  // ===== Branch 3 : routing i18n pour toutes les autres routes publiques =====
  const intlRes = intlMiddleware(req);
  // Propage les cookies auth refresh depuis baseRes vers intlRes
  baseRes.cookies.getAll().forEach((c) => {
    intlRes.cookies.set(c.name, c.value, c as CookieOptions);
  });
  if (isDemoUser) {
    intlRes.headers.set("x-geoperf-demo", "1");
    req.headers.set("x-geoperf-demo", "1");
  }
  return intlRes;
}

export const config = {
  // Match toutes les routes SAUF :
  // - /api/* (Edge Functions / API Routes Next)
  // - /_next/* (assets Next)
  // - /monitoring/* (Sentry tunnel route)
  // - /favicon, /robots.txt, /sitemap.xml, /llms.txt
  // - /logos/* (SVG brand)
  // - tout fichier statique avec extension (.png, .svg, .jpg, .ico, .webmanifest, etc.)
  matcher: [
    "/((?!api|_next|monitoring|favicon|robots\\.txt|sitemap\\.xml|llms\\.txt|logos|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
