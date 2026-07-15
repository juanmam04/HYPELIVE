import Link from "next/link";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <StreamingShell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-soft">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold text-text-primary">
          No encontramos esa página
        </h1>
        <p className="mt-2 max-w-md text-text-muted">
          El contenido puede haberse movido o el enlace es incorrecto.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/home">
            <Button>Ir al inicio</Button>
          </Link>
          <Link href="/buscar">
            <Button variant="secondary">Buscar</Button>
          </Link>
        </div>
      </div>
    </StreamingShell>
  );
}
