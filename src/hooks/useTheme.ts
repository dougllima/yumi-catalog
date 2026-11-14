import { useEffect, useState } from "react";

type Theme = "light" | "dark";

// Only an explicit choice made with the toggle is stored. Without it, the
// theme follows the device preference, falling back to light.
// Keep in sync with the inline script in index.html.
const storageKey = "yumi-theme-choice";
const darkSchemeQuery = "(prefers-color-scheme: dark)";

const getStoredTheme = (): Theme | null => {
  try {
    const storedTheme = window.localStorage.getItem(storageKey);

    return storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : null;
  } catch {
    return null;
  }
};

const getDarkSchemeMedia = (): MediaQueryList | null => {
  try {
    return typeof window.matchMedia === "function"
      ? window.matchMedia(darkSchemeQuery)
      : null;
  } catch {
    return null;
  }
};

const getSystemTheme = (): Theme =>
  getDarkSchemeMedia()?.matches ? "dark" : "light";

export function useTheme() {
  const [hasChoice, setHasChoice] = useState(() => getStoredTheme() !== null);
  const [theme, setTheme] = useState<Theme>(
    () => getStoredTheme() ?? getSystemTheme(),
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    if (hasChoice) return;

    const media = getDarkSchemeMedia();
    if (!media) return;

    const handleChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [hasChoice]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    setHasChoice(true);
    try {
      window.localStorage.setItem(storageKey, nextTheme);
    } catch {
      // Theme still applies even if persistence is unavailable.
    }
  };

  return { theme, toggleTheme };
}
