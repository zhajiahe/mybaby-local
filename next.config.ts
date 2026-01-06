import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  images: {
    remotePatterns: [
      // MinIO (local development)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9500',
        pathname: '/**',
      },
      // MinIO (Docker internal)
      {
        protocol: 'http',
        hostname: 'minio',
        port: '9500',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
