// GET /api/saas/export-snapshot/[sid]
// Exporte les réponses d'un snapshot en CSV (une ligne par LLM × prompt).

import { NextResponse } from "next/server";
import { requireSaasUser } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sid: string }> }
) {
  const { sid } = await params;
  const user = await requireSaasUser();
  const sb = getServiceClient();

  // Vérif ownership : le snapshot doit appartenir à une marque de l'user
  const { data: snap } = await sb
    .from("saas_brand_snapshots")
    .select("id, brand_id, saas_tracked_brands!inner(user_id, name, domain)")
    .eq("id", sid)
    .maybeSingle();

  if (!snap) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const brandInfo = (snap as any).saas_tracked_brands as { user_id: string; name: string; domain: string } | null;
  if (!brandInfo || brandInfo.user_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Réponses du snapshot
  const { data, error } = await sb
    .from("saas_snapshot_responses")
    .select("llm, prompt_text, brand_mentioned, brand_rank, competitors_mentioned, latency_ms")
    .eq("snapshot_id", sid)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data ?? [];

  const headers = ["LLM", "Prompt", "Marque citée", "Rang", "Concurrents cités", "Latence (ms)"];

  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const lines = [
    headers.join(","),
    ...rows.map((r: any) =>
      [
        r.llm,
        r.prompt_text,
        r.brand_mentioned ? "Oui" : "Non",
        r.brand_rank ?? "",
        Array.isArray(r.competitors_mentioned) ? r.competitors_mentioned.join("; ") : "",
        r.latency_ms ?? "",
      ]
        .map(escape)
        .join(",")
    ),
  ];

  const csv = lines.join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  const slug = (brandInfo.domain ?? "snapshot").replace(/[^a-z0-9]/gi, "-");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="geoperf-${slug}-${date}.csv"`,
    },
  });
}
