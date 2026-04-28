// GET /api/pixel/<tracking_token>.png
// Renvoie un PNG transparent 1x1 + log un event email_opened.
// À embarquer dans les emails Apollo : <img src="https://geoperf.com/api/pixel/{{tracking_token}}.png" width="1" height="1" alt="">

import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

// PNG 1x1 transparent (43 bytes, generated from real ImageMagick output)
const PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=",
  "base64",
);

const HEADERS = {
  "Content-Type": "image/png",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token: rawToken } = await params;
  // Token comes as "<hex>.png" — strip extension
  const token = rawToken.replace(/\.png$/i, "");

  // Always serve the pixel, even if token invalid (don't break emails)
  const responseBody = new Uint8Array(PIXEL);

  // Validate token format (24 hex chars from gen_random_bytes(12))
  if (!/^[a-f0-9]{24}$/i.test(token)) {
    return new NextResponse(responseBody, { headers: HEADERS, status: 200 });
  }

  // Fire-and-forget event log (don't await — keep latency low)
  (async () => {
    try {
      const sb = getServiceClient();
      const { data: prospect } = await sb
        .from("prospects")
        .select("id")
        .eq("tracking_token", token)
        .maybeSingle();
      if (!prospect) return;
      const userAgent = req.headers.get("user-agent") || "";
      const referer = req.headers.get("referer") || "";
      // Detect email client prefetchers (Gmail, Outlook, Apple Mail) to avoid false positives
      const isPrefetch =
        /GoogleImageProxy|YahooMailProxy|MicrosoftOffice|Outlook-iOS|Apple-Mail/i.test(userAgent);
      await sb.from("prospect_events").insert({
        prospect_id: prospect.id,
        event_type: "email_opened",
        channel: "email",
        direction: "inbound",
        metadata: {
          user_agent: userAgent.substring(0, 200),
          referer: referer.substring(0, 200),
          is_prefetch_likely: isPrefetch,
          source: "tracking_pixel",
        },
      });
      // Update last_engagement_at
      await sb
        .from("prospects")
        .update({ last_engagement_at: new Date().toISOString() })
        .eq("id", prospect.id);
    } catch (e) {
      // Swallow errors — never break email rendering
      console.error("[pixel] log failed", e);
    }
  })();

  return new NextResponse(responseBody, { headers: HEADERS, status: 200 });
}
