import { and, eq } from "drizzle-orm";
import { type Session } from "next-auth";

import { db } from "~/server/db";
import { type Task, taskSolves } from "~/server/db/schema";

import { logger } from "../server/log";
import { generateFlag } from "../task/id";

type User = Session["user"];
type UserId = User["id"];
type TaskId = Task["id"];

export const getUserTask = async (props: {
  userId: UserId;
  taskId: TaskId;
}) => {
  const dbTask = await db.query.tasks.findFirst({
    where: (t, { eq }) => eq(t.id, props.taskId),
    with: {
      solves: {
        where: (s, { eq }) => eq(s.userId, props.userId),
        limit: 1,
      },
    },
  });

  if (!dbTask) {
    return null;
  }

  const { solves, ...taskData } = dbTask;

  return {
    ...taskData,
    solve: solves[0],
  };
};

export const createTaskAttempt = async (ctx: {
  userId: UserId;
  taskId: TaskId;
  task?: Pick<Task, "flagBase" | "flagUserSpecific">;
  finishedAt?: Date;
}) => {
  return db.transaction(async (tx) => {
    const task = await (ctx.task ??
      tx.query.tasks.findFirst({
        where: (t, { eq }) => eq(t.id, ctx.taskId),
        columns: {
          flagUserSpecific: true,
          flagBase: true,
        },
      }));

    if (!task) {
      return null;
    }

    return tx
      .insert(taskSolves)
      .values({
        userId: ctx.userId,
        taskId: ctx.taskId,
        flag: generateFlag({
          ...ctx,
          flagBase: task.flagBase!,
          userSpecific: task.flagUserSpecific,
        }),
        finishedAt: ctx.finishedAt,
      })
      .onConflictDoNothing()
      .returning()
      .execute()
      .then((t) => t[0])
      .catch((e) => {
        console.error(e);
        return null;
      });
  });
};

export const getOrCreateTaskAttempt = async (
  ctx: Parameters<typeof createTaskAttempt>[0],
) => {
  const attempt = await createTaskAttempt(ctx);

  if (attempt) {
    return attempt;
  }

  return db.query.taskSolves.findFirst({
    where: (s, { eq, and }) =>
      and(eq(s.userId, ctx.userId), eq(s.taskId, ctx.taskId)),
  });
};

export const solveTaskAttempt = async (ctx: {
  userId: UserId;
  taskId: TaskId;
}) => {
  return db.transaction(async (tx) => {
    const task = await tx.query.tasks.findFirst({
      where: (t, { eq }) => eq(t.id, ctx.taskId),
    });

    if (!task) {
      return null;
    }

    const finishedAt = new Date();

    try {
      return await tx
        .update(taskSolves)
        .set({
          finishedAt,
        })
        .execute();
    } catch {
      return createTaskAttempt({
        userId: ctx.userId,
        taskId: ctx.taskId,
        task,
        finishedAt,
      });
    }
  });
};

export const handleFlagVerification = async (ctx: {
  userId: UserId;
  taskId: TaskId;
  userSubmittedFlag: string;
}) => {
  return db.transaction(async (tx) => {
    const task = await tx.query.tasks.findFirst({
      where: (t, { eq }) => eq(t.id, ctx.taskId),
      columns: {},
      with: {
        solves: {
          columns: {
            userId: true,
            taskId: true,
            flag: true,
            startedAt: true,
          },
          where: (s, { eq, and }) => and(eq(s.userId, ctx.userId)),
        },
      },
    });

    if (!task) {
      return {
        status: "error" as const,
        message: "Zadatak nije pronađen",
      };
    }

    const taskSolve = task.solves.at(0);

    if (!taskSolve) {
      return {
        status: "error" as const,
        message: "Zadatak nije pronađen",
      };
    }

    const { flag } = taskSolve;

    if (
      flag.trim().toLowerCase() !== ctx.userSubmittedFlag.trim().toLowerCase()
    ) {
      return {
        status: "error" as const,
        message: "Kriva zastavica",
      };
    }

    const finishedAt = new Date();

    return db
      .update(taskSolves)
      .set({
        finishedAt,
      })
      .where(
        and(
          eq(taskSolves.taskId, taskSolve.taskId),
          eq(taskSolves.userId, taskSolve.userId),
        ),
      )
      .execute()
      .then(() => {
        return {
          status: "success" as const,
        };
      })
      .catch((e) => {
        logger.error(e);

        return {
          status: "error" as const,
          message: "Nešto je pošlo po krivu",
        };
      });
  });
};
