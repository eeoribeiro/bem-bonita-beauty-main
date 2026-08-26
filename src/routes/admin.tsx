import { createFileRoute } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { AdminPanel } from "@/components/admin/AdminPanel";
import { Botao } from "@/components/site/Botao";
import { getSupabaseClient } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo | Bem Bonita" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  const verify = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    setError("");
    if (!nextSession) {
      setAuthorized(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: accessError } = await getSupabaseClient()
      .from("admin_users")
      .select("user_id")
      .eq("user_id", nextSession.user.id)
      .maybeSingle();
    setAuthorized(Boolean(data) && !accessError);
    if (accessError) setError("Não foi possível verificar o acesso administrativo.");
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseClient();
    void supabase.auth.getSession().then(({ data }) => verify(data.session));
    const { data } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => void verify(nextSession),
    );
    return () => data.subscription.unsubscribe();
  }, [verify]);

  if (loading) return <LoadingScreen />;
  if (!session) return <Login externalError={error} />;
  if (!authorized)
    return <AccessDenied email={session.user.email ?? "usuário conectado"} error={error} />;
  return (
    <AdminPanel
      email={session.user.email ?? "Administrador"}
      onLogout={() => getSupabaseClient().auth.signOut()}
    />
  );
}

function Login({ externalError }: { externalError: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(externalError);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const { error: loginError } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    });
    if (loginError) {
      setError("E-mail ou senha incorretos. Confira os dados e tente novamente.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-blush-soft px-5 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-border/70 bg-card p-7 shadow-soft sm:p-9">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-magenta"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao site
        </a>
        <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-magenta">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <p className="eyebrow mt-6">Área protegida</p>
        <h1 className="mt-3 text-3xl">Painel Bem Bonita</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Entre com o usuário administrador cadastrado no Supabase.
        </p>
        <form onSubmit={login} className="mt-7 space-y-5">
          <label className="block text-sm font-medium">
            E-mail
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="admin-input"
              placeholder="seu@email.com"
            />
          </label>
          <label className="block text-sm font-medium">
            Senha
            <span className="relative mt-2 block">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="admin-input mt-0 pr-12"
                placeholder="Sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>
          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200"
            >
              {error}
            </p>
          ) : null}
          <Botao type="submit" disabled={submitting} className="w-full disabled:opacity-60">
            {submitting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            {submitting ? "Entrando..." : "Entrar no painel"}
          </Botao>
        </form>
      </div>
    </main>
  );
}

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
      <LoaderCircle className="mr-3 h-6 w-6 animate-spin text-magenta" /> Validando acesso...
    </main>
  );
}

function AccessDenied({ email, error }: { email: string; error: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
        <ShieldCheck className="mx-auto h-10 w-10 text-magenta" />
        <h1 className="mt-5 text-3xl">Acesso não autorizado</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          O usuário <strong className="text-foreground">{email}</strong> está autenticado, mas ainda
          não consta na tabela <code>admin_users</code>.
        </p>
        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        <Botao onClick={() => void getSupabaseClient().auth.signOut()} className="mt-6">
          Sair e tentar outra conta
        </Botao>
      </div>
    </main>
  );
}
