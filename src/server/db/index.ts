import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env.mjs";

import { logger } from "../../lib/server/log";
import * as schema from "./schema";

const dbLogger = logger.child({
  module: "db",
});

const dbProvider = postgres(env.DATABASE_URL);

export const db = drizzle(dbProvider, {
  schema,
  logger: new (class {
    logQuery(query: string, params: unknown[]) {
      dbLogger.debug(
        `query=${JSON.stringify(query)} params=${JSON.stringify(params)}`,
      );
    }
  })(),
});
