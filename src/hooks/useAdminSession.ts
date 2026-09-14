import { useEffect, useState } from "react";

import type { AdminSession } from "@/application/contracts";
import { authService } from "@/application/dependencies";

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    void authService
      .getCurrentAdmin()
      .then((admin) => {
        if (isActive) {
          setSession(admin);
        }
      })
      .catch(() => {
        if (isActive) {
          setSession(null);
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    const unsubscribe = authService.onAuthStateChange((admin) => {
      setSession(admin);
      setLoading(false);
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  return {
    session,
    loading,
  };
}
