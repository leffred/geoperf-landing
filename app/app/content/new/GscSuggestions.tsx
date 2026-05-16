"use client";

type GscRow = { query: string; impressions: number; position: number; ctr: number };

export default function GscSuggestions({ suggestions }: { suggestions: GscRow[] }) {
  if (!suggestions.length) return null;

  return (
    <div className="space-y-1.5">
      {suggestions.map((s) => (
        <button
          key={s.query}
          type="button"
          onClick={() => {
            const el = document.getElementById("subject") as HTMLTextAreaElement | null;
            if (el) { el.value = s.query; el.focus(); }
          }}
          className="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-DEFAULT hover:border-brand-500 hover:bg-brand-50/40 transition-all group"
        >
          <span className="text-ink text-sm truncate group-hover:text-brand-700">{s.query}</span>
          <span className="text-ink-subtle text-xs ml-3 shrink-0">
            {s.impressions} imp · pos {Number(s.position).toFixed(1)}
          </span>
        </button>
      ))}
    </div>
  );
}
