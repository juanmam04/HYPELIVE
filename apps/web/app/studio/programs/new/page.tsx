"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export default function NewProgramPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    setBusy(false);
    toast("Programa creado", {
      description: "Guardado como borrador simulado.",
      tone: "success",
    });
    router.push("/studio/programs");
  }

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Nuevo programa
              </h1>
              <p className="mt-1 text-sm text-text-muted">
                Creá un show dentro de tu canal. Artwork y hosts se pueden
                completar después.
              </p>
            </div>
            <Link href="/studio/programs">
              <Button variant="secondary" size="sm">
                Cancelar
              </Button>
            </Link>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded border border-border-subtle bg-slate p-5"
          >
            <Input
              label="Título"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slug) {
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, ""),
                  );
                }
              }}
              required
            />
            <Input
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-secondary">
                Descripción
              </span>
              <textarea
                className="min-h-24 w-full rounded border border-border-subtle bg-ink px-3 py-2 text-sm text-text-primary outline-none focus-visible:border-border-active focus-visible:ring-2 focus-visible:ring-accent/40"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <Input
              label="Horario habitual"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="Lunes a viernes · 22:00"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="submit" disabled={busy || !title.trim()}>
                {busy ? "Guardando…" : "Crear programa"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </StreamingShell>
  );
}
