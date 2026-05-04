// Timeline compacte des 7 derniers jours (server component).
// Aggrège snapshots completed + alertes + recos en une liste sortée par created_at desc.

import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

export type ActivityItem = {
  kind: "snapshot" | "alert" | "reco" | "brand_created";
  brandId: string;
  brandName: string;
  title: string;
  hint?: string;
  createdAt: string;
};

type Props = {
  items: ActivityItem[];
};

const KIND_ICON: Record<ActivityItem["kind"], string> = {
  snapshot: "◆",
  alert: "⚠",
  reco: "→",
  brand_created: "+",
};

const KIND_COLOR: Record<ActivityItem["kind"], string> = {
  snapshot: "text-brand-500",
  alert: "text-warning",
  reco: "text-ink-muted",
  brand_created: "text-success",
};

function fmtRel(iso: string): string {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const diffH = diffMs / 3600_000;
  if (diffH < 1) return "à l'instant";
  if (diffH < 24) return `il y a ${Math.floor(diffH)}h`;
  const diffD = diffH / 24;
  if (diffD < 7) return `il y a ${Math.floor(diffD)}j`;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export function ActivityTimeline({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-ink/[0.08] p-6">
        <Eyebrow className="mb-2">Activité 7 derniers jours</Eyebrow>
        <p className="text-sm text-ink-muted italic">Aucune activité récente.</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg border border-ink/[0.08] p-6">
      <Eyebrow className="mb-4">Activité 7 derniers jours</Eyebrow>
      <ul className="space-y-2.5">
        {items.slice(0, 10).map((item, idx) => (
          <li key={`${item.kind}-${idx}-${item.createdAt}`} className="grid grid-cols-[1rem_minmax(0,1fr)_auto] items-start gap-3 text-sm">
            <span className={`font-mono text-xs ${KIND_COLOR[item.kind]} mt-0.5`}>{KIND_ICON[item.kind]}</span>
            <div className="min-w-0">
              <Link href={`/app/brands/${item.brandId}`} className="text-ink hover:text-brand-500 transition-colors">
                <span className="text-ink-subtle font-mono text-[10px] uppercase tracking-eyebrow mr-2">{item.brandName}</span>
                {item.title}
              </Link>
              {item.hint && <span className="text-ink-muted text-xs ml-2">— {item.hint}</span>}
            </div>
            <span className="text-[11px] font-mono text-ink-subtle whitespace-nowrap">{fmtRel(item.createdAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
