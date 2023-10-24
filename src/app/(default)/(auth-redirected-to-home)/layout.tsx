import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { type NextAppLayoutProps } from "~/types/next";

export default async function LayoutDefaultAuth({
  children,
}: NextAppLayoutProps) {
  const auth = await getServerAuthSession();

  if (auth) {
    redirect("/home");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-primary transition-colors">
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
