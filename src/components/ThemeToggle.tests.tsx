import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  it("announces the next theme and calls the toggle handler", async () => {
    const user = userEvent.setup();
    const onToggleTheme = vi.fn();

    render(<ThemeToggle theme="dark" onToggleTheme={onToggleTheme} />);

    await user.click(screen.getByRole("button", { name: "Ativar tema claro" }));

    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("announces dark mode when the current theme is light", () => {
    render(<ThemeToggle theme="light" onToggleTheme={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Ativar tema escuro" }),
    ).toBeInTheDocument();
  });
});
