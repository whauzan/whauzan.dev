import type { NextConfig } from "next";

const showDevRoutes =
  process.env.NODE_ENV === "development" ||
  process.env.SHOW_DEV_ROUTES === "true";

/**
 * Everything that is not already locale-prefixed, and not a Next internal.
 *
 * The lookaheads are anchored (`id$|id/`) rather than bare, so `/identity` is
 * still an English path while `/id` and `/id/blog` are left alone.
 */
const UNPREFIXED_PATH = "/:path((?!id$|id/|en$|en/|_next/).*)";

const nextConfig: NextConfig = {
  pageExtensions: showDevRoutes
    ? ["ts", "tsx", "dev.ts", "dev.tsx"]
    : ["ts", "tsx"],

  /**
   * English is unprefixed, so the apex resolves in one request — that is the URL
   * recruiters and AI crawlers hit first. `afterFiles` rather than `beforeFiles`
   * so `public/` assets and real top-level routes (sitemap.xml, robots.txt) are
   * served at the filesystem step before this catch-all is considered.
   *
   * This does not loop with the redirect below: redirects are checked before
   * rewrites, and a rewrite is internal — the routing pipeline does not restart
   * on the rewritten path.
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
