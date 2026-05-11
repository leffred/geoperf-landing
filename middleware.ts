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

// S32 — Détecte les params UTM dans l'URL et pose un cookie _geoperf_utm 30 jours
// (first-touch attribution). À la création du compte, la server action signup lit
// ce cookie et pousse les UTM dans options.data → trigger DB → saas_profiles.acquisition_*.
const UTM_COOKIE_NAME = "_geoperf_utm";
const UTM_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

/** Calcule le payload UTM à poser (ou null si rien à faire). First-touch only. */
function computeUtmPayload(req: NextRequest): string | null {
  if (req.cookies.get(UTM_COOKIE_NAME)) return null; // déjà set → first-touch préservé
  const sp = req.nextUrl.searchParams;
  const source = sp.get("utm_source");
  if (!source) return null;
  return JSON.stringify({
    utm_source: source,
    utm_medium: sp.get("utm_medium") || "",
    utm_campaign: sp.get("utm_campaign") || "",
    utm_content: sp.get("utm_content") || "",
    utm_term: sp.get("utm_term") || "",
    first_touch_at: new Date().toISOString(),
  });
}

/** Helper : applique le cookie UTM sur la response finale (peu importe son origine). */
function applyUtm(res: NextResponse, utmPayload: string | null): NextResponse {
  if (utmPayload) {
    res.cookies.set(UTM_COOKIE_NAME, utmPayload, {
      maxAge: UTM_COOKIE_MAX_AGE,
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
  return res;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ===== S32 : capture UTM first-touch (calcul up-front, appliqué sur la response finale via applyUtm) =====
  const utmPayload = computeUtmPayload(req);

  // ===== Guard env vars : dev sans .env.local -> skip auth, juste i18n =====
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[middleware] Supabase env vars missing - skipping auth");
    }
    if (isAuthenticatedScope(path)) {
      return applyUtm(NextResponse.next({ request: req }), utmPayload);
    }
    return applyUtm(intlMiddleware(req), utmPayload);
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
      return applyUtm(NextResponse.redirect(loginUrl), utmPayload);
    }
    return applyUtm(baseRes, utmPayload);
  }
  if (scope === "app") {
    const isLoginRedirect = path === "/login" || path.startsWith("/login/");
    if (!user && !isLoginRedirect) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", path);
      return applyUtm(NextResponse.redirect(loginUrl), utmPayload);
    }
    return applyUtm(baseRes, utmPayload);
  }

  // ===== Auth forms : redirect deja-loggues vers app/dashboard =====
  if (isAuthFormScope(path) && user) {
    return applyUtm(NextResponse.redirect(new URL("/app/dashboard", req.url)), utmPayload);
  }

  // ===== Routes publiques : delegate next-intl pour locale routing =====
  return applyUtm(intlMiddleware(req), utmPayload);
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
