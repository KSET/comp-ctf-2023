"use client";

import { useRouter } from "next/navigation";
import { type FC } from "react";

import { type Provider } from "~/lib/server/api/auth/providers";
import { api } from "~/lib/trpc/react";

import { ProviderIcon } from "./provider-icon";

export const AppDisconnectProviderButton: FC<{
  provider: Provider;
  className?: string;
  disabled?: boolean;
}> = (props) => {
  const router = useRouter();
  const disconnectMutation = api.auth.providers.disconnect.useMutation({
    onSuccess() {
      router.refresh();
    },
  });

  const disabled = Boolean(props.disabled) || disconnectMutation.isLoading;

  return (
    <button
      className="flex w-full items-center justify-end gap-8 rounded-full border-2 border-background bg-off-text p-4 text-lg font-bold text-background transition hover:border-text hover:bg-text hover:transition-none disabled:border-background disabled:bg-neutral-300 disabled:text-neutral-600"
      disabled={disabled}
      type="button"
      onClick={(e) => {
        e.preventDefault();

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
    </button>
  );
};
