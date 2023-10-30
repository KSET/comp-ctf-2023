import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const KEY_URL = "x-url";
export const KEY_PATH = "x-path";

export const getCurrentPath = () => {
  return headers().get(KEY_PATH);
};

export const getCurrentUrl = () => {
  return headers().get(KEY_URL);
};

export function middleware(request: Request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(KEY_URL, request.url);
  requestHeaders.set(KEY_PATH, new URL(request.url).pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
