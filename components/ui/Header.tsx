import Link from "next/link";

type NavItem = { label: string; href: string };

const NAV: NavItem[] = [
  { label: "Études", href: "/etudes" },
  { label: "Méthodologie", href: "/methodologie" },
  { label: "Tarifs", href: "/tarifs" },
];

type Props = {
  variant?: "on-light" | "on-dark";
  rightSlot?: React.ReactNode;
};

export function Header({ variant = "on-light", rightSlot }: Props) {
  const onDark = variant === "on-dark";
  const text = onDark ? "text-white" : "text-ink";
  const navMuted = onDark
    ? "text-white/70 hover:text-white"
    : "text-ink-muted hover:text-ink";
  const border = onDark ? "border-white/10" : "border-DEFAULT";
  const bg = onDark ? "bg-ink/85" : "bg-white/85";

  return (
    <header className={`sticky top-0 z-40 border-b ${border} ${bg} backdrop-blur-md`}>
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-14 flex items-center justify-between">
        <Link href="/" className={`flex items-center gap-2 ${text}`}>
          <span className="grid place-items-center w-6 h-6 rounded-md bg-brand-500 text-white text-[11px] font-medium">
            G
          </span>
          <span className="text-[15px] font-medium tracking-tightish">
            Geoperf<span className="text-amber amber-pulse">·</span>
          </span>
        </Link>
        {rightSlot ? (
          <div className={`text-sm ${text}`}>{rightSlot}</div>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={`${navMuted} transition-colors`}>
                {n.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-ink text-white text-sm font-medium px-3.5 py-2 rounded-md hover:bg-ink/90 transition-colors"
            >
              Demander une étude
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
