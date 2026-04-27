import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Geoperf — Études sectorielles de visibilité LLM",
  description: "Mesurez la perception de votre marque par ChatGPT, Gemini, Claude et Perplexity.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com"),
  openGraph: {
    type: "website",
    siteName: "Geoperf",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-cream text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
