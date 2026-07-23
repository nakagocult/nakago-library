// Shared site-wide constants (mascot art, social links).
// Recreated from the original constants.ts for the multi-page rebuild.

export const MASCOT_URL = '/naka-mascot.jpg';

// Page links, in nav order. Rendered by the NavBar menu and the footer nav.
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/henk', label: 'Henk' },
  { href: '/rain', label: 'Rain' },
  { href: '/claim', label: 'Claim' },
  { href: '/view', label: 'View' },
  { href: '/mosaic', label: 'Mosaic' },
  { href: '/lobiathan', label: 'Lobiathan' },
  { href: '/memoires', label: 'Memoires' },
  { href: '/cawf', label: 'CAWF' },
] as const;

export const SOCIAL_LINKS = {
  telegram: 'https://t.me/NakaGoInu',
  twitter: 'https://x.com/NakaGoCult',
  uniswap:
    'https://app.uniswap.org/#/swap?outputCurrency=0x6967b9a8c0b14849CFE8f9E5732B401433fD2898',
} as const;

// DDERGO's Spotify artist page — linked from the radio dock's "Follow" button.
export const DDERGO_ARTIST_ID = '6B30jOzfy4u8nu9PrcoOFa';
export const DDERGO_ARTIST_URL = `https://open.spotify.com/artist/${DDERGO_ARTIST_ID}`;
// Self-hosted copy of DDERGO's Spotify profile photo (pulled from Spotify's
// oEmbed thumbnail). Used as the player's default art so the dock stays fast
// and doesn't depend on Spotify's CDN at build or runtime.
export const DDERGO_ARTIST_IMG = '/ddergo-artist.jpg';

// The wider Naka Go ecosystem, grouped by platform. Rendered as the footer
// directory. Follower/member counts are deliberately omitted so the copy
// doesn't go stale.
export const ECOSYSTEM_LINKS = [
  {
    group: 'Websites',
    links: [
      {
        label: 'Naka Go Cult',
        desc: 'Central hub of all things Naka Go',
        href: 'https://www.nakagocult.xyz/',
      },
      {
        label: 'Naka Labs',
        desc: 'Intelligent trading app',
        href: 'https://nakalabs.xyz/',
      },
    ],
  },
  {
    group: 'X',
    links: [
      {
        label: '@NakaGoInu',
        desc: 'Original artwork and story',
        href: 'https://x.com/NakaGoInu',
      },
      {
        label: '@DdergoRecords',
        desc: 'Ddergo Records music label',
        href: 'https://x.com/DdergoRecords',
      },
      {
        label: '@NakaGoCult',
        desc: 'Collective feed',
        href: 'https://x.com/NakaGoCult',
      },
      {
        label: '@N4kaishi8a',
        desc: 'Co-creative art feed',
        href: 'https://x.com/N4kaishi8a',
      },
      {
        label: '@nakalabs_',
        desc: 'Naka Labs trading app',
        href: 'https://x.com/nakalabs_',
      },
    ],
  },
  {
    group: 'Telegram',
    links: [
      {
        label: 'Naka Go Inu',
        desc: 'Largest general activity chat',
        href: 'https://t.me/NakaGoInu',
      },
      {
        label: 'Naka Go Cult',
        desc: 'Deeper coordination group',
        href: 'https://t.me/NakaGoCult',
      },
    ],
  },
  {
    group: 'Music and Lore',
    links: [
      {
        label: 'West Dingo',
        desc: 'Our in-house DJ on Spotify',
        href: DDERGO_ARTIST_URL,
      },
      {
        label: 'The Lore Lab',
        desc: 'Collaborative worldbuilding on Medium',
        href: 'https://medium.com/@n4kaishi8a/the-lore-lab-42d19055de97',
      },
      {
        label: 'The Shiba Who Saved His Breed',
        desc: 'The origin story on Medium',
        href: 'https://medium.com/@NakaGo/naka-go-the-shiba-inu-who-saved-his-breed-c363e26bb988',
      },
    ],
  },
] as const;
