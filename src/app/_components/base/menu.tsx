"use client";

import { intersperse } from "rambdax";
import { type FC, type ReactNode, useMemo } from "react";
import {
  Button,
  Item,
  type ItemProps,
  Menu,
  MenuTrigger,
  OverlayArrow,
  Popover,
  Separator,
} from "react-aria-components";

import { cn } from "~/lib/util/class";
import { type Falsy } from "~/types/util";

import $style from "./menu.module.scss";

export type AppMenuItem =
  | ItemProps
  //
  | Falsy;

export type AppMenuItems = AppMenuItem[] | (AppMenuItem[] | Falsy)[];

export type AppMenuProps = {
  label: string;
  trigger: ReactNode;
  items?: AppMenuItems;
};

export const AppMenu: FC<
  AppMenuProps & {
    className?: string;
  }
> = (props) => {
  const topFiltered = useMemo(() => {
    return props.items?.filter(Boolean) ?? [];
  }, [props.items]);
  const isNested = Array.isArray(topFiltered[0]);
  const items = useMemo(() => {
    const nestedItems = (
      isNested ? topFiltered : [topFiltered]
    ) as AppMenuItem[][];

    const filtered = nestedItems
      .map((group) => group.filter(Boolean))
      .filter((group) => group.filter(Boolean).length > 0);

    return intersperse([null], filtered as (ItemProps | null)[][]).flat();
  }, [isNested, topFiltered]);

  return (
    <MenuTrigger>
      <Button aria-label="Korisnički meni" className="flex items-center">
        {props.trigger}
      </Button>

      <Popover className={$style.popover}>
        <OverlayArrow>
          <svg height={12} viewBox="0 0 12 12" width={12}>
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>

        <Menu
          className={cn(
            "w-56 rounded-md border-off-text bg-off-text p-2 text-background shadow-lg",
            props.className,
          )}
        >
          {items.map((props, i) => {
            const id = `item-${i}`;

            if (!props) {
              return (
                <Separator
                  key={id}
                  className="mx-1 my-0.5 h-px bg-background"
                />
              );
            }

            return (
              <Item
                key={id}
                className="group flex w-full items-center justify-end rounded-md p-2 text-sm text-background hover:bg-primary hover:text-off-text"
                {...props}
              />
            );
          })}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
};
