import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/saas/EmptyState";
import { loadSaasContext, tierLimits } from "@/lib/saas-auth";
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
  const limits = tierLimits(ctx.tier);
  const canAddMore = brands.length < limits.brands;

  return (
    <Section py="md" tone="white">
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
        <div>
          <Eyebrow className="mb-2">Mes marques</Eyebrow>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
            {brands.length} / {limits.brands} suivies
          </h1>
        </div>
        {canAddMore ? (
          <Button href="/app/brands/new" variant="primary" size="md">+ Suivre une marque</Button>
        ) : (
          <Button href="/app/billing" variant="secondary" size="md">Upgrade pour ajouter +</Button>
        )}
      </div>

      {brands.length === 0 ? (
        <EmptyState
          icon="brands"
          eyebrow="Démarrer"
          title="Aucune marque suivie"
          body="Commence par suivre ta première marque pour voir comment les LLM la perçoivent."
          ctaLabel="Suivre ma 1re marque"
          ctaHref="/app/brands/new"
        />
      ) : (
        <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
              <tr>
                <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">Marque</th>
                <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">Domaine</th>
                <th className="text-left py-3 px-4 hidden md:table-cell font-mono uppercase tracking-eyebrow">Catégorie</th>
                <th className="text-left py-3 px-4 hidden md:table-cell font-mono uppercase tracking-eyebrow">Concurrents</th>
                <th className="text-left py-3 px-4 hidden lg:table-cell font-mono uppercase tracking-eyebrow">Cadence</th>
                <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">Score</th>
                <th className="text-right py-3 px-4 hidden sm:table-cell font-mono uppercase tracking-eyebrow">Notif</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(b => (
                <tr key={b.id} className="border-b border-DEFAULT last:border-b-0 hover:bg-surface transition-colors duration-150 ease-out">
                  <td className="py-3 px-4">
                    <Link href={`/app/brands/${b.id}`} className="font-medium text-ink hover:text-brand-500 transition-colors">
                      {b.name}
                    </Link>
                    {!b.is_active && <span className="ml-2 text-xs text-ink-subtle">(inactive)</span>}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-ink-muted">{b.domain}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-xs text-ink-muted">{b.category_slug.replace(/-/g, " ")}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-xs text-ink-subtle">{b.competitor_domains?.length ?? 0}</td>
                  <td className="py-3 px-4 hidden lg:table-cell text-xs text-ink-muted">{b.cadence === "weekly" ? "Hebdo" : "Mensuel"}</td>
                  <td className="py-3 px-4 text-right font-mono text-ink tabular-nums">{b.visibility_score?.toFixed(0) ?? "—"}</td>
                  <td className="py-3 px-4 text-right hidden sm:table-cell text-xs">
                    {b.unread_alerts > 0 && <span className="text-warning font-medium mr-2">{b.unread_alerts} alertes</span>}
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
