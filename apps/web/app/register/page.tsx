"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { BRAND_NAME } from "@hypelive/domain";
import { registerSchema } from "@hypelive/validation";
import { logger } from "@hypelive/analytics";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { useAppRouter } from "@/lib/use-app-router";

function RegisterForm() {
  const { push } = useAppRouter();
  const { signUpWithPassword, demoMode, enterDemoSession, configured } =
    useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
    username: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const parsed = registerSchema.safeParse(form);
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
        "Supabase no está configurado. Agrega las variables de entorno o continúa en modo demo.",
      );
      return;
    }

    setLoading(true);
    try {
      const result = await signUpWithPassword(parsed.data);
      if (result.needsEmailConfirmation) {
        toast("Revisá tu email para confirmar la cuenta", {
          tone: "success",
          description:
            "O desactivá “Confirm email” en Supabase → Authentication → Providers → Email.",
        });
        push("/login");
        return;
      }
      toast("Cuenta creada", { tone: "success" });
      push("/home");
    } catch (error) {
      logger.warn("Register failed", error);
      setFormError(
        error instanceof Error ? error.message : "No se pudo crear la cuenta",
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
            El registro real requiere Supabase. Podés explorar con datos mock.
          </p>
          <Button
            size="sm"
            variant="secondary"
            className="mt-3"
            onClick={() => {
              enterDemoSession();
              push("/home");
            }}
          >
            Continuar al inicio
          </Button>
        </div>
      ) : null}

      <form
        onSubmit={(e) => void onSubmit(e)}
        className="mt-8 space-y-4"
        noValidate
      >
        <Input
          label="Nombre para mostrar"
          name="displayName"
          value={form.displayName}
          onChange={(e) =>
            setForm((f) => ({ ...f, displayName: e.target.value }))
          }
          error={errors.displayName}
          disabled={loading}
        />
        <Input
          label="Usuario"
          name="username"
          value={form.username}
          onChange={(e) =>
            setForm((f) => ({ ...f, username: e.target.value.toLowerCase() }))
          }
          error={errors.username}
          hint="Solo minúsculas, números y guión bajo"
          disabled={loading}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          error={errors.email}
          disabled={loading}
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
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
          disabled={demoMode || loading}
        >
          Crear cuenta
        </Button>
        {demoMode ? (
          <p className="text-center text-xs text-text-muted">
            Modo demo: falta `.env.local` o reiniciá el servidor.
          </p>
        ) : null}
      </form>
    </>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-ink">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-4 py-14 sm:px-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text-primary">
          Unite a {BRAND_NAME}
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Creá tu perfil para seguir canales y continuar viendo.
        </p>
        <Suspense
          fallback={
            <p className="mt-8 text-sm text-text-muted">Cargando…</p>
          }
        >
          <RegisterForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-text-muted">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-accent-soft hover:underline">
            Entrar
          </Link>
        </p>
      </main>
    </div>
  );
}
