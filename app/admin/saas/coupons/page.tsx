// S20 §4.1 — Admin /admin/saas/coupons : liste + status + form creation.
// Server component (read) + form server action.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/ui/HeaderStatic";
import { Footer } from "@/components/ui/FooterStatic";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { getAdminUser } from "@/lib/supabase-server-auth";
import { getServiceClient } from "@/lib/supabase";
import { CouponForm } from "./CouponForm";
import { ToggleActiveButton } from "./ToggleActiveButton";

export const metadata: Metadata = {
  title: "Coupons — Admin Geoperf",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  expired: "bg-amber/30 text-ink",
  exhausted: "bg-red-100 text-red-700",
  disabled: "bg-gray-200 text-gray-700",
};

type CouponRow = {
  code: string;
  tier_target: string;
  trial_days: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  status: "active" | "expired" | "exhausted" | "disabled";
  redemption_count: number;
};

export default async function CouponsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; toggled?: string; error?: string }>;
}) {
  const adminUser = await getAdminUser();
  if (!adminUser) redirect("/admin/login?next=/admin/saas/coupons");

  const sp = await searchParams;
  const sb = getServiceClient();
  const { data: coupons, error } = await sb
    .from("v_admin_coupons")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header
        rightSlot={
          <div className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="text-ink-muted hover:text-ink">Admin</Link>
            <Link href="/admin/saas" className="text-ink-muted hover:text-ink">SaaS</Link>
            <span className="text-ink-subtle font-mono text-xs">{adminUser.email}</span>
          </div>
        }
      />

      <Section py="md" tone="white">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <Eyebrow className="mb-2">Admin · SaaS</Eyebrow>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink">
              Coupons
            </h1>
            <p className="text-sm text-ink-muted mt-2 max-w-2xl">
              Codes de parrainage : trial Starter/Growth/Pro/Agency offert. Distribués
              en 1-1 par email Sequence A ou via lead-magnet.
            </p>
          </div>
          <Link
            href="#new-coupon"
            className="bg-ink text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-ink/90"
          >
            ↓ Nouveau coupon
          </Link>
        </div>

        {sp.created && (
          <div className="mb-4 border border-green-300 bg-green-50 text-green-800 text-sm p-3 rounded-md">
            Coupon <code className="font-mono">{sp.created}</code> créé.
          </div>
        )}
        {sp.toggled && (
          <div className="mb-4 border border-amber/50 bg-amber/10 text-ink text-sm p-3 rounded-md">
            Coupon <code className="font-mono">{sp.toggled}</code> mis à jour.
          </div>
        )}
        {sp.error && (
          <div className="mb-4 border border-red-300 bg-red-50 text-red-800 text-sm p-3 rounded-md">
            {sp.error}
          </div>
        )}

        {error && (
          <div className="text-red-700 mb-4 text-sm">DB error: {error.message}</div>
        )}

        <div className="overflow-x-auto border border-DEFAULT rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs font-mono uppercase tracking-eyebrow text-ink-muted">
              <tr>
                <th className="px-3 py-2.5">Code</th>
                <th className="px-3 py-2.5">Tier</th>
                <th className="px-3 py-2.5">Trial</th>
                <th className="px-3 py-2.5">Used / Max</th>
                <th className="px-3 py-2.5">Expire</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Notes</th>
                <th className="px-3 py-2.5">Action</th>
              </tr>
            </thead>
            <tbody>
              {(coupons as CouponRow[] | null)?.map((c) => (
                <tr key={c.code} className="border-t border-DEFAULT hover:bg-surface/40">
                  <td className="px-3 py-2.5 font-mono text-xs text-ink">{c.code}</td>
                  <td className="px-3 py-2.5 text-ink">{c.tier_target}</td>
                  <td className="px-3 py-2.5 text-ink">{c.trial_days}j</td>
                  <td className="px-3 py-2.5 text-ink">
                    {c.used_count} / {c.max_uses ?? "∞"}
                    {c.redemption_count !== c.used_count && (
                      <span className="text-xs text-ink-subtle ml-1">
                        (redemptions {c.redemption_count})
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-ink-muted text-xs">
                    {c.expires_at ? new Date(c.expires_at).toISOString().slice(0, 10) : "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-mono ${STATUS_BADGE[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-ink-muted max-w-xs truncate">{c.notes}</td>
                  <td className="px-3 py-2.5">
                    <ToggleActiveButton code={c.code} isActive={c.is_active} />
                  </td>
                </tr>
              ))}
              {(!coupons || coupons.length === 0) && (
                <tr>
                  <td colSpan={8} className="px-3 py-12 text-center text-ink-muted text-sm">
                    Aucun coupon. Créez-en un ci-dessous.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div id="new-coupon" className="mt-12 max-w-2xl">
          <h2 className="text-xl font-medium text-ink mb-4">Nouveau coupon</h2>
          <CouponForm createdBy={adminUser.id} />
        </div>
      </Section>

      <Footer />
    </main>
  );
}
