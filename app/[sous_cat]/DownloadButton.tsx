"use client";

import { useState } from "react";

type Props = {
  prospectId: string;
  pdfUrl: string | null;
  htmlUrl: string | null;
};

export function DownloadButton({ prospectId, pdfUrl, htmlUrl }: Props) {
  const [busy, setBusy] = useState(false);
  const target = pdfUrl || htmlUrl;
  const labelFormat = pdfUrl ? "PDF" : "HTML";

  if (!target) {
    return (
      <span className="inline-block bg-white/20 text-white/60 px-8 py-4 font-medium cursor-not-allowed">
        Étude en cours de préparation
      </span>
    );
  }

  async function handleClick() {
    setBusy(true);
    try {
      // Track + get the (possibly fresh) signed URL from the server
      const res = await fetch(`/api/download?prospect_id=${prospectId}&format=${pdfUrl ? "pdf" : "html"}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback to the embedded URL
        window.location.href = target!;
      }
    } catch {
      window.location.href = target!;
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className="inline-block bg-amber text-navy px-8 py-4 font-medium hover:bg-amber/90 transition disabled:opacity-50"
    >
      {busy ? "Préparation..." : `Télécharger l'étude (${labelFormat})`}
    </button>
  );
}
