import { taskHandlerKeys } from "~/lib/task/handlers";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  indexTasks: adminProcedure.query(async ({ ctx }) => {
    const [taskList] = await Promise.all([
      ctx.db.query.tasks.findMany({
        orderBy: (t) => t.position,
      }),
    ] as const);

    return {
      tasks: taskList,
      taskHandlerKeys,
    };
  }),
  indexUsers: adminProcedure.query(async ({ ctx }) => {
    const [userList, taskList] = await Promise.all([
      ctx.db.query.users.findMany({
        columns: {
          emailVerified: false,
        },
        orderBy: (u) => u.email,
        with: {
          accounts: {
            columns: {
              provider: true,
            },
          },
          taskSolves: {
            columns: {
              taskId: true,
              startedAt: true,
              finishedAt: true,
            },
          },
        },
      }),
      ctx.db.query.tasks.findMany({
        orderBy: (t) => t.position,
      }),
    ] as const);

    return {
      users: userList,
      tasks: taskList,
    };
  }),
});
