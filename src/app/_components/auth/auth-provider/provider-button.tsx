import { type FC } from "react";

import { env } from "~/env.mjs";
import { type Provider } from "~/lib/server/api/auth/providers";
import { getCurrentPath } from "~/lib/server/pathHack";

import { AppLoginButtonBase } from "./provider-button.client";
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
      className="contents"
      method="POST"
    >
      <input name="callbackUrl" type="hidden" value={url} />
      <input name="csrfToken" type="hidden" value={props.csrfToken} />
      <AppLoginButtonBase
        className={props.className}
        isDisabled={disabled}
        type="submit"
      >
        <ProviderIcon className="scale-150" providerId={props.provider.id} />
        <span className="ml-auto">{props.provider.name}</span>
      </AppLoginButtonBase>
    </form>
  );
};
