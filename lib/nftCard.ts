import { fpTier, fpImg, NIPPO_MAP } from '@/lib/nftMaps';
import type { DropSlug } from '@/lib/thirdweb/drops';

export interface CardMeta {
  label: string;
  sublabel: string;
  /** Local image path, or '' when the token has no known artwork. */
  imgSrc: string;
}

/** Maps a drop + token id to its display name, subtitle, and artwork. */
export function resolveCard(slug: DropSlug, tokenId: number): CardMeta {
  if (slug === 'founder-pass') {
    const tier = fpTier(tokenId);
    return {
      label: tier === '12-month' ? '12-Month Pass' : '6-Month Pass',
      sublabel: tier === '12-month' ? 'Rare tier · Founder perks' : 'Founder perks',
      imgSrc: fpImg(tokenId),
    };
  }

  const entry = NIPPO_MAP[tokenId];
  if (entry) {
    return {
      label: entry.name,
      sublabel: `${entry.lineage} · ${entry.rarity}`,
      imgSrc: entry.img,
    };
  }

  return { label: `Token #${tokenId}`, sublabel: '', imgSrc: '' };
}
