'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, EyeOff, Lock } from 'lucide-react';
import type { DropConfig } from '@/lib/thirdweb/drops';
import { useDropStats } from '@/lib/thirdweb/useDropStats';
import FounderArt from './FounderArt';
import MysteryCard from './MysteryCard';

interface DropHubCardProps {
  drop: DropConfig;
  badge: string;
}

export default function DropHubCard({ drop, badge }: DropHubCardProps) {
  const stats = useDropStats(drop);
  const pct = stats.total > 0 ? Math.min(100, (stats.claimed / stats.total) * 100) : 0;

  return (
    <Link href={`/claim/${drop.slug}`} className="group block">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="relative h-full overflow-hidden rounded-3xl p-5"
        style={{
          background: 'rgba(17,17,17,0.7)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${drop.accent[0]}30`,
          boxShadow: `0 0 40px ${drop.accent[0]}10`,
        }}
      >
        {/* hover glow wash */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle at 50% 0%, ${drop.accent[0]}1f, transparent 60%)` }}
        />

        <div className="relative mb-4 overflow-hidden rounded-2xl">
          {drop.concealed ? <MysteryCard accent={drop.accent} /> : <FounderArt accent={drop.accent} />}
        </div>

        <div className="relative">
          <div className="mb-2 flex items-center justify-between">
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em]"
              style={{ background: `${drop.accent[0]}1a`, border: `1px solid ${drop.accent[0]}40`, color: drop.accent[0], fontFamily: 'Bebas Neue, Impact, sans-serif' }}
            >
              {badge}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-white/35">
              {drop.concealed ? <><EyeOff className="h-3 w-3" /> Concealed</> : <><Lock className="h-3 w-3" /> Revealed</>}
            </span>
          </div>

          <h3
            className="text-2xl font-black leading-tight text-white"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.03em' }}
          >
            {drop.title}
          </h3>
          <p className="mt-1 text-sm text-white/50">{drop.tagline}</p>

          {/* live mini progress */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-white/45">
              <span>{stats.loading ? 'reading chain…' : `${stats.claimed} / ${stats.total} claimed`}</span>
              <span>{stats.priceLabel ?? `≈ $${drop.referenceUsd}`}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${drop.accent[0]}, ${drop.accent[1]})` }}
              />
            </div>
          </div>

          <div
            className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3 transition-colors"
            style={{ background: `${drop.accent[0]}12`, border: `1px solid ${drop.accent[0]}33` }}
          >
            <span className="text-sm font-black uppercase tracking-[0.1em] text-white" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
              Enter Drop
            </span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: drop.accent[0] }} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
