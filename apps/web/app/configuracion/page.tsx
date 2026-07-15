"use client";

import { useState } from "react";
import Link from "next/link";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

export default function ConfiguracionPage() {
  const { user, profile, signOutUser, demoMode } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [saving, setSaving] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  async function saveProfile() {
    if (!user || demoMode) {
      toast("Guardado local (modo demo)", { tone: "success" });
      return;
    }
    const client = createClient();
    if (!client) {
      toast("Supabase no configurado", { tone: "error" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await client
        .from("profiles")
        .update({
          display_name: displayName.trim() || profile?.displayName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) throw error;
      toast("Perfil actualizado", { tone: "success" });
    } catch {
      toast("No se pudo guardar", { tone: "error" });
    } finally {
      setSaving(false);
    }
  }

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
              <div className="mt-4 space-y-3">
                <Input
                  label="Nombre para mostrar"
                  value={displayName || profile?.displayName || ""}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <p className="text-sm text-text-muted">
                  {user?.email ?? profile?.username ?? "Sin email"}
                </p>
                <Button
                  size="sm"
                  loading={saving}
                  onClick={() => void saveProfile()}
                >
                  Guardar cambios
                </Button>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-sm text-text-muted">No hay sesión activa.</p>
                <Link href="/login" className="mt-3 inline-block">
                  <Button size="sm">Iniciar sesión</Button>
                </Link>
              </div>
            )}
          </section>

          <section className="rounded border border-border-subtle bg-slate p-5">
            <h2 className="text-base font-bold text-text-primary">
              Reproducción
            </h2>
            <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 text-sm text-text-secondary">
              <span>Autoplay del siguiente episodio</span>
              <input
                type="checkbox"
                checked={autoplay}
                onChange={(e) => setAutoplay(e.target.checked)}
                className="size-4 accent-accent"
              />
            </label>
            <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 text-sm text-text-secondary">
              <span>Reducir movimiento</span>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="size-4 accent-accent"
              />
            </label>
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
