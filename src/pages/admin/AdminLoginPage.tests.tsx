import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { authService } from "@/application/dependencies";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";

vi.mock("@/application/dependencies", () => ({
  authService: {
    signIn: vi.fn(),
  },
  runtimeBackend: "supabase",
}));

vi.mock("@/hooks/useAdminSession", () => ({
  useAdminSession: vi.fn(),
}));

const mockedAuthService = vi.mocked(authService);
const mockedUseAdminSession = vi.mocked(useAdminSession);

const renderLoginPage = () =>
  render(
    <MemoryRouter initialEntries={["/admin/login"]}>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<h1>Area admin</h1>} />
      </Routes>
    </MemoryRouter>,
  );

describe("AdminLoginPage", () => {
  beforeEach(() => {
    mockedAuthService.signIn.mockReset();
    mockedUseAdminSession.mockReturnValue({
      session: null,
      loading: false,
    });
  });

  it("signs in with email and password and navigates to admin", async () => {
    const user = userEvent.setup();
    mockedAuthService.signIn.mockResolvedValueOnce({
      id: "admin-1",
      email: "admin@yumi.test",
    });

    renderLoginPage();

    await user.type(screen.getByTestId("admin-login-email"), "admin@yumi.test");
    await user.type(screen.getByTestId("admin-login-password"), "secret");
    await user.click(screen.getByTestId("admin-login-submit"));

    expect(mockedAuthService.signIn).toHaveBeenCalledWith(
      "admin@yumi.test",
      "secret",
    );
    expect(await screen.findByText("Area admin")).toBeInTheDocument();
  });

  it("shows authentication errors", async () => {
    const user = userEvent.setup();
    mockedAuthService.signIn.mockRejectedValueOnce(
      new Error("Credenciais invalidas."),
    );

    renderLoginPage();

    await user.type(screen.getByTestId("admin-login-email"), "admin@yumi.test");
    await user.type(screen.getByTestId("admin-login-password"), "wrong");
    await user.click(screen.getByTestId("admin-login-submit"));

    expect(
      await screen.findByText("Credenciais invalidas."),
    ).toBeInTheDocument();
  });
});
