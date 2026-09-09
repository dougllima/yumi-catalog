import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAdminSession } from "@/hooks/useAdminSession";

type AdminRouteProps = {
  children: ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  const { session, loading } = useAdminSession();
  const location = useLocation();

  if (loading) {
    return (
      <main className="mx-auto grid min-h-[48vh] w-full max-w-[1360px] place-items-center px-4 py-10 sm:px-7">
        <section className="rounded-[1.5rem] border bg-card/72 p-7 text-center shadow-xl shadow-primary/8 backdrop-blur">
          <h1 className="font-display text-3xl font-semibold">
            Verificando acesso
          </h1>
          <p className="mt-2 text-muted-foreground">
            Estamos validando sua sessão administrativa.
          </p>
        </section>
      </main>
    );
  }

  if (!session) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
