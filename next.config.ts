import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://maimaidx-eng.com/**'), new URL('https://dp4p6x0xfi5o9.cloudfront.net/**')],
  },
};

export default nextConfig;
