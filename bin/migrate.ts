/* eslint-disable no-console */
import { join as pathJoin } from "node:path";

import { migrate } from "drizzle-orm/postgres-js/migrator";

import drizzleConfig from "../drizzle.config";
import { db } from "../src/server/db";

const migrationsFolder = pathJoin(
  new URL(import.meta.url).pathname,
  "..",
  "..",
  drizzleConfig.out,
);

async function main() {
  console.log("Migrating...");

  await migrate(db, {
    migrationsFolder,
  });
}

void main()
  .then(() => {
    console.log("Done!");

    process.exit(0);
  })
  .catch((e) => {
    console.error(e);

    process.exit(1);
  });
