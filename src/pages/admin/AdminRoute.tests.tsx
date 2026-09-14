import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminRoute } from "@/pages/admin/AdminRoute";

vi.mock("@/hooks/useAdminSession", () => ({
  useAdminSession: vi.fn(),
}));

const mockedUseAdminSession = vi.mocked(useAdminSession);

const renderAdminRoute = () =>
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <h1>Produtos da Yumi Studio</h1>
            </AdminRoute>
          }
        />
        <Route path="/admin/login" element={<h1>Entrar no admin</h1>} />
      </Routes>
    </MemoryRouter>,
  );

describe("AdminRoute", () => {
  beforeEach(() => {
    mockedUseAdminSession.mockReset();
  });

  it("shows a loading state while the session is being checked", () => {
    mockedUseAdminSession.mockReturnValue({
      session: null,
      loading: true,
    });

    renderAdminRoute();

    expect(screen.getByText("Verificando acesso")).toBeInTheDocument();
  });

  it("redirects anonymous users to login", () => {
    mockedUseAdminSession.mockReturnValue({
      session: null,
      loading: false,
    });

    renderAdminRoute();

    expect(screen.getByText("Entrar no admin")).toBeInTheDocument();
  });

  it("renders children for authenticated admins", () => {
    mockedUseAdminSession.mockReturnValue({
      session: { id: "admin-1" },
      loading: false,
    });

    renderAdminRoute();

    expect(screen.getByText("Produtos da Yumi Studio")).toBeInTheDocument();
  });
});
