import { notFound } from "next/navigation";

import { hasRole } from "~/lib/auth/role";
import { BASE_METADATA } from "~/lib/page/metadata";
import { getServerAuthSession } from "~/server/auth";
import { type NextAppLayoutProps } from "~/types/next";

export const metadata = {
  ...BASE_METADATA,
  title: {
    template: "Admin",
    default: "Admin",
  },
};

export default async function LayoutDefaultAuth({
  children,
}: NextAppLayoutProps) {
  const session = await getServerAuthSession();

  if (!session || !hasRole(session.user, "admin")) {
    notFound();
    return null;
  }

  return <>{children}</>;
}
