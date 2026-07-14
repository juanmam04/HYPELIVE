import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { createQueryClient } from "../lib/query-client";
import { setupSentry } from "../lib/sentry";
import { PairingProvider } from "./PairingProvider";
import { ErrorBoundary } from "../components/ErrorBoundary";

setupSentry();

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(() => createQueryClient());

  return (
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <PairingProvider>{children}</PairingProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
