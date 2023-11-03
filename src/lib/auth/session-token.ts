import { cookies, headers } from "next/headers";
import { type NextRequest } from "next/server";

export const getSessionToken = (request?: NextRequest) => {
  const ctx = request ?? {
    cookies: cookies(),
    headers: headers(),
  };

  return (
    ctx.cookies.get("__Secure-next-auth.session-token")?.value ??
    ctx.cookies.get("next-auth.session-token")?.value ??
    ctx.headers.get("from") ??
    ctx.headers.get("authorization")?.replace(/^Bearer /i, "")
  );
};
