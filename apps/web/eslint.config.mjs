import { nextConfig } from "@hypelive/eslint-config/next";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextConfig,
  {
    ignores: [".next/**", "node_modules/**"],
  },
];
