import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // public/nfts/** is local — no external domains needed
    localPatterns: [{ pathname: '/nfts/**' }],
    // Mosaic tiles/composite live on Vercel Blob's public host (any store id).
    // Routing them through next/image serves resized, cached, modern-format
    // thumbnails instead of the raw multi-MB PNGs.
    remotePatterns: [{ protocol: 'https', hostname: '**.public.blob.vercel-storage.com' }],
  },
};

export default nextConfig;
