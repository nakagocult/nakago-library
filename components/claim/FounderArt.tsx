'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { FOUNDER_PASS_ART } from '@/lib/thirdweb/drops';

interface FounderArtProps {
  accent: [string, string];
}

/** Founder Pass artwork. Falls back to an aurora crest if the remote art can't load. */
export default function FounderArt({ accent }: FounderArtProps) {
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl"
      style={{
        border: `1px solid ${accent[1]}40`,
        boxShadow: `0 0 50px ${accent[1]}1f, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {!failed ? (
        <Image
          src={FOUNDER_PASS_ART}
          alt="Naka Labs Founder Pass"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          onError={() => setFailed(true)}
          priority
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-4"
          style={{ background: `radial-gradient(circle at 50% 35%, ${accent[1]}33, #0c0c0c 70%)` }}
        >
          <Crown className="h-16 w-16" style={{ color: accent[1], filter: `drop-shadow(0 0 14px ${accent[1]})` }} />
          <p className="text-sm font-black uppercase tracking-[0.3em]" style={{ color: accent[1], fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
            Founder Pass
          </p>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.7))' }} />
    </motion.div>
  );
}
