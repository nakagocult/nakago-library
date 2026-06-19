import { NextResponse } from 'next/server';
import { getDdergoTopTracks, isSpotifyConfigured } from '@/lib/spotify/server';

export async function GET() {
  if (!isSpotifyConfigured()) {
    return NextResponse.json({ tracks: [], configured: false });
  }
  try {
    const tracks = await getDdergoTopTracks();
    return NextResponse.json(
      { tracks, configured: true },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    );
  } catch {
    return NextResponse.json({ tracks: [], configured: true, error: 'fetch_failed' }, { status: 502 });
  }
}
