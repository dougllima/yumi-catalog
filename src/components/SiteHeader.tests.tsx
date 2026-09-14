import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { SiteHeader } from "@/components/SiteHeader";
import { contactUrl, instagramUrl } from "@/config/contact";

describe("SiteHeader", () => {
  it("renders navigation, external links, and theme control", async () => {
    const user = userEvent.setup();
    const onToggleTheme = vi.fn();

    render(
      <MemoryRouter>
        <SiteHeader theme="dark" onToggleTheme={onToggleTheme} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Yumi Studio" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Produtos" })).toHaveAttribute(
      "href",
      "/produtos",
    );
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      instagramUrl,
    );
    expect(screen.getByRole("link", { name: "Contato" })).toHaveAttribute(
      "href",
      contactUrl,
    );

    await user.click(screen.getByRole("button", { name: "Ativar tema claro" }));

    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });
});
