import Link from "next/link";
import { redirect } from "next/navigation";

import { UserDropdown } from "~/app/_components/auth/user-dropdown";
import { Logo } from "~/assets/images/logo";
import { getServerAuthSession } from "~/server/auth";
import { type NextAppLayoutProps } from "~/types/next";

export default async function LayoutDefaultAuth({
  children,
}: NextAppLayoutProps) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col transition-colors">
      <header className="bg-primary py-2 text-text">
        <div className="container flex items-center gap-4">
          <Link
            className="text-3xl font-bold text-off-text hover:text-text"
            href="/home"
          >
            <Logo
              className="h-8 w-auto translate-y-0.5 text-inherit"
              weight="normal"
            />
          </Link>

          <div className="ml-auto flex items-center">
            <UserDropdown user={session.user} />
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col text-off-text">{children}</main>
    </div>
  );
}
