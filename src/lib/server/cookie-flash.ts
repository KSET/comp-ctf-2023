import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { type Simplify } from "type-fest";
import { z } from "zod";

import { try$ } from "~/lib/util/try";

const flashCookieValidator = z.record(
  z.string(),
  z.array(
    z.object({
      type: z.string().optional(),
      message: z.string(),
    }),
  ),
);

export type FlashCookie = z.infer<typeof flashCookieValidator>;
export type FlashCookieEntry = FlashCookie[keyof FlashCookie][number];

export const FLASH_COOKIE_NAME = "flash";

const getCookie = () => {
  const cookieJar = cookies();
  const cookieStr = cookieJar.get(FLASH_COOKIE_NAME)?.value;

  if (!cookieStr) {
    return null;
  }

  const cookieValue = try$(() => JSON.parse(cookieStr));
  const cookieValidated = flashCookieValidator.safeParse(cookieValue);

  if (!cookieValidated.success) {
    return null;
  }

  return cookieValidated.data;
};

export const addFlashMessage = ({
  path,
  ...entry
}: Simplify<FlashCookieEntry & { path: string }>) => {
  const cookie = getCookie() ?? {};

  if (!Array.isArray(cookie[path])) {
    cookie[path] = [];
  }

  cookie[path]!.push(entry);

  const cookieJar = cookies();
  cookieJar.set(FLASH_COOKIE_NAME, JSON.stringify(cookie));
  revalidatePath(path);
};

export const popFlashMessage = (path: string) => {
  const cookie = getCookie();

  if (!cookie || !(path in cookie)) {
    return [];
  }

  const messages = cookie[path]!;
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete cookie[path];

  const cookieJar = cookies();
  cookieJar.set(FLASH_COOKIE_NAME, JSON.stringify(cookie));

  return messages;
};
