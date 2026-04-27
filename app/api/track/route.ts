// Lightweight tracking endpoint — used by client-side beacons.
// POST { prospect_id, event_type, metadata? }

import { NextRequest, NextResponse } from "next/server";
import { logEvent, EventType } from "@/lib/tracking";

const ALLOWED: EventType[] = [
  "landing_visited",
  "download_started",
  "download_completed",
  "calendly_booked",
  "email_clicked",
];

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid json" }, { status: 400 }); }
  const { prospect_id, event_type, metadata } = body || {};
  if (!prospect_id || !ALLOWED.includes(event_type)) {
    return NextResponse.json({ error: "invalid prospect_id or event_type" }, { status: 400 });
  }
  await logEvent({ prospect_id, event_type, metadata: metadata || {} });
  return NextResponse.json({ ok: true });
}
