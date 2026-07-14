import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mobayilo/themes", "@mobayilo/ui", "@mobayilo/auth-magic-link"],
};

export default nextConfig;
