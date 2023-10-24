import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "~/assets/styles/tailwind.css";
import "~/assets/styles/global.css";

import { epilogue, spaceMono } from "~/assets/font";
import { BASE_METADATA } from "~/lib/page/metadata";

import { Providers } from "./providers";

export const metadata = BASE_METADATA;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hr">
      <body
        className={`bg-black font-mono text-text antialiased ${spaceMono.variable} ${epilogue.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
