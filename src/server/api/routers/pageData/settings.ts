import { getCsrfToken } from "~/lib/server/api/auth/csrf";
import { listProviders } from "~/lib/server/api/auth/providers";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const settingsRouter = createTRPCRouter({
  home: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const providersPromise = listProviders();
    const linkedProvidersPromise = ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      with: {
        accounts: {
          columns: {
            provider: true,
          },
        },
      },
      columns: {},
    });

    const [providers, linkedProvidersData, csrfToken] = await Promise.all([
      providersPromise,
      linkedProvidersPromise,
      getCsrfToken(),
    ]);

    const providersList = Object.values(providers);
    const linkedProviderIds =
      linkedProvidersData?.accounts.map((a) => a.provider) ?? [];

    const linkedProviders = providersList.filter((x) => {
      return linkedProviderIds.includes(x.id);
    });
    const unlinkedProviders = providersList.filter((x) => {
      return !linkedProviderIds.includes(x.id);
    });

    return {
      linkedProviders,
      unlinkedProviders,
      csrfToken,
    };
  }),
});
