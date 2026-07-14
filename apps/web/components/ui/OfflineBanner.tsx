"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { cn } from "@/lib/cn";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center gap-2 border-b border-warning/30 bg-warning/10 px-4 py-2",
        "text-xs text-text-secondary",
      )}
    >
      <WifiOff className="size-3.5 text-warning" aria-hidden />
      Sin conexión. Algunos datos pueden estar desactualizados.
    </div>
  );
}
