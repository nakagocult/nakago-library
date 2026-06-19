// Server-only Spotify helpers. Never import this from a client component —
// it reads SPOTIFY_CLIENT_SECRET, which must never reach the browser bundle.
import { DDERGO_ARTIST_ID } from '@/lib/site';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_BASE = 'https://api.spotify.com/v1';

function credentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

let cachedAppToken: { token: string; expiresAt: number } | null = null;

/** App-only (Client Credentials) token — for public catalog reads, no user login needed. */
async function getAppToken(): Promise<string> {
  const creds = credentials();
  if (!creds) throw new Error('Spotify credentials not configured');

  if (cachedAppToken && cachedAppToken.expiresAt > Date.now()) return cachedAppToken.token;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${creds.clientId}:${creds.clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`Spotify token request failed: ${res.status}`);
  const data = await res.json();
  cachedAppToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedAppToken.token;
}

export interface DdergoTrack {
  id: string;
  name: string;
  uri: string;
  durationMs: number;
  albumArt: string | null;
  externalUrl: string;
}

export async function getDdergoTopTracks(): Promise<DdergoTrack[]> {
  const token = await getAppToken();
  const res = await fetch(`${API_BASE}/artists/${DDERGO_ARTIST_ID}/top-tracks?market=US`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Spotify top-tracks request failed: ${res.status}`);
  const data = await res.json();
  return (data.tracks ?? []).map((t: Record<string, unknown>) => ({
    id: t.id as string,
    name: t.name as string,
    uri: t.uri as string,
    durationMs: t.duration_ms as number,
    albumArt: ((t.album as Record<string, unknown>)?.images as Array<{ url: string }>)?.[0]?.url ?? null,
    externalUrl: ((t.external_urls as Record<string, string>)?.spotify) ?? '',
  }));
}

/** Exchanges a PKCE auth code for a user access token, then follows DDERGO with it. */
export async function exchangeCodeAndFollow(code: string, verifier: string, redirectUri: string): Promise<void> {
  const creds = credentials();
  if (!creds) throw new Error('Spotify credentials not configured');

  const tokenRes = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${creds.clientId}:${creds.clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    }).toString(),
  });
  if (!tokenRes.ok) throw new Error(`Spotify code exchange failed: ${tokenRes.status}`);
  const tokenData = await tokenRes.json();

  const followRes = await fetch(`${API_BASE}/me/following?type=artist&ids=${DDERGO_ARTIST_ID}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!followRes.ok) throw new Error(`Spotify follow request failed: ${followRes.status}`);
}

export function isSpotifyConfigured(): boolean {
  return credentials() !== null;
}
