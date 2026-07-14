import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@hypelive/analytics",
    "@hypelive/api",
    "@hypelive/auth",
    "@hypelive/config",
    "@hypelive/database",
    "@hypelive/design-tokens",
    "@hypelive/domain",
    "@hypelive/types",
    "@hypelive/validation",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
