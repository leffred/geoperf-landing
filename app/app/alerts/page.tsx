import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { requireSaasUser } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { markAllAlertsRead, markOneAlertRead } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Alertes — Geoperf", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ severity?: string; type?: string; brand?: string; show?: string }> };

const TYPE_LABELS: Record<string, string> = {
  rank_drop: "Rang ↓",
  rank_gain: "Rang ↑",
  competitor_overtake: "Concurrent",
  new_source: "Sources",
  citation_loss: "Citation ↓",
  citation_gain: "Citation ↑",
};

const SEV_STYLES: Record<string, string> = {
  high:   "border-l-danger",
  medium: "border-l-warning",
  low:    "border-l-ink/15",
};
const SEV_LABEL_COLOR: Record<string, string> = {
  high: "text-danger",
  medium: "text-warning",
  low: "text-ink-subtle",
};

const SEV_LABEL: Record<string, string> = { high: "Important", medium: "À regarder", low: "Info" };

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diffH = (now - d.getTime()) / 3600000;
  if (diffH < 1) return "il y a <1h";
  if (diffH < 24) return `il y a ${Math.floor(diffH)}h`;
  if (diffH < 48) return "hier";
  const diffD = diffH / 24;
  if (diffD < 7) return `il y a ${Math.floor(diffD)}j`;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export default async function AlertsPage({ searchParams }: Props) {
  const { severity, type, brand, show } = await searchParams;
  const user = await requireSaasUser();
  const sb = getServiceClient();

  let q = sb
    .from("saas_alerts")
    .select("id, alert_type, severity, title, body, brand_id, snapshot_id, is_read, email_sent_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(200);

  if (severity && ["high", "medium", "low"].includes(severity)) q = q.eq("severity", severity);
  if (type) q = q.eq("alert_type", type);
  if (brand) q = q.eq("brand_id", brand);
  if (show === "unread") q = q.eq("is_read", false);

  const [{ data: alerts }, { data: brandRows }] = await Promise.all([
    q,
    sb.from("saas_tracked_brands").select("id, name").eq("user_id", user.id).order("name"),
  ]);

  const alertList = (alerts as any[] | null) ?? [];
  const brandsMap = Object.fromEntries(((brandRows as any[] | null) ?? []).map(b => [b.id, b.name]));
  const totalUnread = alertList.filter(a => !a.is_read).length;
  const totalEmailed = alertList.filter(a => a.email_sent_at).length;

  const baseQS = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const s = overrides.severity ?? severity;
    const t = overrides.type ?? type;
    const b = overrides.brand ?? brand;
    const sh = overrides.show ?? show;
    if (s) params.set("severity", s);
    if (t) params.set("type", t);
    if (b) params.set("brand", b);
    if (sh) params.set("show", sh);
    const str = params.toString();
    return str ? `?${str}` : "";
  };

  const filterChip = (active: boolean) =>
    `px-3 py-1.5 rounded-md text-xs transition-colors duration-150 ease-out ${
      active ? "bg-ink text-white" : "bg-white border border-DEFAULT text-ink hover:bg-surface"
    }`;

  return (
    <Section py="md" tone="white">
      <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
        <div>
          <Eyebrow className="mb-2">Alertes</Eyebrow>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink leading-tight">
            {alertList.length} alerte{alertList.length > 1 ? "s" : ""}
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            {totalUnread} non lue{totalUnread > 1 ? "s" : ""} · {totalEmailed} email{totalEmailed > 1 ? "s" : ""} envoyé{totalEmailed > 1 ? "s" : ""}
          </p>
        </div>
        {totalUnread > 0 && (
          <form action={markAllAlertsRead}>
            <Button type="submit" variant="primary" size="md">Marquer toutes lues</Button>
          </form>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-8 items-center">
        <Link href={`/app/alerts${baseQS({ show: undefined })}`} className={filterChip(!show)}>Toutes</Link>
        <Link href={`/app/alerts${baseQS({ show: "unread" })}`} className={filterChip(show === "unread")}>Non lues</Link>
        <span className="border-l border-DEFAULT mx-1 h-4"></span>
        {(["high", "medium", "low"] as const).map(s => (
          <Link
            key={s}
            href={`/app/alerts${baseQS({ severity: severity === s ? undefined : s })}`}
            className={filterChip(severity === s)}
          >
            {SEV_LABEL[s]}
          </Link>
        ))}
        {(brand || severity || type || show) && (
          <Link href="/app/alerts" className="px-3 py-1.5 text-xs text-ink-muted hover:text-ink underline">
            Réinitialiser
          </Link>
        )}
      </div>

      {alertList.length === 0 ? (
        <div className="bg-white rounded-lg border border-DEFAULT shadow-card p-10 text-center">
          <p className="text-ink-muted">Aucune alerte ne correspond aux filtres.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alertList.map(a => (
            <article
              key={a.id}
              className={`rounded-lg border border-DEFAULT border-l-2 bg-white p-5 shadow-card ${SEV_STYLES[a.severity] || SEV_STYLES.low} ${a.is_read ? "opacity-70" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-3 mb-1.5 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-subtle">{TYPE_LABELS[a.alert_type] || a.alert_type}</span>
                  <span className={`font-mono text-[10px] uppercase tracking-eyebrow ${SEV_LABEL_COLOR[a.severity] || "text-ink-subtle"}`}>
                    · {SEV_LABEL[a.severity]}
                  </span>
                  {!a.is_read && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-brand-500 text-white">NEW</span>
                  )}
                  {a.email_sent_at && <span className="font-mono text-[10px] text-ink-subtle">📧 envoyée</span>}
                </div>
                <span className="font-mono text-[10px] text-ink-subtle whitespace-nowrap">{fmtDate(a.created_at)}</span>
              </div>
              <h3 className="text-base font-medium text-ink mb-1 tracking-tightish">
                <Link href={`/app/brands/${a.brand_id}`} className="hover:text-brand-500 transition-colors">
                  {brandsMap[a.brand_id] ?? "?"} — {a.title}
                </Link>
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-2">{a.body}</p>
              <div className="flex items-center gap-3 text-xs">
                <Link href={`/app/brands/${a.brand_id}`} className="text-brand-500 hover:underline">
                  Ouvrir la marque →
                </Link>
                {!a.is_read && (
                  <form action={markOneAlertRead}>
                    <input type="hidden" name="alert_id" value={a.id} />
                    <button type="submit" className="text-ink-muted hover:text-ink underline transition-colors">
                      Marquer lue
                    </button>
                  </form>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}
