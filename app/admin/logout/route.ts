// POST /admin/logout — sign out and redirect to /admin/login
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";

export async function POST(req: Request) {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  const url = new URL("/admin/login", req.url);
  return NextResponse.redirect(url, { status: 303 });
}
