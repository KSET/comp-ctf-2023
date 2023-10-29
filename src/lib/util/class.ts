import { type Falsy } from "~/types/util";

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export const cn = (...classes: (string | Falsy)[]) =>
  classes.filter(Boolean).join(" ");
