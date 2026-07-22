"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BRAND_NAME } from "@hypelive/domain";
import { loginSchema } from "@hypelive/validation";
import { logger } from "@hypelive/analytics";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { useAppRouter } from "@/lib/use-app-router";

function LoginForm() {
  const { push } = useAppRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/home";
  const { signInWithPassword, demoMode, enterDemoSession, configured } =
    useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0] ?? "form");
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    if (!configured) {
      setFormError(
        "Supabase no está configurado. Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY, o continúa en modo demo.",
      );
      return;
    }

    setLoading(true);
    try {
      await signInWithPassword(parsed.data.email, parsed.data.password);
      toast("Sesión iniciada", { tone: "success" });
      push(next);
    } catch (error) {
      logger.warn("Login failed", error);
      setFormError(
        error instanceof Error ? error.message : "No se pudo iniciar sesión",
      );
      setLoading(false);
    }
  }

  return (
    <>
      {demoMode ? (
        <div
          className="mt-6 rounded border border-border bg-slate px-4 py-3 text-sm text-text-secondary"
          role="status"
        >
          <p className="font-medium text-text-primary">Continuar sin cuenta</p>
          <p className="mt-1 text-text-muted">
            Podés explorar el contenido ahora. La autenticación completa requiere
            configurar Supabase.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                enterDemoSession();
                push("/home");
              }}
            >
              Continuar al inicio
            </Button>
            <Link
              href="/home"
              className="inline-flex h-8 items-center px-3 text-sm text-text-secondary underline-offset-2 hover:underline"
            >
              Solo explorar
            </Link>
          </div>
        </div>
      ) : null}

      <form
        onSubmit={(e) => void onSubmit(e)}
        className="mt-8 space-y-4"
        noValidate
      >
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={loading}
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={loading}
        />
        {formError ? (
          <p className="text-sm text-danger" role="alert">
            {formError}
          </p>
        ) : null}
        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={demoMode}
        >
          Iniciar sesión
        </Button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-ink">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-4 py-14 sm:px-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text-primary">
          Entrar a {BRAND_NAME}
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Usá tu cuenta para seguir canales y abrir Studio.
        </p>
        <Suspense
          fallback={
            <p className="mt-8 text-sm text-text-muted">Cargando…</p>
          }
        >
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-text-muted">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="text-accent-soft hover:underline">
            Registrate
          </Link>
        </p>
      </main>
    </div>
  );
}
