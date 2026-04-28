"use client";

import { useState } from "react";

type Category = { slug: string; nom: string; parent_nom: string | null; reports_count: number };
type Report = { id: string; sous_categorie: string; created_at: string; companies_count: number };

type Props = {
  adminToken: string;
  categories: Category[];
  reports: Report[];
};

type LogEntry = {
  ts: string;
  action: string;
  status: "pending" | "ok" | "ko";
  message: string;
  details?: any;
};

export function AdminActions({ adminToken, categories, reports }: Props) {
  const [extractCat, setExtractCat] = useState<string>(categories[0]?.slug || "");
  const [extractTopN, setExtractTopN] = useState(10);
  const [synthesisReport, setSynthesisReport] = useState<string>(reports[0]?.id || "");
  const [synthesisModel, setSynthesisModel] = useState("anthropic/claude-haiku-4.5");
  const [sourcingReport, setSourcingReport] = useState<string>(reports[0]?.id || "");
  const [sourcingMax, setSourcingMax] = useState(3);
  const [busy, setBusy] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  function pushLog(entry: LogEntry) {
    setLogs((prev) => [entry, ...prev].slice(0, 8));
  }

  async function call(action: string, params: any, label: string) {
    setBusy(action);
    const ts = new Date().toLocaleTimeString("fr-FR");
    pushLog({ ts, action: label, status: "pending", message: "Envoi en cours..." });
    try {
      const res = await fetch("/api/admin/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ action, params }),
      });
      const data = await res.json();
      const ok = res.ok && data.ok !== false;
      pushLog({
        ts,
        action: label,
        status: ok ? "ok" : "ko",
        message: ok ? "OK — workflow lancé" : `Erreur ${res.status} : ${data.error || JSON.stringify(data.response).substring(0, 200)}`,
        details: data,
      });
    } catch (e: any) {
      pushLog({ ts, action: label, status: "ko", message: e.message || String(e) });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="bg-white border border-navy/10 p-6 mb-6">
      <h2 className="font-serif text-2xl text-navy mb-1">Actions</h2>
      <p className="text-xs text-ink-muted mb-6">Trigger les workflows n8n directement depuis le browser. Aucun envoi mail (test mode).</p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* EXTRACT */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base text-navy">Phase 1 — Nouvelle étude</h3>
            <span className="font-mono text-[10px] text-ink-muted">~2 min</span>
          </div>
          <p className="text-xs text-ink-muted leading-snug">
            Lance extract+consolidate pour une sous-catégorie. La synthesis se déclenche auto à la fin.
          </p>
          <select
            value={extractCat}
            onChange={(e) => setExtractCat(e.target.value)}
            className="w-full text-sm bg-cream px-3 py-2 border border-navy/10"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.parent_nom ? `${c.parent_nom} → ` : ""}
                {c.nom}{c.reports_count > 0 ? ` (${c.reports_count} déjà)` : ""}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-ink-muted">Top N :</label>
            <input
              type="number"
              min={3}
              max={50}
              value={extractTopN}
              onChange={(e) => setExtractTopN(parseInt(e.target.value, 10) || 10)}
              className="w-20 text-sm bg-cream px-3 py-1 border border-navy/10"
            />
          </div>
          <button
            onClick={() => call("extract", { category_slug: extractCat, top_n: extractTopN, year: 2026 }, `Extract ${extractCat}`)}
            disabled={busy !== null || !extractCat}
            className="w-full bg-navy text-white py-2 text-sm font-medium hover:bg-navy-light disabled:opacity-50 transition"
          >
            {busy === "extract" ? "Lancement..." : "Lancer extraction"}
          </button>
        </div>

        {/* SYNTHESIS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base text-navy">Phase 1.1 — Re-render</h3>
            <span className="font-mono text-[10px] text-ink-muted">~45s</span>
          </div>
          <p className="text-xs text-ink-muted leading-snug">
            Re-génère HTML+PDF pour un report existant. Utile après modif template.
          </p>
          <select
            value={synthesisReport}
            onChange={(e) => setSynthesisReport(e.target.value)}
            className="w-full text-sm bg-cream px-3 py-2 border border-navy/10"
          >
            {reports.map((r) => (
              <option key={r.id} value={r.id}>
                {r.sous_categorie} ({r.companies_count} sociétés)
              </option>
            ))}
            {reports.length === 0 && <option disabled>Aucun report</option>}
          </select>
          <select
            value={synthesisModel}
            onChange={(e) => setSynthesisModel(e.target.value)}
            className="w-full text-sm bg-cream px-3 py-2 border border-navy/10 font-mono"
          >
            <option value="anthropic/claude-haiku-4.5">Haiku 4.5 (rapide, $0.02)</option>
            <option value="anthropic/claude-sonnet-4.6">Sonnet 4.6 (qualité+)</option>
            <option value="anthropic/claude-opus-4.7">Opus 4.7 (premium, $0.30)</option>
          </select>
          <button
            onClick={() => call("synthesis", { report_id: synthesisReport, top_n: 14, model: synthesisModel }, `Re-synthesis ${synthesisReport.substring(0, 8)}`)}
            disabled={busy !== null || !synthesisReport}
            className="w-full bg-navy text-white py-2 text-sm font-medium hover:bg-navy-light disabled:opacity-50 transition"
          >
            {busy === "synthesis" ? "Lancement..." : "Re-générer HTML+PDF"}
          </button>
        </div>

        {/* SOURCING */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base text-navy">Phase 2 — Sourcing Apollo</h3>
            <span className="font-mono text-[10px] text-ink-muted">~30-60s</span>
          </div>
          <p className="text-xs text-ink-muted leading-snug">
            Trouve les décideurs marketing pour les sociétés du LB. Crée les prospects en DB.
          </p>
          <select
            value={sourcingReport}
            onChange={(e) => setSourcingReport(e.target.value)}
            className="w-full text-sm bg-cream px-3 py-2 border border-navy/10"
          >
            {reports.map((r) => (
              <option key={r.id} value={r.id}>
                {r.sous_categorie} ({r.companies_count} sociétés)
              </option>
            ))}
            {reports.length === 0 && <option disabled>Aucun report</option>}
          </select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-ink-muted">Max / société :</label>
            <input
              type="number"
              min={1}
              max={10}
              value={sourcingMax}
              onChange={(e) => setSourcingMax(parseInt(e.target.value, 10) || 3)}
              className="w-20 text-sm bg-cream px-3 py-1 border border-navy/10"
            />
          </div>
          <button
            onClick={() => call("sourcing", { report_id: sourcingReport, max_per_company: sourcingMax, min_lead_score: 50 }, `Sourcing ${sourcingReport.substring(0, 8)}`)}
            disabled={busy !== null || !sourcingReport}
            className="w-full bg-amber text-navy py-2 text-sm font-medium hover:bg-amber/90 disabled:opacity-50 transition"
          >
            {busy === "sourcing" ? "Lancement..." : "Lancer sourcing prospects"}
          </button>
        </div>
      </div>

      {/* Log */}
      {logs.length > 0 && (
        <div className="mt-6 pt-4 border-t border-navy/10">
          <h3 className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">Activité (8 derniers)</h3>
          <div className="space-y-1.5">
            {logs.map((l, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 text-xs p-2 ${l.status === "ok" ? "bg-green-50 text-green-900" : l.status === "ko" ? "bg-red-50 text-red-900" : "bg-cream text-ink"}`}
              >
                <span className="font-mono text-[10px] text-ink-muted">{l.ts}</span>
                <span className="font-medium min-w-[140px]">{l.action}</span>
                <span className="flex-1">{l.message}</span>
                <span
                  className={`font-mono text-[10px] px-2 ${l.status === "ok" ? "bg-green-700 text-white" : l.status === "ko" ? "bg-red-700 text-white" : "bg-navy text-white"}`}
                >
                  {l.status === "pending" ? "..." : l.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
