import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "yumi-theme";

const getInitialTheme = (): Theme => {
  try {
    const storedTheme = window.localStorage.getItem(storageKey);

    return storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : "dark";
  } catch {
    return "dark";
  }
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // Theme still applies even if persistence is unavailable.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  return { theme, toggleTheme };
}
