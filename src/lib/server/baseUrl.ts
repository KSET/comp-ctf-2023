export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.APP_INTERNAL_URL) {
    return process.env.APP_INTERNAL_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const BASE_URL = getBaseUrl();
