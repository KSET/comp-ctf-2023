import { type AuthOptions } from "next-auth";
import { type Simplify } from "type-fest";

import { BASE_URL } from "~/lib/server/baseUrl";
import { logger } from "~/lib/server/log";

type AuthProvider = Simplify<
  AuthOptions["providers"][number] & {
    signinUrl: string;
    callbackUrl: string;
  }
>;

export type Provider = {
  id: AuthProvider["id"];
  name: AuthProvider["name"];
  type: AuthProvider["type"];
  signinUrl: string;
  callbackUrl: string;
  isAssociated?: boolean;
};

const providersUrl = `${BASE_URL}/api/auth/providers`;

export const listProviders = () => {
  logger.debug(JSON.stringify({ providersUrl }));

  return fetch(providersUrl)
    .then((res) => res.json())
    .catch((e) => {
      logger.error(e);

      return {};
    }) as Promise<Record<Provider["id"], Provider>>;
};
