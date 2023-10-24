"use client";

import {
  createTheme,
  type DefaultMantineColor,
  type MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { type FC, type PropsWithChildren } from "react";
import { black, offWhite } from "tailwind.config";

import { spaceMono } from "~/assets/font";

type ExtendedCustomColors = "primary" | DefaultMantineColor;

declare module "@mantine/core" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
}

export const theme = createTheme({
  white: offWhite,
  black,
  fontFamily: spaceMono.style.fontFamily,
  fontFamilyMonospace: spaceMono.style.fontFamily,
  headings: {
    fontFamily: spaceMono.style.fontFamily,
  },
  respectReducedMotion: true,
  primaryColor: "primary",
  primaryShade: 9,
  colors: {
    primary: [
      "#eddfe9",
      "#dcbcd3",
      "#cc95bd",
      "#be75ab",
      "#b5619f",
      "#b2569a",
      "#9c4786",
      "#8b3e77",
      "#7b3368",
      "#5e2750",
    ],
  },
});

export const ProvidersClient: FC<PropsWithChildren> = ({ children }) => {
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <Notifications />
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
};
