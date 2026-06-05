'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, EyeOff, Sparkles, FlaskConical } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/shared/Reveal';
import MysteryCard from '@/components/claim/MysteryCard';
import MintProgress from '@/components/claim/MintProgress';
import ClaimConsole from '@/components/claim/ClaimConsole';
import { NIPPO } from '@/lib/thirdweb/drops';
import { useDropStats } from '@/lib/thirdweb/useDropStats';

export default function NippoClaimPage() {
  const stats = useDropStats(NIPPO);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto max-w-6xl px-4 py-28">
        <Link href="/claim">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group mb-10 inline-flex items-center gap-2 text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> All Drops
          </motion.div>
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Concealed visual */}
          <Reveal from="left">
            <MysteryCard accent={NIPPO.accent} />
            <div
              className="mt-4 flex items-start gap-2.5 rounded-2xl p-4"
              style={{ background: '#0d0d0d', border: '1px solid rgba(255,77,0,0.18)' }}
            >
              <EyeOff className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#FF4D00]" />
              <p className="text-xs leading-relaxed text-white/55">
                Images are concealed during mint to prevent Rare Boi sniping. Proof of fairly
                randomized order exists in the{' '}
                <Link href="/lore-lab" className="font-semibold text-[#FFD700] underline-offset-2 hover:underline">
                  Lore Lab
                </Link>
                .
              </p>
            </div>
          </Reveal>

          {/* Claim side */}
          <div>
            <Reveal>
              <span
                className="text-xs font-black uppercase tracking-[0.3em] text-[#FF4D00]"
                style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
              >
                Drop 01 · Culture Cards
              </span>
              <h1
                className="mt-2 text-5xl font-black leading-[0.95] text-white md:text-6xl"
                style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.02em' }}
              >
                <span className="text-gradient-gold">The NIPPO</span>
                <br />Pedigree Archives
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/65">
                Culture card NFTs granting lifetime access to Cult features across every project
                that emerges in the swarm.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-6 rounded-2xl p-5" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)' }}>
                <MintProgress
                  claimed={stats.claimed}
                  total={stats.total}
                  rareBois={NIPPO.rareBois}
                  accent={NIPPO.accent}
                  loading={stats.loading}
                />
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-5">
                <ClaimConsole drop={NIPPO} maxPerTx={10} />
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-6 space-y-3 text-sm leading-relaxed text-white/55">
                <p>
                  <Sparkles className="mr-1.5 -mt-0.5 inline h-4 w-4 text-[#FFD700]" />
                  NakaLabs hosts the first Cult features — early trade signals, unique interfaces,
                  treasury proposals, experimental tools. The feature set evolves as we build.
                </p>
                <p>
                  <FlaskConical className="mr-1.5 -mt-0.5 inline h-4 w-4 text-[#FF4D00]" />
                  Rare Bois get Rare Boi features (TBD). All funds go to the multisig to support
                  development, infrastructure, and future bootstraps.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
