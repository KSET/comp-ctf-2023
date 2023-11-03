import { getCsrfToken } from "~/lib/server/api/auth/csrf";
import { listProviders } from "~/lib/server/api/auth/providers";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { adminRouter } from "./admin";
import { settingsRouter } from "./settings";
import { tasksRouter } from "./tasks";

export const pageDataRouter = createTRPCRouter({
  $header: publicProcedure.query(async ({ ctx }) => {
    const providersPromise = listProviders();
    const { session } = ctx;
    const userId = session?.user.id;

    const associatedProvidersPromise = userId
      ? ctx.db.query.users
          .findFirst({
            where: (users, { eq }) => eq(users.id, userId),
            columns: {
              email: true,
            },
            with: {
              accounts: {
                columns: {
                  provider: true,
                },
              },
            },
          })
          .then((res) => res?.accounts.map((a) => a.provider))
      : null;

    const [providers, associatedProviders] = await Promise.all([
      providersPromise,
      associatedProvidersPromise,
    ]);

    for (const provider of Object.values(providers)) {
      provider.isAssociated =
        associatedProviders?.includes(provider.id) ?? false;
    }

    return {
      session,
      providers,
    };
  }),

  home: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const tasksRaw = await ctx.db.query.tasks.findMany({
      where: (t, { eq }) => eq(t.hidden, false),
      with: {
        solves: {
          columns: {
            finishedAt: true,
          },
          where: (t, { eq }) => eq(t.userId, userId),
        },
      },
      orderBy: (t, { asc }) => asc(t.position),
    });

    const tasks = tasksRaw.map((task) => {
      return {
        ...task,
        solved: task.solves[0]?.finishedAt ?? null,
      };
    });

    return {
      tasks,
    };
  }),

  login: publicProcedure.query(async () => {
    const providers = await listProviders();

    return {
      providers: Object.values(providers),
      csrfToken: await getCsrfToken(),
    };
  }),

  settings: settingsRouter,
  admin: adminRouter,
  tasks: tasksRouter,
});
