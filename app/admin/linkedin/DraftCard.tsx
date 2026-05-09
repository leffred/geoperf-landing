"use client";

// S31 Session 2 — Carte draft LinkedIn dans /admin/linkedin.
// Toggle preview / edit / schedule, formulaires server-action.

import { useState } from "react";
import { updateDraft, scheduleDraft, discardDraft, markPosted, regenerateDraft } from "./actions";

export interface DraftRow {
  id: string;
  template_type: string;
  draft_text: string;
  hashtags: string[] | null;
  tagged_personas: string[] | null;
  status: string;
  scheduled_at: string | null;
  posted_at: string | null;
  posted_url: string | null;
  source_lb_id: string | null;
  source_slug: string | null;
  generation_cost_usd: number | null;
  created_at: string;
}

const TEMPLATE_BADGE: Record<string, string> = {
  top5_visible: "bg-emerald-50 text-success",
  top5_invisible: "bg-red-50 text-danger",
  methodologie: "bg-brand-50 text-brand-600",
  cmo_takeaway: "bg-amber/20 text-amber-900",
  data_viz: "bg-purple-50 text-purple-700",
  quote: "bg-blue-50 text-blue-700",
  vs_seo: "bg-orange-50 text-orange-700",
  cta_download: "bg-pink-50 text-pink-700",
  opinion: "bg-violet-50 text-violet-700",
  reactive: "bg-yellow-50 text-yellow-800",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function suggestScheduleDefault(): string {
  // tomorrow 09:00 CET local
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  // datetime-local needs yyyy-MM-ddTHH:mm
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function DraftCard({ draft, tab }: { draft: DraftRow; tab: string }) {
  const [mode, setMode] = useState<"view" | "edit" | "schedule" | "post">("view");
  const charCount = draft.draft_text.length;

  const badgeClass = TEMPLATE_BADGE[draft.template_type] ?? "bg-surface text-ink-muted";

  return (
    <div className="bg-white border border-DEFAULT rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono ${badgeClass}`}>
            {draft.template_type}
          </span>
          <span className="font-mono text-xs text-ink-muted">
            {charCount} chars
          </span>
          {draft.source_slug && (
            <a
              href={`/leaderboard/${draft.source_slug}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-brand-600 hover:underline"
            >
              ↗ {draft.source_slug}
            </a>
          )}
          <span className="font-mono text-xs text-ink-muted">{fmtDate(draft.created_at)}</span>
          {draft.status === "scheduled" && draft.scheduled_at && (
            <span className="inline-block px-2 py-0.5 rounded text-xs font-mono bg-brand-50 text-brand-600">
              📅 {fmtDate(draft.scheduled_at)}
            </span>
          )}
          {draft.status === "posted" && (
            <span className="inline-block px-2 py-0.5 rounded text-xs font-mono bg-emerald-50 text-success">
              ✓ {fmtDate(draft.posted_at)}
            </span>
          )}
        </div>
      </div>

      {mode === "view" && (
        <>
          <pre className="text-sm text-ink whitespace-pre-wrap font-sans bg-surface p-3 rounded mb-3 max-h-64 overflow-y-auto">
            {draft.draft_text}
          </pre>
          {draft.hashtags && draft.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {draft.hashtags.map((h, i) => (
                <span key={i} className="font-mono text-xs px-1.5 py-0.5 bg-surface rounded text-brand-600">
                  #{h}
                </span>
              ))}
            </div>
          )}
          {draft.tagged_personas && draft.tagged_personas.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {draft.tagged_personas.map((p, i) => (
                <span key={i} className="font-mono text-xs px-1.5 py-0.5 bg-amber/20 rounded text-amber-900">
                  {p}
                </span>
              ))}
            </div>
          )}
          {draft.posted_url && (
            <div className="mb-2">
              <a href={draft.posted_url} target="_blank" rel="noreferrer" className="font-mono text-xs text-brand-600 hover:underline">
                ↗ {draft.posted_url}
              </a>
            </div>
          )}
        </>
      )}

      {mode === "edit" && (
        <form action={updateDraft} className="space-y-3">
          <input type="hidden" name="draft_id" value={draft.id} />
          <input type="hidden" name="tab" value={tab} />
          <div>
            <label className="block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1">Texte</label>
            <textarea
              name="draft_text"
              defaultValue={draft.draft_text}
              rows={8}
              required
              minLength={50}
              className="w-full text-sm bg-white px-3 py-2 rounded-md border border-DEFAULT focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none font-sans"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1">Hashtags (séparés par espace ou virgule)</label>
              <input
                type="text"
                name="hashtags"
                defaultValue={(draft.hashtags ?? []).join(" ")}
                placeholder="GenerativeAI GEO Marketing LLM"
                className="w-full text-sm bg-white px-3 py-1.5 rounded-md border border-DEFAULT focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1">Personas tagués (1 par ligne)</label>
              <input
                type="text"
                name="tagged_personas"
                defaultValue={(draft.tagged_personas ?? []).join(", ")}
                placeholder="@Prenom Nom Fonction Entreprise"
                className="w-full text-sm bg-white px-3 py-1.5 rounded-md border border-DEFAULT focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none font-mono"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setMode("view")} className="px-3 py-1.5 text-xs font-mono rounded-md bg-surface hover:bg-surface-2 text-ink">
              Annuler
            </button>
            <button type="submit" className="px-4 py-1.5 text-xs font-medium rounded-md bg-ink text-white hover:bg-ink/90">
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {mode === "schedule" && (
        <form action={scheduleDraft} className="space-y-3 bg-surface p-3 rounded">
          <input type="hidden" name="draft_id" value={draft.id} />
          <input type="hidden" name="tab" value={tab} />
          <div>
            <label className="block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1">Date & heure de publication</label>
            <input
              type="datetime-local"
              name="scheduled_at"
              required
              defaultValue={suggestScheduleDefault()}
              className="w-full text-sm bg-white px-3 py-1.5 rounded-md border border-DEFAULT focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none font-mono"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setMode("view")} className="px-3 py-1.5 text-xs font-mono rounded-md bg-white border border-DEFAULT hover:bg-surface-2 text-ink">
              Annuler
            </button>
            <button type="submit" className="px-4 py-1.5 text-xs font-medium rounded-md bg-brand-500 text-white hover:bg-brand-600">
              Schedule
            </button>
          </div>
        </form>
      )}

      {mode === "post" && (
        <form action={markPosted} className="space-y-3 bg-surface p-3 rounded">
          <input type="hidden" name="draft_id" value={draft.id} />
          <input type="hidden" name="tab" value={tab} />
          <div>
            <label className="block text-xs font-mono uppercase tracking-eyebrow text-ink-subtle mb-1">URL du post LinkedIn (optionnel)</label>
            <input
              type="url"
              name="posted_url"
              placeholder="https://www.linkedin.com/posts/..."
              className="w-full text-sm bg-white px-3 py-1.5 rounded-md border border-DEFAULT focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none font-mono"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setMode("view")} className="px-3 py-1.5 text-xs font-mono rounded-md bg-white border border-DEFAULT hover:bg-surface-2 text-ink">
              Annuler
            </button>
            <button type="submit" className="px-4 py-1.5 text-xs font-medium rounded-md bg-success text-white hover:bg-success/90">
              Mark posted
            </button>
          </div>
        </form>
      )}

      {mode === "view" && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-DEFAULT/60">
          {draft.status === "pending_review" && (
            <>
              <button onClick={() => setMode("edit")} className="px-3 py-1.5 text-xs font-mono rounded-md bg-surface hover:bg-surface-2 text-ink">
                Edit
              </button>
              <button onClick={() => setMode("schedule")} className="px-3 py-1.5 text-xs font-mono rounded-md bg-brand-500 text-white hover:bg-brand-600">
                Schedule
              </button>
              <button onClick={() => setMode("post")} className="px-3 py-1.5 text-xs font-mono rounded-md bg-success text-white hover:bg-success/90">
                Mark posted
              </button>
              <form action={regenerateDraft} className="inline">
                <input type="hidden" name="draft_id" value={draft.id} />
                <button type="submit" className="px-3 py-1.5 text-xs font-mono rounded-md bg-amber/20 text-amber-900 hover:bg-amber/30">
                  Regenerate batch
                </button>
              </form>
              <form action={discardDraft} className="inline">
                <input type="hidden" name="draft_id" value={draft.id} />
                <input type="hidden" name="tab" value={tab} />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-mono rounded-md bg-red-50 text-danger hover:bg-red-100"
                >
                  Discard
                </button>
              </form>
            </>
          )}
          {draft.status === "scheduled" && (
            <>
              <button onClick={() => setMode("edit")} className="px-3 py-1.5 text-xs font-mono rounded-md bg-surface hover:bg-surface-2 text-ink">
                Edit
              </button>
              <button onClick={() => setMode("schedule")} className="px-3 py-1.5 text-xs font-mono rounded-md bg-brand-50 text-brand-600 hover:bg-brand-100">
                Reschedule
              </button>
              <button onClick={() => setMode("post")} className="px-3 py-1.5 text-xs font-mono rounded-md bg-success text-white hover:bg-success/90">
                Mark posted
              </button>
              <form action={discardDraft} className="inline">
                <input type="hidden" name="draft_id" value={draft.id} />
                <input type="hidden" name="tab" value={tab} />
                <button type="submit" className="px-3 py-1.5 text-xs font-mono rounded-md bg-red-50 text-danger hover:bg-red-100">
                  Cancel & discard
                </button>
              </form>
            </>
          )}
          {draft.status === "posted" && (
            <span className="font-mono text-xs text-ink-muted">Posté — pas d&apos;action.</span>
          )}
        </div>
      )}
    </div>
  );
}
