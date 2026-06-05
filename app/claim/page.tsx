'use client';

import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/shared/Reveal';
import DropHubCard from '@/components/claim/DropHubCard';
import { NIPPO, FOUNDER_PASS } from '@/lib/thirdweb/drops';

export default function ClaimHubPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto max-w-5xl px-4 py-28">
        <Reveal>
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
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal index={0}>
            <DropHubCard drop={NIPPO} badge="Drop 01" />
          </Reveal>
          <Reveal index={1}>
            <DropHubCard drop={FOUNDER_PASS} badge="Drop 02" />
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <p className="mt-10 text-center text-xs leading-relaxed text-white/30">
            Connect any of 500+ wallets. All mint funds route to the NakaLabs multisig to fund
            development, infrastructure, and future bootstraps.
          </p>
        </Reveal>
      </div>
      <Footer />
    </div>
  );
}
