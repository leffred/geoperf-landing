// GET /api/og?t=<tracking_token>
// Génère une OG image dynamique 1200×630 avec le rang IA + score visibilité du prospect.
// Ces images apparaissent quand on partage la landing sur LinkedIn / Twitter / Slack.

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "edge"; // ImageResponse requires edge runtime

const NAVY = "#042C53";
const NAVY_LIGHT = "#0C447C";
const AMBER = "#EF9F27";
const CREAM = "#F1EFE8";
const INK_MUTED = "#5F5E5A";

// SVG dot character used as logo accent
function Logo({ small }: { small?: boolean }) {
  const size = small ? 36 : 56;
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        fontFamily: "serif",
        fontSize: size,
        color: NAVY,
        fontWeight: 500,
        letterSpacing: "-1px",
      },
      children: [
        "Ge",
        { type: "span", props: { style: { color: AMBER, padding: "0 2px" }, children: "·" } },
        "perf",
      ],
    },
  };
}

async function fetchProspect(token: string) {
  if (!/^[a-f0-9]{24}$/i.test(token)) return null;
  try {
    const sb = getServiceClient();
    const { data } = await sb
      .from("prospects")
      .select(
        "first_name, full_name, companies(nom), reports(sous_categorie), report_companies!inner(rank, visibility_score)",
      )
      .eq("tracking_token", token)
      .maybeSingle();
    if (!data) return null;
    const rc = Array.isArray((data as any).report_companies)
      ? (data as any).report_companies[0]
      : (data as any).report_companies;
    return {
      first_name: (data as any).first_name as string | null,
      full_name: (data as any).full_name as string | null,
      company_name: (data as any).companies?.nom || null,
      sous_categorie: (data as any).reports?.sous_categorie || null,
      rank: rc?.rank ?? null,
      visibility_score: rc?.visibility_score ?? null,
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("t") || "";
  const ctx = await fetchProspect(token);

  // Generic fallback OG (no token / invalid)
  if (!ctx) {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            background: NAVY,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 80,
            color: "#FFFFFF",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", fontSize: 32, color: "#FFFFFF", fontFamily: "serif" }}>
            Ge<span style={{ color: AMBER, padding: "0 4px" }}>·</span>perf
          </div>
          <div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 18,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: AMBER,
                marginBottom: 24,
              }}
            >
              LLM Visibility Research
            </div>
            <div
              style={{
                fontFamily: "serif",
                fontSize: 76,
                lineHeight: 1.1,
                fontWeight: 500,
                marginBottom: 24,
              }}
            >
              Mesurer ce que les IA disent de votre marque<span style={{ color: AMBER }}>.</span>
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
      ),
      { width: 1200, height: 630 },
    );
  }

  // Personalized OG (token resolved)
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top band: logo + segment */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "40px 64px",
            borderBottom: `2px solid ${CREAM}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", fontSize: 36, color: NAVY, fontFamily: "serif", fontWeight: 500 }}>
            Ge<span style={{ color: AMBER, padding: "0 4px" }}>·</span>perf
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 14,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: NAVY_LIGHT,
            }}
          >
            {ctx.sous_categorie || "LLM Visibility Research"} · 2026
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", padding: "48px 64px" }}>
          {/* Left: stats */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 16,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: AMBER,
                marginBottom: 16,
              }}
            >
              Étude Geoperf 2026
            </div>
            <div
              style={{
                fontFamily: "serif",
                fontSize: 56,
                lineHeight: 1.1,
                color: NAVY,
                fontWeight: 500,
                marginBottom: 24,
              }}
            >
              {ctx.company_name || "Étude sectorielle"}
            </div>
            <div style={{ fontSize: 22, color: INK_MUTED, lineHeight: 1.4, marginBottom: 32 }}>
              ressort en position{" "}
              <strong style={{ color: NAVY }}>#{ctx.rank ?? "—"}</strong> dans la perception des LLM
              majeurs en 2026.
            </div>
            <div style={{ fontSize: 16, color: INK_MUTED, fontFamily: "monospace" }}>
              geoperf.com · 4 LLM analysés · {ctx.visibility_score ?? "—"}/4 LLM citants
            </div>
          </div>

          {/* Right: visibility score badge */}
          <div
            style={{
              width: 320,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: NAVY,
              padding: 32,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 14,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: AMBER,
                marginBottom: 16,
              }}
            >
              Score Visibilité IA
            </div>
            <div
              style={{
                fontFamily: "serif",
                fontSize: 200,
                fontWeight: 500,
                color: "#FFFFFF",
                lineHeight: 1,
              }}
            >
              {ctx.visibility_score ?? "—"}
            </div>
            <div
              style={{
                fontFamily: "serif",
                fontSize: 32,
                color: "#FFFFFF",
                opacity: 0.7,
                marginTop: 8,
              }}
            >
              / 4 LLM
            </div>
          </div>
        </div>

        {/* Bottom band */}
        <div
          style={{
            background: CREAM,
            padding: "20px 64px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 16,
            color: INK_MUTED,
          }}
        >
          <span>Geoperf est un produit de Jourdechance SAS · Boulogne-Billancourt</span>
          <span style={{ fontFamily: "monospace" }}>geoperf.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
