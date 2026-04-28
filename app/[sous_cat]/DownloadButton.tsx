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
  const format = pdfUrl ? "pdf" : "html";

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
      const res = await fetch(`/api/download?prospect_id=${prospectId}&format=${format}`, { method: "POST" });
      const data = await res.json();
      const fileUrl = data.url || target!;
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      window.location.assign(`/merci?p=${prospectId}&format=${format}`);
    } catch {
      window.open(target!, "_blank", "noopener,noreferrer");
      window.location.assign(`/merci?p=${prospectId}&format=${format}`);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className="inline-block bg-amber text-navy px-8 py-4 font-medium hover:bg-amber/90 transition disabled:opacity-50"
    >
      {busy ? "Préparation..." : `Télécharger l'étude (${format.toUpperCase()})`}
    </button>
  );
}
