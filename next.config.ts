import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      canvas: './empty-module.js',
    },
  },
  experimental: {
    bodySizeLimit: '20mb',
  },
};

export default nextConfig;
