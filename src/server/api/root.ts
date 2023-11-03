import { createTRPCRouter } from "~/server/api/trpc";

import { authRouter } from "./routers/auth";
import { pageDataRouter } from "./routers/pageData";
import { tasksRouter } from "./routers/task";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  pageData: pageDataRouter,
  task: tasksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
