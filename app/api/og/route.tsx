// GET /api/og?t=<tracking_token>
// Génère une OG image dynamique 1200×630.
// Edge runtime obligatoire pour next/og — donc on n'utilise PAS supabase-js
// (qui marche mal en edge), mais fetch direct vers PostgREST.

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const NAVY = "#042C53";
const NAVY_LIGHT = "#0C447C";
const AMBER = "#EF9F27";
const CREAM = "#F1EFE8";
const INK_MUTED = "#5F5E5A";

type ProspectCtx = {
  first_name: string | null;
  full_name: string | null;
  company_name: string | null;
  sous_categorie: string | null;
  rank: number | null;
  visibility_score: number | null;
};

async function fetchProspect(token: string): Promise<ProspectCtx | null> {
  if (!/^[a-f0-9]{24}$/i.test(token)) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    // PostgREST query : embed companies + reports + report_companies
    const q = new URLSearchParams({
      select: "first_name,full_name,companies(nom),reports(sous_categorie),report_companies!inner(rank,visibility_score)",
      tracking_token: `eq.${token}`,
      limit: "1",
    });
    const res = await fetch(`${url}/rest/v1/prospects?${q}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as any[];
    const row = rows?.[0];
    if (!row) return null;
    const rc = Array.isArray(row.report_companies) ? row.report_companies[0] : row.report_companies;
    return {
      first_name: row.first_name,
      full_name: row.full_name,
      company_name: row.companies?.nom ?? null,
      sous_categorie: row.reports?.sous_categorie ?? null,
      rank: rc?.rank ?? null,
      visibility_score: rc?.visibility_score ?? null,
    };
  } catch {
    return null;
  }
}

function GenericOG() {
  return (
    <div
      style={{
        width: 1200, height: 630, background: NAVY, color: "#FFFFFF",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: 80, fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", fontSize: 32, fontFamily: "serif" }}>
        Ge<span style={{ color: AMBER, padding: "0 4px" }}>·</span>perf
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: AMBER, marginBottom: 24 }}>
          LLM Visibility Research
        </div>
        <div style={{ fontFamily: "serif", fontSize: 76, lineHeight: 1.1, fontWeight: 500, marginBottom: 24, display: "flex", flexWrap: "wrap" }}>
          <span>Mesurer ce que les IA disent de votre marque</span>
          <span style={{ color: AMBER }}>.</span>
        </div>
        <div style={{ fontSize: 24, opacity: 0.85, fontFamily: "serif" }}>
          ChatGPT · Gemini · Claude · Perplexity — un benchmark, quatre modèles.
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, opacity: 0.7 }}>
        <span>geoperf.com</span>
        <span>Édition 2026</span>
      </div>
    </div>
  );
}

function PersonalizedOG({ ctx }: { ctx: ProspectCtx }) {
  return (
    <div
      style={{
        width: 1200, height: 630, background: "#FFFFFF",
        display: "flex", flexDirection: "column", fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "40px 64px", borderBottom: `2px solid ${CREAM}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 36, color: NAVY, fontFamily: "serif", fontWeight: 500 }}>
          Ge<span style={{ color: AMBER, padding: "0 4px" }}>·</span>perf
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: NAVY_LIGHT }}>
          {ctx.sous_categorie || "LLM Visibility Research"} · 2026
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", padding: "48px 64px" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: 3, textTransform: "uppercase", color: AMBER, marginBottom: 16 }}>
            Étude Geoperf 2026
          </div>
          <div style={{ fontFamily: "serif", fontSize: 56, lineHeight: 1.1, color: NAVY, fontWeight: 500, marginBottom: 24, display: "flex" }}>
            {ctx.company_name || "Étude sectorielle"}
          </div>
          <div style={{ fontSize: 22, color: INK_MUTED, lineHeight: 1.4, marginBottom: 32, display: "flex", flexWrap: "wrap" }}>
            <span>Position #{ctx.rank ?? "—"} dans la perception des LLM majeurs en 2026.</span>
          </div>
          <div style={{ fontSize: 16, color: INK_MUTED, fontFamily: "monospace" }}>
            geoperf.com · 4 LLM analysés · {ctx.visibility_score ?? "—"}/4 LLM citants
          </div>
        </div>

        <div
          style={{
            width: 320, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", background: NAVY, padding: 32,
          }}
        >
          <div style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: AMBER, marginBottom: 16 }}>
            Score Visibilité IA
          </div>
          <div style={{ fontFamily: "serif", fontSize: 200, fontWeight: 500, color: "#FFFFFF", lineHeight: 1 }}>
            {ctx.visibility_score ?? "—"}
          </div>
          <div style={{ fontFamily: "serif", fontSize: 32, color: "#FFFFFF", opacity: 0.7, marginTop: 8 }}>
            / 4 LLM
          </div>
        </div>
      </div>

      <div
        style={{
          background: CREAM, padding: "20px 64px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 16, color: INK_MUTED,
        }}
      >
        <span>Geoperf est un produit de Jourdechance SAS · Boulogne-Billancourt</span>
        <span style={{ fontFamily: "monospace" }}>geoperf.com</span>
      </div>
    </div>
  );
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("t") || "";
    const ctx = token ? await fetchProspect(token) : null;
    return new ImageResponse(ctx ? <PersonalizedOG ctx={ctx} /> : <GenericOG />, {
      width: 1200,
      height: 630,
    });
  } catch (e) {
    // Fallback ultime : si tout plante, on sert quand même la generic OG
    try {
      return new ImageResponse(<GenericOG />, { width: 1200, height: 630 });
    } catch {
      // Last resort : 1×1 transparent PNG
      const PIXEL = Uint8Array.from(
        atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="),
        (c) => c.charCodeAt(0),
      );
      return new Response(PIXEL, { headers: { "Content-Type": "image/png" } });
    }
  }
}
