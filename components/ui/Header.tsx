import Link from "next/link";

type Props = {
  /** Right-side content. If omitted, shows contact email. */
  rightSlot?: React.ReactNode;
  /** Render variant. Default = 'on-light'. */
  variant?: "on-light" | "on-dark";
};

export function Header({ rightSlot, variant = "on-light" }: Props) {
  const textColor = variant === "on-dark" ? "text-white" : "text-navy";
  const borderColor = variant === "on-dark" ? "border-white/15" : "border-navy/10";
  const bgClass = variant === "on-dark" ? "bg-navy/85" : "bg-white/85";
  const accent = "text-amber amber-pulse";
  return (
    <header className={`sticky top-0 z-40 px-8 py-6 border-b ${borderColor} ${bgClass} backdrop-blur-sm transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className={`font-serif text-2xl ${textColor}`}>
          Ge<span className={accent}>·</span>perf
        </Link>
        <div className={`text-sm ${textColor}`}>
          {rightSlot ?? (
            <a href="mailto:contact@geoperf.com" className="hover:underline">
              contact@geoperf.com
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
