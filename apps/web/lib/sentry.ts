import { captureException, initSentry, logger } from "@hypelive/analytics";
import { getPublicEnv } from "./env";

let bootstrapped = false;

export function bootstrapSentry(): void {
  if (bootstrapped) return;
  bootstrapped = true;
  const { sentryDsn, appEnv } = getPublicEnv();
  initSentry({ dsn: sentryDsn || null, environment: appEnv });
  logger.debug("Sentry bootstrap complete", { enabled: Boolean(sentryDsn) });
}

export function reportError(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  captureException(error, context);
}
