import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // public/nfts/** is local — no external domains needed
    localPatterns: [{ pathname: '/nfts/**' }],
  },
};

export default nextConfig;
