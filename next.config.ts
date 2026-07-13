import type { NextConfig } from "next";

// The /verify page calls same-origin /api/verify/*; the gate that answers lives
// in the Telegram bot process, not in this app. We proxy those paths to it so the
// browser stays same-origin (clean Origin check) and the bot host never appears in
// client code. Set VERIFY_BACKEND_ORIGIN (e.g. https://gate.nakagocult.xyz) in the
// Vercel project. Must be an absolute http(s):// URL — Next rejects anything else
// as an "Invalid rewrite" and fails the whole build, so we validate here and skip
// the rewrite on a missing/garbage value (fails safe: /api/verify/* just 404s and
// the rest of the site still builds) rather than letting one bad env var take the
// deploy down.
const rawVerifyBackend = process.env.VERIFY_BACKEND_ORIGIN?.replace(/\/$/, '');
const verifyBackend = /^https?:\/\//.test(rawVerifyBackend ?? '') ? rawVerifyBackend : undefined;

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
      // The /observatory page reads henk's public metrics lens from the same
      // bot process (read-only JSON; the bot curates what is public). Same
      // origin trick, same env var, same fail-safe: no env, no rewrite.
      {
        source: '/api/henk/:path*',
        destination: `${verifyBackend}/api/henk/:path*`,
      },
    ];
  },
};

export default nextConfig;
