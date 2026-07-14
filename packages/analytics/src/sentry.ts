import { logger } from "./logger";
import { sanitizeError } from "./sanitize";

export type SentryLike = {
  init: (options: Record<string, unknown>) => void;
  captureException: (error: unknown, context?: Record<string, unknown>) => void;
  captureMessage: (message: string, level?: string) => void;
};

let sentryInstance: SentryLike | null = null;
let initialized = false;

/**
 * Initialize Sentry if a DSN is provided. No-ops without DSN so local/demo
 * builds never crash.
 */
export function initSentry(options: {
  dsn?: string | null;
  environment?: string;
  /** Optional injected SDK (avoid hard dependency). */
  sentry?: SentryLike;
}): void {
  if (initialized) return;
  initialized = true;

  const dsn = options.dsn?.trim();
  if (!dsn) {
    logger.debug("Sentry disabled — no DSN");
    return;
  }

  if (!options.sentry) {
    logger.warn("Sentry DSN present but no SDK provided — skipping init");
    return;
  }

  sentryInstance = options.sentry;
  sentryInstance.init({
    dsn,
    environment: options.environment ?? "development",
    tracesSampleRate: 0.1,
  });
  logger.info("Sentry initialized");
}

export function captureException(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  const safe = sanitizeError(error);
  if (!sentryInstance) {
    logger.error(safe.message, context);
    return;
  }
  sentryInstance.captureException(new Error(safe.message), {
    ...context,
    originalName: safe.name,
  });
}

export function captureMessage(message: string, level = "info"): void {
  const safe = redactSimple(message);
  if (!sentryInstance) {
    logger.info(safe);
    return;
  }
  sentryInstance.captureMessage(safe, level);
}

function redactSimple(value: string): string {
  return sanitizeError(value).message;
}
