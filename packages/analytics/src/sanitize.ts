const SECRET_PATTERNS = [
  /password/i,
  /passwd/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /authorization/i,
  /bearer\s+[a-z0-9._-]+/i,
  /supabase/i,
  /service[_-]?role/i,
];

/**
 * Strip likely secrets from error messages / objects before logging or Sentry.
 */
export function sanitizeError(error: unknown): {
  message: string;
  name?: string;
  stack?: string;
} {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: redact(error.message),
      stack: error.stack ? redact(error.stack) : undefined,
    };
  }

  if (typeof error === "string") {
    return { message: redact(error) };
  }

  try {
    return { message: redact(JSON.stringify(error)) };
  } catch {
    return { message: "Unknown error" };
  }
}

function redact(value: string): string {
  let result = value;
  for (const pattern of SECRET_PATTERNS) {
    result = result.replace(pattern, "[REDACTED]");
  }
  // Redact JWT-looking strings
  result = result.replace(
    /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
    "[REDACTED_JWT]",
  );
  return result;
}
