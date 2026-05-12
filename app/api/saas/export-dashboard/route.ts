// GET /api/saas/export-dashboard
// Exporte les métriques actuelles de toutes les marques en CSV.

import { NextResponse } from "next/server";
import { requireSaasUser } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await requireSaasUser();
  const sb = getServiceClient();

  const { data, error } = await sb
    .from("v_saas_brand_latest")
    .select(
      "name, domain, category_slug, visibility_score, avg_rank, citation_rate, share_of_voice, last_snapshot_at"
    )
    .eq("user_id", user.id)
    .order("visibility_score", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = data ?? [];

  const headers = [
    "Marque",
    "Domaine",
    "Catégorie",
    "Score visibilité",
    "Rang moyen",
    "Taux citation (%)",
    "Part de voix (%)",
    "Dernier snapshot",
  ];

  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.name,
        r.domain,
        r.category_slug,
        r.visibility_score !== null ? Number(r.visibility_score).toFixed(1) : "",
        r.avg_rank !== null ? Number(r.avg_rank).toFixed(1) : "",
        r.citation_rate !== null ? Number(r.citation_rate).toFixed(0) : "",
        r.share_of_voice !== null ? Number(r.share_of_voice).toFixed(0) : "",
        r.last_snapshot_at
          ? new Date(r.last_snapshot_at).toLocaleString("fr-FR")
          : "",
      ]
        .map(escape)
        .join(",")
    ),
  ];

  const csv = lines.join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="geoperf-export-${date}.csv"`,
    },
  });
}
