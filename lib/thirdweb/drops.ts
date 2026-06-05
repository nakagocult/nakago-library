import type { ThirdwebContract } from 'thirdweb';
import { nippoContract, founderPassContract } from './client';

export type DropSlug = 'nippo' | 'founder-pass';

export interface DropConfig {
  slug: DropSlug;
  contract: ThirdwebContract;
  /** Short label used in nav / cards. */
  name: string;
  /** Full archival title. */
  title: string;
  /** One-line tagline for the hub card. */
  tagline: string;
  /** Reference USD price — copy only. The live on-chain price is always rendered. */
  referenceUsd: number;
  /** Known drop size. Used as the progress denominator until the live claim condition loads. */
  totalSupply: number;
  /** Count of the scarce "Rare Boi" tier within the drop. */
  rareBois: number;
  /** Whether the artwork is revealed during mint. NIPPO conceals it to stop sniping. */
  concealed: boolean;
  /** Accent gradient stops, drawn from the aurora system. */
  accent: [string, string];
}

export const NIPPO: DropConfig = {
  slug: 'nippo',
  contract: nippoContract,
  name: 'NIPPO',
  title: 'The NIPPO Pedigree Archives',
  tagline: 'Lifetime access to Cult features across the swarm.',
  referenceUsd: 27,
  totalSupply: 270,
  rareBois: 10,
  concealed: true,
  accent: ['#FF4D00', '#FFD700'],
};

export const FOUNDER_PASS: DropConfig = {
  slug: 'founder-pass',
  contract: founderPassContract,
  name: 'Founder Pass',
  title: 'Naka Labs Founder Pass',
  tagline: 'Founder perks for life. Subscription baked in.',
  referenceUsd: 48,
  totalSupply: 480,
  rareBois: 60,
  concealed: false,
  accent: ['#FF4D00', '#9B30FF'],
};

export const DROPS: Record<DropSlug, DropConfig> = {
  nippo: NIPPO,
  'founder-pass': FOUNDER_PASS,
};

/** Randomized-order proof for the Founder Pass, surfaced in the Provably Fair panel. */
export const FOUNDER_FAIRNESS_HASH =
  'C0CBC9835113AE85321C910CA90954865620964485217AA57826AE7D27DD4EF4';

/** Production art for the Founder Pass. The host is allowlisted in next.config. */
export const FOUNDER_PASS_ART = 'https://i.ibb.co/3YymJb6D/IMG-0680.jpg';

/** The native currency sentinel thirdweb returns for ETH-priced claim conditions. */
export const NATIVE_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
