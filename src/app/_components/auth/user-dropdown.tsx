"use client";

import Link from "next/link";
import { type Session } from "next-auth";
import { type FC, useMemo } from "react";

import { AppMenu, type AppMenuItems } from "~/app/_components/base/menu";

export const UserDropdown: FC<{
  user: Session["user"];
}> = ({ user }) => {
  const items = useMemo(() => {
    return [
      ({ active }) => (
        <Link
          href="/api/auth/signout"
          className={`${
            active ? "bg-primary text-off-text" : "text-background"
          } group flex w-full items-center justify-end rounded-md p-2 text-sm`}
        >
          Odjavi se
        </Link>
      ),
    ] satisfies AppMenuItems;
  }, []);

  const userImage = user.image ?? null;
  const userName = user.name ?? user.email ?? "Nepoznati korisnik";

  return (
    <AppMenu
      items={items}
      trigger={
        <button
          aria-label="User dropdown"
          className="flex items-center gap-2 text-off-text hover:text-text"
          type="button"
        >
          {userImage ? (
            <img
              alt="Profilna slika"
              className="aspect-square h-auto w-8 rounded-full"
              src={userImage}
            />
          ) : null}
          {userName}
        </button>
      }
    />
  );
};
