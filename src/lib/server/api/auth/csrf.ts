import { headers } from "next/headers";
import { z } from "zod";

import { BASE_URL } from "~/lib/server/baseUrl";
import { logger } from "~/lib/server/log";

const csrfUrl = `${BASE_URL}/api/auth/csrf`;

const respValidator = z.object({
  csrfToken: z.string(),
});

export const getCsrfToken = () => {
  logger.debug(JSON.stringify({ csrfUrl }));

  return fetch(csrfUrl, {
    headers: headers(),
  })
    .then((res) => res.json())
    .then((res) => respValidator.safeParseAsync(res))
    .then((res) => {
      if (!res.success) {
        throw res.error;
      }

      return res.data.csrfToken;
    })
    .catch((e) => {
      logger.error(e);

      return null;
    });
};
