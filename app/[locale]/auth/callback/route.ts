// OAuth/magic-link callback. Exchanges the code in the URL for a session.
// Used by signup confirmation emails and magic links.

import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/app/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=unknown", req.url));
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL(`/login?error=unknown`, req.url));
  }

  return NextResponse.redirect(new URL(next, req.url));
}
