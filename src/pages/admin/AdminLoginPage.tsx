import { LockKeyhole, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { authService, runtimeBackend } from "@/application/dependencies";
import { Button } from "@/components/ui/button";
import { useAdminSession } from "@/hooks/useAdminSession";

export function AdminLoginPage() {
  const { session, loading } = useAdminSession();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "string"
      ? location.state.from
      : "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && session) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await authService.signIn(email, password);
      navigate(redirectTo, { replace: true });
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Não foi possível entrar.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto grid min-h-[58vh] w-full max-w-[1360px] place-items-center px-4 py-10 sm:px-7">
      <section className="grid w-full max-w-md gap-6 rounded-[1.75rem] border bg-card/72 p-6 shadow-2xl shadow-primary/10 backdrop-blur sm:p-8">
        <div className="grid gap-3 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-primary">
            <LockKeyhole aria-hidden="true" />
          </div>
          <div className="grid gap-2">
            <p className="flex items-center justify-center gap-2 text-sm font-extrabold text-primary">
              <Sparkles className="size-4" aria-hidden="true" />
              Área interna
            </p>
            <h1 className="font-display text-3xl font-semibold">
              Entrar no admin
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Use uma conta criada manualmente no serviço de autenticação.
            </p>
          </div>
        </div>

        {runtimeBackend !== "supabase" && (
          <p className="rounded-2xl border bg-muted/70 px-4 py-3 text-sm font-semibold text-muted-foreground">
            O admin precisa do Supabase configurado para autenticar e salvar
            produtos.
          </p>
        )}

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-extrabold">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="h-11 rounded-full border bg-background/70 px-4 font-semibold outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </label>

          <label className="grid gap-2 text-sm font-extrabold">
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="h-11 rounded-full border bg-background/70 px-4 font-semibold outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </label>

          {error && (
            <p className="rounded-2xl border bg-card/70 px-4 py-3 text-sm font-semibold text-destructive shadow-sm">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="h-11 rounded-full"
            disabled={submitting}
          >
            {submitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </section>
    </main>
  );
}
