"use client";

// V2 — 3-step add brand wizard. Triggered from Topbar.
// Steps : Identity (name+domain+sector) → Competitors (3-5) → Cadence + recap.
// Submits to existing createBrand server action.

import { useEffect, useRef, useState, useTransition } from "react";
import { Plus, X, ChevronRight, Info, Check } from "lucide-react";
import { createBrand } from "@/app/app/brands/new/actions";

interface AddBrandWizardProps {
  open: boolean;
  onClose: () => void;
  defaultCadence?: "weekly" | "monthly";
  canPickWeekly?: boolean;
}

const SECTOR_SUGGESTIONS = [
  "Asset Management",
  "Assurance",
  "Banque retail",
  "Fintech B2B",
  "Énergie",
  "SaaS B2B",
  "E-commerce",
];

export function AddBrandWizard({ open, onClose, defaultCadence = "weekly", canPickWeekly = true }: AddBrandWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [sector, setSector] = useState("");
  const [comps, setComps] = useState<string[]>(["", "", ""]);
  const [cadence, setCadence] = useState<"weekly" | "monthly">(defaultCadence);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (open) {
      setStep(1);
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const canNext1 = name.trim().length > 0 && domain.trim().length > 2 && domain.includes(".") && sector.trim().length > 0;
  const validComps = comps.filter((c) => c.trim().length > 2 && c.includes("."));
  const canNext2 = validComps.length >= 0; // Competitors optional

  function next() {
    if (step < 3) setStep((s) => (s + 1) as 1 | 2 | 3);
  }
  function prev() {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3);
  }

  function handleSubmit() {
    if (!formRef.current) return;
    setError(null);
    const fd = new FormData(formRef.current);
    fd.set("competitors", validComps.join(","));
    startTransition(async () => {
      try {
        await createBrand(fd);
        // server action redirects on success; if we get here something went wrong
      } catch (e) {
        // Redirect throws NEXT_REDIRECT — let it propagate
        if (e && typeof e === "object" && "digest" in e && String((e as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")) {
          throw e;
        }
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      }
    });
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center"
      style={{
        background: "rgba(10,14,26,0.45)",
        backdropFilter: "blur(2px)",
        animation: "gp-fade .15s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-DEFAULT shadow-modal overflow-hidden"
        style={{
          width: 540,
          maxWidth: "90vw",
          borderRadius: 16,
          animation: "gp-pop .18s cubic-bezier(.2,.7,.3,1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ padding: "16px 20px", borderBottom: "1px solid rgba(10,14,26,0.08)" }}
        >
          <div className="text-ink" style={{ fontSize: 14, fontWeight: 600 }}>
            Suivre une nouvelle marque
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid place-items-center rounded-md text-ink-muted hover:text-ink hover:bg-surface transition-colors duration-fast"
            style={{ width: 28, height: 28 }}
            aria-label="Fermer"
          >
            <X size={14} strokeWidth={1.8} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1" style={{ padding: "16px 20px 0", marginBottom: 18 }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 999,
                background: step >= s ? "#2563EB" : "#EEF1F5",
                transition: "background .2s",
              }}
            />
          ))}
        </div>

        {/* Body */}
        <form ref={formRef} action={handleSubmit} className="flex flex-col" style={{ padding: "0 20px 20px" }}>
          {step === 1 && (
            <div className="flex flex-col gap-3.5">
              <StepHeader step={1} label="Identité de la marque" />
              <Field label="Nom de la marque" required>
                <input
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: AXA Investment Managers"
                  className="gp-v2-input"
                  required
                  autoFocus
                />
              </Field>
              <Field label="Domaine principal" required>
                <input
                  name="domain"
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="axa.fr"
                  className="gp-v2-input"
                  required
                />
              </Field>
              <Field label="Secteur" required>
                <input
                  name="category"
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Asset Management"
                  className="gp-v2-input"
                  required
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {SECTOR_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSector(s)}
                      className="px-2 py-0.5 rounded-md border border-strong bg-white text-ink hover:bg-surface transition-colors duration-fast"
                      style={{ fontSize: 11, fontWeight: 500 }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-3.5">
              <StepHeader step={2} label="Concurrents" />
              <p className="text-ink-muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
                3 à 5 concurrents directs. Ils seront monitorés sur les mêmes prompts pour calculer ta part de voix.
              </p>
              <div className="flex flex-col gap-1.5">
                {comps.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={c}
                      onChange={(e) => {
                        const next = [...comps];
                        next[i] = e.target.value;
                        setComps(next);
                      }}
                      placeholder={`concurrent${i + 1}.fr`}
                      className="gp-v2-input flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => setComps(comps.filter((_, j) => j !== i))}
                      className="grid place-items-center rounded-md text-ink-muted hover:text-danger hover:bg-surface transition-colors duration-fast"
                      style={{ width: 32, height: 32 }}
                      aria-label="Supprimer"
                    >
                      <X size={14} strokeWidth={1.8} />
                    </button>
                  </div>
                ))}
                {comps.length < 5 && (
                  <button
                    type="button"
                    onClick={() => setComps([...comps, ""])}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-strong bg-white text-ink hover:bg-surface transition-colors duration-fast self-start"
                    style={{ fontSize: 13, fontWeight: 500 }}
                  >
                    <Plus size={12} strokeWidth={1.8} />
                    Ajouter un concurrent
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-3.5">
              <StepHeader step={3} label="Cadence & confirmation" />

              <div>
                <label className="block text-ink-muted mb-2" style={{ fontSize: 12 }}>Cadence</label>
                <div className="flex items-stretch gap-2">
                  {(["weekly", "monthly"] as const).map((id) => {
                    const isWeekly = id === "weekly";
                    const disabled = isWeekly && !canPickWeekly;
                    return (
                      <button
                        key={id}
                        type="button"
                        disabled={disabled}
                        onClick={() => setCadence(id)}
                        className="flex-1 text-left transition-colors duration-fast"
                        style={{
                          padding: 12,
                          border: `1px solid ${cadence === id ? "#2563EB" : "rgba(10,14,26,0.14)"}`,
                          borderRadius: 8,
                          background: cadence === id ? "color-mix(in srgb, #2563EB 6%, transparent)" : "#FFFFFF",
                          opacity: disabled ? 0.5 : 1,
                          cursor: disabled ? "not-allowed" : "pointer",
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-ink" style={{ fontSize: 13, fontWeight: 600 }}>
                            {isWeekly ? "Hebdomadaire" : "Mensuelle"}
                          </span>
                          {isWeekly && canPickWeekly && (
                            <span
                              className="inline-flex items-center px-1.5 rounded-full border"
                              style={{
                                fontSize: 9,
                                padding: "1px 6px",
                                background: "color-mix(in srgb, #2563EB 10%, transparent)",
                                color: "#2563EB",
                                borderColor: "color-mix(in srgb, #2563EB 24%, transparent)",
                              }}
                            >
                              Recommandé
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-ink-muted mt-1" style={{ fontSize: 11 }}>
                          {isWeekly ? "4× / mois · ~5€" : "1× / mois · ~1€"}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {!canPickWeekly && (
                  <p className="text-ink-subtle mt-1.5" style={{ fontSize: 11 }}>
                    Cadence hebdomadaire réservée aux plans Starter et plus.
                  </p>
                )}
                <input type="hidden" name="cadence" value={cadence} />
              </div>

              <div className="rounded-lg" style={{ padding: 12, background: "#F7F8FA", fontSize: 12 }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Info size={12} strokeWidth={1.8} color="#5B6478" />
                  <strong className="text-ink" style={{ fontSize: 12 }}>Récapitulatif</strong>
                </div>
                <div className="text-ink-muted" style={{ lineHeight: 1.7 }}>
                  <strong className="text-ink">{name || "—"}</strong> ({domain || "—"}) · {sector || "—"}
                  <br />
                  Concurrents : {validComps.length > 0 ? validComps.join(", ") : "—"}
                  <br />
                  30 prompts × 4 LLMs · {cadence === "weekly" ? "4 snapshots / mois" : "1 snapshot / mois"}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div
              className="mt-3 px-3 py-2 rounded-md text-danger"
              style={{ background: "color-mix(in srgb, #DC2626 12%, transparent)", fontSize: 12 }}
            >
              {error}
            </div>
          )}

          {/* Footer */}
          <div
            className="flex items-center justify-between gap-2 mt-5 pt-4"
            style={{ borderTop: "1px solid rgba(10,14,26,0.08)" }}
          >
            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prev}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-strong bg-white text-ink hover:bg-surface transition-colors duration-fast"
                  style={{ fontSize: 13, fontWeight: 500 }}
                  disabled={isPending}
                >
                  Retour
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-md text-ink-muted hover:bg-surface transition-colors duration-fast"
                style={{ fontSize: 13, fontWeight: 500 }}
                disabled={isPending}
              >
                Annuler
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-500 text-white hover:bg-brand-600 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontSize: 13, fontWeight: 500 }}
                >
                  Continuer
                  <ChevronRight size={11} strokeWidth={2} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-500 text-white hover:bg-brand-600 transition-colors duration-fast disabled:opacity-50"
                  style={{ fontSize: 13, fontWeight: 500 }}
                >
                  <Check size={11} strokeWidth={2.2} />
                  {isPending ? "Création…" : "Créer le monitoring"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes gp-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes gp-pop {
          from { opacity: 0; transform: scale(.96) translateY(8px); }
          to { opacity: 1; transform: scale(1); }
        }
        .gp-v2-input {
          width: 100%;
          appearance: none;
          background: #F7F8FA;
          border: 1px solid rgba(10,14,26,0.08);
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 13px;
          font-family: inherit;
          color: #0A0E1A;
          outline: none;
          transition: all .12s;
        }
        .gp-v2-input::placeholder {
          color: #8C94A6;
        }
        .gp-v2-input:focus {
          border-color: #2563EB;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px color-mix(in srgb, #2563EB 15%, transparent);
        }
      `}</style>
    </div>
  );
}

function StepHeader({ step, label }: { step: number; label: string }) {
  return (
    <div
      className="font-mono uppercase text-ink-subtle"
      style={{ fontSize: 10, letterSpacing: "0.14em" }}
    >
      Étape {step}/3 · {label}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-ink-muted mb-1" style={{ fontSize: 12 }}>
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
