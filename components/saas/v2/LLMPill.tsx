// V2 — LLMPill : colored glyph + LLM name
// Matches design handoff §LLM brand colors :
//   GPT-4o #10A37F · Claude #C77D2C · Gemini #4285F4 · Perplexity #20808D

const LLM_META: Record<string, { glyph: string; bg: string; canonical: string }> = {
  "gpt-4o":     { glyph: "G", bg: "#10A37F", canonical: "GPT-4o" },
  "openai/gpt-4o": { glyph: "G", bg: "#10A37F", canonical: "GPT-4o" },
  "openai/gpt-4o-mini": { glyph: "G", bg: "#10A37F", canonical: "GPT-4o mini" },
  "chatgpt":    { glyph: "G", bg: "#10A37F", canonical: "ChatGPT" },
  "claude":     { glyph: "C", bg: "#C77D2C", canonical: "Claude" },
  "anthropic/claude-sonnet-4-6": { glyph: "C", bg: "#C77D2C", canonical: "Claude" },
  "anthropic/claude-haiku-4-5":  { glyph: "C", bg: "#C77D2C", canonical: "Claude Haiku" },
  "gemini":     { glyph: "g", bg: "#4285F4", canonical: "Gemini" },
  "google/gemini-2.5-flash": { glyph: "g", bg: "#4285F4", canonical: "Gemini Flash" },
  "perplexity": { glyph: "P", bg: "#20808D", canonical: "Perplexity" },
  "perplexity/sonar": { glyph: "P", bg: "#20808D", canonical: "Perplexity" },
  "perplexity/sonar-pro": { glyph: "P", bg: "#20808D", canonical: "Perplexity Pro" },
};

function meta(name: string): { glyph: string; bg: string; canonical: string } {
  const key = name.toLowerCase().trim();
  return LLM_META[key] ?? LLM_META[key.replace(/[-_].*$/, "")] ?? { glyph: "?", bg: "#5B6478", canonical: name };
}

interface LLMPillProps {
  name: string;
  size?: "sm" | "md";
}

export function LLMPill({ name, size = "md" }: LLMPillProps) {
  const m = meta(name);
  const glyphSize = size === "sm" ? 12 : 14;
  const fontSize = size === "sm" ? 10 : 11;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-DEFAULT bg-surface text-ink whitespace-nowrap"
      style={{ fontSize, fontWeight: 500 }}
    >
      <span
        className="rounded-[3px] grid place-items-center text-white"
        style={{
          width: glyphSize,
          height: glyphSize,
          background: m.bg,
          fontSize: glyphSize - 5,
          fontWeight: 700,
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        {m.glyph}
      </span>
      {m.canonical}
    </span>
  );
}

export function llmColor(name: string): string {
  return meta(name).bg;
}
