import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      canvas: './empty-module.js',
    },
  },
  serverActions: {
    bodySizeLimit: '20mb',
  },
};

export default nextConfig;
