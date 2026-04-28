// POST /api/calendly-webhook
// Reçoit les events Calendly (invitee.created, invitee.canceled).
// Match l'invitee.email avec un prospect en DB → log calendly_booked → trigger Postgres transitionne en converted.
//
// Setup côté Calendly :
//   1. Calendly Settings → Webhooks → Create Webhook Subscription
//   2. URL : https://geoperf.com/api/calendly-webhook
//   3. Events : invitee.created, invitee.canceled (and invitee.no_show_marked si tu veux)
//   4. Signing key : copy → mettre dans Vercel env CALENDLY_WEBHOOK_SECRET
//
// Vérification de signature : Calendly signe ses webhooks avec HMAC-SHA256 du body avec ta secret.
// Header : Calendly-Webhook-Signature (format : "t=timestamp,v1=signature")

import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { createHmac, timingSafeEqual } from "crypto";

// Verify Calendly webhook signature (HMAC-SHA256)
function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=")));
  const ts = parts.t;
  const sig = parts.v1;
  if (!ts || !sig) return false;
  // Reject if older than 5 minutes (replay protection)
  const age = Math.abs(Date.now() / 1000 - parseInt(ts, 10));
  if (age > 300) return false;
  const expected = createHmac("sha256", secret).update(`${ts}.${rawBody}`).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;

  // Optional signature check — skip if secret not set (dev mode)
  if (secret) {
    const sigHeader = req.headers.get("calendly-webhook-signature");
    if (!verifySignature(rawBody, sigHeader, secret)) {
      console.error("[calendly-webhook] Invalid signature");
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  }

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // Calendly v2 webhook payload structure
  const event = body?.event as string;
  const payload = body?.payload || {};
  const inviteeEmail = (payload.email || "").toLowerCase().trim();
  const inviteeName = payload.name || "";
  const eventStartTime = payload.scheduled_event?.start_time || null;
  const cancelReason = payload.cancellation?.reason || null;

  if (!inviteeEmail) {
    return NextResponse.json({ ok: false, reason: "no_email_in_payload" }, { status: 200 });
  }

  const sb = getServiceClient();
  // Match prospect by email (case-insensitive)
  const { data: prospect } = await sb
    .from("prospects")
    .select("id, full_name, status")
    .ilike("email", inviteeEmail)
    .maybeSingle();

  if (!prospect) {
    // Pas de match — log dans une table audit ou ignore
    console.log("[calendly-webhook] No matching prospect for email:", inviteeEmail);
    return NextResponse.json({ ok: false, reason: "no_matching_prospect", email: inviteeEmail }, { status: 200 });
  }

  // Map event type → event_type DB
  let eventType: "calendly_booked" | "calendly_attended" | "calendly_cancelled" | "calendly_no_show" | null = null;
  if (event === "invitee.created") eventType = "calendly_booked";
  else if (event === "invitee.canceled" || event === "invitee.cancelled") eventType = "calendly_cancelled";
  else if (event === "invitee.no_show_marked") eventType = "calendly_no_show";
  else {
    return NextResponse.json({ ok: false, reason: `unknown_event:${event}` }, { status: 200 });
  }

  // Log the event — the Postgres trigger handle_prospect_engagement
  // will auto-transition the prospect to 'converted' on calendly_booked.
  await sb.from("prospect_events").insert({
    prospect_id: prospect.id,
    event_type: eventType,
    channel: "calendar",
    direction: "inbound",
    metadata: {
      calendly_event: event,
      invitee_email: inviteeEmail,
      invitee_name: inviteeName,
      event_start_time: eventStartTime,
      cancel_reason: cancelReason,
      raw_payload_keys: Object.keys(payload),
    },
  });

  return NextResponse.json({
    ok: true,
    matched_prospect: prospect.id,
    event_logged: eventType,
  });
}

// Calendly verifies the webhook subscription by sending a GET request
export async function GET() {
  return NextResponse.json({ status: "Geoperf Calendly webhook active" });
}
