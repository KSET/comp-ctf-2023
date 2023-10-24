import { headers } from "next/headers";
import { type FC, type PropsWithChildren } from "react";

import { TRPCReactProvider } from "~/trpc/react";

import { ProvidersClient } from "./providers.client";

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <TRPCReactProvider headers={headers()}>
      <ProvidersClient>{children}</ProvidersClient>
    </TRPCReactProvider>
  );
};
