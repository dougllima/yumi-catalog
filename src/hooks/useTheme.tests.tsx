import { renderHook } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useTheme } from "@/hooks/useTheme";

const storageKey = "yumi-theme-choice";

type ChangeListener = (event: MediaQueryListEvent) => void;

const mockSystemScheme = (prefersDark: boolean) => {
  const listeners = new Set<ChangeListener>();
  const media = {
    matches: prefersDark,
    media: "(prefers-color-scheme: dark)",
    addEventListener: (_type: string, listener: ChangeListener) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: ChangeListener) => {
      listeners.delete(listener);
    },
  };

  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => media),
  );

  return {
    change: (nextPrefersDark: boolean) => {
      media.matches = nextPrefersDark;
      listeners.forEach((listener) =>
        listener({ matches: nextPrefersDark } as MediaQueryListEvent),
      );
    },
  };
};

describe("useTheme", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.document.documentElement.className = "";
    window.document.documentElement.style.colorScheme = "";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("falls back to light when the device preference is unavailable", () => {
    vi.stubGlobal("matchMedia", undefined);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
    expect(window.document.documentElement).not.toHaveClass("dark");
    expect(window.document.documentElement.style.colorScheme).toBe("light");
    expect(window.localStorage.getItem(storageKey)).toBeNull();
  });

  it("follows a dark device preference without storing it", () => {
    mockSystemScheme(true);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    expect(window.document.documentElement).toHaveClass("dark");
    expect(window.localStorage.getItem(storageKey)).toBeNull();
  });

  it("follows device preference changes while no choice was made", () => {
    const system = mockSystemScheme(false);

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");

    act(() => {
      system.change(true);
    });

    expect(result.current.theme).toBe("dark");
    expect(window.document.documentElement).toHaveClass("dark");
  });

  it("stores the toggle choice and stops following the device", () => {
    const system = mockSystemScheme(false);

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
    expect(window.localStorage.getItem(storageKey)).toBe("dark");

    act(() => {
      system.change(false);
    });

    expect(result.current.theme).toBe("dark");
  });

  it("uses a stored choice over the device preference", () => {
    mockSystemScheme(true);
    window.localStorage.setItem(storageKey, "light");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
    expect(window.document.documentElement).not.toHaveClass("dark");
  });

  it("ignores the legacy key that stored the old dark default", () => {
    mockSystemScheme(false);
    window.localStorage.setItem("yumi-theme", "dark");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
  });
});
