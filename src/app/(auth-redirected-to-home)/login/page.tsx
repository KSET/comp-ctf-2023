import { type IconType } from "react-icons";
import { FcGoogle as IconGoogle } from "react-icons/fc";
import {
  SiDiscord as IconDiscord,
  SiGithub as IconGithub,
} from "react-icons/si";

import { $metadata } from "~/lib/page/metadata";
import { api } from "~/lib/trpc/server";

const idToIcon: Record<string, IconType> = {
  google: IconGoogle,
  discord: IconDiscord,
  github: IconGithub,
};

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
          const Icon = idToIcon[provider.id] ?? (() => null);

          return (
            <form
              key={provider.id}
              action={provider.signinUrl}
              className="flex flex-col gap-4 text-center"
              method="POST"
            >
              <input
                name="callbackUrl"
                type="hidden"
                value="https://comp-ctf.saturn.ji0.li/home"
              />
              <input name="csrfToken" type="hidden" value={csrfToken} />
              <button
                className="flex items-center gap-8 rounded-full border-2 border-background bg-off-text p-4 text-lg font-bold text-background transition hover:border-text hover:bg-text hover:transition-none"
                type="submit"
              >
                <Icon className="scale-150" />
                <span className="ml-auto">{provider.name}</span>
              </button>
            </form>
          );
        })}
      </div>
    </section>
  );
}
