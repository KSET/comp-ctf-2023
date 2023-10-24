"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { type FC } from "react";

export const ButtonLogout: FC = () => {
  return (
    <Link
      className="bg-surface0 hover:bg-surface1 rounded-full px-10 py-3 font-semibold no-underline transition"
      href="/api/auth/signout"
      onClick={(e) => {
        e.preventDefault();
        void signOut();
      }}
    >
      Sign out
    </Link>
  );
};
