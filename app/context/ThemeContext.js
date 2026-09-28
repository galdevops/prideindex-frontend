"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { THEME_STORAGE_KEY, THEME_CHOICES } from "../lib/theme";

const ThemeContext = createContext(null);

const readStoredTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_CHOICES.includes(stored) ? stored : "system";
  } catch {
    return "system";
  }
};

// The one place data-theme is written after first paint. The inline script in
// layout.js does the same resolution before hydration to avoid a flash.
// Returns the resolved "light" | "dark".
const applyTheme = (theme) => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved =
    theme === "system" ? (prefersDark ? "dark" : "light") : theme;
  document.documentElement.dataset.theme = resolved;
  return resolved;
};

export const ThemeProvider = ({ children }) => {
  // "system" on the server and first client render so hydration matches;
  // the saved choice is read right after mount.
  const [theme, setThemeState] = useState("system");
  const [hydrated, setHydrated] = useState(false);
  // "light" | "dark" once known, null before. Consumers that need the
  // resolved value (e.g. the map style) must ignore null.
  const [resolvedTheme, setResolvedTheme] = useState(null);

  useEffect(() => {
    setThemeState(readStoredTheme());
    setHydrated(true);
  }, []);

  useEffect(() => {
    // Wait for the saved choice so "system" is not applied first and then
    // corrected, which would briefly show the wrong theme.
    if (!hydrated) return;

    setResolvedTheme(applyTheme(theme));
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setResolvedTheme(applyTheme("system"));
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme, hydrated]);

  const setTheme = useCallback((next) => {
    if (!THEME_CHOICES.includes(next)) return;
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked (private mode): the choice still applies this visit.
    }
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};
