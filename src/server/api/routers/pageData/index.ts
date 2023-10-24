import { getCsrfToken } from "~/lib/server/api/auth/csrf";
import { listProviders } from "~/lib/server/api/auth/providers";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

  login: publicProcedure.query(async () => {
    const providers = await listProviders();

    return {
      providers: Object.values(providers),
      csrfToken: await getCsrfToken(),
    };
  }),
});
