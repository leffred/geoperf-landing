// GET /api/click?t=<token>&u=<url>&l=<label>
// Logs an email_clicked event then 302s to the destination URL.
// Use in emails for tracking external links: e.g. Calendly, partner sites.

import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

// Allowlist: only redirect to these domains (avoids open-redirect abuse)
const SAFE_HOSTS = [
  "calendly.com",
  "cal.com",
  "geoperf.com",
  "linkedin.com",
  "qfdvdcvqknoqfxetttch.supabase.co",
];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("t") || "";
  const dest = url.searchParams.get("u") || "";
  const label = url.searchParams.get("l") || "";

  // Validate destination URL
  let destUrl: URL;
  try {
    destUrl = new URL(dest);
  } catch {
    return NextResponse.redirect("https://geoperf.com", { status: 302 });
  }
  const hostOk = SAFE_HOSTS.some(
    (h) => destUrl.hostname === h || destUrl.hostname.endsWith("." + h),
  );
  if (!hostOk) {
    return NextResponse.redirect("https://geoperf.com", { status: 302 });
  }

  // Fire-and-forget log
  if (/^[a-f0-9]{24}$/i.test(token)) {
    (async () => {
      try {
        const sb = getServiceClient();
        const { data: prospect } = await sb
          .from("prospects")
          .select("id")
          .eq("tracking_token", token)
          .maybeSingle();
        if (!prospect) return;
        await sb.from("prospect_events").insert({
          prospect_id: prospect.id,
          event_type: "email_clicked",
          channel: "email",
          direction: "inbound",
          metadata: {
            destination: destUrl.toString().substring(0, 500),
            label: label.substring(0, 100),
            user_agent: (req.headers.get("user-agent") || "").substring(0, 200),
          },
        });
        await sb
          .from("prospects")
          .update({ last_engagement_at: new Date().toISOString() })
          .eq("id", prospect.id);
      } catch (e) {
        console.error("[click] log failed", e);
      }
    })();
  }

  return NextResponse.redirect(destUrl, { status: 302 });
}
