"use client";

import { Menu, Transition } from "@headlessui/react";
import { type FC, Fragment, type ReactElement, type ReactNode } from "react";

import { cn } from "~/lib/util/class";

export type AppMenuItem =
  | ((props: {
      active: boolean;
      disabled: boolean;
      close: () => void;
    }) => ReactElement)
  | ReactElement;

export type AppMenuItems = AppMenuItem[] | AppMenuItem[][];

export type AppMenuProps = {
  trigger: ReactNode;
  items?: AppMenuItems;
};

export const AppMenu: FC<
  AppMenuProps & {
    className?: string;
  }
> = (props) => {
  const isNested = Array.isArray(props.items?.[0]);
  const items = (
    (isNested ? props.items : [props.items]) as AppMenuItem[][]
  ).filter((group) => group.length > 0);

  return (
    <Menu
      as="div"
      className={cn("relative inline-block text-left", props.className)}
    >
      <Menu.Button as="div">{props.trigger}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-1 w-56 origin-top-right rounded-md border-off-text bg-off-text text-background shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="divide-y divide-background">
            {items.map((group, groupIndex) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div key={groupIndex} className="p-1 text-right">
                  {group.map((item, itemIndex) => {
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <Menu.Item key={`${groupIndex}-${itemIndex}`}>
                        {item}
                      </Menu.Item>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="absolute right-2 top-0 h-0 w-0 -translate-y-full border-4 border-t-0 border-transparent border-b-inherit content-['_']" />
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
