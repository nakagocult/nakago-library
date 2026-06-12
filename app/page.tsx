'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gem, Images, ArrowRight } from 'lucide-react';
import { MASCOT_URL, SOCIAL_LINKS } from '@/lib/site';

const STATS = [
  { value: '80%+', label: 'Shibas Influenced' },
  { value: '1948', label: 'Year Born' },
  { value: '0/0', label: 'Tax' },
  { value: '1B', label: 'Total Supply' },
];

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MASCOT_URL} alt="Naka Go" className="h-full w-full object-cover" />
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

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-14"
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
    </main>
  );
}
