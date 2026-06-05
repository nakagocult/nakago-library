'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import { Lock } from 'lucide-react';

interface MysteryCardProps {
  accent: [string, string];
}

const HEX = '0123456789ABCDEF';

/** Deterministic pseudo-random so server and client render identical glyphs. */
function seededRows(rows: number, cols: number): string[] {
  let seed = 1948;
  const next = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => HEX[Math.floor(next() * 16)]).join(''),
  );
}

/**
 * Sealed-archive card for concealed drops. The real art is intentionally hidden
 * to prevent Rare Boi sniping — this renders a glowing, shifting encrypted card
 * in its place.
 */
export default function MysteryCard({ accent }: MysteryCardProps) {
  const reduce = useReducedMotion();
  const rows = useMemo(() => seededRows(14, 22), []);

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl"
      style={{
        background: 'linear-gradient(160deg, #0d0d0d 0%, #141414 100%)',
        border: `1px solid ${accent[0]}40`,
        boxShadow: `0 0 50px ${accent[0]}1f, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* shifting aurora wash */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${accent[0]}33, transparent 55%), radial-gradient(circle at 75% 80%, ${accent[1]}26, transparent 55%)`,
          backgroundSize: '160% 160%',
        }}
        animate={reduce ? undefined : { backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* drifting encrypted glyph wall */}
      <div className="absolute inset-0 flex flex-col justify-center gap-1 px-3 opacity-25">
        {rows.map((row, i) => (
          <motion.p
            key={i}
            className="whitespace-nowrap font-mono text-[10px] tracking-[0.25em]"
            style={{ color: i % 3 === 0 ? accent[1] : accent[0] }}
            animate={reduce ? undefined : { x: i % 2 === 0 ? ['-4%', '4%', '-4%'] : ['4%', '-4%', '4%'] }}
            transition={{ duration: 8 + i, repeat: Infinity, ease: 'easeInOut' }}
          >
            {row}
          </motion.p>
        ))}
      </div>

      {/* scanline sweep */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute inset-x-0 h-24"
          style={{ background: `linear-gradient(180deg, transparent, ${accent[0]}26, transparent)` }}
          animate={{ y: ['-30%', '130%'] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* sealed crest */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-2xl backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.45)', border: `1px solid ${accent[0]}66` }}
          animate={reduce ? undefined : { boxShadow: [`0 0 20px ${accent[0]}40`, `0 0 50px ${accent[0]}99`, `0 0 20px ${accent[0]}40`] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Lock className="h-9 w-9" style={{ color: accent[0] }} />
        </motion.div>
        <div className="text-center">
          <p
            className="text-sm font-black uppercase tracking-[0.3em]"
            style={{ color: accent[1], fontFamily: 'Bebas Neue, Impact, sans-serif' }}
          >
            Sealed Archive
          </p>
          <p className="mt-1 text-[11px] text-white/35">Revealed after mint</p>
        </div>
      </div>
    </div>
  );
}
