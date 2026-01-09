import type { NextConfig } from "next";

// Only enable static export when building for Capacitor mobile
const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  // Static export for Capacitor mobile build (only when STATIC_EXPORT=true)
  ...(isStaticExport && {
    output: 'export',
    trailingSlash: true,
  }),

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
