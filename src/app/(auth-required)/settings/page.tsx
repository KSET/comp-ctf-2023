import { AppLoginProviderButton } from "~/app/_components/auth/auth-provider/provider-button";
import { AppDisconnectProviderButton } from "~/app/_components/auth/auth-provider/provider-button.client";
import { api } from "~/lib/trpc/server";

export default async function PageSettings() {
  const { linkedProviders, unlinkedProviders, csrfToken } =
    await api.pageData.settings.home.query();

  if (!csrfToken) {
    return (
      <div className="container flex flex-1 items-center justify-center">
        <h1 className="text-3xl">
          Something went wrong. Please try again later.
        </h1>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold">Postavke</h1>

      <div className="flex flex-wrap">
        <section className="rounded-md bg-primary p-4">
          <h2 className="text-3xl font-bold">Računi</h2>

          <div className="mt-4 flex gap-x-12 gap-y-8">
            {unlinkedProviders.length > 0 ? (
              <section>
                <h3 className="text-xl">Poveži</h3>
                <ul className="mt-1 max-w-xs space-y-2">
                  {unlinkedProviders.map((provider) => {
                    return (
                      <li key={provider.id}>
                        <AppLoginProviderButton
                          className="border-primary"
                          csrfToken={csrfToken}
                          provider={provider}
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            {linkedProviders.length > 0 ? (
              <section>
                <h3 className="text-xl">Povezani računi</h3>
                <ul className="mt-1 max-w-xs space-y-2">
                  {linkedProviders.map((provider) => {
                    return (
                      <li key={provider.id}>
                        <AppDisconnectProviderButton
                          className="border-primary"
                          isDisabled={linkedProviders.length <= 1}
                          provider={provider}
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
}
