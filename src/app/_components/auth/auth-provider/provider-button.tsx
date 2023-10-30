import { type FC } from "react";

import { env } from "~/env.mjs";
import { type Provider } from "~/lib/server/api/auth/providers";
import { getCurrentPath } from "~/lib/server/pathHack";

import { ProviderIcon } from "./provider-icon";

export const AppLoginProviderButton: FC<{
  provider: Provider;
  csrfToken: string;
  className?: string;
  disabled?: boolean;
  redirectTo?: `/${string}`;
}> = (props) => {
  const baseUrl = env.APP_PUBLIC_URL.replace(/\/*$/, "");
  const currentPath = getCurrentPath();

  let url = "";
  if (props.redirectTo) {
    url = `${baseUrl}${props.redirectTo}`;
  } else {
    url = `${baseUrl}${currentPath}`;
  }

  const disabled = Boolean(props.disabled);

  return (
    <form
      key={props.provider.id}
      action={props.provider.signinUrl}
      className={`flex flex-col gap-4 text-center ${props.className ?? ""}`}
      method="POST"
    >
      <input name="callbackUrl" type="hidden" value={url} />
      <input name="csrfToken" type="hidden" value={props.csrfToken} />
      <button
        className="flex items-center gap-8 rounded-full border-2 border-background bg-off-text p-4 text-lg font-bold text-background transition hover:border-text hover:bg-text hover:transition-none"
        disabled={disabled}
        type="submit"
      >
        <ProviderIcon className="scale-150" providerId={props.provider.id} />
        <span className="ml-auto">{props.provider.name}</span>
      </button>
    </form>
  );
};
