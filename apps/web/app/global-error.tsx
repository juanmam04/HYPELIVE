"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/sentry";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { boundary: "global-error" });
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#07090D",
          color: "#F5F7FA",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: 24, maxWidth: 420 }}>
          <h1 style={{ fontSize: 28, marginBottom: 8, fontWeight: 700 }}>
            Error crítico
          </h1>
          <p style={{ color: "#8B95A5", marginBottom: 20 }}>
            La aplicación encontró un fallo inesperado.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#3D7EEA",
              color: "#F5F7FA",
              border: 0,
              borderRadius: 4,
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
