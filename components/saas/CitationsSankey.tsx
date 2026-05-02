// Citations Flow Sankey diagram. Spec : SPRINTS_S8_S9_S10_PLAN.md S10.1
//
// 4 colonnes : Catégorie de prompt → LLM → Brand mention (yes/no) → Top sources cited
// Recharts Sankey (depuis v2.x). Le data structure est { nodes: [{name}], links: [{source, target, value}] }.
"use client";

import { useMemo } from "react";
import { Sankey, Tooltip, ResponsiveContainer } from "recharts";

const LLM_LABELS: Record<string, string> = {
  "openai/gpt-4o": "GPT-4o",
  "anthropic/claude-sonnet-4-6": "Sonnet 4.6",
  "google/gemini-2.5-pro": "Gemini 2.5",
  "perplexity/sonar-pro": "Sonar Pro",
  "mistralai/mistral-large": "Mistral L",
  "x-ai/grok-2": "Grok 2",
  "meta-llama/llama-3.3-70b-instruct": "Llama 3.3",
};

const PROMPT_CATEGORY_LABELS: Record<string, string> = {
  direct_search: "Recherche directe",
  use_case: "Use-case",
  competitive: "Concurrentielle",
  unknown: "Autre",
};

type PromptInfo = { id: string; category: string };

type Response = {
  llm: string;
  prompt_text: string;
  prompt_id?: string | null;
  prompt_category?: string | null;
  brand_mentioned: boolean;
  sources_cited: Array<{ url?: string; domain?: string }> | null;
};

type Props = {
  responses: Response[];
  brandName: string;
  /** Mapping prompt_text → category. Optionnel (sinon "unknown"). */
  promptCategoryByText?: Record<string, string>;
  /** Si true : grayscale + overlay upgrade */
  locked?: boolean;
  height?: number;
};

type SankeyDatum = {
  nodes: Array<{ name: string; col: number; key: string }>;
  links: Array<{ source: number; target: number; value: number }>;
};

function buildSankeyData(rs: Response[], brandName: string, mapping: Record<string, string>): SankeyDatum {
  // Col 0 : prompt category (3 max + unknown)
  // Col 1 : LLM (1-7)
  // Col 2 : brand mentioned yes/no (2 nodes)
  // Col 3 : top 5 source domains
  const cat = (r: Response) => (r.prompt_category ?? mapping[r.prompt_text] ?? "unknown");

  const categories = Array.from(new Set(rs.map(cat))).slice(0, 4);
  const llms = Array.from(new Set(rs.map(r => r.llm))).slice(0, 7);
  const mentions = ["mentioned", "not_mentioned"] as const;

  // Top 5 source domains across all rs
  const domainCounts: Record<string, number> = {};
  for (const r of rs) {
    if (!r.brand_mentioned) continue; // sources flow uniquement quand cité
    for (const s of (r.sources_cited ?? [])) {
      const d = (s?.domain || "").toLowerCase();
      if (d) domainCounts[d] = (domainCounts[d] ?? 0) + 1;
    }
  }
  const topDomains = Object.entries(domainCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([d]) => d);

  // Build nodes : col 0 categories, col 1 llms, col 2 mentions, col 3 domains
  const nodes: SankeyDatum["nodes"] = [];
  const idxCat: Record<string, number> = {};
  const idxLlm: Record<string, number> = {};
  const idxMen: Record<string, number> = {};
  const idxDom: Record<string, number> = {};

  for (const c of categories) {
    idxCat[c] = nodes.length;
    nodes.push({ name: PROMPT_CATEGORY_LABELS[c] ?? c, col: 0, key: `cat-${c}` });
  }
  for (const l of llms) {
    idxLlm[l] = nodes.length;
    nodes.push({ name: LLM_LABELS[l] ?? l.split("/")[1] ?? l, col: 1, key: `llm-${l}` });
  }
  for (const m of mentions) {
    idxMen[m] = nodes.length;
    nodes.push({ name: m === "mentioned" ? `Cite ${brandName}` : "Ne cite pas", col: 2, key: `men-${m}` });
  }
  for (const d of topDomains) {
    idxDom[d] = nodes.length;
    nodes.push({ name: d, col: 3, key: `dom-${d}` });
  }

  // Build links agrégés
  const linkMap: Record<string, number> = {};
  function addLink(src: number, tgt: number, v: number) {
    const k = `${src}-${tgt}`;
    linkMap[k] = (linkMap[k] ?? 0) + v;
  }

  for (const r of rs) {
    const c = cat(r);
    if (idxCat[c] === undefined) continue;
    if (idxLlm[r.llm] === undefined) continue;
    addLink(idxCat[c], idxLlm[r.llm], 1);

    const menKey = r.brand_mentioned ? "mentioned" : "not_mentioned";
    addLink(idxLlm[r.llm], idxMen[menKey], 1);

    if (r.brand_mentioned) {
      const domsInResp = new Set<string>();
      for (const s of (r.sources_cited ?? [])) {
        const d = (s?.domain || "").toLowerCase();
        if (d && idxDom[d] !== undefined) domsInResp.add(d);
      }
      for (const d of domsInResp) {
        addLink(idxMen.mentioned, idxDom[d], 1);
      }
    }
  }

  const links = Object.entries(linkMap).map(([k, value]) => {
    const [s, t] = k.split("-").map(Number);
    return { source: s, target: t, value: value || 0.0001 }; // Recharts Sankey ne supporte pas value=0
  });

  return { nodes, links };
}

// Tech crisp palette : ink → brand-600 → brand-500 → success
const NODE_COLORS = ["#0A0E1A", "#1D4ED8", "#2563EB", "#059669"];

function SankeyNode({ x, y, width, height, index, payload }: any) {
  const col = (payload as any).col ?? 0;
  const fill = NODE_COLORS[col % NODE_COLORS.length];
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.9} rx={1} />
      <text
        x={x + width + 6}
        y={y + height / 2}
        dominantBaseline="middle"
        fontSize={10}
        fontFamily="Inter, system-ui, sans-serif"
        fill="#0A0E1A"
      >
        {(payload as any).name}
      </text>
    </g>
  );
}

export function CitationsSankey({ responses, brandName, promptCategoryByText = {}, locked = false, height = 480 }: Props) {
  const data = useMemo(() => buildSankeyData(responses, brandName, promptCategoryByText), [responses, brandName, promptCategoryByText]);

  if (locked) {
    return (
      <div className="relative bg-white rounded-lg border border-DEFAULT shadow-card p-6">
        <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center text-center px-6 z-10 rounded-lg">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-3">Pro / Agency</p>
          <h3 className="text-xl font-medium text-ink mb-2 tracking-tightish">Citations Flow</h3>
          <p className="text-sm text-ink-muted mb-5 max-w-md leading-relaxed">
            Visualise le flux complet : catégorie de prompt → LLM → mention de la marque → sources autorité citées. 4 colonnes Sankey.
          </p>
          <a href="/app/billing" className="bg-brand-500 text-white px-5 py-2.5 text-sm font-medium rounded-md hover:bg-brand-600 transition-colors duration-150 ease-out shadow-card">
            Upgrade vers Pro
          </a>
        </div>
        <div aria-hidden className="opacity-30 select-none pointer-events-none" style={{ height }}>
          <div className="grid grid-cols-4 gap-12 h-full">
            <div className="bg-ink/30" />
            <div className="bg-brand-600/30" />
            <div className="bg-brand-500/30" />
            <div className="bg-success/30" />
          </div>
        </div>
      </div>
    );
  }

  if (data.nodes.length === 0 || data.links.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-8 text-center text-ink-muted text-sm">
        Pas assez de données pour la visualisation Sankey (snapshot completed avec ≥1 LLM requis).
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-5">
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500">Citations Flow</p>
        <p className="text-xs text-ink-subtle font-mono">
          {responses.length} réponses · {data.nodes.length} nodes · {data.links.length} flux
        </p>
      </div>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <Sankey
            data={data}
            nodePadding={28}
            nodeWidth={14}
            margin={{ top: 8, right: 140, bottom: 8, left: 8 }}
            link={{ stroke: "#1D4ED8", strokeOpacity: 0.25 } as any}
            node={SankeyNode as any}
          >
            <Tooltip
              contentStyle={{ background: "#FFFFFF", border: "1px solid rgba(10,14,26,0.14)", borderRadius: 6, padding: "6px 10px", fontSize: 12, color: "#0A0E1A" }}
              formatter={(v) => [`${v} flux`, ""]}
            />
          </Sankey>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] text-ink-subtle font-mono">
        <span>Colonnes :</span>
        <span><span className="inline-block w-2.5 h-2.5 bg-ink mr-1 align-middle rounded-sm" />Catégorie prompt</span>
        <span><span className="inline-block w-2.5 h-2.5 bg-brand-600 mr-1 align-middle rounded-sm" />LLM</span>
        <span><span className="inline-block w-2.5 h-2.5 bg-brand-500 mr-1 align-middle rounded-sm" />Mention {brandName}</span>
        <span><span className="inline-block w-2.5 h-2.5 bg-success mr-1 align-middle rounded-sm" />Sources citées</span>
      </div>
    </div>
  );
}
