"use client";

import { useState, useTransition } from "react";

type Row = {
  id: string;
  email: string;
  full_name: string | null;
  title: string | null;
  email_verified: boolean | null;
  lead_score: number | null;
  status: string;
  company_nom: string | null;
  company_domain: string | null;
  company_country: string | null;
  category_slug: string | null;
  parent_category_slug: string | null;
  created_at: string;
};

const STATUS_BADGE: Record<string, string> = {
  new: "bg-brand-50 text-brand-600",
  engaged: "bg-emerald-50 text-success",
  qualified: "bg-emerald-100 text-success",
  replied: "bg-emerald-100 text-success",
  disqualified: "bg-amber/30 text-ink",
  opted_out: "bg-red-50 text-danger",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

export function ProspectsTable({ rows }: { rows: Row[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === rows.length && rows.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rows.map(r => r.id)));
    }
  };

  async function runBulk(action: "disqualify" | "opt_out" | "enroll_seq_a" | "export_csv") {
    if (selected.size === 0) {
      setFeedback("Aucun prospect sélectionné.");
      return;
    }
    if (action === "disqualify" || action === "opt_out") {
      const confirmMsg = action === "disqualify"
        ? `Disqualifier ${selected.size} prospect(s) ? Action irréversible (sauf SQL manuel).`
        : `Opt-out de ${selected.size} prospect(s) ? Ils ne recevront plus aucun email.`;
      if (!confirm(confirmMsg)) return;
    }

    startTransition(async () => {
      try {
        const ids = Array.from(selected);
        const resp = await fetch("/api/admin/prospects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, ids }),
        });

        if (action === "export_csv") {
          if (!resp.ok) {
            setFeedback(`Export échoué : HTTP ${resp.status}`);
            return;
          }
          const blob = await resp.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `prospects-${Date.now()}.csv`;
          a.click();
          URL.revokeObjectURL(url);
          setFeedback(`CSV exporté (${ids.length} lignes).`);
          return;
        }

        const json = await resp.json();
        if (!resp.ok || json.error) {
          setFeedback(`Erreur : ${json.error || `HTTP ${resp.status}`}`);
          return;
        }
        setFeedback(
          action === "enroll_seq_a"
            ? `Sequence A : ${json.requested} prospects envoyés au webhook (ok=${json.webhook_ok}).`
            : `${json.updated || 0} prospect(s) mis à jour. Recharge la page pour voir le résultat.`
        );
        setSelected(new Set());
      } catch (e) {
        setFeedback(`Erreur réseau : ${String(e)}`);
      }
    });
  }

  const allChecked = selected.size === rows.length && rows.length > 0;
  const partialChecked = selected.size > 0 && selected.size < rows.length;

  return (
    <div className="space-y-3">
      {/* Bulk action toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-white border border-DEFAULT rounded-md px-4 py-2.5">
        <div className="text-sm text-ink-muted">
          {selected.size > 0 ? (
            <span className="font-medium text-ink">{selected.size} sélectionné{selected.size > 1 ? "s" : ""}</span>
          ) : (
            <span>Sélectionne des prospects pour activer les actions bulk.</span>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            disabled={busy || selected.size === 0}
            onClick={() => runBulk("export_csv")}
            className="px-3 py-1.5 text-xs font-mono rounded-md bg-white border border-DEFAULT hover:bg-surface disabled:opacity-40 transition-colors"
          >
            Export CSV
          </button>
          <button
            type="button"
            disabled={busy || selected.size === 0}
            onClick={() => runBulk("enroll_seq_a")}
            className="px-3 py-1.5 text-xs font-mono rounded-md bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40 transition-colors"
          >
            Enroll Seq A
          </button>
          <button
            type="button"
            disabled={busy || selected.size === 0}
            onClick={() => runBulk("disqualify")}
            className="px-3 py-1.5 text-xs font-mono rounded-md bg-amber/30 hover:bg-amber/50 disabled:opacity-40 transition-colors"
          >
            Disqualify
          </button>
          <button
            type="button"
            disabled={busy || selected.size === 0}
            onClick={() => runBulk("opt_out")}
            className="px-3 py-1.5 text-xs font-mono rounded-md bg-red-50 text-danger hover:bg-red-100 disabled:opacity-40 transition-colors"
          >
            Opt-out
          </button>
        </div>
      </div>

      {feedback && (
        <div className="text-sm bg-surface border-l-2 border-brand-500 px-4 py-2 rounded">
          {feedback}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-DEFAULT rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-surface text-ink-muted">
            <tr>
              <th className="w-10 px-3 py-2.5 text-left">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={el => { if (el) el.indeterminate = partialChecked; }}
                  onChange={toggleAll}
                  className="accent-brand-500"
                />
              </th>
              <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Email</th>
              <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Nom</th>
              <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Titre</th>
              <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Société</th>
              <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Cat / Sous-cat</th>
              <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Score</th>
              <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Statut</th>
              <th className="px-3 py-2.5 text-left font-mono text-xs uppercase tracking-eyebrow">Créé</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-DEFAULT">
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-ink-muted">Aucun prospect ne matche ces filtres.</td>
              </tr>
            )}
            {rows.map(r => (
              <tr key={r.id} className={selected.has(r.id) ? "bg-brand-50/30" : "hover:bg-surface"}>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => toggle(r.id)}
                    className="accent-brand-500"
                  />
                </td>
                <td className="px-3 py-2 font-mono text-xs">
                  <a href={`/admin/prospects/${r.id}`} className="text-brand-600 hover:underline">{r.email}</a>
                  {r.email_verified ? <span className="ml-1.5 text-success" title="Email vérifié">✓</span> : null}
                </td>
                <td className="px-3 py-2">{r.full_name ?? "—"}</td>
                <td className="px-3 py-2 text-ink-muted">{r.title ?? "—"}</td>
                <td className="px-3 py-2">
                  <div>{r.company_nom ?? "—"}</div>
                  {r.company_domain && <div className="font-mono text-xs text-ink-muted">{r.company_domain}</div>}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-ink-muted">
                  {r.parent_category_slug && <div>{r.parent_category_slug}</div>}
                  {r.category_slug && <div>{r.category_slug}</div>}
                </td>
                <td className="px-3 py-2 font-mono">{r.lead_score ?? "—"}</td>
                <td className="px-3 py-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono ${STATUS_BADGE[r.status] || "bg-surface text-ink-muted"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2 font-mono text-xs text-ink-muted">{fmtDate(r.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
