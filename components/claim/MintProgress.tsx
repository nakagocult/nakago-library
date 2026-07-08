'use client';

import CountUp from 'react-countup';
import { motion } from 'framer-motion';

interface MintProgressProps {
  claimed: number;
  total: number;
  rareBois: number;
  accent: [string, string];
  loading: boolean;
}

export default function MintProgress({ claimed, total, rareBois, accent, loading }: MintProgressProps) {
  const pct = total > 0 ? Math.min(100, (claimed / total) * 100) : 0;
  const remaining = Math.max(0, total - claimed);

  return (
    <div>
      <div className="mb-2 flex items-end justify-between">
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-4xl font-black leading-none"
            style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', color: accent[0] }}
          >
            {loading ? '…' : <CountUp end={claimed} duration={1.4} separator="," preserveValue />}
          </span>
          <span className="text-lg font-bold text-white/35" style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif' }}>
            / {total} claimed
          </span>
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/40">
          {loading ? 'reading chain…' : `${remaining} left`}
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${accent[0]}, ${accent[1]})`,
            boxShadow: `0 0 16px ${accent[0]}80`,
          }}
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-black tracking-wide"
          style={{
            background: `${accent[1]}1a`,
            border: `1px solid ${accent[1]}40`,
            color: accent[1],
            fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif',
            letterSpacing: '0.1em',
          }}
        >
          {rareBois} RARE BOIS
        </span>
        <span className="text-[11px] text-white/30">scarce tier · randomized order</span>
      </div>
    </div>
  );
}
