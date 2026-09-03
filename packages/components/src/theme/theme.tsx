"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

type ThemeAttribute = "class" | "data-theme";

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "dark" | "light" | "system";
  attribute?: ThemeAttribute;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  attribute = "class",
  enableSystem = false,
  disableTransitionOnChange = true,
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      {children}
    </NextThemesProvider>
  );
}
