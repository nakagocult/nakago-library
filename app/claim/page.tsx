'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gem, Check } from 'lucide-react';
import ClaimConsole from '@/components/claim/ClaimConsole';
import MintProgress from '@/components/claim/MintProgress';
import { FOUNDER_PASS, NIPPO, type DropConfig } from '@/lib/thirdweb/drops';
import { useDropStats } from '@/lib/thirdweb/useDropStats';

interface DropEntry {
  drop: DropConfig;
  maxPerTx: number;
  badge: string;
  cardImage: string;
  perks: ReactNode[];
}

const DROPS: DropEntry[] = [
  {
    drop: NIPPO,
    maxPerTx: 4,
    badge: 'Drop 01',
    cardImage: '/nfts/nippo-dossier.png',
    perks: [
      <>
        Increases your{' '}
        <Link href="/rain" className="font-semibold text-white underline-offset-2 hover:underline">
          💧 Rain
        </Link>{' '}
        multiplier
      </>,
      "Token credits toward Henk's art generators",
      'Lifetime access to Cult features across the swarm',
      'Tap in to the community',
      '10 Rare Boi pedigrees in the drop',
    ],
  },
  {
    drop: FOUNDER_PASS,
    maxPerTx: 4,
    badge: 'Drop 02',
    cardImage: '/nfts/naka-labs-logo.jpg',
    perks: [
      'Founder perks for life, subscription baked in',
      'Priority access to every Naka Labs bootstrap',
      '60 Rare Boi tiers with elevated standing',
      'Direct line into the Labs build pipeline',
    ],
  },
];

const [NIPPO_ENTRY, FOUNDER_ENTRY] = DROPS;

// Source order is mobile (single column): claim → perks → claim → perks.
// On md+ the `mdOrder` classes swap the second row so the claim boxes land on the
// diagonal: NIPPO claim (TL) · NIPPO perks (TR) · Founder perks (BL) · Founder claim (BR).
const CELLS: Array<{ kind: 'claim' | 'perks'; entry: DropEntry; mdOrder: string }> = [
  { kind: 'claim', entry: NIPPO_ENTRY, mdOrder: 'md:order-1' },
  { kind: 'perks', entry: NIPPO_ENTRY, mdOrder: 'md:order-2' },
  { kind: 'claim', entry: FOUNDER_ENTRY, mdOrder: 'md:order-4' },
  { kind: 'perks', entry: FOUNDER_ENTRY, mdOrder: 'md:order-3' },
];

export default function ClaimPage() {
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
          style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
        >
          <span className="text-gradient-fire">CLAIM</span> THE DROPS
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/45">
          Two drops, live on-chain. Culture cards for swarm-wide access, and Founder Passes for
          the people who show up first. Numbers below are read straight from the contracts.
        </p>
      </div>

      {/* Drop cards — staggered: claim boxes on the diagonal, perks on the off-diagonal */}
      <section className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
        {CELLS.map((cell, i) => (
          <motion.div
            key={`${cell.entry.drop.slug}-${cell.kind}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`h-full ${cell.mdOrder}`}
          >
            {cell.kind === 'claim' ? (
              <ClaimBox entry={cell.entry} />
            ) : (
              <PerksPanel entry={cell.entry} />
            )}
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
        Connect any of 500+ wallets. All mint funds route to the Naka Go Cult multisig to fund
        development, infrastructure, buybacks, and future bootstraps.
      </motion.p>

    </main>
  );
}

/** The actionable tile: drop header, live progress, and the claim console. */
function ClaimBox({ entry }: { entry: DropEntry }) {
  const { drop, maxPerTx, badge } = entry;
  const stats = useDropStats(drop);

  return (
    <article
      className="glass-card flex h-full flex-col p-6"
      style={{ borderColor: `${drop.accent[0]}30` }}
    >
      {/* Header */}
      <span
        className="mb-3 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest"
        style={{ background: `${drop.accent[0]}1a`, border: `1px solid ${drop.accent[0]}40`, color: drop.accent[0], fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif' }}
      >
        {badge}
      </span>
      <h2
        className="text-3xl font-black leading-tight text-white"
        style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.03em' }}
      >
        {drop.title}
      </h2>

      {/* Progress */}
      <div className="mt-5 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <MintProgress
          claimed={stats.claimed}
          total={stats.total}
          rareBois={drop.rareBois}
          accent={drop.accent}
          loading={stats.loading}
        />
      </div>

      {/* Claim console */}
      <div className="mt-auto pt-5">
        <ClaimConsole drop={drop} maxPerTx={maxPerTx} />
      </div>
    </article>
  );
}

/** The descriptive side: drop art as a dimmed backdrop with the perks checklist over it. */
function PerksPanel({ entry }: { entry: DropEntry }) {
  const { drop, cardImage, perks } = entry;

  return (
    <div
      className="relative flex h-full flex-col justify-center overflow-hidden rounded-3xl p-7 sm:p-9"
      style={{ border: `1px solid ${drop.accent[0]}20` }}
    >
      {/* Drop art, dimmed into the background */}
      <Image
        src={cardImage}
        alt={drop.title}
        fill
        className="object-cover opacity-40"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.82) 100%)' }}
      />

      <div className="relative">
        <span className="mb-4 block text-[11px] font-black uppercase tracking-[0.25em] text-white/45">
          What You Get
        </span>
        <ul className="flex flex-col gap-3.5">
          {perks.map((perk, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-white/85">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full backdrop-blur-sm"
                style={{ background: `${drop.accent[0]}26`, border: `1px solid ${drop.accent[0]}55` }}
              >
                <Check className="h-3 w-3" style={{ color: drop.accent[0] }} />
              </span>
              {perk}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
