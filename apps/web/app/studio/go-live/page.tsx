"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { studioQueryOptions } from "@hypelive/api";
import { logger } from "@hypelive/analytics";
import { Mic, Video, Wifi, Radio } from "lucide-react";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { Dialog } from "@/components/ui/Dialog";
import { FakePlayer } from "@/components/player/FakePlayer";
import { useToast } from "@/components/ui/Toast";
import { apiOptions } from "@/lib/api-options";
import { normalizeStudioSummary, posterGradient } from "@/lib/models";

type ConnState = "idle" | "connecting" | "live" | "ending";
type BroadcastType = "program" | "event";

const CAMERAS = ["FaceTime HD", "OBS Virtual Camera", "Cam Link 4K"];
const MICS = ["MacBook Mic", "Rode NT-USB", "Focusrite Scarlett"];

export default function GoLivePage() {
  const query = useQuery(studioQueryOptions(undefined, apiOptions()));
  const studio = query.data ? normalizeStudioSummary(query.data) : null;
  const { toast } = useToast();

  const [title, setTitle] = useState("Señal en vivo — HYPE");
  const [broadcastType, setBroadcastType] = useState<BroadcastType>("program");
  const [programId, setProgramId] = useState("");
  const [camera, setCamera] = useState(CAMERAS[0]!);
  const [mic, setMic] = useState(MICS[0]!);
  const [conn, setConn] = useState<ConnState>("idle");
  const [confirmStart, setConfirmStart] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!studio) return;
    if (studio.nextStream?.title) setTitle(studio.nextStream.title);
    if (studio.programs[0]?.id) setProgramId(studio.programs[0].id);
  }, [studio]);

  const resolvedProgramId =
    broadcastType === "program" ? programId || null : null;

  async function startLive() {
    setBusy(true);
    setConn("connecting");
    logger.info("Go-live connecting", {
      programId: resolvedProgramId,
      type: broadcastType,
    });
    await wait(1200);
    setConn("live");
    setBusy(false);
    setConfirmStart(false);
    toast("Estás en vivo", {
      description: title,
      tone: "success",
    });
    logger.info("Go-live started");
  }

  async function endLive() {
    setBusy(true);
    setConn("ending");
    logger.info("Go-live ending");
    await wait(800);
    setConn("idle");
    setBusy(false);
    setConfirmEnd(false);
    toast("Transmisión finalizada", { tone: "info" });
  }

  const canStart =
    title.trim().length > 0 &&
    (broadcastType === "event" || Boolean(programId));

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Preparar transmisión
              </h1>
              <p className="mt-1 text-sm text-text-muted">
                Vista previa, dispositivos y controles de emisión.
              </p>
            </div>
            <ConnectionBadge state={conn} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_340px]">
            <div>
              {conn === "live" ? (
                <FakePlayer
                  id="go-live"
                  title={title}
                  mode="live"
                  viewerCount={128}
                />
              ) : (
                <div
                  className="relative overflow-hidden rounded border border-border-subtle"
                  style={{ background: posterGradient("go-live-preview") }}
                >
                  <div className="relative aspect-video">
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/30 text-center">
                      <Video className="size-8 text-text-muted" />
                      <p className="text-lg font-semibold text-text-primary">
                        Vista previa
                      </p>
                      <p className="max-w-xs text-sm text-text-muted">
                        Simulación de cámara · {camera}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 rounded border border-border-subtle bg-slate p-4">
              <Input
                label="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={conn === "live"}
              />

              <fieldset disabled={conn === "live"} className="space-y-2">
                <legend className="text-sm font-medium text-text-secondary">
                  Tipo
                </legend>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBroadcastType("program")}
                    className={`flex-1 rounded border px-3 py-2 text-sm font-medium transition-colors ${
                      broadcastType === "program"
                        ? "border-accent bg-accent-muted text-accent-soft"
                        : "border-border text-text-muted hover:text-text-primary"
                    }`}
                  >
                    Programa
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastType("event")}
                    className={`flex-1 rounded border px-3 py-2 text-sm font-medium transition-colors ${
                      broadcastType === "event"
                        ? "border-accent bg-accent-muted text-accent-soft"
                        : "border-border text-text-muted hover:text-text-primary"
                    }`}
                  >
                    Evento especial
                  </button>
                </div>
              </fieldset>

              {broadcastType === "program" ? (
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-text-secondary">
                    Programa
                  </span>
                  <select
                    className="h-11 rounded border border-border bg-elevated px-3 text-sm text-text-primary focus:border-accent focus:outline-none disabled:opacity-50"
                    value={programId}
                    disabled={conn === "live"}
                    onChange={(e) => setProgramId(e.target.value)}
                  >
                    <option value="">Elegí un programa</option>
                    {(studio?.programs ?? []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <p className="rounded border border-border-subtle bg-elevated px-3 py-2 text-sm text-text-muted">
                  Evento especial del canal · sin programa vinculado
                  (program_id = null)
                </p>
              )}

              <label className="flex flex-col gap-1.5">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <Video className="size-3.5" /> Cámara
                </span>
                <select
                  className="h-11 rounded border border-border bg-elevated px-3 text-sm text-text-primary focus:border-accent focus:outline-none disabled:opacity-50"
                  value={camera}
                  disabled={conn === "live"}
                  onChange={(e) => setCamera(e.target.value)}
                >
                  {CAMERAS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <Mic className="size-3.5" /> Micrófono
                </span>
                <select
                  className="h-11 rounded border border-border bg-elevated px-3 text-sm text-text-primary focus:border-accent focus:outline-none disabled:opacity-50"
                  value={mic}
                  disabled={conn === "live"}
                  onChange={(e) => setMic(e.target.value)}
                >
                  {MICS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              {conn === "live" ? (
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => setConfirmEnd(true)}
                >
                  Finalizar transmisión
                </Button>
              ) : (
                <Button
                  className="w-full"
                  loading={conn === "connecting"}
                  onClick={() => setConfirmStart(true)}
                  disabled={!canStart}
                >
                  <Radio className="size-4" />
                  Empezar en vivo
                </Button>
              )}

              <Link
                href="/studio"
                className="block text-center text-sm text-text-muted hover:text-text-primary"
              >
                ← Volver al studio
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={confirmStart}
        onClose={() => setConfirmStart(false)}
        title="¿Empezar transmisión?"
        description={`Se publicará “${title}” como señal en vivo${
          broadcastType === "event"
            ? " (evento especial)."
            : "."
        }`}
        confirmLabel="Ir en vivo"
        onConfirm={() => void startLive()}
        loading={busy}
      />

      <Dialog
        open={confirmEnd}
        onClose={() => setConfirmEnd(false)}
        title="¿Finalizar transmisión?"
        description="La señal se cerrará para todos los espectadores."
        confirmLabel="Finalizar"
        tone="danger"
        onConfirm={() => void endLive()}
        loading={busy}
      />
    </StreamingShell>
  );
}

function ConnectionBadge({ state }: { state: ConnState }) {
  if (state === "live") return <LiveBadge />;
  const map = {
    idle: { label: "Listo", tone: "muted" as const },
    connecting: { label: "Conectando…", tone: "warning" as const },
    ending: { label: "Cerrando…", tone: "warning" as const },
  };
  const item = map[state];
  return (
    <Badge tone={item.tone} className="gap-1.5">
      <Wifi className="size-3" />
      {item.label}
    </Badge>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
