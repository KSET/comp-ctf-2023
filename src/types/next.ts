import { type ReactNode } from "react";

export type NextAppPageProps<
  TParams extends Record<string, string | string[]> = Record<string, never>,
> = {
  params: TParams;
  searchParams: Record<string, string | string[] | undefined>;
};

export type NextAppLayoutProps<
  TParams extends Record<string, string | string[]> = Record<string, never>,
  TParallelPages extends string[] = [],
> = Record<TParallelPages[number], ReactNode> & {
  params: TParams;
  children: ReactNode;
};

export type NextAppRouteContext<
  TParams extends Record<string, string | string[]> = Record<string, never>,
> = {
  params: TParams;
};
