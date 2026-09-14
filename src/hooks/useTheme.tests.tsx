import { renderHook } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it } from "vitest";

import { useTheme } from "@/hooks/useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.document.documentElement.className = "";
    window.document.documentElement.style.colorScheme = "";
  });

  it("starts in dark mode by default and applies it to the document", () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    expect(window.document.documentElement).toHaveClass("dark");
    expect(window.document.documentElement.style.colorScheme).toBe("dark");
    expect(window.localStorage.getItem("yumi-theme")).toBe("dark");
  });

  it("uses a stored theme and toggles it", () => {
    window.localStorage.setItem("yumi-theme", "light");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
    expect(window.document.documentElement).not.toHaveClass("dark");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
    expect(window.document.documentElement).toHaveClass("dark");
    expect(window.localStorage.getItem("yumi-theme")).toBe("dark");
  });
});
