import { createTRPCRouter } from "~/server/api/trpc";

import { providersRouter } from "./providers";

export const authRouter = createTRPCRouter({
  providers: providersRouter,
});
