import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { listProviders } from "~/lib/server/api/auth/providers";
import { logger } from "~/lib/server/log";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { accounts } from "~/server/db/schema";

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

  disconnect: protectedProcedure
    .input(
      z.object({
        providerId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const resp = await ctx.db
        .transaction(async (tx) => {
          const [currentAccounts] = await tx.execute(
            sql`select count(*) as "count" from ${accounts} where ${accounts.userId} = ${userId}`,
          );

          if (
            !currentAccounts ||
            !("count" in currentAccounts) ||
            typeof currentAccounts.count !== "string"
          ) {
            throw new Error("Something went wrong");
          }

          if (Number(currentAccounts.count) <= 1) {
            throw new Error("You must have at least one account");
          }

          return tx
            .delete(accounts)
            .where(
              and(
                eq(accounts.provider, input.providerId),
                eq(accounts.userId, userId),
              ),
            )
            .returning();
        })
        .catch((e) => {
          logger.error(String(e));

          return null;
        });

      return {
        resp,
      };
    }),
});
