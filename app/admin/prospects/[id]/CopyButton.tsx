"use client";

import { useState } from "react";

export function CopyButton({ text, label = "copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 transition ${copied ? "bg-green-600 text-white" : "bg-navy/10 text-navy hover:bg-navy/20"}`}
    >
      {copied ? "✓ copié" : label}
    </button>
  );
}
