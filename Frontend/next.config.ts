import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [72, 81, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.geeksforgeeks.org"
      },
      {
        protocol: "https",
        hostname: "academickids.com"
      },
      {
        protocol: "https",
        hostname: "tse3.mm.bing.net"
      },
      {
        protocol: "https",
        hostname: "tse4.mm.bing.net"
      },
      {
        protocol: "https",
        hostname: "image1.slideserve.com"
      },
      {
        protocol: "https",
        hostname: "image.slideserve.com"
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org"
      }
    ]
  },
   experimental: {
    globalNotFound: true,
  }
};

export default nextConfig;
