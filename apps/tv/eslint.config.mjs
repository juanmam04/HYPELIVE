import { reactNativeConfig } from "@hypelive/eslint-config/react-native";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...reactNativeConfig,
  {
    ignores: [
      ".expo/**",
      "node_modules/**",
      "dist/**",
      "babel.config.js",
      "metro.config.js",
    ],
  },
];
