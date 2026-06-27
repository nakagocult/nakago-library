import type { NextConfig } from "next";

// The /verify page calls same-origin /api/verify/*; the gate that answers lives
// in the Telegram bot process, not in this app. We proxy those paths to it so the
// browser stays same-origin (clean Origin check) and the bot host never appears in
// client code. Set VERIFY_BACKEND_ORIGIN (e.g. https://gate.nakagocult.xyz) in the
// Vercel project. If it's unset, the rewrite is skipped so the build can't break —
// /api/verify/* will simply 404 until the var is set and the gate subdomain is live.
const verifyBackend = process.env.VERIFY_BACKEND_ORIGIN?.replace(/\/$/, '');

const nextConfig: NextConfig = {
  images: {
    // public/nfts/** is local — no external domains needed
    localPatterns: [{ pathname: '/nfts/**' }],
    // Mosaic tiles/composite live on Vercel Blob's public host (any store id).
    // Routing them through next/image serves resized, cached, modern-format
    // thumbnails instead of the raw multi-MB PNGs.
    remotePatterns: [{ protocol: 'https', hostname: '**.public.blob.vercel-storage.com' }],
  },
  async rewrites() {
    if (!verifyBackend) return [];
    return [
      {
        source: '/api/verify/:path*',
        destination: `${verifyBackend}/api/verify/:path*`,
      },
    ];
  },
};

export default nextConfig;
