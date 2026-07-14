"use client";

import Link from "next/link";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";

export default function ConfiguracionPage() {
  const { user, profile, signOutUser } = useAuth();

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl space-y-6">
          <h1 className="text-2xl font-bold text-text-primary">
            Configuración
          </h1>

          <section className="rounded border border-border-subtle bg-slate p-5">
            <h2 className="text-base font-bold text-text-primary">Cuenta</h2>
            {user || profile ? (
              <div className="mt-3 space-y-1 text-sm">
                <p className="text-text-secondary">
                  {profile?.displayName ?? "Usuario"}
                </p>
                <p className="text-text-muted">
                  {user?.email ?? profile?.username ?? "Sin email"}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-text-muted">
                No hay sesión activa.
              </p>
            )}
          </section>

          <section className="rounded border border-border-subtle bg-slate p-5">
            <h2 className="text-base font-bold text-text-primary">Studio</h2>
            <p className="mt-2 text-sm text-text-muted">
              Gestioná tu canal, programas y transmisiones.
            </p>
            <Link href="/studio" className="mt-4 inline-block">
              <Button variant="secondary" size="sm">
                Abrir Studio
              </Button>
            </Link>
          </section>

          <section className="rounded border border-border-subtle bg-slate p-5">
            <h2 className="text-base font-bold text-text-primary">Sesión</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {user || profile ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => void signOutUser()}
                >
                  Cerrar sesión
                </Button>
              ) : (
                <Link href="/login">
                  <Button size="sm">Iniciar sesión</Button>
                </Link>
              )}
            </div>
          </section>
        </div>
      </div>
    </StreamingShell>
  );
}
