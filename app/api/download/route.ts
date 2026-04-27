// POST /api/download?prospect_id=...&format=pdf|html
// Logs download events + regenerates a fresh signed URL (7d) to serve.

import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { logEvent } from "@/lib/tracking";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const prospectId = url.searchParams.get("prospect_id");
  const format = (url.searchParams.get("format") || "html").toLowerCase();
  if (!prospectId) return NextResponse.json({ error: "prospect_id required" }, { status: 400 });
  if (format !== "html" && format !== "pdf") {
    return NextResponse.json({ error: "format must be html or pdf" }, { status: 400 });
  }

  const sb = getServiceClient();

  // Fetch prospect → report_id
  const { data: prospect, error: pErr } = await sb
    .from("prospects")
    .select("id, report_id")
    .eq("id", prospectId)
    .maybeSingle();
  if (pErr || !prospect) {
    return NextResponse.json({ error: "prospect not found" }, { status: 404 });
  }

  // Log download_started
  await logEvent({
    prospect_id: prospect.id,
    event_type: "download_started",
    metadata: { format },
  });

  // Regenerate signed URL for fresh delivery
  const fileName = `${prospect.report_id}.${format}`;
  const { data: signed, error: sErr } = await sb.storage
    .from("white-papers")
    .createSignedUrl(fileName, 60 * 60 * 24 * 7);

  if (sErr || !signed?.signedUrl) {
    // Fall back to whatever URL is stored
    const { data: report } = await sb
      .from("reports")
      .select("html_url, pdf_url")
      .eq("id", prospect.report_id)
      .maybeSingle();
    const fallback = (format === "pdf" ? report?.pdf_url : report?.html_url) || null;
    if (!fallback) return NextResponse.json({ error: "file not available" }, { status: 404 });
    await logEvent({
      prospect_id: prospect.id,
      event_type: "download_completed",
      metadata: { format, fallback: true },
    });
    return NextResponse.json({ url: fallback });
  }

  // Mark download_completed
  await logEvent({
    prospect_id: prospect.id,
    event_type: "download_completed",
    metadata: { format },
  });

  return NextResponse.json({ url: signed.signedUrl });
}
