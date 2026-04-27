import { getServiceClient } from "./supabase";

export type ProspectContext = {
  prospect_id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  company_name: string | null;
  ranking_position: number | null;
  visibility_score: number | null;
  report_id: string;
  sous_categorie: string;
  html_url: string | null;
  pdf_url: string | null;
};

/** Resolve a tracking_token → full prospect + report context. */
export async function resolveToken(token: string): Promise<ProspectContext | null> {
  if (!token || !/^[a-f0-9]{24}$/.test(token)) return null;
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("prospects")
    .select(`
      id, first_name, last_name, full_name,
      report_id,
      companies(nom),
      reports(sous_categorie, html_url, pdf_url),
      report_companies!inner(rank, visibility_score)
    `)
    .eq("tracking_token", token)
    .maybeSingle();
  if (error || !data) return null;
  const reports: any = (data as any).reports || {};
  const company: any = (data as any).companies || {};
  const rc: any = Array.isArray((data as any).report_companies) ? (data as any).report_companies[0] : (data as any).report_companies;
  return {
    prospect_id: (data as any).id,
    first_name: (data as any).first_name,
    last_name: (data as any).last_name,
    full_name: (data as any).full_name,
    company_name: company.nom || null,
    ranking_position: rc?.rank ?? null,
    visibility_score: rc?.visibility_score ?? null,
    report_id: (data as any).report_id,
    sous_categorie: reports.sous_categorie || "",
    html_url: reports.html_url || null,
    pdf_url: reports.pdf_url || null,
  };
}

export type EventType =
  | "landing_visited"
  | "download_started"
  | "download_completed"
  | "calendly_booked"
  | "email_clicked";

export async function logEvent(args: {
  prospect_id: string;
  event_type: EventType;
  channel?: "linkedin" | "email" | "phone" | "web" | "calendar" | "manual" | "system";
  direction?: "outbound" | "inbound" | "system";
  metadata?: Record<string, unknown>;
}) {
  const sb = getServiceClient();
  await sb.from("prospect_events").insert({
    prospect_id: args.prospect_id,
    event_type: args.event_type,
    channel: args.channel || "web",
    direction: args.direction || "inbound",
    metadata: args.metadata || {},
  });
  // Side effects
  if (args.event_type === "landing_visited") {
    await sb.from("prospects").update({ last_engagement_at: new Date().toISOString() }).eq("id", args.prospect_id);
  } else if (args.event_type === "download_completed") {
    await sb.from("prospects").update({
      download_at: new Date().toISOString(),
      last_engagement_at: new Date().toISOString(),
      status: "engaged",
    }).eq("id", args.prospect_id);
  }
}
