"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";

type ThemeAttribute = "class" | "data-theme";

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "dark" | "light" | "system";
  attribute?: ThemeAttribute;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
}

export interface ThemeContextValue {
  theme: string;
  setTheme: (theme: string) => void;
  systemTheme?: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  attribute = "class",
  enableSystem = false,
  disableTransitionOnChange = true,
  storageKey = "theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) return saved;
      } catch {
        // ignore localStorage failure in private modes
      }
    }
    return defaultTheme;
  });

  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystem = () => setSystemTheme(media.matches ? "dark" : "light");
    updateSystem();
    media.addEventListener?.("change", updateSystem);
    return () => media.removeEventListener?.("change", updateSystem);
  }, []);

  const effectiveTheme = useMemo(() => {
    if (enableSystem && theme === "system") {
      return systemTheme;
    }
    return theme;
  }, [theme, systemTheme, enableSystem]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const d = document.documentElement;

    if (disableTransitionOnChange) {
      d.classList.add("disable-transitions");
    }

    if (attribute === "class") {
      d.classList.remove("light", "dark");
      d.classList.add(effectiveTheme);
    } else {
      d.setAttribute(attribute, effectiveTheme);
    }

    if (disableTransitionOnChange) {
      const timeout = window.setTimeout(() => {
        d.classList.remove("disable-transitions");
      }, 0);
      return () => window.clearTimeout(timeout);
    }
  }, [effectiveTheme, attribute, disableTransitionOnChange]);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch {
      // ignore
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
