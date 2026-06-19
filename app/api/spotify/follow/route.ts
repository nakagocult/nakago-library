import { NextResponse } from 'next/server';
import { exchangeCodeAndFollow, isSpotifyConfigured } from '@/lib/spotify/server';

export async function POST(req: Request) {
  if (!isSpotifyConfigured()) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const { code, verifier, redirectUri } = await req.json();
  if (!code || !verifier || !redirectUri) {
    return NextResponse.json({ error: 'missing_params' }, { status: 400 });
  }

  try {
    await exchangeCodeAndFollow(code, verifier, redirectUri);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'follow_failed' }, { status: 502 });
  }
}
