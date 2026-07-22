"use client";

import { useEffect, type ReactNode } from "react";
import { bootstrapSentry } from "@/lib/sentry";
import { AuthProvider } from "@/providers/AuthProvider";
import { NavigationProvider } from "@/providers/NavigationProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { ToastProvider } from "@/components/ui/Toast";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    bootstrapSentry();
  }, []);

  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <NavigationProvider>
            <NavigationProgress />
            {children}
          </NavigationProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
