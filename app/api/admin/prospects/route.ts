// S20 §4.2 : route /api/admin/prospects avec filtres + pagination + bulk actions.
// GET  /api/admin/prospects?parent_cat=&category=&status=&email_verified=&search=&page=1&limit=50
// POST /api/admin/prospects (bulk action) → { action: 'disqualify' | 'opt_out' | 'enroll_seq_a' | 'export_csv', ids: string[] }
//
// Auth : Supabase session admin (cookie) OU Bearer token GEOPERF_ADMIN_TOKEN.
// Service role pour bypass RLS sur la vue v_admin_prospects.

import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";

const N8N_PHASE2_WEBHOOK_URL =
  process.env.N8N_PHASE2_WEBHOOK_URL ||
  "https://fredericlefebvre.app.n8n.cloud/webhook/geoperf-sourcing";

async function checkAuth(req: NextRequest): Promise<boolean> {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7);
    if (token && token === process.env.GEOPERF_ADMIN_TOKEN) return true;
  }
  const user = await getAdminUser();
  return !!user;
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const parentCat = searchParams.get("parent_cat") || null;
  const category = searchParams.get("category") || null;
  const statuses = searchParams.getAll("status");
  const emailVerifiedRaw = searchParams.get("email_verified");
  const search = searchParams.get("search")?.trim() || null;
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Math.min(200, Math.max(1, Number(searchParams.get("limit") || "50")));
  const offset = (page - 1) * limit;
  const sortField = searchParams.get("sort") || "lead_score";
  const sortDir = (searchParams.get("dir") || "desc").toLowerCase() === "asc";

  const sb = getServiceClient();
  let query = sb.from("v_admin_prospects").select("*", { count: "exact" });

  if (parentCat) query = query.eq("parent_category_slug", parentCat);
  if (category) query = query.eq("category_slug", category);
  if (statuses.length > 0) query = query.in("status", statuses);
  if (emailVerifiedRaw === "true") query = query.eq("email_verified", true);
  if (emailVerifiedRaw === "false") query = query.eq("email_verified", false);
  if (search) {
    // OR sur company_nom, full_name, email, title
    const escaped = search.replace(/[%_]/g, "\\$&");
    query = query.or(
      `company_nom.ilike.%${escaped}%,full_name.ilike.%${escaped}%,email.ilike.%${escaped}%,title.ilike.%${escaped}%`
    );
  }

  // Whitelist sort fields pour eviter SQL injection via param
  const ALLOWED_SORTS = new Set([
    "lead_score", "created_at", "status", "company_nom", "email_verified", "full_name",
  ]);
  const safeSort = ALLOWED_SORTS.has(sortField) ? sortField : "lead_score";
  query = query.order(safeSort, { ascending: sortDir }).range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    rows: data ?? [],
    total: count ?? 0,
    page,
    limit,
    pages: count ? Math.ceil(count / limit) : 0,
  });
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { action?: string; ids?: string[]; payload?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const ids = Array.isArray(body.ids) ? body.ids.filter((s) => typeof s === "string") : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: "no_ids" }, { status: 400 });
  }
  if (ids.length > 500) {
    return NextResponse.json({ error: "too_many_ids", max: 500 }, { status: 400 });
  }

  const sb = getServiceClient();

  switch (body.action) {
    case "disqualify": {
      const { error, count } = await sb
        .from("prospects")
        .update({ status: "disqualified", updated_at: new Date().toISOString() }, { count: "exact" })
        .in("id", ids);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, updated: count });
    }

    case "opt_out": {
      const { error, count } = await sb
        .from("prospects")
        .update({
          status: "opted_out",
          opt_out_at: new Date().toISOString(),
          opt_out_reason: "admin_bulk",
          updated_at: new Date().toISOString(),
        }, { count: "exact" })
        .in("id", ids);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, updated: count });
    }

    case "enroll_seq_a": {
      // Fire-and-forget : appelle n8n Phase 2.2 (sequence_load) avec la liste d'ids
      // Note : le workflow Phase 2.2 (Sequence A) accepte un array prospect_ids.
      // Si schema differe : adapter le payload selon le webhook reel.
      const resp = await fetch(N8N_PHASE2_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enroll_sequence_a",
          prospect_ids: ids,
          source: "admin_bulk",
        }),
      }).catch((e) => ({ ok: false, status: 0, error: String(e) } as Response & { error?: string }));
      const ok = (resp as Response).ok;
      // Audit trail : insert event sur chaque prospect
      const events = ids.map((id) => ({
        prospect_id: id,
        event_type: "sequence_a_enroll_requested",
        channel: "system",
        created_by: "admin_bulk",
        metadata: { webhook_ok: ok },
      }));
      await sb.from("prospect_events").insert(events).then(({ error }) => {
        if (error) console.warn("[admin_prospects] event log:", error.message);
      });
      return NextResponse.json({ ok, requested: ids.length, webhook_ok: ok });
    }

    case "export_csv": {
      // Retourne du CSV inline pour les ids selectionnes
      const { data, error } = await sb
        .from("v_admin_prospects")
        .select("email,full_name,title,company_nom,company_domain,lead_score,status,category_slug,parent_category_slug,created_at")
        .in("id", ids);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      const headers = [
        "email", "full_name", "title", "company_nom", "company_domain",
        "lead_score", "status", "category_slug", "parent_category_slug", "created_at",
      ];
      const csv = [
        headers.join(","),
        ...(data ?? []).map((r: Record<string, unknown>) =>
          headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")
        ),
      ].join("\n");
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="prospects-${Date.now()}.csv"`,
        },
      });
    }

    default:
      return NextResponse.json({ error: "unknown_action", allowed: ["disqualify","opt_out","enroll_seq_a","export_csv"] }, { status: 400 });
  }
}
