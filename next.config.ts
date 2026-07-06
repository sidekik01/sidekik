import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@esbuild/darwin-x64",
    "@remotion/bundler",
    "@remotion/renderer",
    "esbuild",
  ],
};

export default nextConfig;
