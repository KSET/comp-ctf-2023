import { headers } from "next/headers";
import { type FC, type PropsWithChildren } from "react";

import { TRPCReactProvider } from "~/lib/trpc/react";

import { ClientProviders } from "./providers.client";

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <TRPCReactProvider headers={headers()}>
      <ClientProviders>{children}</ClientProviders>
    </TRPCReactProvider>
  );
};
