import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "www.eredmenyek.com",
      },
      {
        protocol: "https",
        hostname: "static.flashscore.com",
      },
      {
        protocol: "https",
        hostname: "image.flashscore.com",
      },
    ],
  },
};

export default nextConfig;
