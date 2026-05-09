"use client";

// S31 Session 1 — Client form pour Quick LLM Check.
// Gère : input domain + dropdown category, cooldown 30s sessionStorage, appel server action,
// affichage résultats 4 cards LLM, email capture post-result.

import { useState, useTransition, useEffect } from "react";
import {
  quickCheck,
  captureEmail,
  type QuickCheckResult,
  type CaptureEmailResult,
} from "./actions";

export type CategoryOption = { slug: string; label: string };

export type QuickCheckI18n = {
  domainLabel: string;
  domainPlaceholder: string;
  categoryLabel: string;
  categoryPlaceholder: string;
  submit: string;
  submitting: string;
  cooldownLabel: string; // ex: "Patientez {n}s avant un nouveau check"
  errorInvalidDomain: string;
  errorRateLimit: string;
  errorGeneric: string;
  resultEyebrow: string;
  resultTitle: string;
  citedBy: string;
  notCited: string;
  costLabel: string;
  latencyLabel: string;
  emailCtaTitle: string;
  emailCtaBody: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailSubmit: string;
  emailSubmitting: string;
  emailSuccess: string;
  optInLabel: string;
  optInLink: string;
  errorOptIn: string;
};

type Props = {
  categories: CategoryOption[];
  i18n: QuickCheckI18n;
};

const COOLDOWN_KEY = "geoperf_qc_cooldown_until";
const COOLDOWN_MS = 30_000;

export function QuickCheckForm({ categories, i18n }: Props) {
  const [pending, startTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [result, setResult] = useState<QuickCheckResult | null>(null);
  const [emailResult, setEmailResult] = useState<CaptureEmailResult | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  // Cooldown timer (sessionStorage persistance entre re-renders du tab).
  useEffect(() => {
    const tick = () => {
      const until = Number(sessionStorage.getItem(COOLDOWN_KEY) || "0");
      const left = Math.max(0, Math.ceil((until - Date.now()) / 1000));
      setCooldownLeft(left);
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, []);

  function startCooldown() {
    sessionStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (cooldownLeft > 0 || pending) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    setResult(null);
    setEmailResult(null);
    startCooldown();
    startTransition(async () => {
      const r = await quickCheck(formData);
      setResult(r);
    });
  }

  async function onEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (emailPending || !result?.ok) return;
    const formData = new FormData(e.currentTarget);
    if (result?.domain) formData.set("domain", result.domain);
    if (result?.category) formData.set("category", result.category);
    startEmailTransition(async () => {
      const r = await captureEmail(formData);
      setEmailResult(r);
    });
  }

  return (
    <div className="space-y-8">
      {/* Form principal */}
      <form onSubmit={onSubmit} className="bg-surface border border-DEFAULT rounded-lg p-6 md:p-8 shadow-card space-y-4">
        <div>
          <label htmlFor="qc-domain" className="block text-sm font-medium text-ink mb-1.5">
            {i18n.domainLabel}
          </label>
          <input
            id="qc-domain"
            name="domain"
            type="text"
            required
            placeholder={i18n.domainPlaceholder}
            className="w-full rounded-md border border-DEFAULT bg-white px-3 py-2.5 text-sm font-mono text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label htmlFor="qc-category" className="block text-sm font-medium text-ink mb-1.5">
            {i18n.categoryLabel}
          </label>
          <select
            id="qc-category"
            name="category"
            required
            defaultValue=""
            className="w-full rounded-md border border-DEFAULT bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="" disabled>
              {i18n.categoryPlaceholder}
            </option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={pending || cooldownLeft > 0}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-amber px-4 py-2.5 text-sm font-medium text-navy hover:bg-amber/90 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {pending
            ? i18n.submitting
            : cooldownLeft > 0
              ? i18n.cooldownLabel.replace("{n}", String(cooldownLeft))
              : i18n.submit}
        </button>
        <p className="text-[11px] text-ink-subtle">
          5 checks gratuits / 24h. Pas d&apos;inscription nécessaire pour le check de base.
        </p>
      </form>

      {/* Résultat */}
      {result && !result.ok && (
        <div className="border-l-2 border-l-danger bg-red-50/50 px-4 py-3 rounded-md text-sm text-danger">
          {result.message ?? i18n.errorGeneric}
        </div>
      )}

      {result?.ok && result.results && (
        <div className="space-y-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-1">
              {i18n.resultEyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-medium text-ink tracking-tight">
              {i18n.resultTitle.replace("{domain}", result.domain ?? "").replace("{n}", String(result.mentioned_count ?? 0)).replace("{total}", String(result.total_llms ?? 4))}
            </h2>
            <p className="text-xs font-mono text-ink-subtle mt-1">
              {i18n.costLabel.replace("{cost}", (result.total_cost_usd ?? 0).toFixed(4))} ·{" "}
              {i18n.latencyLabel.replace("{ms}", String(result.total_latency_ms ?? 0))}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {result.results.map((r) => (
              <div
                key={r.llm}
                className={`border-l-4 p-4 rounded-md ${
                  r.mentioned ? "border-l-success bg-emerald-50/50" : "border-l-ink/20 bg-surface"
                }`}
              >
                <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                  <strong className="text-base text-ink">{r.label}</strong>
                  <span className={`text-xs font-mono uppercase tracking-eyebrow ${r.mentioned ? "text-success" : "text-ink-subtle"}`}>
                    {r.mentioned ? "✅ " + i18n.citedBy : "❌ " + i18n.notCited}
                  </span>
                </div>
                {r.error ? (
                  <p className="text-xs text-danger italic">Erreur : {r.error}</p>
                ) : (
                  <p className="text-xs text-ink-muted leading-relaxed">{r.context || "—"}</p>
                )}
                {r.sources?.length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {r.sources.slice(0, 2).map((s) => (
                      <li key={s} className="text-[10px] font-mono text-ink-subtle truncate">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Email capture */}
          {!emailResult?.ok && (
            <div className="border border-DEFAULT bg-cream rounded-lg p-5 mt-4">
              <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-2">
                Audit complet
              </p>
              <h3 className="text-lg font-medium text-ink mb-1">{i18n.emailCtaTitle}</h3>
              <p className="text-sm text-ink-muted mb-4">{i18n.emailCtaBody}</p>
              <form onSubmit={onEmailSubmit} className="space-y-3">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={i18n.emailPlaceholder}
                  className="w-full rounded-md border border-DEFAULT bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <label className="flex items-start gap-2 text-xs text-ink-muted cursor-pointer">
                  <input type="checkbox" name="opt_in" required className="mt-0.5" />
                  <span>
                    {i18n.optInLabel}{" "}
                    <a href="/privacy" className="underline hover:text-ink">
                      {i18n.optInLink}
                    </a>
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={emailPending}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light disabled:opacity-60 transition"
                >
                  {emailPending ? i18n.emailSubmitting : i18n.emailSubmit}
                </button>
                {emailResult && !emailResult.ok && (
                  <p className="text-xs text-danger">{emailResult.message ?? i18n.errorGeneric}</p>
                )}
              </form>
            </div>
          )}

          {emailResult?.ok && (
            <div className="border-l-2 border-l-success bg-emerald-50/50 px-4 py-3 rounded-md text-sm text-success">
              ✅ {i18n.emailSuccess}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
