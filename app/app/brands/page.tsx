import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { loadSaasContext, TIER_LIMITS } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mes marques — Geoperf", robots: { index: false, follow: false } };

type Brand = {
  id: string;
  name: string;
  domain: string;
  category_slug: string;
  competitor_domains: string[];
  cadence: "weekly" | "monthly";
  is_active: boolean;
  last_snapshot_at: string | null;
  visibility_score: number | null;
  unread_alerts: number;
  unread_recos: number;
};

export default async function BrandsPage() {
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  const { data } = await sb
    .from("v_saas_brand_latest")
    .select("id, name, domain, category_slug, competitor_domains, cadence, is_active, last_snapshot_at, visibility_score, unread_alerts, unread_recos")
    .eq("user_id", ctx.user.id)
    .order("created_at", { ascending: false });

  const brands = (data as Brand[] | null) ?? [];
  const limits = TIER_LIMITS[ctx.tier];
  const canAddMore = brands.length < limits.brands;

  return (
    <Section py="md" tone="cream">
      <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase">Mes marques</p>
          <h1 className="font-serif text-3xl text-navy">{brands.length} / {limits.brands} suivies</h1>
        </div>
        {canAddMore ? (
          <Link href="/app/brands/new" className="bg-amber text-navy px-4 py-2 text-sm font-medium hover:bg-amber/90 transition">
            + Suivre une marque
          </Link>
        ) : (
          <Link href="/app/billing" className="bg-navy text-white px-4 py-2 text-sm font-medium hover:bg-navy-light transition">
            Upgrade pour ajouter +
          </Link>
        )}
      </div>

      {brands.length === 0 ? (
        <div className="bg-white p-8 text-center">
          <p className="text-ink-muted mb-4">Aucune marque suivie pour l&apos;instant.</p>
          <Link href="/app/brands/new" className="inline-block bg-amber text-navy px-6 py-2.5 text-sm font-medium hover:bg-amber/90 transition">
            Suivre ma 1re marque
          </Link>
        </div>
      ) : (
        <div className="bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-muted border-b border-navy/15">
              <tr>
                <th className="text-left py-3 px-4">Marque</th>
                <th className="text-left py-3 px-4">Domaine</th>
                <th className="text-left py-3 px-4 hidden md:table-cell">Catégorie</th>
                <th className="text-left py-3 px-4 hidden md:table-cell">Concurrents</th>
                <th className="text-left py-3 px-4 hidden lg:table-cell">Cadence</th>
                <th className="text-right py-3 px-4">Score</th>
                <th className="text-right py-3 px-4 hidden sm:table-cell">Notif</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(b => (
                <tr key={b.id} className="border-b border-navy/5 hover:bg-cream/50">
                  <td className="py-3 px-4">
                    <Link href={`/app/brands/${b.id}`} className="font-medium text-navy hover:underline">
                      {b.name}
                    </Link>
                    {!b.is_active && <span className="ml-2 text-xs text-ink-muted">(inactive)</span>}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-ink-muted">{b.domain}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-xs">{b.category_slug.replace(/-/g, " ")}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-xs text-ink-muted">{b.competitor_domains?.length ?? 0}</td>
                  <td className="py-3 px-4 hidden lg:table-cell text-xs">{b.cadence === "weekly" ? "Hebdo" : "Mensuel"}</td>
                  <td className="py-3 px-4 text-right font-mono">{b.visibility_score?.toFixed(0) ?? "—"}</td>
                  <td className="py-3 px-4 text-right hidden sm:table-cell text-xs">
                    {b.unread_alerts > 0 && <span className="text-amber font-medium mr-2">{b.unread_alerts} alertes</span>}
                    {b.unread_recos > 0 && <span className="text-ink-muted">{b.unread_recos} recos</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}
