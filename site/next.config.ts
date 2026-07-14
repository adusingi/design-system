import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: every route is prerendered (no server), so the site can be
  // served from Cloudflare Pages at design.mobayilo.com. Build output: out/.
  output: "export",
  transpilePackages: ["@mobayilo/themes", "@mobayilo/ui", "@mobayilo/auth-magic-link"],
};

export default nextConfig;
