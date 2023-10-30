"use client";

import { useRouter } from "next/navigation";
import { type FC, type PropsWithChildren } from "react";
import { RouterProvider } from "react-aria-components";

export const ClientProviders: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const navigateFn = router.push as unknown as (url: string) => void;

  return <RouterProvider navigate={navigateFn}>{children}</RouterProvider>;
};
