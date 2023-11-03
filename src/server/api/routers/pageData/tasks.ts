import { z } from "zod";

import { getOrCreateTaskAttempt } from "~/lib/services/task-service";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  info: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const task = await ctx.db.query.tasks.findFirst({
        where: (t, { eq, and }) =>
          and(eq(t.slug, input.slug), eq(t.hidden, false)),
      });

      if (!task) {
        return null;
      }

      const taskId = task.id;

      const attemptInfo = await getOrCreateTaskAttempt({
        taskId,
        userId,
        task,
      });

      if (!attemptInfo) {
        return null;
      }

      const { flag, ...attempt } = attemptInfo;

      return {
        task: {
          ...task,
          attempt,
        },
        flag,
      };
    }),
});
