import { createTRPCRouter } from "~/server/api/trpc";

import { authRouter } from "./routers/auth";
import { pageDataRouter } from "./routers/pageData";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  pageData: pageDataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
