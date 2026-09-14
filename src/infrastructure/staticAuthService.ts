import type {
  AdminSession,
  AuthService,
  AuthStateUnsubscribe,
} from "@/application/contracts";

export class StaticAuthService implements AuthService {
  async getCurrentAdmin(): Promise<AdminSession | null> {
    return null;
  }

  async signIn(): Promise<AdminSession> {
    throw new Error(
      "Admin indisponível: configure o Supabase para habilitar autenticação.",
    );
  }

  async signOut(): Promise<void> {
    return;
  }

  onAuthStateChange(
    callback: (session: AdminSession | null) => void,
  ): AuthStateUnsubscribe {
    void callback;
    return () => undefined;
  }
}
