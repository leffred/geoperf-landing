import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0E1A",
          muted: "#5B6478",
          subtle: "#8C94A6",
        },
        surface: {
          DEFAULT: "#F7F8FA",
          2: "#EEF1F5",
        },
        brand: {
          50: "#EFF4FE",
          500: "#2563EB",
          600: "#1D4ED8",
        },
        success: "#059669",
        warning: "#D97706",
        danger: "#DC2626",
        amber: { DEFAULT: "#EF9F27" },
        navy: { DEFAULT: "#0A0E1A", light: "#1D4ED8" },
        cream: { DEFAULT: "#F7F8FA" },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', "ui-monospace", "monospace"],
        serif: ['"Inter"', "system-ui", "sans-serif"],
      },
      borderColor: {
        DEFAULT: "rgba(10,14,26,0.08)",
        strong: "rgba(10,14,26,0.14)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,14,26,0.04), 0 0 0 0.5px rgba(10,14,26,0.06)",
        cardHover: "0 4px 12px rgba(10,14,26,0.06), 0 0 0 0.5px rgba(10,14,26,0.10)",
      },
      letterSpacing: {
        tightish: "-0.015em",
        eyebrow: "0.18em",
      },
    },
  },
  plugins: [],
};
export default config;
