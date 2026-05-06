// GET /api/og?t=<tracking_token>
// Génère une OG image dynamique 1200×630.
// Edge runtime obligatoire pour next/og — donc on n'utilise PAS supabase-js
// (qui marche mal en edge), mais fetch direct vers PostgREST.
//
// S23 :
//   - C4 cleanup : suppression des aliases locaux (NAVY/AMBER/INK/...) au profit
//     des tokens `editorial.*` / `ui.*` consommés directement.
//   - Wordmark `Ge·perf` → `geoperf` (lowercase, Inter ExtraBold) sur les 4 OG.
//     Cohérent avec decision log 2026-05-06 (« jamais Ge·perf, toujours geoperf »).

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { editorial, ui } from "@/lib/design-tokens";

export const runtime = "edge";

// ============================================================================
// Wordmark `geoperf` reusable — Inter ExtraBold lowercase, color paramétrable.
// next/og runtime : fontFamily "sans-serif" → Inter par défaut.
// ============================================================================
function Wordmark({ color, size = 36 }: { color: string; size?: number }) {
  return (
    <div
      style={{
        fontFamily: "sans-serif",
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "-0.025em",
        color,
        display: "flex",
      }}
    >
      geoperf
    </div>
  );
}

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

// ============================================================================
// GenericOG — palette éditoriale (navy/amber).
// ============================================================================
function GenericOG() {
  return (
    <div
      style={{
        width: 1200, height: 630, background: editorial.navy, color: "#FFFFFF",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: 80, fontFamily: "sans-serif",
      }}
    >
      <Wordmark color="#FFFFFF" size={32} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: editorial.amber, marginBottom: 24 }}>
          LLM Visibility Research
        </div>
        <div style={{ fontFamily: "serif", fontSize: 76, lineHeight: 1.1, fontWeight: 500, marginBottom: 24, display: "flex", flexWrap: "wrap" }}>
          <span>Mesurer ce que les IA disent de votre marque</span>
          <span style={{ color: editorial.amber }}>.</span>
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

// ============================================================================
// PersonalizedOG — étude sectorielle, palette éditoriale (navy/amber/parchment).
// ============================================================================
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
          padding: "40px 64px", borderBottom: `2px solid ${editorial.parchment}`,
        }}
      >
        <Wordmark color={editorial.navy} size={36} />
        <div style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: editorial.navyLight }}>
          {ctx.sous_categorie || "LLM Visibility Research"} · 2026
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", padding: "48px 64px" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: 3, textTransform: "uppercase", color: editorial.amber, marginBottom: 16 }}>
            Étude Geoperf 2026
          </div>
          <div style={{ fontFamily: "serif", fontSize: 56, lineHeight: 1.1, color: editorial.navy, fontWeight: 500, marginBottom: 24, display: "flex" }}>
            {ctx.company_name || "Étude sectorielle"}
          </div>
          <div style={{ fontSize: 22, color: editorial.inkMuted, lineHeight: 1.4, marginBottom: 32, display: "flex", flexWrap: "wrap" }}>
            <span>Position #{ctx.rank ?? "—"} dans la perception des LLM majeurs en 2026.</span>
          </div>
          <div style={{ fontSize: 16, color: editorial.inkMuted, fontFamily: "monospace" }}>
            geoperf.com · 4 LLM analysés · {ctx.visibility_score ?? "—"}/4 LLM citants
          </div>
        </div>

        <div
          style={{
            width: 320, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", background: editorial.navy, padding: 32,
          }}
        >
          <div style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: editorial.amber, marginBottom: 16 }}>
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
          background: editorial.parchment, padding: "20px 64px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 16, color: editorial.inkMuted,
        }}
      >
        <span>Geoperf est un produit de Jourdechance SAS · Boulogne-Billancourt</span>
        <span style={{ fontFamily: "monospace" }}>geoperf.com</span>
      </div>
    </div>
  );
}

// ============================================================================
// ProfileOG + LeaderboardOG — Tech crisp (ink/brand-500/Inter), pour /profile et /leaderboard.
// S17 §4.4. Cohérent avec emails post-S16 §4.7.
// ============================================================================
function ProfileOG({ title, score }: { title: string; score: string | null }) {
  return (
    <div
      style={{
        width: 1200, height: 630, background: "#FFFFFF",
        display: "flex", flexDirection: "column", fontFamily: "sans-serif",
      }}
    >
      <div style={{ padding: "40px 64px", borderBottom: `1px solid ${ui.surface}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Wordmark color={ui.ink} size={36} />
        <div style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: ui.brand500 }}>
          Profil de marque · 2026
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", padding: "60px 64px" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: 3, textTransform: "uppercase", color: ui.brand500, marginBottom: 20 }}>
            Étude Geoperf
          </div>
          <div style={{ fontSize: 64, lineHeight: 1.1, color: ui.ink, fontWeight: 500, marginBottom: 28, display: "flex", letterSpacing: "-0.025em" }}>
            {title}
          </div>
          <div style={{ fontSize: 22, color: ui.inkMuted, lineHeight: 1.4, display: "flex", flexWrap: "wrap" }}>
            <span>Comment cette marque est citée par ChatGPT, Claude, Gemini et Perplexity.</span>
          </div>
        </div>
        {score !== null && (
          <div style={{ width: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: ui.ink, padding: 24 }}>
            <div style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: ui.brand500, marginBottom: 12 }}>
              Visibility
            </div>
            <div style={{ fontSize: 180, fontWeight: 500, color: "#FFFFFF", lineHeight: 1, letterSpacing: "-0.025em" }}>
              {score}
            </div>
            <div style={{ fontSize: 28, color: "#FFFFFF", opacity: 0.7, marginTop: 4 }}>/ 4 LLM</div>
          </div>
        )}
      </div>
      <div style={{ background: ui.surface, padding: "20px 64px", display: "flex", justifyContent: "space-between", fontSize: 14, color: ui.inkMuted, fontFamily: "monospace" }}>
        <span>geoperf.com/profile</span>
        <span>Étude indépendante Jourdechance</span>
      </div>
    </div>
  );
}

function LeaderboardOG({ title }: { title: string }) {
  return (
    <div
      style={{
        width: 1200, height: 630, background: ui.ink, color: "#FFFFFF",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: 80, fontFamily: "sans-serif",
      }}
    >
      <Wordmark color="#FFFFFF" size={32} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: ui.brand500, marginBottom: 24 }}>
          Leaderboard sectoriel · 2026
        </div>
        <div style={{ fontSize: 84, lineHeight: 1.05, fontWeight: 500, marginBottom: 24, display: "flex", flexWrap: "wrap", letterSpacing: "-0.025em" }}>
          <span>{title}</span>
        </div>
        <div style={{ fontSize: 24, opacity: 0.85 }}>
          Selon ChatGPT, Claude, Gemini et Perplexity. Étude gratuite Jourdechance.
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, opacity: 0.7, fontFamily: "monospace" }}>
        <span>geoperf.com/leaderboard</span>
        <span>Édition 2026</span>
      </div>
    </div>
  );
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("t") || "";
    const type = url.searchParams.get("type");

    if (type === "profile") {
      const title = url.searchParams.get("title") || "Marque";
      const score = url.searchParams.get("score");
      return new ImageResponse(<ProfileOG title={title} score={score} />, { width: 1200, height: 630 });
    }
    if (type === "leaderboard") {
      const title = url.searchParams.get("title") || "Top 10 par secteur";
      return new ImageResponse(<LeaderboardOG title={title} />, { width: 1200, height: 630 });
    }

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
      // Last resort : 1x1 transparent PNG
      const PIXEL = Uint8Array.from(
        atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="),
        (c) => c.charCodeAt(0),
      );
      return new Response(PIXEL, { headers: { "Content-Type": "image/png" } });
    }
  }
}
