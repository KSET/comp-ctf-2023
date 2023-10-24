import pluginTypography from "@tailwindcss/typography";
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export const white = "#fff";
export const offWhite = "#f2f2f2";
export const black = "#000";
export const primary = "#5e2750";

export const background = black;
export const text = white;
export const offText = offWhite;

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },

      colors: {
        primary,
        background,
        text,
        "off-text": offText,
      },

      container: {
        center: true,
        padding: {
          DEFAULT: "3rem",
          md: "2rem",
        },
        screens: {
          "2xl": "1400px",
          br: "1200px",
        },
      },

      typography: {
        DEFAULT: {
          css: {
            color: offText,
          },
        },
      },
    },
  },
  plugins: [pluginTypography({})],
} satisfies Config;
