// Proxy server-side vers Edge Function saas_suggest_prompts.
// Auth : user Supabase logué (vérifié via getSupabaseServerClient).
// Pas d'exposition du service_role côté client.

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

  let body: { name?: string; domain?: string; category?: string; competitors?: string[] };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  if (!body.name || !body.category) {
    return NextResponse.json({ error: "name_and_category_required" }, { status: 400 });
  }

  const resp = await fetch(`${SUPABASE_URL}/functions/v1/saas_suggest_prompts`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: auth.user.id,
      name: body.name,
      domain: body.domain ?? "",
      category: body.category,
      competitors: body.competitors ?? [],
    }),
  });

  const data = await resp.json().catch(() => ({ error: "edge_invalid_response" }));
  return NextResponse.json(data, { status: resp.status });
}
