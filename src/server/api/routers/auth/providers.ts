import { listProviders } from "~/lib/server/api/auth/providers";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const providersRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return listProviders();
  }),

  linkedToAccount: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;

    return ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      with: {
        accounts: {
          columns: {
            provider: true,
          },
        },
      },
    });
  }),
});
