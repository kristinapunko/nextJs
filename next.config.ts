import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns:[
      {
        protocol:"https",
        hostname:"cdn.sanity.io"
      }
    ]
  },
  /* config options here */
};

export default nextConfig;
