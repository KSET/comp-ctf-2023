import { type FC } from "react";
import { type IconBaseProps, type IconType } from "react-icons";
import { FcGoogle as IconGoogle } from "react-icons/fc";
import {
  SiDiscord as IconDiscord,
  SiGithub as IconGithub,
} from "react-icons/si";

import { type Provider } from "~/lib/server/api/auth/providers";

const idToIcon: Record<string, IconType> = {
  google: IconGoogle,
  discord: IconDiscord,
  github: IconGithub,
};

export const providerIcon = <TWithFallback extends boolean = true>(
  providerId: Provider["id"],
  withFallback: TWithFallback = true as TWithFallback,
) => {
  const Icon = idToIcon[providerId];

  if (Icon) {
    return Icon;
  }

  type TRet = TWithFallback extends true ? () => null : null;

  if (withFallback) {
    return (() => null) as TRet;
  }

  return null as TRet;
};

export const ProviderIcon: FC<
  IconBaseProps & {
    providerId: Provider["id"];
  }
> = ({ providerId, ...props }) => {
  const Icon = providerIcon(providerId);

  return <Icon {...props} />;
};
