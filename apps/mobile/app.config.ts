import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Disney Streaming",
  slug: "disney-streaming",
  version: "0.0.1",
  orientation: "portrait",
  scheme: "hypelive",
  userInterfaceStyle: "dark",
  newArchEnabled: false,
  icon: undefined,
  splash: {
    backgroundColor: "#07090D",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.hypelive.app",
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#07090D",
    },
    package: "com.hypelive.app",
  },
  plugins: ["expo-router", "expo-secure-store"],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    brandName: "Disney Streaming",
    brandSlug: "disney-streaming",
  },
});
