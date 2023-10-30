"use client";

import { type Session } from "next-auth";
import { type FC, useMemo } from "react";

import { AppMenu, type AppMenuItems } from "~/app/_components/base/menu";
import { hasRole } from "~/lib/auth/role";

export const UserDropdown: FC<{
  user: Session["user"];
}> = ({ user }) => {
  const isAdmin = hasRole(user, "admin");

  const items = useMemo(() => {
    return [
      isAdmin && [
        {
          href: "/admin",
          children: "Admin panel",
        },
      ],
      [
        {
          href: "/settings",
          children: "Postavke",
        },
      ],
      [
        {
          href: "/api/auth/signout",
          children: "Odjavi se",
        },
      ],
    ] satisfies AppMenuItems;
  }, [isAdmin]);

  const userImage = user.image ?? null;
  const userName = user.name ?? user.email ?? "Nepoznati korisnik";

  return (
    <AppMenu
      items={items}
      label="Korisnički meni"
      trigger={
        <div className="flex items-center gap-2 text-off-text hover:text-text">
          {userImage ? (
            <img
              alt="Profilna slika"
              className="aspect-square h-auto w-8 rounded-full"
              src={userImage}
            />
          ) : null}
          {userName}
        </div>
      }
    />
  );
};
