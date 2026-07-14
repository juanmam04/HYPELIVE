"use client";

import { useEffect, type ReactNode } from "react";
import { bootstrapSentry } from "@/lib/sentry";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { ToastProvider } from "@/components/ui/Toast";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    bootstrapSentry();
  }, []);

  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
