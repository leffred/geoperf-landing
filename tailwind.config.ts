import type { Config } from "tailwindcss";
import { editorial, ui, semantic, borders, shadows, motion } from "./lib/design-tokens";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // UI tokens — pour app/dashboard/portail
        ink: {
          DEFAULT: ui.ink,
          muted:   ui.inkMuted,
          subtle:  ui.inkSubtle,
        },
        surface: {
          DEFAULT: ui.surface,
          2: ui.surface2,
        },
        brand: {
          50:  ui.brand50,
          500: ui.brand500,
          600: ui.brand600,
        },

        // Editorial tokens — pour logos, OG, covers, étude sectorielle
        navy: {
          DEFAULT: editorial.navy,
          light:   editorial.navyLight,
        },
        amber: { DEFAULT: editorial.amber },
        parchment: { DEFAULT: editorial.parchment },

        // Sémantique
        success: semantic.success,
        warning: semantic.warning,
        danger:  semantic.danger,

        // Alias rétrocompatible — `cream` = parchment éditorial.
        // À supprimer une fois `bg-parchment` adopté partout.
        cream: { DEFAULT: editorial.parchment },
      },
      fontFamily: {
        sans:  ['"Inter"', "system-ui", "sans-serif"],
        serif: ['"Source Serif Pro"', '"Times New Roman"', "Georgia", "serif"],
        mono:  ['"JetBrains Mono"', '"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        // Micro-label — remplace les `text-[10px]` arbitraires
        "2xs": ["10px", { lineHeight: "1.4" }],
      },
      borderColor: {
        DEFAULT:  borders.default,
        strong:   borders.strong,
        hairline: borders.hairline,
      },
      boxShadow: {
        card:      shadows.card,
        cardHover: shadows.cardHover,
        popover:   shadows.popover,
        modal:     shadows.modal,
      },
      letterSpacing: {
        tightish: "-0.015em",
        eyebrow:  "0.18em",
      },
      transitionDuration: {
        fast: motion.duration.fast,
        base: motion.duration.base,
        slow: motion.duration.slow,
      },
      transitionTimingFunction: {
        snappy: motion.easing.snappy,
        smooth: motion.easing.smooth,
      },
      keyframes: {
        amberpulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.55" },
        },
      },
      animation: {
        "amber-pulse": "amberpulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
