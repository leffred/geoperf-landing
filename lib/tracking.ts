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

/** Resolve a tracking_token via the v_prospect_landing_context view (single row, all joins pre-resolved). */
export async function resolveToken(token: string): Promise<ProspectContext | null> {
  if (!token || !/^[a-f0-9]{24}$/i.test(token)) return null;
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("v_prospect_landing_context")
    .select("*")
    .eq("tracking_token", token)
    .maybeSingle();
  if (error || !data) return null;
  return {
    prospect_id: (data as any).prospect_id,
    first_name: (data as any).first_name,
    last_name: (data as any).last_name,
    full_name: (data as any).full_name,
    company_name: (data as any).company_name,
    ranking_position: (data as any).ranking_position,
    visibility_score: (data as any).visibility_score,
    report_id: (data as any).report_id,
    sous_categorie: (data as any).sous_categorie || "",
    html_url: (data as any).html_url,
    pdf_url: (data as any).pdf_url,
  };
}

export type EventType =
  | "landing_visited"
  | "download_started"
  | "download_completed"
  | "calendly_booked"
  | "email_clicked"
  | "email_opened";

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
  // Note : last_engagement_at + status transitions are handled by the
  // handle_prospect_engagement Postgres trigger — pas besoin de doubler ici.
}
