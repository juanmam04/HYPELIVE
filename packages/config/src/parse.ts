import type { ZodError, ZodTypeAny } from "zod";
import type { z } from "zod";

function formatZodError(prefix: string, error: ZodError): string {
  const details = error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  return `${prefix}\n${details}`;
}

export function parseEnv<T extends ZodTypeAny>(
  schema: T,
  env: Record<string, string | undefined>,
  label: string,
): z.infer<T> {
  const result = schema.safeParse(env);
  if (!result.success) {
    throw new Error(
      formatZodError(
        `[${label}] Missing or invalid environment variables:`,
        result.error,
      ),
    );
  }
  return result.data;
}
