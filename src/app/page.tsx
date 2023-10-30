import Link from "next/link";

import { Logo } from "~/assets/images/logo";

export default function Home() {
  return (
    <main className="my-auto flex min-h-screen flex-col items-center justify-center gap-4 bg-primary px-8 py-16 text-4xl">
      <Logo className="h-36 w-auto" color="white" weight="bold" />
      <div>
        <p className="text-center">CTF Računarske sekcije KSET-a</p>
        <p className="mt-8 flex flex-col items-center justify-center gap-[2ch] text-center md:flex-row">
          <Link
            className="rounded-md bg-background p-4 font-bold text-off-text hover:text-text"
            href="/home"
          >
            Započni
          </Link>
          <span className="text-2xl">ili</span>
          <Link
            className="rounded-md border border-current p-4 font-bold text-off-text hover:text-text"
            href="/about"
          >
            Saznaj više
          </Link>
        </p>
      </div>
    </main>
  );
}
