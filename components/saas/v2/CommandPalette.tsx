"use client";

// V2 — Command palette ⌘K. Basic version : filter brands + nav shortcuts.
// Triggered from Topbar search button or via ⌘K / Ctrl+K global shortcut.

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles, Bell, BarChart3, Plus, Layers } from "lucide-react";

export interface PaletteBrand {
  id: string;
  name: string;
  domain: string;
}

interface PaletteAction {
  id: string;
  label: string;
  hint?: string;
  icon: "brand" | "nav" | "action";
  href: string;
  group: "brands" | "nav" | "actions";
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  brands: PaletteBrand[];
}

export function CommandPalette({ open, onClose, brands }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = useMemo<PaletteAction[]>(() => {
    const brandActions: PaletteAction[] = brands.map((b) => ({
      id: `brand-${b.id}`,
      label: b.name,
      hint: b.domain,
      icon: "brand",
      href: `/app/brands/${b.id}`,
      group: "brands",
    }));
    const navActions: PaletteAction[] = [
      { id: "nav-dashboard", label: "Dashboard", icon: "nav", href: "/app/dashboard", group: "nav" },
      { id: "nav-alerts", label: "Alertes", icon: "nav", href: "/app/alerts", group: "nav" },
      { id: "nav-brands", label: "Marques", icon: "nav", href: "/app/brands", group: "nav" },
      { id: "nav-billing", label: "Abonnement", icon: "nav", href: "/app/billing", group: "nav" },
      { id: "nav-settings", label: "Réglages", icon: "nav", href: "/app/settings", group: "nav" },
    ];
    const cmdActions: PaletteAction[] = [
      { id: "add-brand", label: "Ajouter une marque", hint: "Wizard 3 étapes", icon: "action", href: "/app/brands/new", group: "actions" },
    ];
    return [...brandActions, ...navActions, ...cmdActions];
  }, [brands]);

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase().trim();
    return actions.filter((a) => a.label.toLowerCase().includes(q) || a.hint?.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => setActiveIdx(0), [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const target = filtered[activeIdx];
        if (target) {
          onClose();
          router.push(target.href);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIdx, onClose, router]);

  if (!open) return null;

  const groups: Array<{ label: string; items: PaletteAction[] }> = [];
  const byGroup: Record<string, PaletteAction[]> = {};
  for (const a of filtered) (byGroup[a.group] ||= []).push(a);
  if (byGroup.brands?.length) groups.push({ label: "Marques", items: byGroup.brands });
  if (byGroup.nav?.length) groups.push({ label: "Navigation", items: byGroup.nav });
  if (byGroup.actions?.length) groups.push({ label: "Actions", items: byGroup.actions });

  let globalIdx = 0;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-center"
      style={{
        background: "rgba(10,14,26,0.45)",
        backdropFilter: "blur(2px)",
        paddingTop: "8vh",
        animation: "gp-fade .15s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-DEFAULT shadow-modal overflow-hidden"
        style={{
          width: 560,
          maxWidth: "90vw",
          maxHeight: "70vh",
          borderRadius: 12,
          animation: "gp-pop .18s cubic-bezier(.2,.7,.3,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Input */}
        <div
          className="flex items-center gap-2"
          style={{ padding: "12px 16px", borderBottom: "1px solid rgba(10,14,26,0.08)" }}
        >
          <Search size={14} strokeWidth={1.8} color="#8C94A6" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une marque, page ou commande…"
            className="flex-1 bg-transparent outline-none text-ink placeholder:text-ink-subtle"
            style={{ fontSize: 14 }}
          />
          <span
            className="font-mono text-ink-subtle bg-surface border border-DEFAULT rounded"
            style={{ fontSize: 10, padding: "1px 5px" }}
          >
            Esc
          </span>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="text-ink-subtle text-center" style={{ padding: "32px 16px", fontSize: 13 }}>
              Aucun résultat pour « {query} »
            </div>
          ) : (
            groups.map((g) => (
              <div key={g.label}>
                <div
                  className="font-mono uppercase text-ink-subtle"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    padding: "10px 16px 4px",
                  }}
                >
                  {g.label}
                </div>
                {g.items.map((a) => {
                  const idx = globalIdx++;
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        onClose();
                        router.push(a.href);
                      }}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className="w-full flex items-center gap-3 text-left transition-colors duration-fast"
                      style={{
                        padding: "8px 16px",
                        background: isActive ? "#F7F8FA" : "transparent",
                        borderLeft: isActive ? "2px solid #2563EB" : "2px solid transparent",
                      }}
                    >
                      <CmdIcon kind={a.icon} />
                      <div className="flex-1 min-w-0">
                        <div className="text-ink truncate" style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</div>
                        {a.hint && <div className="text-ink-subtle truncate font-mono" style={{ fontSize: 11 }}>{a.hint}</div>}
                      </div>
                      {isActive && <ArrowRight size={12} strokeWidth={1.8} color="#8C94A6" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div
          className="flex items-center gap-3 text-ink-subtle"
          style={{ padding: "8px 16px", borderTop: "1px solid rgba(10,14,26,0.08)", fontSize: 11 }}
        >
          <span className="flex items-center gap-1">
            <span className="font-mono bg-surface border border-DEFAULT rounded" style={{ padding: "0 4px" }}>↑↓</span>
            naviguer
          </span>
          <span className="flex items-center gap-1">
            <span className="font-mono bg-surface border border-DEFAULT rounded" style={{ padding: "0 4px" }}>Enter</span>
            ouvrir
          </span>
          <span className="flex items-center gap-1 ml-auto font-mono">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gp-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes gp-pop { from { opacity: 0; transform: scale(.96) translateY(8px); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

function CmdIcon({ kind }: { kind: "brand" | "nav" | "action" }) {
  if (kind === "brand")
    return (
      <span className="grid place-items-center rounded-md bg-surface text-ink-muted shrink-0" style={{ width: 24, height: 24 }}>
        <BarChart3 size={12} strokeWidth={1.8} />
      </span>
    );
  if (kind === "action")
    return (
      <span className="grid place-items-center rounded-md text-white shrink-0" style={{ width: 24, height: 24, background: "#2563EB" }}>
        <Plus size={12} strokeWidth={2} />
      </span>
    );
  // nav
  return (
    <span className="grid place-items-center rounded-md bg-surface text-ink-muted shrink-0" style={{ width: 24, height: 24 }}>
      <Layers size={12} strokeWidth={1.8} />
    </span>
  );
}

// Suppress unused warnings on default exports
void Sparkles;
void Bell;
