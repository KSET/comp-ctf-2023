import {
  createTRPCProxyClient,
  loggerLink,
  // eslint-disable-next-line camelcase
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import { headers } from "next/headers";

import { baseLog, logger } from "~/lib/server/log";
import { type AppRouter } from "~/server/api/root";

import { getUrl, transformer } from "./shared";

const trpcLogger = logger.child({
  module: "trpc",
});

const trpcLog = baseLog.child({
  module: "trpc",
});

export const api = createTRPCProxyClient<AppRouter>({
  transformer,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
      logger(opts) {
        trpcLogger.debug(JSON.stringify(opts));
        trpcLog.debug(opts);
      },
    }),
    unstable_httpBatchStreamLink({
      url: getUrl(),
      headers() {
        const heads = new Map(headers());
        heads.set("x-trpc-source", "rsc");
        heads.delete("content-length");
        return Object.fromEntries(heads);
      },
    }),
  ],
});
