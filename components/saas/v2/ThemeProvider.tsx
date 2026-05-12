"use client";

// V2 — ThemeProvider wrapping next-themes for the /app/* tree.
// Uses attribute="data-theme" + value="dark|light" to match the V2 prototype CSS contract.

import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
