export const NAKA_ORANGE = '#FF4D00';
export const NAKA_RED = '#FF0000';
export const NAKA_GRADIENT = 'linear-gradient(135deg, #FF4D00 0%, #FF0000 100%)';

export const SBT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS as `0x${string}` | undefined;
export const NAKA_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_NAKA_TOKEN_ADDRESS as `0x${string}` | undefined;
export const LOTTERY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}` | undefined;

export const SOCIAL_LINKS = {
  telegram: 'https://t.me/NakaGoCult',
  twitter: 'https://x.com/NakaGoInu',
  medium: 'https://medium.com/@NakaGo',
  etherscan: `https://etherscan.io/token/${SBT_CONTRACT_ADDRESS ?? ''}`,
} as const;

export const SPOTIFY_PLAYLIST = 'https://open.spotify.com/playlist/3PGFWI7Ms2PHZXbadbfhh4?si=AivBt82gSl-XGV70EFFQlQ';
export const SPOTIFY_EMBED = 'https://open.spotify.com/embed/playlist/3PGFWI7Ms2PHZXbadbfhh4?utm_source=generator&theme=0';
