"use client";

import { useActionState, useTransition } from "react";
import type { LlmVisibilityRow } from "./page";
import { rescanLlmVisibility, type RescanState } from "./llmActions";

const LLM_LABELS: Record<string, { label: string; color: string }> = {
  "perplexity-sonar": { label: "Perplexity",  color: "#1F7AFF" },
  "gpt-4o":           { label: "GPT-4o",       color: "#10A37F" },
  "gemini-flash":     { label: "Gemini",        color: "#4285F4" },
  "claude-sonnet":    { label: "Claude",        color: "#D97757" },
};

const LLM_ORDER = ["perplexity-sonar", "gpt-4o", "gemini-flash", "claude-sonnet"];

interface Props {
  articleId: string;
  rows: LlmVisibilityRow[];
}

export function LlmVisibilityPanel({ articleId, rows }: Props) {
  const [state, formAction] = useActionState<RescanState | undefined, FormData>(
    rescanLlmVisibility,
    undefined
  );
  const [isPending, startTransition] = useTransition();

  // Dernière date de scan
  const lastChecked = rows.length > 0
    ? new Date(rows[0].checked_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : null;

  // Regrouper par LLM : appeared si au moins 1 query est true
  const byLlm: Record<string, { appeared: boolean; queries: string[] }> = {};
  for (const row of rows) {
    if (!byLlm[row.llm_name]) {
      byLlm[row.llm_name] = { appeared: false, queries: [] };
    }
    if (row.appeared) byLlm[row.llm_name].appeared = true;
    if (!byLlm[row.llm_name].queries.includes(row.query)) {
      byLlm[row.llm_name].queries.push(row.query);
    }
  }

  const appearedCount = Object.values(byLlm).filter((v) => v.appeared).length;
  const total = Object.keys(byLlm).length || LLM_ORDER.length;

  return (
    <div className="bg-white border border-DEFAULT rounded-xl shadow-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="font-mono uppercase text-ink-subtle" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
          Visibilité LLM
        </div>
        {rows.length > 0 && (
          <span className="font-mono text-ink-subtle" style={{ fontSize: 9 }}>
            {appearedCount}/{total} LLMs
          </span>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="text-ink-muted" style={{ fontSize: 11, lineHeight: 1.5 }}>
          Scan en cours… Relancez si aucun résultat après 1 min.
        </p>
      ) : (
        <>
          <div className="space-y-2">
            {LLM_ORDER.map((key) => {
              const meta = LLM_LABELS[key] ?? { label: key, color: "#6B7280" };
              const data = byLlm[key];
              if (!data) {
                return (
                  <LlmRow key={key} label={meta.label} color={meta.color} status="pending" queries={[]} />
                );
              }
              return (
                <LlmRow
                  key={key}
                  label={meta.label}
                  color={meta.color}
                  status={data.appeared ? "found" : "not_found"}
                  queries={data.queries}
                />
              );
            })}
          </div>

          {lastChecked && (
            <p className="text-ink-subtle font-mono" style={{ fontSize: 9 }}>
              Dernier scan : {lastChecked}
            </p>
          )}
        </>
      )}

      {/* Feedback rescan */}
      {state?.ok && (
        <p className="text-success" style={{ fontSize: 11 }}>
          Scan terminé — {state.appeared_count}/{state.results_count ? Math.round(state.results_count / (state.results_count / 4)) : 4} LLMs te citent.
        </p>
      )}
      {state && !state.ok && (
        <p className="text-danger" style={{ fontSize: 11 }}>
          {state.error === "not_published" ? "Article non publié." : "Erreur lors du scan."}
        </p>
      )}

      {/* Bouton rescan */}
      <form
        action={formAction}
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(() => {
            formAction(new FormData(e.currentTarget));
          });
        }}
      >
        <input type="hidden" name="article_id" value={articleId} />
        <button
          type="submit"
          disabled={isPending}
          className="w-full text-center rounded-md border border-DEFAULT hover:border-strong hover:bg-surface transition-colors disabled:opacity-50"
          style={{ fontSize: 11, padding: "6px 12px", fontFamily: "monospace" }}
        >
          {isPending ? "Scan en cours…" : "↻ Relancer le scan"}
        </button>
      </form>
    </div>
  );
}

function LlmRow({
  label, color, status, queries,
}: {
  label: string;
  color: string;
  status: "found" | "not_found" | "pending";
  queries: string[];
}) {
  const icon = status === "found" ? "✓" : status === "not_found" ? "✗" : "⏳";
  const textColor = status === "found" ? "#059669" : status === "not_found" ? "#DC2626" : "#9CA3AF";
  const bg = status === "found" ? "#D1FAE5" : status === "not_found" ? "#FEE2E2" : "#F3F4F6";

  return (
    <div className="flex items-center gap-2.5">
      <span
        className="shrink-0 inline-block rounded"
        style={{ fontSize: 9, padding: "2px 6px", background: color, color: "#fff", fontWeight: 700, letterSpacing: "0.04em", fontFamily: "monospace" }}
      >
        {label}
      </span>
      <span
        className="flex-1 rounded font-mono text-right"
        style={{ fontSize: 10, padding: "2px 6px", background: bg, color: textColor, fontWeight: 600 }}
      >
        {icon} {status === "found" ? "cité" : status === "not_found" ? "absent" : "—"}
      </span>
    </div>
  );
}
