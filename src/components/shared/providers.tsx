"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { ColorThemeProvider } from "./color-theme-provider";
import { SmoothScrollProvider } from "./smooth-scroll-provider";

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      <ColorThemeProvider />
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </NextThemesProvider>
  );
}
