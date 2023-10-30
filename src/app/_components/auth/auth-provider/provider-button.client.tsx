"use client";

import { useRouter } from "next/navigation";
import { type FC } from "react";
import { Button, type ButtonProps } from "react-aria-components";

import { type Provider } from "~/lib/server/api/auth/providers";
import { api } from "~/lib/trpc/react";
import { type ClassName, cn } from "~/lib/util/class";

import { ProviderIcon } from "./provider-icon";

type AppLoginButtonBaseProps = ButtonProps & {
  className?: ClassName;
};

export const AppLoginButtonBase: FC<AppLoginButtonBaseProps> = (props) => {
  return (
    <Button
      type="button"
      {...props}
      className={cn(
        "flex w-full items-center gap-8 rounded-full border-2 border-background bg-off-text p-4 text-lg font-bold text-background hover:border-text hover:bg-text disabled:border-background disabled:bg-neutral-300 disabled:text-neutral-600",
        props.className,
      )}
    />
  );
};

export const AppDisconnectProviderButton: FC<
  AppLoginButtonBaseProps & {
    provider: Provider;
  }
> = (props) => {
  const router = useRouter();
  const disconnectMutation = api.auth.providers.disconnect.useMutation({
    onSuccess() {
      router.refresh();
    },
  });

  const disabled = Boolean(props.isDisabled) || disconnectMutation.isLoading;

  return (
    <AppLoginButtonBase
      {...props}
      isDisabled={disabled}
      onPress={() => {
        if (!confirm(`Odspoji ${props.provider.name} od računa?`)) {
          return;
        }

        disconnectMutation.mutate({
          providerId: props.provider.id,
        });
      }}
    >
      <ProviderIcon className="scale-150" providerId={props.provider.id} />
      <span className="ml-auto">Odspoji {props.provider.name}</span>
    </AppLoginButtonBase>
  );
};
