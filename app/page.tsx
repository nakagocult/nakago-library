'use client';

import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';
import ClaimConsole from '@/components/claim/ClaimConsole';
import MintProgress from '@/components/claim/MintProgress';
import { FOUNDER_PASS, NIPPO, type DropConfig } from '@/lib/thirdweb/drops';
import { useDropStats } from '@/lib/thirdweb/useDropStats';

const DROPS: Array<{ drop: DropConfig; maxPerTx: number; badge: string }> = [
  { drop: NIPPO, maxPerTx: 10, badge: 'Drop 01' },
  { drop: FOUNDER_PASS, maxPerTx: 5, badge: 'Drop 02' },
];

export default function MintPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-14 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: '#111', border: '1px solid rgba(255,77,0,0.3)', boxShadow: '0 0 30px rgba(255,77,0,0.2)' }}
        >
          <Gem className="h-8 w-8 text-[#FF4D00]" />
        </motion.div>

        <span
          className="block text-xs font-black uppercase tracking-[0.35em] text-[#FF4D00]"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          Mint · Ethereum
        </span>
        <h1
          className="mt-3 text-6xl font-black leading-none text-white md:text-7xl"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
        >
          <span className="text-gradient-fire">CLAIM</span> THE DROPS
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/45">
          Two drops, live on-chain. Culture cards for swarm-wide access, and Founder Passes for
          the people who show up first. Numbers below are read straight from the contracts.
        </p>
      </div>

      {/* Drop cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {DROPS.map(({ drop, maxPerTx, badge }, i) => (
          <motion.div
            key={drop.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <MintDrop drop={drop} maxPerTx={maxPerTx} badge={badge} />
          </motion.div>
        ))}
      </section>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 text-center text-xs leading-relaxed text-white/30"
      >
        Connect any of 500+ wallets. All mint funds route to the NakaLabs multisig to fund
        development, infrastructure, and future bootstraps.
      </motion.p>
    </main>
  );
}

function MintDrop({ drop, maxPerTx, badge }: { drop: DropConfig; maxPerTx: number; badge: string }) {
  const stats = useDropStats(drop);

  return (
    <article
      className="glass-card flex flex-col overflow-hidden"
      style={{ borderColor: `${drop.accent[0]}30` }}
    >
      {/* Drop header */}
      <div className="p-6 pb-4">
        <div className="mb-1 flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest"
            style={{ background: `${drop.accent[0]}1a`, border: `1px solid ${drop.accent[0]}40`, color: drop.accent[0], fontFamily: 'Bebas Neue, Impact, sans-serif' }}
          >
            {badge}
          </span>
        </div>
        <h2
          className="mt-2 text-3xl font-black leading-tight text-white"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.03em' }}
        >
          {drop.title}
        </h2>
        <p className="mt-1 text-sm text-white/45">{drop.tagline}</p>
      </div>

      {/* Progress */}
      <div className="mx-6 mb-4 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <MintProgress
          claimed={stats.claimed}
          total={stats.total}
          rareBois={drop.rareBois}
          accent={drop.accent}
          loading={stats.loading}
        />
      </div>

      {/* Claim console */}
      <div className="mt-auto p-6 pt-0">
        <ClaimConsole drop={drop} maxPerTx={maxPerTx} />
      </div>
    </article>
  );
}
