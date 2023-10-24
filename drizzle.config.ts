import { type Config } from "drizzle-kit";

import { env } from "~/env.mjs";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  out: "./src/server/db/generated",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: [`${env.DATABASE_TABLE_NAME_PREFIX}*`],
  verbose: true,
  strict: true,
  introspect: {
    casing: "camel",
  },
} satisfies Config;
