import { initSentry } from "@hypelive/analytics";

export function setupSentry(): void {
  initSentry({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: process.env.EXPO_PUBLIC_APP_ENV ?? "development",
  });
}
