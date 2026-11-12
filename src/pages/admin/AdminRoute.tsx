import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { PageContainer } from "@/components/PageContainer";
import { StatePanel } from "@/components/StatePanel";
import { useAdminSession } from "@/hooks/useAdminSession";

type AdminRouteProps = {
  children: ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  const { session, loading } = useAdminSession();
  const location = useLocation();

  if (loading) {
    return (
      <PageContainer centered>
        <StatePanel
          as="section"
          headingAs="h1"
          icon={ShieldCheck}
          title="Verificando acesso"
          description="Estamos validando sua sessão administrativa."
        />
      </PageContainer>
    );
  }

  if (!session) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }

  return children;
}
