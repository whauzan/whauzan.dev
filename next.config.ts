import type { NextConfig } from "next";

const showDevRoutes =
  process.env.NODE_ENV === "development" ||
  process.env.SHOW_DEV_ROUTES === "true";

const nextConfig: NextConfig = {
  pageExtensions: showDevRoutes
    ? ["ts", "tsx", "dev.ts", "dev.tsx"]
    : ["ts", "tsx"],
};

export default nextConfig;
