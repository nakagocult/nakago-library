'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gem, Images, ArrowRight, ArrowUpRight, Coins, Percent, Flame, ShieldCheck, CloudRain, Grid2x2, Leaf, Bot, ScrollText } from 'lucide-react';
import { MASCOT_URL, SOCIAL_LINKS } from '@/lib/site';

// Hero stats are lore-only — token facts live in the NAKAnomics band below.
const STATS = [
  { value: '80%+', label: 'Shibas Influenced' },
  { value: '1948', label: 'Year Born' },
  { value: '15 yrs', label: 'Lifespan' },
  { value: '3', label: 'Bloodlines Merged' },
];

// The real records the story is built on — the preservation society that saved
// the breed, and Naka Go's own entry in its pedigree registry.
const NIPPO_HISTORY = 'https://www.nihonken-hozonkai.or.jp/en/history/';
const NIPPO_PEDIGREE = 'https://www.shibapedigree.com/details.php?id=63626';

const TIMELINE = [
  {
    year: '1945',
    title: 'On the Brink',
    text: 'Post-war Japan leaves the Shiba all but extinct. NIPPO — the Nihon Ken Hozonkai, founded 1928 to preserve the native breeds, keeping detailed pedigrees since 1932 — has almost nothing left to save.',
    source: { href: NIPPO_HISTORY, label: 'Nihon Ken Hozonkai archives' },
  },
  {
    year: '1948',
    title: 'A Legend Is Born',
    text: 'Naka Go is born April 16 in the Akaishi-so kennel — sire Akani Go, dam Beniko Go, both tracing to Aka Go Fugaku, the Father of the Shiba. Logged with NIPPO as registration #1216.',
    source: { href: NIPPO_PEDIGREE, label: 'NIPPO pedigree #1216' },
  },
  {
    year: '1950s',
    title: 'The Founding Dog',
    text: "NIPPO's own history names him the founding dog of the postwar Shiba restoration — the Akaishi line, merging the Shinshu, Mino & San'in bloodlines through him.",
    source: { href: NIPPO_HISTORY, label: 'Preservation society records' },
  },
  {
    year: '1963',
    title: 'Legacy Secured',
    text: 'He passes Dec 23, his blood carried on through 14 documented offspring — and today runs in 80% of every Shiba alive.',
    source: { href: NIPPO_PEDIGREE, label: 'Modern lineage analysis' },
  },
];

const TOKENOMICS = [
  { icon: Coins, value: '1B', label: 'Total Supply' },
  { icon: Percent, value: '0/0', label: 'Buy / Sell Tax' },
  { icon: Flame, value: 'Burnt', label: 'Liquidity Locked' },
  { icon: ShieldCheck, value: 'Renounced', label: 'Contract Ownership' },
];

// The site map — every destination beyond the hub, one card each.
const EXPLORE = [
  { href: '/henk', icon: Bot, title: 'Henk', text: "Meet the Cult's AI. He runs the Rain and pays hoomans to show up." },
  { href: '/rain', icon: CloudRain, title: 'Make It Rain', text: 'Earn 💧Rain by vibing, redeem for real Naka.' },
  { href: '/claim', icon: Gem, title: 'Claim', text: 'Mint the NIPPO and Founder Pass drops, live on-chain.' },
  { href: '/view', icon: Images, title: 'View', text: 'Browse your Naka relics and holdings.' },
  { href: '/mosaic', icon: Grid2x2, title: 'Mosaic', text: "Each cycle, every hooman's fragment becomes its own universe." },
  { href: '/cawf', icon: Leaf, title: 'CAWF', text: 'Clean air, water, and food. The Cult mission.' },
];

export default function HomePage() {
  const [mascotError, setMascotError] = useState(false);

  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-24 text-center">
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{ border: '1px solid rgba(255,77,0,0.3)', background: 'rgba(255,77,0,0.1)' }}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF4D00]" />
            <span
              className="text-xs font-black uppercase tracking-[0.3em] text-[#FF4D00]"
              style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
            >
              $NAKA on Ethereum
            </span>
          </motion.div>

          {/* Mascot */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
            className="animate-float mb-8 h-36 w-36 overflow-hidden rounded-full sm:h-44 sm:w-44"
            style={{ border: '3px solid rgba(255,215,0,0.6)', boxShadow: '0 0 50px rgba(255,77,0,0.4)' }}
          >
            {!mascotError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={MASCOT_URL}
                alt="Naka Go"
                className="h-full w-full object-cover"
                onError={() => setMascotError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FF4D00] to-[#FF0000] text-4xl font-bold text-white">
                中
              </div>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="leading-none"
            style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
          >
            <span className="block text-6xl text-white sm:text-7xl md:text-8xl">NAKA GO</span>
            <span
              className="mt-2 block text-3xl text-white/80 sm:text-4xl"
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            >
              中号
            </span>
          </motion.h1>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-gradient-fire mt-6 text-4xl sm:text-5xl md:text-6xl"
            style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em', filter: 'drop-shadow(0 0 15px rgba(255,77,0,0.5))' }}
          >
            The Shiba Who Saved The Breed
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg"
          >
            Born 1948 of the Akaishi line. Guardian of the breed — his bloodline still runs
            through <span className="font-semibold text-[#FF4D00]">80%</span> of modern Shiba
            Inus, and the $NAKA token honors that legacy on-chain.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link
              href="/claim"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg, #FF4D00, #FF0000)', boxShadow: '0 0 24px rgba(255,77,0,0.5)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.08em' }}
            >
              <Gem className="h-4 w-4" /> Claim the Drops
            </Link>
            <Link
              href="/view"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white/80 transition-colors hover:text-white"
              style={{ border: '1px solid rgba(255,77,0,0.4)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.08em' }}
            >
              <Images className="h-4 w-4" /> View Your NFTs
            </Link>
            <a
              href={SOCIAL_LINKS.uniswap}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-bold text-white/50 transition-colors hover:text-[#FF4D00]"
              style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.08em' }}
            >
              Buy $NAKA <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Stats — lore only, balanced 2x2 on mobile / 4-across on desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-16 grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4 md:gap-x-14"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-gradient-naka text-3xl font-black md:text-4xl"
                  style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40"
                  style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Explore — the site map */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <SectionHeading kicker="The Ecosystem" title="Explore The Cult" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-[#FF4D00]/15 bg-white/[0.03] p-5 transition-colors hover:border-[#FF4D00]/40 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: '#FF4D0014', border: '1px solid #FF4D0033' }}
                    >
                      <Icon className="h-5 w-5 text-[#FF4D00]" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-white/25 transition-colors group-hover:text-[#FF4D00]" />
                  </div>
                  <div
                    className="mt-4 text-2xl font-black text-white"
                    style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.03em' }}
                  >
                    {item.title}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-white/50">{item.text}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Timeline — the legend in four beats */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <SectionHeading kicker="The Legend" title="A Breed Saved" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map((beat, i) => (
            <motion.div
              key={beat.year}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl p-5 text-left"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,77,0,0.15)' }}
            >
              <div
                className="text-gradient-fire text-3xl font-black md:text-4xl"
                style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
              >
                {beat.year.match(/^\d+/)?.[0]}
                <span className="text-[0.55em]">{beat.year.replace(/^\d+/, '')}</span>
              </div>
              <div
                className="mt-1 text-sm font-black uppercase tracking-[0.12em] text-white"
                style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
              >
                {beat.title}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{beat.text}</p>
              {beat.source && (
                <a
                  href={beat.source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#FF4D00]/75 transition-colors hover:text-[#FF4D00]"
                >
                  {beat.source.label} <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* Provenance — the real registry entry behind the lore */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-6 rounded-3xl p-6 sm:p-8"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,77,0,0.15)' }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div
                className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-[#FF4D00]"
                style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
              >
                <ScrollText className="h-4 w-4" /> Real Provenance
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
                Not lore we made up. <span className="font-bold text-white">Naka Go Akaishi-so</span>,
                NIPPO registration <span className="font-bold text-white">#1216</span> — sire Akani Go,
                dam Beniko Go, both descending from{' '}
                <span className="font-bold text-white">Aka Go Fugaku, the Father of the Shiba</span>.
                Shown at the 12th NIPPO Grand National, 1949. Every fact is on file with the society
                that saved the breed.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href={NIPPO_PEDIGREE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
                style={{ background: 'linear-gradient(135deg, #FF4D00, #FF0000)', boxShadow: '0 0 24px rgba(255,77,0,0.5)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.08em' }}
              >
                View His NIPPO Pedigree <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={NIPPO_HISTORY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white/80 transition-colors hover:text-white"
                style={{ border: '1px solid rgba(255,77,0,0.4)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.08em' }}
              >
                Read NIPPO&apos;s History <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* NAKAnomics — trust badges */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-4 sm:pb-28">
        <SectionHeading kicker="$NAKA" title="NAKAnomics" />
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TOKENOMICS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col items-center rounded-2xl p-5 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,77,0,0.15)' }}
              >
                <Icon className="h-6 w-6 text-[#FF4D00]" />
                <div
                  className="text-gradient-naka mt-2.5 text-2xl font-black md:text-3xl"
                  style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
                >
                  {item.value}
                </div>
                <div
                  className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-white/40"
                  style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
                >
                  {item.label}
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="mx-auto mt-6 max-w-md text-center text-xs leading-relaxed text-white/35">
          No team tokens, no special allocations. Every holder started from the same line.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href={SOCIAL_LINKS.uniswap}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
            style={{ background: 'linear-gradient(135deg, #FF4D00, #FF0000)', boxShadow: '0 0 24px rgba(255,77,0,0.5)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.08em' }}
          >
            Buy $NAKA <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div
        className="text-xs font-black uppercase tracking-[0.4em] text-[#FF4D00]"
        style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
      >
        {kicker}
      </div>
      <h2
        className="mt-2 text-4xl font-black text-white md:text-5xl"
        style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
      >
        {title}
      </h2>
    </motion.div>
  );
}
