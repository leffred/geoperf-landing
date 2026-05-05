// Middleware: refresh Supabase auth cookies on /admin/* and /app/* requests, redirect
// unauthenticated visitors to /admin/login (admin) or /login (saas).
// Public routes (/, /sample, /[sous_cat], /signup, etc.) are NOT touched.

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const path = req.nextUrl.pathname;
  const isAdminScope = path === "/admin" || path.startsWith("/admin/");
  const isAppScope = path === "/app" || path.startsWith("/app/");
  const adminLogin = path === "/admin/login";
  const saasLogin = path === "/login";
  const saasSignup = path === "/signup";

  // S20 §4.5 : flag x-geoperf-demo propage si l'utilisateur est le compte demo seedé.
  // Les server components / actions peuvent lire ce header pour bloquer les mutations.
  const DEMO_USER_ID = "d3403d3e-d3d3-d3d3-d3d3-d3d3d3d30000";
  const isDemoUser = data.user?.id === DEMO_USER_ID;
  if (isDemoUser) {
    res.headers.set("x-geoperf-demo", "1");
    req.headers.set("x-geoperf-demo", "1");
  }

  // /admin/* → /admin/login si non authentifié
  if (isAdminScope) {
    if (!data.user && !adminLogin) {
      const loginUrl = new URL("/admin/login", req.url);
      if (path !== "/admin") {
        loginUrl.searchParams.set("next", path + req.nextUrl.search);
      }
      return NextResponse.redirect(loginUrl);
    }
    if (data.user && adminLogin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // /app/* → /login si non authentifié
  if (isAppScope) {
    if (!data.user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", path + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Si déjà loggé, /login et /signup redirigent vers /app/dashboard
  if ((saasLogin || saasSignup) && data.user) {
    return NextResponse.redirect(new URL("/app/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/app", "/app/:path*", "/login", "/signup"],
};
