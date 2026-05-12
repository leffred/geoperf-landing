"use client";

// V2 — Light/Dark toggle button. Sits next to the avatar in Topbar.

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div style={{ width: 32, height: 32 }} />;
  }

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Mode clair" : "Mode sombre"}
      aria-label="Toggle theme"
      className="grid place-items-center text-ink-muted hover:text-ink hover:bg-surface rounded-md transition-colors duration-fast"
      style={{ width: 32, height: 32 }}
    >
      {isDark ? <Sun size={14} strokeWidth={1.6} /> : <Moon size={14} strokeWidth={1.6} />}
    </button>
  );
}
