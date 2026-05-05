import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Geoperf — Études sectorielles de visibilité LLM",
  description:
    "Mesurez la perception de votre marque par ChatGPT, Gemini, Claude et Perplexity.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com"
  ),
  openGraph: {
    type: "website",
    siteName: "Geoperf",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-ink font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
