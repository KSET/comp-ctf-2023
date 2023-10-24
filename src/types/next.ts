import { type ReactNode } from "react";

export type NextAppPageProps<
  TParams extends Record<string, string | string[]> = Record<string, never>,
> = {
  params: TParams;
  searchParams: Record<string, string | string[] | undefined>;
};

export type NextAppLayoutProps<
  TParams extends Record<string, string | string[]> = Record<string, never>,
  TParallelPages extends Record<string, NextAppPageProps> = Record<
    string,
    never
  >,
> = TParallelPages & {
  params: TParams;
  children: ReactNode;
};
