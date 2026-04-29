// POST /api/admin/trigger
// Body : { action: "extract" | "synthesis" | "sourcing", params: {...} }
// Auth : either
//   - Supabase session cookie (set by /admin/login form), OR
//   - Authorization: Bearer <GEOPERF_ADMIN_TOKEN> (for external callers / cron / GitHub Actions)
// Proxie vers le webhook n8n correspondant. Server-side only.

import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabase-server-auth";

const N8N_BASE = process.env.N8N_WEBHOOK_BASE || "https://fredericlefebvre.app.n8n.cloud/webhook";

const ACTIONS: Record<string, { path: string; defaults?: Record<string, any> }> = {
  extract: { path: "/geoperf-extract", defaults: { top_n: 10, year: 2026 } },
  synthesis: { path: "/geoperf-synthesis", defaults: { top_n: 14, model: "anthropic/claude-haiku-4.5" } },
  sourcing: { path: "/geoperf-sourcing", defaults: { max_per_company: 3, min_lead_score: 50 } },
  sequence_load: { path: "/geoperf-sequence-load", defaults: { lead_score_min: 50, max: 50 } },
};

async function authorize(req: NextRequest): Promise<{ ok: boolean; via: "session" | "token" | null }> {
  // 1. Bearer token (external callers)
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  const expected = process.env.GEOPERF_ADMIN_TOKEN;
  if (expected && token && token === expected) return { ok: true, via: "token" };

  // 2. Supabase session (browser /admin)
  const user = await getAdminUser();
  if (user) return { ok: true, via: "session" };

  return { ok: false, via: null };
}

export async function POST(req: NextRequest) {
  const { ok, via } = await authorize(req);
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const { action, params } = body || {};
  if (!action || !ACTIONS[action]) {
    return NextResponse.json(
      { error: `unknown action. Valid : ${Object.keys(ACTIONS).join(", ")}` },
      { status: 400 },
    );
  }

  const cfg = ACTIONS[action];
  const payload = { ...cfg.defaults, ...(params || {}) };
  const startedAt = new Date().toISOString();

  try {
    const res = await fetch(`${N8N_BASE}${cfg.path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    let parsed: any = text;
    try { parsed = JSON.parse(text); } catch {}
    return NextResponse.json(
      {
        ok: res.ok,
        action,
        auth_via: via,
        status: res.status,
        payload_sent: payload,
        response: parsed,
        started_at: startedAt,
        n8n_url: `${N8N_BASE}${cfg.path}`,
      },
      { status: res.ok ? 200 : 502 },
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        action,
        error: e.message || String(e),
        payload_sent: payload,
        started_at: startedAt,
      },
      { status: 500 },
    );
  }
}
