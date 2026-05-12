// POST /api/saas/prefill-brand-setup
// Proxy vers l'Edge Function saas_prefill_brand_setup.
// Body : { brand_id }  — récupère name/domain/category_slug depuis la DB.

import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  const authSb = await getSupabaseServerClient();
  const { data: auth } = await authSb.auth.getUser();
  if (!auth?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: { brand_id?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!body.brand_id) return NextResponse.json({ error: "brand_id_required" }, { status: 400 });

  // Fetch brand data + ownership check
  const sb = getServiceClient();
  const { data: brand } = await sb
    .from("saas_tracked_brands")
    .select("id, user_id, name, domain, category_slug, brand_description")
    .eq("id", body.brand_id)
    .maybeSingle();

  if (!brand || (brand as any).user_id !== auth.user.id) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const resp = await fetch(`${SUPABASE_URL}/functions/v1/saas_prefill_brand_setup`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: auth.user.id,
      brand_name: (brand as any).name,
      domain: (brand as any).domain ?? "",
      category: (brand as any).category_slug ?? "",
      brand_description: (brand as any).brand_description ?? "",
    }),
  });

  const data = await resp.json().catch(() => ({ error: "edge_invalid_response" }));
  return NextResponse.json(data, { status: resp.status });
}
