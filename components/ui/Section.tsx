import { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

type Tone = "white" | "surface" | "dark" | "cream" | "navy";

type Props = {
  children: ReactNode;
  py?: "sm" | "md" | "lg";
  tone?: Tone;
  eyebrow?: string;
  className?: string;
};

const PY = { sm: "py-12", md: "py-20", lg: "py-28" };
const TONE_MAP: Record<Tone, string> = {
  white: "bg-white text-ink",
  surface: "bg-surface text-ink border-y border-DEFAULT",
  dark: "bg-ink text-white",
  cream: "bg-surface text-ink border-y border-DEFAULT",
  navy: "bg-ink text-white",
};

export function Section({
  children,
  py = "md",
  tone = "white",
  eyebrow,
  className = "",
}: Props) {
  const isDark = tone === "dark" || tone === "navy";
  return (
    <section className={`px-6 md:px-8 ${PY[py]} ${TONE_MAP[tone]} ${className}`}>
      <div className="max-w-6xl mx-auto">
        {eyebrow && (
          <Eyebrow variant={isDark ? "muted" : "brand"} className="mb-3">
            {eyebrow}
          </Eyebrow>
        )}
        {children}
      </div>
    </section>
  );
}
