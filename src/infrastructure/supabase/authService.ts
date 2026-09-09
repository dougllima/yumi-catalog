import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  AdminSession,
  AuthService,
  AuthStateUnsubscribe,
} from "@/application/contracts";

export class SupabaseAuthService implements AuthService {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async getCurrentAdmin(): Promise<AdminSession | null> {
    const {
      data: { session },
      error,
    } = await this.client.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    if (!session?.user) {
      return null;
    }

    const { data, error: adminError } = await this.client
      .from("admin_users")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle<{ user_id: string }>();

    if (adminError) {
      throw new Error(adminError.message);
    }

    if (!data) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
    };
  }

  async signIn(email: string, password: string): Promise<AdminSession> {
    const { error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    const admin = await this.getCurrentAdmin();

    if (!admin) {
      await this.signOut();
      throw new Error("Usuário autenticado não possui acesso administrativo.");
    }

    return admin;
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  }

  onAuthStateChange(
    callback: (session: AdminSession | null) => void,
  ): AuthStateUnsubscribe {
    const {
      data: { subscription },
    } = this.client.auth.onAuthStateChange(() => {
      void this.getCurrentAdmin()
        .then(callback)
        .catch(() => callback(null));
    });

    return () => subscription.unsubscribe();
  }
}
