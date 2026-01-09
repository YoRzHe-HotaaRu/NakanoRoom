import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Capacitor mobile build
  output: 'export',
  trailingSlash: true,

  reactCompiler: true,
  images: {
    // Required for static export
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

