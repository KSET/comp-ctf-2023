import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import kebabCase from "lodash/fp/kebabCase";
import { filterObject } from "rambdax";
import { z } from "zod";

import { logger } from "~/lib/server/log";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { tasks } from "~/server/db/schema";

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  slug: true,
  position: true,
});
type InsertTaskSchema = typeof tasks.$inferInsert;
export type InsertTaskPayload = z.infer<typeof insertTaskSchema>;

export const updateTaskSchema = insertTaskSchema
  .partial()
  .extend({
    id: z.number(),
  })
  .strip();
export type UpdateTaskPayload = z.infer<typeof updateTaskSchema>;

export const tasksRouter = createTRPCRouter({
  add: adminProcedure
    .input(insertTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const newTask = {
        ...input,
        slug: kebabCase(input.title),
        position: 0,
      } satisfies InsertTaskSchema;

      return await ctx.db
        .transaction(async (tx) => {
          const lastPositionQuery = await tx.query.tasks.findFirst({
            orderBy: (t, { desc }) => desc(t.position),
            columns: {
              position: true,
            },
          });
          const lastPosition = lastPositionQuery?.position ?? 0;

          const existingSlugQuery = await tx.query.tasks.findFirst({
            where: (t, op) => op.eq(t.slug, newTask.slug),
            columns: {
              slug: true,
            },
          });

          const slug =
            existingSlugQuery?.slug.concat(
              `-${Math.random().toString(36).substring(2)}`,
            ) ?? newTask.slug;

          return tx.insert(tasks).values({
            ...newTask,
            slug,
            position: lastPosition + 1,
          });
        })
        .catch((e) => {
          logger.error(e);

          return null;
        });
    }),

  update: adminProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updated } = filterObject(
        (x) => x !== null && x !== undefined,
        input,
      ) as unknown as typeof input;

      return await ctx.db
        .update(tasks)
        .set(updated)
        .where(eq(tasks.id, id))
        .returning()
        .catch((e) => {
          logger.error(e);

          return null;
        });
    }),

  move: adminProcedure
    .input(
      z.object({
        id: z.number(),
        direction: z.enum(["forwards", "backwards"]),
      }),
    )
    .mutation(({ input, ctx }) => {
      const { id, direction } = input;
      const newPositionDelta = direction === "forwards" ? 1 : -1;

      return ctx.db.transaction(async (tx) => {
        const currentTask = await tx.query.tasks.findFirst({
          where: (t, op) => op.eq(t.id, id),
          columns: {
            id: true,
            position: true,
          },
        });

        if (!currentTask) {
          throw new Error("Task not found");
        }

        const newPosition = currentTask.position + newPositionDelta;

        if (newPosition <= 0) {
          throw new Error("Position cannot be less than or equal to 0");
        }

        const taskAtPosition = await tx.query.tasks.findFirst({
          where: (t, op) => op.eq(t.position, newPosition),
          columns: {
            id: true,
            position: true,
          },
        });

        if (taskAtPosition) {
          await tx
            .update(tasks)
            .set({
              position: -taskAtPosition.position,
            })
            .where(eq(tasks.id, taskAtPosition.id));
        }

        await tx
          .update(tasks)
          .set({
            position: newPosition,
          })
          .where(eq(tasks.id, id));

        if (taskAtPosition) {
          await tx
            .update(tasks)
            .set({
              position: currentTask.position,
            })
            .where(eq(tasks.id, taskAtPosition.id));
        }

        return true;
      });
    }),
});
