import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "HYPE LIVE",
  slug: "hype-live-tv",
  version: "0.0.1",
  orientation: "landscape",
  scheme: "hypelive-tv",
  userInterfaceStyle: "dark",
  newArchEnabled: false,
  splash: {
    backgroundColor: "#07090D",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.hypelive.tv",
    infoPlist: {
      UIRequiresFullScreen: true,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#07090D",
    },
    package: "com.hypelive.tv",
  },
  plugins: ["expo-router"],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    brandName: "HYPE LIVE",
    brandSlug: "hype-live",
    isTv: true,
  },
});
