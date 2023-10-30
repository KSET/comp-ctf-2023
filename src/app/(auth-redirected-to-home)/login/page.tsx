import { AppLoginProviderButton } from "~/app/_components/auth/auth-provider/provider-button";
import { $metadata } from "~/lib/page/metadata";
import { api } from "~/lib/trpc/server";

export const metadata = $metadata({
  title: "Sign In",
});

export default async function PageLogin() {
  const pageData = await api.pageData.login.query();
  const { providers, csrfToken } = pageData;

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
    <section className="container m-auto flex w-auto max-w-sm flex-col gap-8 rounded-md bg-background p-8 shadow-xl">
      <h1 className="text-center text-4xl font-bold">Sign in with</h1>

      <div className="flex flex-col gap-[inherit]">
        {providers.map((provider) => {
          return (
            <AppLoginProviderButton
              key={provider.id}
              csrfToken={csrfToken}
              provider={provider}
              redirectTo="/home"
            />
          );
        })}
      </div>
    </section>
  );
}
