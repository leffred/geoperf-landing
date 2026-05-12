"use client";

// V2 — Snapshot inspector : left filters + prompt list / right per-LLM response cards.
// Filters (LLM + category) are client state. Brand name passed in for highlight.

import { useMemo, useState } from "react";
import { Quote, Check, X } from "lucide-react";
import { LLMPill } from "@/components/saas/v2/LLMPill";

export interface SnapshotPrompt {
  /** Unique key (prompt_text). */
  key: string;
  /** Derived from prompt text via heuristic. */
  category: "direct" | "usecase" | "comp";
  text: string;
  responses: Array<SnapshotResponseRow>;
}

export interface SnapshotResponseRow {
  llm: string;
  brandMentioned: boolean;
  brandRank: number | null;
  responseText: string | null;
  competitorsMentioned: string[];
  sourcesCited: Array<{ url?: string; domain?: string; title?: string }>;
  costUsd: number | null;
  latencyMs: number | null;
}

interface Props {
  brandName: string;
  llms: string[];
  prompts: SnapshotPrompt[];
}

const CAT_LABELS = {
  all: "Toutes",
  direct: "Recherche directe",
  usecase: "Use-case",
  comp: "Concurrentielle",
};
const CAT_SHORT = { direct: "01 · DIRECT", usecase: "02 · USE-CASE", comp: "03 · COMP" };

export function SnapshotInspector({ brandName, llms, prompts }: Props) {
  const [llmFilter, setLlmFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<"all" | "direct" | "usecase" | "comp">("all");
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const filtered = useMemo(
    () => prompts.filter((p) => catFilter === "all" || p.category === catFilter),
    [prompts, catFilter],
  );

  const current = filtered[selectedIdx] ?? filtered[0];
  const visibleLlms = llmFilter === "all" ? llms : [llmFilter];

  if (filtered.length === 0 || !current) {
    return (
      <div className="grid place-items-center bg-surface rounded-xl text-ink-subtle" style={{ padding: 40, fontSize: 13 }}>
        Pas de prompt sur ce filtre.
      </div>
    );
  }

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "320px minmax(0, 1fr)" }}>
      {/* Left : filters + prompt list */}
      <div className="flex flex-col gap-3">
        {/* Filters card */}
        <div className="bg-white border border-DEFAULT rounded-xl shadow-card" style={{ padding: 14 }}>
          <div className="font-mono uppercase text-ink-subtle mb-2" style={{ fontSize: 10, letterSpacing: "0.14em" }}>Filtres</div>

          <div className="mb-2.5">
            <div className="text-ink-muted mb-1" style={{ fontSize: 11 }}>LLM</div>
            <div className="flex flex-wrap gap-1">
              <SegBtn active={llmFilter === "all"} onClick={() => setLlmFilter("all")} accent>Tous</SegBtn>
              {llms.map((l) => (
                <SegBtn key={l} active={llmFilter === l} onClick={() => setLlmFilter(l)} accent>
                  {humanLLMShort(l)}
                </SegBtn>
              ))}
            </div>
          </div>

          <div>
            <div className="text-ink-muted mb-1" style={{ fontSize: 11 }}>Par catégorie</div>
            <div className="flex flex-wrap gap-1">
              {(["all", "direct", "usecase", "comp"] as const).map((id) => (
                <SegBtn
                  key={id}
                  active={catFilter === id}
                  onClick={() => {
                    setCatFilter(id);
                    setSelectedIdx(0);
                  }}
                >
                  {CAT_LABELS[id]}
                </SegBtn>
              ))}
            </div>
          </div>
        </div>

        {/* Prompt list */}
        <div className="bg-white border border-DEFAULT rounded-xl shadow-card overflow-hidden" style={{ padding: 0 }}>
          <div className="flex items-center justify-between" style={{ padding: "12px 14px", borderBottom: "1px solid rgba(10,14,26,0.08)" }}>
            <span className="font-mono uppercase text-ink-subtle" style={{ fontSize: 10, letterSpacing: "0.14em" }}>Prompts</span>
            <span className="font-mono text-ink-subtle" style={{ fontSize: 11 }}>{filtered.length}/{prompts.length}</span>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 480 }}>
            {filtered.map((p, i) => {
              const cited = p.responses.filter((r) => r.brandMentioned).length;
              const total = p.responses.length;
              const all = cited === total && total > 0;
              const none = cited === 0;
              const isSelected = i === selectedIdx;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setSelectedIdx(i)}
                  className="block text-left w-full"
                  style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid rgba(10,14,26,0.08)",
                    background: isSelected ? "#F7F8FA" : "transparent",
                    borderLeft: isSelected ? "2px solid #2563EB" : "2px solid transparent",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-mono uppercase text-ink-subtle" style={{ fontSize: 9, letterSpacing: "0.1em" }}>
                      {CAT_SHORT[p.category]}
                    </span>
                    <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full border" style={{
                      fontSize: 11,
                      fontWeight: 500,
                      background: all ? "color-mix(in srgb, #059669 12%, transparent)" : none ? "color-mix(in srgb, #DC2626 12%, transparent)" : "#F7F8FA",
                      color: all ? "#059669" : none ? "#DC2626" : "#5B6478",
                      borderColor: all ? "color-mix(in srgb, #059669 24%, transparent)" : none ? "color-mix(in srgb, #DC2626 24%, transparent)" : "rgba(10,14,26,0.08)",
                    }}>
                      {cited}/{total}
                    </span>
                  </div>
                  <div
                    className="text-ink line-clamp-2"
                    style={{ fontSize: 12, lineHeight: 1.4, fontWeight: isSelected ? 500 : 400 }}
                  >
                    {p.text}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right : selected prompt header + per-LLM responses */}
      <div className="flex flex-col gap-4 min-w-0">
        {/* Prompt header */}
        <div className="bg-white border border-DEFAULT rounded-xl shadow-card" style={{ padding: 18 }}>
          <div className="flex items-start gap-3 mb-3.5">
            <div
              className="grid place-items-center shrink-0 text-ink-muted"
              style={{ width: 30, height: 30, borderRadius: 8, background: "#F7F8FA", border: "1px solid rgba(10,14,26,0.08)" }}
            >
              <Quote size={14} strokeWidth={1.6} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono uppercase text-ink-subtle mb-1" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
                {CAT_LABELS[current.category]} · Prompt
              </div>
              <div className="text-ink" style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.4 }}>
                « {current.text} »
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 pt-3" style={{ borderTop: "1px solid rgba(10,14,26,0.08)" }}>
            <div>
              <div className="font-mono uppercase text-ink-subtle" style={{ fontSize: 10, letterSpacing: "0.1em" }}>Citation</div>
              <div className="font-mono text-ink mt-0.5 tabular-nums" style={{ fontSize: 16, fontWeight: 600 }}>
                {current.responses.filter((r) => r.brandMentioned).length}/{current.responses.length} LLMs
              </div>
            </div>
            <div>
              <div className="font-mono uppercase text-ink-subtle" style={{ fontSize: 10, letterSpacing: "0.1em" }}>Rang moyen</div>
              <div className="font-mono text-ink mt-0.5 tabular-nums" style={{ fontSize: 16, fontWeight: 600 }}>
                {(() => {
                  const ranks = current.responses.filter((r) => r.brandMentioned && r.brandRank !== null).map((r) => r.brandRank!);
                  return ranks.length ? (ranks.reduce((a, b) => a + b, 0) / ranks.length).toFixed(1) : "—";
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Per-LLM response cards */}
        <div className="flex flex-col gap-3">
          {visibleLlms.map((llm) => {
            const r = current.responses.find((x) => x.llm === llm);
            if (!r) {
              return (
                <div
                  key={llm}
                  className="bg-white border border-DEFAULT rounded-xl shadow-card"
                  style={{ padding: 18, borderLeft: "3px solid rgba(10,14,26,0.14)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <LLMPill name={llm} size="sm" />
                    <span className="text-ink-subtle" style={{ fontSize: 12 }}>Pas de réponse pour ce LLM sur ce prompt.</span>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={llm}
                className="bg-white border border-DEFAULT rounded-xl shadow-card"
                style={{
                  padding: 18,
                  borderLeft: r.brandMentioned ? "3px solid #059669" : "3px solid rgba(10,14,26,0.14)",
                }}
              >
                <div className="flex items-center justify-between gap-3 flex-wrap mb-2.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <LLMPill name={llm} size="sm" />
                    {r.brandMentioned ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          background: "color-mix(in srgb, #059669 12%, transparent)",
                          color: "#059669",
                          borderColor: "color-mix(in srgb, #059669 24%, transparent)",
                        }}
                      >
                        <Check size={10} strokeWidth={2.2} />
                        Marque citée{r.brandRank !== null ? ` · rang ${r.brandRank}` : ""}
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          background: "color-mix(in srgb, #DC2626 12%, transparent)",
                          color: "#DC2626",
                          borderColor: "color-mix(in srgb, #DC2626 24%, transparent)",
                        }}
                      >
                        <X size={10} strokeWidth={2.2} />
                        Non citée
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-ink-subtle" style={{ fontSize: 10 }}>
                    {r.latencyMs !== null ? `${r.latencyMs}ms` : "—"} · {r.costUsd !== null ? `$${r.costUsd.toFixed(4)}` : "—"}
                  </span>
                </div>

                {r.responseText && (
                  <div
                    className="text-ink mb-3"
                    style={{
                      fontSize: 13,
                      lineHeight: 1.6,
                      padding: "10px 12px",
                      background: "#F7F8FA",
                      borderRadius: 8,
                      borderLeft: "2px solid rgba(10,14,26,0.14)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <Highlight text={r.responseText} brandName={brandName} maxLen={600} />
                  </div>
                )}

                <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div>
                    <div className="font-mono uppercase text-ink-subtle mb-1.5" style={{ fontSize: 10, letterSpacing: "0.12em" }}>
                      Marques citées · ordre
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {r.competitorsMentioned.length === 0 ? (
                        <span className="text-ink-subtle" style={{ fontSize: 11 }}>—</span>
                      ) : (
                        r.competitorsMentioned.map((b, i) => {
                          const isBrand = b.toLowerCase() === brandName.toLowerCase();
                          return (
                            <span
                              key={`${b}-${i}`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
                              style={{
                                fontSize: 11,
                                fontWeight: 500,
                                background: isBrand ? "color-mix(in srgb, #2563EB 10%, transparent)" : "#F7F8FA",
                                color: isBrand ? "#2563EB" : "#5B6478",
                                borderColor: isBrand ? "color-mix(in srgb, #2563EB 24%, transparent)" : "rgba(10,14,26,0.08)",
                              }}
                            >
                              <span className="font-mono" style={{ fontSize: 9, opacity: 0.6 }}>{i + 1}</span>
                              {b}
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono uppercase text-ink-subtle mb-1.5" style={{ fontSize: 10, letterSpacing: "0.12em" }}>
                      Sources citées
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {r.sourcesCited.length === 0 ? (
                        <span className="text-ink-subtle" style={{ fontSize: 11 }}>—</span>
                      ) : (
                        r.sourcesCited.slice(0, 8).map((s, i) => (
                          <a
                            key={`${s.url ?? s.domain}-${i}`}
                            href={s.url ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-ink-muted hover:text-brand-500 border border-DEFAULT bg-surface no-underline whitespace-nowrap transition-colors duration-fast"
                            style={{ fontSize: 11 }}
                          >
                            <span className="rounded-sm" style={{ width: 10, height: 10, background: "#8C94A6" }} />
                            {s.domain || safeDomain(s.url) || "—"}
                          </a>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SegBtn({
  active,
  onClick,
  accent,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="transition-colors duration-fast"
      style={{
        padding: "3px 8px",
        fontSize: 11,
        fontWeight: 500,
        borderRadius: 6,
        border: "1px solid",
        background: active ? (accent ? "#2563EB" : "#0A0E1A") : "#FFFFFF",
        color: active ? "#FFFFFF" : "#0A0E1A",
        borderColor: active ? (accent ? "#2563EB" : "#0A0E1A") : "rgba(10,14,26,0.14)",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

// Highlights **bold** + <mark> brand mentions (case-insensitive whole word)
function Highlight({ text, brandName, maxLen = 600 }: { text: string; brandName: string; maxLen?: number }) {
  const truncated = text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
  const escapedBrand = brandName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const brandRe = new RegExp(`\\b${escapedBrand}\\b`, "gi");

  // Split by **bold** markers first
  const parts = truncated.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const isBold = part.startsWith("**") && part.endsWith("**");
        const clean = isBold ? part.slice(2, -2) : part;
        // Now split each piece by brandRe
        const subs = clean.split(brandRe);
        const matches = clean.match(brandRe) ?? [];
        return (
          <span key={i} style={{ fontWeight: isBold ? 600 : 400 }}>
            {subs.flatMap((s, j) => {
              const out: React.ReactNode[] = [<span key={`s-${j}`}>{s}</span>];
              if (j < matches.length) {
                out.push(
                  <mark
                    key={`m-${j}`}
                    style={{
                      background: "color-mix(in srgb, #2563EB 22%, transparent)",
                      color: "#0A0E1A",
                      padding: "0 2px",
                      borderRadius: 3,
                    }}
                  >
                    {matches[j]}
                  </mark>,
                );
              }
              return out;
            })}
          </span>
        );
      })}
    </>
  );
}

function humanLLMShort(llm: string): string {
  const k = llm.toLowerCase();
  if (k.includes("gpt-4o-mini")) return "GPT-4o mini";
  if (k.includes("gpt-4o")) return "GPT-4o";
  if (k.includes("haiku")) return "Claude H";
  if (k.includes("sonnet")) return "Claude S";
  if (k.includes("claude")) return "Claude";
  if (k.includes("gemini")) return "Gemini";
  if (k.includes("perplexity") || k.includes("sonar")) return "Perplexity";
  return llm.split("/").pop() ?? llm;
}

function safeDomain(url: string | undefined): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
