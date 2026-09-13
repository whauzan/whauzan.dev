import type { NextConfig } from "next";

const showDevRoutes =
  process.env.NODE_ENV === "development" ||
  process.env.SHOW_DEV_ROUTES === "true";

/** Anchored lookaheads, so `/identity` stays an English path. */
const UNPREFIXED_PATH = "/:path((?!id$|id/|en$|en/|_next/).*)";

const nextConfig: NextConfig = {
  pageExtensions: showDevRoutes
    ? ["ts", "tsx", "dev.ts", "dev.tsx"]
    : ["ts", "tsx"],

  /**
   * English unprefixed, Indonesian under /id. `afterFiles` so public assets and
   * real routes win first. Pairs with the redirect below — see §2.3.
   */
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/", destination: "/en" },
        { source: UNPREFIXED_PATH, destination: "/en/:path" },
      ],
      fallback: [],
    };
  },

  /** So the same page is never reachable at both `/en/x` and `/x`. */
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
