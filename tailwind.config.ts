import pluginTypography from "@tailwindcss/typography";
import { fromPairs, toPairs } from "rambdax";
import { type Config } from "tailwindcss";
import defaultConfig from "tailwindcss/defaultConfig";
import { fontFamily } from "tailwindcss/defaultTheme";
import reactAriaComponents from "tailwindcss-react-aria-components";

export const white = "#fff";
export const offWhite = "#f2f2f2";
export const black = "#000";
export const primary = "#5e2750";

export const background = black;
export const text = white;
export const offText = offWhite;

type FontSizeRaw = NonNullable<NonNullable<Config["theme"]>["fontSize"]>;
type FontSize = Exclude<FontSizeRaw, (...args: never[]) => unknown>;
/**
 * Define font sizes as just font sizes without extra attributes.
 *
 * @see https://tailwindcss.com/docs/font-size
 */
const fontSize = fromPairs(
  toPairs((defaultConfig.theme?.fontSize ?? {}) as unknown as FontSize).map(
    ([key, value]) => {
      if (typeof value === "string") {
        return [key, value];
      }

      const [size, _config] = value;

      return [key, size];
    },
  ),
) satisfies FontSize;

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },

      fontSize,

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
  plugins: [pluginTypography({}), reactAriaComponents],
} satisfies Config;
