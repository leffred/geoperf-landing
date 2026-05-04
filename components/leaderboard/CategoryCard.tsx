// Card par catégorie pour l'index /leaderboard.
// Server component.

import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

export type CategoryCardProps = {
  slug: string;
  name: string;
  hasReport: boolean;
  topCompaniesPreview?: string[];  // 3 premières marques en preview
  reportDate?: string | null;
  topN?: number;
};

export function CategoryCard({ slug, name, hasReport, topCompaniesPreview = [], reportDate, topN }: CategoryCardProps) {
  return (
    <Link
      href={`/leaderboard/${slug}`}
      className="block bg-white rounded-lg border border-ink/[0.08] p-5 hover:shadow-cardHover hover:border-strong transition-all"
    >
      <div className="flex items-baseline justify-between mb-3">
        <Eyebrow>{name}</Eyebrow>
        {hasReport ? (
          <span className="font-mono text-[10px] uppercase tracking-eyebrow bg-brand-50 text-brand-600 px-2 py-0.5 rounded">
            Top {topN ?? 10}
          </span>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-subtle">À venir</span>
        )}
      </div>
      <h3 className="text-lg font-medium text-ink tracking-tight mb-2">
        Top {topN ?? 10} {name} dans les LLMs
      </h3>
      {hasReport ? (
        <>
          {topCompaniesPreview.length > 0 && (
            <p className="text-sm text-ink-muted mb-3">
              {topCompaniesPreview.slice(0, 3).join(" · ")}
              {topCompaniesPreview.length > 3 ? "…" : ""}
            </p>
          )}
          {reportDate && (
            <p className="text-[11px] font-mono text-ink-subtle">
              Mise à jour {new Date(reportDate).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-ink-muted">Étude en cours, recevoir une notification au lancement →</p>
      )}
    </Link>
  );
}
