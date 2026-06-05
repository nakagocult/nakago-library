export const NAKA_ORANGE = '#FF4D00';
export const NAKA_RED = '#FF0000';
export const NAKA_GRADIENT = 'linear-gradient(135deg, #FF4D00 0%, #FF0000 100%)';

// Mascot Image
export const MASCOT_URL = 'https://i.ibb.co/B8zQgxk/IMG-7857.jpg';

// Contract Addresses (hardcoded)
export const NAKA_TOKEN_ADDRESS = '0x6967b9a8c0b14849CFE8f9E5732B401433fD2898' as `0x${string}`;
export const SBT_CONTRACT_ADDRESS = '0x9AA41B74F3D87c3A27D49736692e70F175eFD420' as `0x${string}`;
export const LOTTERY_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS ?? '') as `0x${string}`;

// Social Links
export const SOCIAL_LINKS = {
  telegram: 'https://t.me/NakaGoInu',
  twitter: 'https://www.x.com/NakaGoInu',
  announcement: 'https://x.com/N4kaishi8a/status/1959984583665230297',
  etherscan: 'https://etherscan.io/token/0x6967b9a8c0b14849cfe8f9e5732b401433fd2898',
  uniswap: 'https://app.uniswap.org/#/swap?outputCurrency=0x6967b9a8c0b14849CFE8f9E5732B401433fD2898',
  dexscreener: 'https://dexscreener.com/ethereum/0x6967b9a8c0b14849cfe8f9e5732b401433fd2898',
  henk: 'https://x.com/cookies_and_cream_monster_bot',
  medium: 'https://medium.com/@n4kaishi8a/the-lore-lab-42d19055de97',
  lorelab: '/lore-lab',
} as const;

// Spotify
export const SPOTIFY_PLAYLIST = 'https://open.spotify.com/playlist/7i3AcSKszKG5lNrTvBtzD8?si=02zOEelbTDeLiGPJf_JNvw';
export const SPOTIFY_EMBED = 'https://open.spotify.com/embed/playlist/7i3AcSKszKG5lNrTvBtzD8?utm_source=generator&theme=0';

// Token
export const NAKA_MINT_COST = BigInt('227000000000000000000'); // 227 NAKA
export const NAKA_DECIMALS = 18;
