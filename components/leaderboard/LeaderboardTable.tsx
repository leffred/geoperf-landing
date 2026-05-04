// Tableau leaderboard top N pour /leaderboard/[secteur].
// Server component — reçoit les rows pré-formatées depuis le parent.

import { Eyebrow } from "@/components/ui/Eyebrow";

export type LeaderboardRow = {
  rank: number;
  companyId: string;
  companyName: string;
  domain: string | null;
  visibilityScore: number | null;     // sur 4 (légacy lead-magnet) ou null
  saturationGap: number | null;       // ai_saturation_gap
  marketRankEstimate: number | null;
  hasProfilePage: boolean;            // si /profile/[domain] indexé
};

type Props = {
  rows: LeaderboardRow[];
  topN: number;
  reportDate: string | null;
};

function fmtVisibility(score: number | null): string {
  if (score === null || score === undefined) return "—";
  return `${Number(score).toFixed(1)}/4`;
}

function fmtPercent(n: number | null): string {
  if (n === null || n === undefined) return "—";
  return `${Math.round(Number(n) * 100)}%`;
}

export function LeaderboardTable({ rows, topN, reportDate }: Props) {
  return (
    <div className="bg-white rounded-lg border border-ink/[0.08] overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-ink-subtle border-b border-ink/[0.08] bg-surface">
          <tr>
            <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow w-16">Rang</th>
            <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">Marque</th>
            <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow hidden md:table-cell">Domaine</th>
            <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">Visibility LLM</th>
            <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow hidden md:table-cell">Saturation IA</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, topN).map((r) => (
            <tr key={r.companyId} className="border-b border-ink/[0.04] last:border-b-0 hover:bg-surface transition-colors">
              <td className="py-3 px-4 font-mono text-ink-subtle tabular-nums">{r.rank.toString().padStart(2, "0")}</td>
              <td className="py-3 px-4 font-medium text-ink">
                {r.hasProfilePage && r.domain ? (
                  <a href={`/profile/${r.domain}`} className="hover:text-brand-500 transition-colors">
                    {r.companyName}
                  </a>
                ) : (
                  r.companyName
                )}
              </td>
              <td className="py-3 px-4 font-mono text-xs text-ink-muted hidden md:table-cell">{r.domain ?? "—"}</td>
              <td className="py-3 px-4 text-right font-mono tabular-nums text-ink">{fmtVisibility(r.visibilityScore)}</td>
              <td className="py-3 px-4 text-right font-mono tabular-nums text-ink-muted hidden md:table-cell">
                {fmtPercent(r.saturationGap)}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="py-10 text-center text-ink-muted text-sm italic">
                Aucune donnée disponible.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {reportDate && (
        <div className="px-4 py-3 border-t border-ink/[0.04] bg-surface">
          <Eyebrow variant="muted">
            Données du {new Date(reportDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
          </Eyebrow>
        </div>
      )}
    </div>
  );
}
