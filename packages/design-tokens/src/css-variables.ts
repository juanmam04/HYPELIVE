import { colors, durations, easings, radii, spacing, typography } from "./tokens";

/**
 * Flatten tokens into CSS custom properties for web.
 */
export function toCssVariables(
  prefix = "hl",
): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(colors)) {
    vars[`--${prefix}-color-${kebab(key)}`] = value;
  }

  for (const [key, value] of Object.entries(spacing)) {
    vars[`--${prefix}-space-${key}`] = `${value}px`;
  }

  for (const [key, value] of Object.entries(radii)) {
    vars[`--${prefix}-radius-${kebab(key)}`] = `${value}px`;
  }

  for (const [key, value] of Object.entries(typography.fontSize)) {
    vars[`--${prefix}-font-size-${key}`] = `${value}px`;
  }

  vars[`--${prefix}-font-sans`] = typography.fontFamily.sans;
  vars[`--${prefix}-font-display`] = typography.fontFamily.display;
  vars[`--${prefix}-font-mono`] = typography.fontFamily.mono;

  for (const [key, value] of Object.entries(durations)) {
    vars[`--${prefix}-duration-${key}`] = `${value}ms`;
  }

  for (const [key, value] of Object.entries(easings)) {
    vars[`--${prefix}-easing-${key}`] = value;
  }

  return vars;
}

/** Serialize CSS variables as a `:root { ... }` block. */
export function cssVariablesString(prefix = "hl"): string {
  const vars = toCssVariables(prefix);
  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `:root {\n${body}\n}`;
}

function kebab(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
