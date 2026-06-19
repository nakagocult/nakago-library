// Shared site-wide constants (mascot art, social links).
// Recreated from the original constants.ts for the multi-page rebuild.

export const MASCOT_URL = 'https://i.ibb.co/B8zQgxk/IMG-7857.jpg';

export const SOCIAL_LINKS = {
  telegram: 'https://t.me/NakaGoInu',
  twitter: 'https://x.com/NakaGoCult',
  uniswap:
    'https://app.uniswap.org/#/swap?outputCurrency=0x6967b9a8c0b14849CFE8f9E5732B401433fD2898',
} as const;

export const DDERGO_ARTIST_ID = '6B30jOzfy4u8nu9PrcoOFa';
export const DDERGO_ARTIST_URL = `https://open.spotify.com/artist/${DDERGO_ARTIST_ID}`;
export const DDERGO_FOLLOW_SCOPE = 'user-follow-modify';

/**
 * Stream-bar moods. `uri` is loaded into the embedded player on tab select.
 * Only "All Tracks" has a confirmed source (the artist catalog) — the rest
 * are wired and ready but stay `enabled: false` until a real playlist/album
 * URI is supplied per mood, so the bar never shows duplicate content under
 * different labels.
 */
export const DDERGO_STREAMS = [
  { id: 'all', label: 'All Tracks', uri: `spotify:artist:${DDERGO_ARTIST_ID}`, enabled: true },
  { id: 'deephouse', label: 'Deep House', uri: `spotify:artist:${DDERGO_ARTIST_ID}`, enabled: false },
  { id: 'latin', label: 'Latin', uri: `spotify:artist:${DDERGO_ARTIST_ID}`, enabled: false },
  { id: 'bangers', label: 'Bangers', uri: `spotify:artist:${DDERGO_ARTIST_ID}`, enabled: false },
] as const;
