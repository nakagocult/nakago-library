'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Clock, Infinity as InfinityIcon } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/shared/Reveal';
import FounderArt from '@/components/claim/FounderArt';
import MintProgress from '@/components/claim/MintProgress';
import ClaimConsole from '@/components/claim/ClaimConsole';
import ProvablyFair from '@/components/claim/ProvablyFair';
import { FOUNDER_PASS, FOUNDER_FAIRNESS_HASH } from '@/lib/thirdweb/drops';
import { useDropStats } from '@/lib/thirdweb/useDropStats';

const BREAKDOWN = [
  { icon: Clock, label: '420 Passes', detail: '6-month subscription', color: '#FF4D00' },
  { icon: Crown, label: '60 Rare Bois', detail: '12-month subscription', color: '#9B30FF' },
  { icon: InfinityIcon, label: 'All 480', detail: 'Lifetime Founder perks', color: '#FFD700' },
];

export default function FounderPassClaimPage() {
  const stats = useDropStats(FOUNDER_PASS);

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
          {/* Art + fairness */}
          <Reveal from="left">
            <FounderArt accent={FOUNDER_PASS.accent} />
            <div className="mt-4">
              <ProvablyFair
                hash={FOUNDER_FAIRNESS_HASH}
                accent={FOUNDER_PASS.accent}
                note="Randomized-order proof, committed before mint. Verify your token against this hash after reveal."
              />
            </div>
          </Reveal>

          {/* Claim side */}
          <div>
            <Reveal>
              <span
                className="text-xs font-black uppercase tracking-[0.3em] text-[#9B30FF]"
                style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
              >
                Drop 02 · Founder Access
              </span>
              <h1
                className="mt-2 text-5xl font-black leading-[0.95] text-white md:text-6xl"
                style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.02em' }}
              >
                Naka Labs
                <br /><span style={{ background: 'linear-gradient(135deg,#FF4D00,#9B30FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Founder Pass</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/65">
                The keys to NakaLabs from day one. Every pass carries a subscription and lifetime
                Founder perks — Rare Bois carry double.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {BREAKDOWN.map(({ icon: Icon, label, detail, color }) => (
                  <div key={label} className="rounded-2xl p-3.5 text-center" style={{ background: '#0d0d0d', border: `1px solid ${color}33` }}>
                    <Icon className="mx-auto mb-1.5 h-5 w-5" style={{ color }} />
                    <p className="text-sm font-black text-white" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}>{label}</p>
                    <p className="mt-0.5 text-[10px] leading-tight text-white/40">{detail}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-5 rounded-2xl p-5" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)' }}>
                <MintProgress
                  claimed={stats.claimed}
                  total={stats.total}
                  rareBois={FOUNDER_PASS.rareBois}
                  accent={FOUNDER_PASS.accent}
                  loading={stats.loading}
                />
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-5">
                <ClaimConsole drop={FOUNDER_PASS} maxPerTx={5} />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
