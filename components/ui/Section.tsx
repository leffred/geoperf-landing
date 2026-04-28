import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Vertical padding preset. */
  py?: "sm" | "md" | "lg";
  /** Background tone. */
  tone?: "white" | "cream" | "navy";
  /** Optional eyebrow text above the section. */
  eyebrow?: string;
  className?: string;
};

const PY = { sm: "py-10", md: "py-16", lg: "py-24" };
const TONES = {
  white: "bg-white text-ink",
  cream: "bg-cream text-ink",
  navy: "bg-navy text-white",
};

export function Section({ children, py = "md", tone = "white", eyebrow, className = "" }: Props) {
  return (
    <section className={`px-8 ${PY[py]} ${TONES[tone]} ${className}`}>
      <div className="max-w-4xl mx-auto">
        {eyebrow && (
          <p className={`font-mono text-xs tracking-widest uppercase mb-3 ${tone === "navy" ? "text-amber" : "text-navy-light"}`}>
            {eyebrow}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
