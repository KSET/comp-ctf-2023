/* eslint-disable camelcase */
import { Epilogue, Space_Mono } from "next/font/google";

export const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin-ext"],
  weight: ["400", "700"],
  preload: true,
  display: "swap",
});

export const epilogue = Epilogue({
  variable: "--font-sans",
  subsets: ["latin-ext"],
});
