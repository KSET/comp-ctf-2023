/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  reactStrictMode: true,
  cleanDistDir: true,
  optimizeFonts: true,
  devIndicators: {
    buildActivityPosition: "bottom-right",
  },
  experimental: {
    adjustFontFallbacks: true,
    adjustFontFallbacksWithSizeAdjust: true,
    serverSourceMaps: true,
    typedRoutes: true,
  },
};

export default config;
