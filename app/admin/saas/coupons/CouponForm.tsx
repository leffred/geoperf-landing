"use client";

import { useState } from "react";
import { createCoupon } from "./actions";

function suggestCode(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${rand}`;
}

export function CouponForm({ createdBy: _ }: { createdBy: string }) {
  const [code, setCode] = useState<string>(() => suggestCode("EARLYACCESS"));

  return (
    <form action={createCoupon} className="space-y-4 bg-surface p-5 rounded-lg border border-DEFAULT">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-1.5">
            Code (auto-suggéré)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="flex-1 border border-DEFAULT rounded-md px-3 py-2 text-sm font-mono bg-white"
            />
            <button
              type="button"
              onClick={() => setCode(suggestCode("EARLYACCESS"))}
              className="px-3 py-2 text-xs border border-DEFAULT rounded-md hover:bg-white"
            >
              ↻
            </button>
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-1.5">
            Tier ciblé
          </label>
          <select
            name="tier_target"
            required
            defaultValue="starter"
            className="w-full border border-DEFAULT rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="starter">Starter (79€/mo)</option>
            <option value="growth">Growth (199€/mo)</option>
            <option value="pro">Pro (399€/mo)</option>
            <option value="agency">Agency (799€/mo)</option>
          </select>
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-1.5">
            Trial (jours)
          </label>
          <input
            type="number"
            name="trial_days"
            required
            min={1}
            max={365}
            defaultValue={14}
            className="w-full border border-DEFAULT rounded-md px-3 py-2 text-sm bg-white"
          />
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-1.5">
            Max uses (vide = illimité)
          </label>
          <input
            type="number"
            name="max_uses"
            min={1}
            placeholder="50"
            className="w-full border border-DEFAULT rounded-md px-3 py-2 text-sm bg-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-1.5">
            Expire le (vide = pas d&apos;expiration)
          </label>
          <input
            type="date"
            name="expires_at"
            className="w-full border border-DEFAULT rounded-md px-3 py-2 text-sm bg-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-mono text-xs uppercase tracking-eyebrow text-ink-muted mb-1.5">
            Notes (interne)
          </label>
          <input
            type="text"
            name="notes"
            placeholder="Distribution Sequence A J0"
            className="w-full border border-DEFAULT rounded-md px-3 py-2 text-sm bg-white"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-ink text-white px-5 py-2.5 text-sm font-medium rounded-md hover:bg-ink/90"
      >
        Créer le coupon
      </button>
    </form>
  );
}
