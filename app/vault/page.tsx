'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Lock, Unlock, Music, BookOpen, ExternalLink,
  Crown, Sparkles, Shield, CheckCircle2, Users, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAccount, useReadContract, useSignMessage } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { parseAbi } from 'viem';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const NAKA_ADDRESS = '0x6967b9a8c0b14849CFE8f9E5732B401433fD2898' as const;
const SBT_ADDRESS  = '0x4e6eb6Ea74943a5d29C539974F518827C06eAcdE' as const;

const NAKA_ABI = parseAbi(['function balanceOf(address account) view returns (uint256)']);
const SBT_ABI  = parseAbi(['function balanceOf(address owner) view returns (uint256)']);

// Tier thresholds (18 decimals)
const T_INITIATE = 500n   * 10n ** 18n;
const T_CULTIST  = 5000n  * 10n ** 18n;
const T_ELDER    = 50000n * 10n ** 18n;

// ─── TIER DEFINITIONS ─────────────────────────────────────────────────────────
const TIERS = [
  { name: 'Wanderer',   min: 0n,         color: '#888888', label: '0 $NAKA',       needsSbt: false },
  { name: 'Initiate',   min: T_INITIATE,  color: '#FF4D00', label: '500+ $NAKA',   needsSbt: false },
  { name: 'Cultist',    min: T_CULTIST,   color: '#FFD700', label: '5K+ $NAKA',    needsSbt: false },
  { name: 'Elder',      min: T_ELDER,     color: '#9B30FF', label: '50K+ $NAKA',   needsSbt: false },
  { name: 'The Chosen', min: 0n,          color: '#00FF88', label: 'SBT Holder',   needsSbt: true  },
];

// ─── VAULT CONTENT ────────────────────────────────────────────────────────────
const VAULT_ITEMS = [
  // Tier 0 — Wanderer (public)
  {
    id: 1, tier: 0, type: 'lore' as const,
    title: 'Chapter 1: The Origin',
    description: 'The founding myth. Where it all began.',
    content: '"In 1948, Naka Go was born. Not as a coin, not as a project, but as a dog — wild, pure, and entirely misunderstood. The elders say he walked the early internet before the internet knew what it was. He left traces. Ghost accounts. Phantom transactions. A dog with no owner but many followers. They called him the First Wanderer."',
  },
  {
    id: 2, tier: 0, type: 'link' as const,
    title: 'Community Links',
    description: 'Find the cult.',
    content: 'community',
  },
  // Tier 1 — Initiate (500+)
  {
    id: 3, tier: 1, type: 'lore' as const,
    title: 'Chapter 2: The First Pulse',
    description: 'The event that awakened the cult. Initiates only.',
    content: '"The First Pulse happened on a Tuesday. No one knew why Tuesday. But 13 wallets moved simultaneously, each buying $NAKA in amounts that added to 1948. The Pulse was not coordinated. It was felt. The cult calls this The Signal — the moment the collective unconscious first breathed together. The blockchain recorded it. History cannot erase it."',
  },
  {
    id: 4, tier: 1, type: 'music' as const,
    title: 'Ddergo: The Cult Frequency',
    description: 'Exclusive music from the Naka Go sound lab.',
    content: 'https://open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC?utm_source=generator&theme=0',
  },
  // Tier 2 — Cultist (5K+)
  {
    id: 5, tier: 2, type: 'lore' as const,
    title: 'Chapter 3: The Survivors',
    description: 'How the inner circle was forged.',
    content: '"The cult grew not through marketing but through magnetism. Every holder who stayed through the first test — a 90% drop in 72 hours — was branded. Not physically. Economically. Their wallets showed green while the world showed red. These were The Survivors. They built the inner circle. They are the reason you are here."',
  },
  {
    id: 6, tier: 2, type: 'image' as const,
    title: 'Exclusive Wallpaper Pack',
    description: '3 exclusive Naka Go wallpapers for Cultists.',
    content: 'https://i.ibb.co/B8zQgxk/IMG-7857.jpg',
  },
  {
    id: 7, tier: 2, type: 'link' as const,
    title: 'Cultist Discord Channel',
    description: 'Private Cultist-tier community.',
    content: 'https://discord.gg/nakago',
  },
  // Tier 3 — Elder (50K+)
  {
    id: 8, tier: 3, type: 'lore' as const,
    title: 'Chapter 4: The Treasury',
    description: 'The final lore chapter. Elders only.',
    content: '"The Elders hold the Treasury address. They do not share it — they guard it. For the treasury is not funds. It is faith made liquid. Every token in that wallet represents a believer who chose conviction over comfort. The address has never moved a single token. It breathes but does not spend. When it moves, the cycle ends."',
  },
  // Tier 4 — The Chosen (SBT)
  {
    id: 9, tier: 4, type: 'badge' as const,
    title: 'The Chosen Seal',
    description: 'You have been marked. Your SBT is permanent proof.',
    content: 'CHOSEN',
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function fmtNaka(raw: bigint): string {
  const n = Number(raw) / 1e18;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}
function shortAddr(a: string) { return `${a.slice(0, 6)}…${a.slice(-4)}`; }

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function VaultPage() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [oathSigned, setOathSigned] = useState(false);

  const { data: nakaRaw } = useReadContract({
    address: NAKA_ADDRESS, abi: NAKA_ABI, functionName: 'balanceOf',
    args: [address!], query: { enabled: !!address },
  });
  const { data: sbtRaw } = useReadContract({
    address: SBT_ADDRESS, abi: SBT_ABI, functionName: 'balanceOf',
    args: [address!], query: { enabled: !!address },
  });

  const nakaBalance = nakaRaw ?? 0n;
  const hasSbt = sbtRaw ? sbtRaw > 0n : false;

  const tierIndex = (() => {
    if (!isConnected) return -1;
    if (hasSbt) return 4;
    if (nakaBalance >= T_ELDER)    return 3;
    if (nakaBalance >= T_CULTIST)  return 2;
    if (nakaBalance >= T_INITIATE) return 1;
    return 0;
  })();

  const currentTier = tierIndex >= 0 ? TIERS[tierIndex] : null;
  const nextTier = tierIndex >= 0 && tierIndex < 4 ? TIERS[tierIndex + 1] : null;

  // Progress to next tier (0-100%)
  const progressPct = (() => {
    if (!nextTier || tierIndex < 0 || hasSbt) return 100;
    const from = tierIndex >= 1 ? TIERS[tierIndex].min : 0n;
    const to   = nextTier.min;
    if (to === 0n) return 100;
    const pct = Number((nakaBalance - from) * 100n / (to - from));
    return Math.max(0, Math.min(100, pct));
  })();

  const { signMessage, isPending: isSigning } = useSignMessage({
    mutation: {
      onSuccess: () => {
        if (address) localStorage.setItem(`naka_oath_${address}`, '1');
        setOathSigned(true);
      },
    },
  });

  const handleSignOath = () => {
    if (!address) return;
    signMessage({
      message: `I am a member of the Naka Go cult.\nI hold $NAKA. I am a believer.\n\nTimestamp: ${new Date().toISOString()}\nWallet: ${address}`,
    });
  };

  return (
    <div className="min-h-screen bg-[#070707]">
      <Header />
      <div className="container mx-auto px-4 py-28 max-w-5xl">

        {/* Back */}
        <Link href="/">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors group cursor-pointer">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Home
          </motion.div>
        </Link>

        {/* HERO */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity }} className="flex justify-center mb-6">
            <div className="relative">
              <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full blur-xl" style={{ background: '#FF4D0060' }} />
              <div className="relative p-5 rounded-full" style={{ background: '#111', border: '1px solid rgba(255,77,0,0.3)' }}>
                <Lock className="w-16 h-16 text-[#FF4D00]" />
              </div>
            </div>
          </motion.div>
          <span className="text-[#FF4D00] text-sm font-black uppercase tracking-[0.35em] mb-3 block" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
            Token-Gated Content
          </span>
          <h1 className="text-7xl md:text-8xl font-black text-white leading-none mb-4" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.06em' }}>
            <span style={{ background: 'linear-gradient(135deg, #FF4D00, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>THE NAKA</span>
            <br />VAULT
          </h1>
          <p className="text-white/40 text-base max-w-md mx-auto leading-relaxed">
            Your $NAKA holdings unlock the truth. The more you hold, the deeper you go.
          </p>
        </motion.div>

        {/* TIER BADGES */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {TIERS.map((tier, i) => {
            const isActive = tierIndex === i;
            const isPassed = tierIndex > i;
            return (
              <motion.div key={tier.name} whileHover={{ scale: 1.08 }}
                className="px-4 py-2 rounded-full text-xs font-black transition-all flex items-center gap-1.5"
                style={{
                  background: isActive || isPassed ? `${tier.color}20` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive || isPassed ? tier.color + '60' : 'rgba(255,255,255,0.08)'}`,
                  color: isActive ? tier.color : isPassed ? tier.color + 'AA' : '#444',
                  fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.1em',
                  boxShadow: isActive ? `0 0 16px ${tier.color}40` : 'none',
                }}>
                {isPassed && <CheckCircle2 className="w-3 h-3" />}
                {tier.name}
                {i < 4 && <ChevronRight className="w-3 h-3 opacity-30" />}
              </motion.div>
            );
          })}
        </motion.div>

        {/* WALLET BAR */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl p-5 mb-6" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
          {!isConnected ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-white font-bold mb-1">Connect wallet to enter the Vault</p>
                <p className="text-white/30 text-sm">Your $NAKA balance determines which tier you access.</p>
              </div>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openConnectModal}
                className="px-6 py-3 rounded-full text-black font-black text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF4D00, #FFD700)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.1em' }}>
                Connect Wallet
              </motion.button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00FF88]" />
                  <span className="text-white font-bold text-sm">{shortAddr(address!)}</span>
                  <span className="text-white/30 text-xs">{fmtNaka(nakaBalance)} $NAKA</span>
                  {hasSbt && <span className="text-[#00FF88] text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)' }}>SBT Holder</span>}
                </div>
                <span className="font-black text-sm px-3 py-1 rounded-full"
                  style={{ color: currentTier?.color ?? '#888', background: `${currentTier?.color ?? '#888'}15`, border: `1px solid ${currentTier?.color ?? '#888'}30`, fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.1em' }}>
                  {currentTier?.name ?? 'Wanderer'}
                </span>
              </div>
              {nextTier && !hasSbt && (
                <div>
                  <div className="flex justify-between text-[10px] text-white/30 mb-1">
                    <span>Progress to {nextTier.name}</span>
                    <span>{nextTier.label}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${currentTier?.color ?? '#FF4D00'}, ${nextTier.color})` }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {VAULT_ITEMS.map((item, i) => {
            const tier = TIERS[item.tier];
            const isUnlocked = tierIndex >= item.tier;

            return (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={isUnlocked ? { y: -4, scale: 1.01 } : {}}
                className="rounded-2xl overflow-hidden relative"
                style={{
                  background: isUnlocked ? '#111' : '#0d0d0d',
                  border: `1px solid ${isUnlocked ? tier.color + '40' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isUnlocked ? `0 0 30px ${tier.color}10` : 'none',
                  opacity: isUnlocked ? 1 : 0.55,
                }}>

                {/* Tier badge */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black"
                  style={{ background: `${tier.color}15`, color: tier.color, border: `1px solid ${tier.color}30`, fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.08em' }}>
                  {tier.name}
                </div>

                <div className="p-5">
                  {/* Icon + Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-xl flex-shrink-0" style={{ background: `${tier.color}15` }}>
                      {item.type === 'lore' && <BookOpen className="w-5 h-5" style={{ color: tier.color }} />}
                      {item.type === 'music' && <Music className="w-5 h-5" style={{ color: tier.color }} />}
                      {item.type === 'image' && <Sparkles className="w-5 h-5" style={{ color: tier.color }} />}
                      {item.type === 'link' && <Users className="w-5 h-5" style={{ color: tier.color }} />}
                      {item.type === 'badge' && <Crown className="w-5 h-5" style={{ color: tier.color }} />}
                    </div>
                    <div>
                      <h3 className="text-white font-black text-sm mb-0.5" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.06em' }}>{item.title}</h3>
                      <p className="text-white/30 text-xs">{item.description}</p>
                    </div>
                  </div>

                  {/* Content — unlocked */}
                  {isUnlocked && (
                    <div className="mt-3">
                      {item.type === 'lore' && (
                        <p className="text-white/60 text-xs leading-relaxed italic border-l-2 pl-3" style={{ borderColor: tier.color + '60' }}>
                          {item.content}
                        </p>
                      )}
                      {item.type === 'music' && (
                        <iframe
                          src={item.content}
                          width="100%" height="100" frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          className="rounded-xl"
                        />
                      )}
                      {item.type === 'image' && (
                        <div className="flex gap-2">
                          {[0, 1, 2].map((n) => (
                            <div key={n} className="flex-1 aspect-square rounded-xl overflow-hidden" style={{ border: `1px solid ${tier.color}30` }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.content} alt="Wallpaper" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                      {item.type === 'link' && item.content === 'community' && (
                        <div className="flex flex-col gap-2">
                          <a href="https://t.me/NakaGoCult" target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-white/60 hover:text-white transition-colors"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            Telegram <ExternalLink className="w-3 h-3" />
                          </a>
                          <a href="https://x.com/NakaGoInu" target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-white/60 hover:text-white transition-colors"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            Twitter / X <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      {item.type === 'link' && item.content !== 'community' && (
                        <a href={item.content} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
                          style={{ background: `${tier.color}20`, color: tier.color, border: `1px solid ${tier.color}40` }}>
                          Join Channel <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {item.type === 'badge' && (
                        <motion.div animate={{ boxShadow: [`0 0 20px ${tier.color}40`, `0 0 60px ${tier.color}80`, `0 0 20px ${tier.color}40`] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="p-4 rounded-xl text-center" style={{ background: `${tier.color}15`, border: `1px solid ${tier.color}40` }}>
                          <Crown className="w-8 h-8 mx-auto mb-2" style={{ color: tier.color, filter: `drop-shadow(0 0 8px ${tier.color})` }} />
                          <p className="font-black text-sm" style={{ color: tier.color, fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.15em' }}>THE CHOSEN</p>
                          <p className="text-white/30 text-xs mt-1">Priority access to all future drops</p>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Locked state */}
                  {!isUnlocked && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-white/20">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Requires {tier.name} — {tier.needsSbt ? 'Mint SBT' : tier.label}</span>
                    </div>
                  )}
                </div>

                {/* Locked overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Lock className="w-8 h-8 text-white/10" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* SIGN THE OATH */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-3xl p-8 text-center" style={{ background: '#111', border: '1px solid rgba(255,77,0,0.2)', boxShadow: '0 0 60px rgba(255,77,0,0.05)' }}>
          <Shield className="w-10 h-10 mx-auto mb-4 text-[#FF4D00]" style={{ filter: 'drop-shadow(0 0 12px rgba(255,77,0,0.5))' }} />
          <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.08em' }}>
            {oathSigned ? 'OATH SIGNED' : 'SIGN THE OATH'}
          </h2>
          <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
            {oathSigned
              ? 'Your wallet is registered in the Cult. The blockchain remembers.'
              : 'Register your wallet in the Cult Registry. Sign the initiation oath. No gas required — just your signature.'}
          </p>
          {oathSigned ? (
            <div className="inline-flex items-center gap-2 text-[#00FF88] font-bold">
              <CheckCircle2 className="w-5 h-5" /> Registered in the Cult Registry
            </div>
          ) : (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={isConnected ? handleSignOath : openConnectModal}
              disabled={isSigning}
              className="px-8 py-3 rounded-full font-black text-black flex items-center gap-2 mx-auto"
              style={{ background: 'linear-gradient(135deg, #FF4D00, #FFD700)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.12em', boxShadow: '0 0 30px rgba(255,77,0,0.4)' }}>
              {isSigning ? <><Unlock className="w-4 h-4 animate-pulse" /> Signing…</> : !isConnected ? 'Connect to Sign' : <><Shield className="w-4 h-4" /> Sign the Oath</>}
            </motion.button>
          )}
        </motion.div>

        {/* How it works */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Sparkles, title: 'Hold $NAKA', desc: 'Your token balance is read live from the blockchain. No login, no signup.' },
            { icon: Unlock, title: 'Unlock Tiers', desc: 'Each tier unlocks exclusive lore, music, wallpapers, and community access.' },
            { icon: Crown, title: 'Become Chosen', desc: 'Mint an SBT to become The Chosen — the highest tier with priority access.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl p-5 text-center" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Icon className="w-6 h-6 text-[#FF4D00] mx-auto mb-2" />
              <p className="text-white text-sm font-black mb-1" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.06em' }}>{title}</p>
              <p className="text-white/30 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
