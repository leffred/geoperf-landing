import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#042C53", light: "#0C447C" },
        amber: { DEFAULT: "#EF9F27" },
        cream: { DEFAULT: "#F1EFE8" },
        ink: { DEFAULT: "#2C2C2A", muted: "#5F5E5A" },
      },
      fontFamily: {
        serif: ['"Source Serif Pro"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
