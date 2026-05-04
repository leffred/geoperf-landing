// Proxy server-side vers Edge Function saas_suggest_competitors.
// Auth : user Supabase logué (vérifié via getSupabaseServerClient).
// S17 §4.6 — pattern identique à /api/saas/suggest-prompts (S15).

import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }
  const sb = await getSupabaseServerClient();
  const { data: auth } = await sb.auth.getUser();
  if (!auth?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: { brand_name?: string; domain?: string; category?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  if (!body.brand_name || !body.category) {
    return NextResponse.json({ error: "brand_name_and_category_required" }, { status: 400 });
  }

  const resp = await fetch(`${SUPABASE_URL}/functions/v1/saas_suggest_competitors`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: auth.user.id,
      brand_name: body.brand_name,
      domain: body.domain ?? "",
      category: body.category,
    }),
  });

  const data = await resp.json().catch(() => ({ error: "edge_invalid_response" }));
  return NextResponse.json(data, { status: resp.status });
}
