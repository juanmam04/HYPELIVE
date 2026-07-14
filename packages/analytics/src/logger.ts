export type LogLevel = "debug" | "info" | "warn" | "error";

export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

function isDev(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
    process.env.EXPO_PUBLIC_APP_ENV !== "production"
  );
}

export function createLogger(scope = "hypelive"): Logger {
  const prefix = `[${scope}]`;

  return {
    debug: (...args) => {
      if (isDev()) {
        // eslint-disable-next-line no-console
        console.debug(prefix, ...args);
      }
    },
    info: (...args) => {
      if (isDev()) {
        // eslint-disable-next-line no-console
        console.info(prefix, ...args);
      }
    },
    warn: (...args) => {
      console.warn(prefix, ...args);
    },
    error: (...args) => {
      console.error(prefix, ...args);
    },
  };
}

export const logger = createLogger();
