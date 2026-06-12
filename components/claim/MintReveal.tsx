'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { resolveCard } from '@/lib/nftCard';
import type { DropConfig, DropSlug } from '@/lib/thirdweb/drops';

interface MintRevealProps {
  drop: DropConfig;
  tokenIds: number[];
}

export default function MintReveal({ drop, tokenIds }: MintRevealProps) {
  if (tokenIds.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="mb-3 text-center text-[11px] font-black uppercase tracking-[0.25em] text-white/40">
        You minted
      </p>
      <div className={`grid gap-3 ${tokenIds.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {tokenIds.map((id, i) => (
          <RevealCard key={id} tokenId={id} slug={drop.slug} accent={drop.accent} index={i} />
        ))}
      </div>
    </div>
  );
}

function RevealCard({
  tokenId,
  slug,
  accent,
  index,
}: {
  tokenId: number;
  slug: DropSlug;
  accent: [string, string];
  index: number;
}) {
  const { label, sublabel, imgSrc } = resolveCard(slug, tokenId);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
      className="overflow-hidden rounded-2xl"
      style={{ border: `1px solid ${accent[0]}40`, background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="relative aspect-square w-full">
        <Image
          src={imgSrc}
          alt={label}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 280px"
        />
        {/* Accent glow overlay */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${accent[0]}60 0%, transparent 50%)` }}
        />
      </div>

      <div className="px-3 py-2.5">
        <p
          className="truncate text-sm font-black leading-tight text-white"
          style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
        >
          {label}
        </p>
        <div className="mt-1 flex items-center justify-between gap-1">
          <p className="truncate text-[10px] text-white/45">{sublabel}</p>
          <p className="shrink-0 text-[10px] text-white/25">#{tokenId}</p>
        </div>
      </div>
    </motion.div>
  );
}

