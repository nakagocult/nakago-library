'use client';

import { useState, useLayoutEffect, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Step {
  badge: string;
  icon: string;
  title: [string, string]; // [plain, accent]
  text: string;
}

const STEPS: Step[] = [
  {
    badge: 'Welcome',
    icon: '中',
    title: ['Step into ', 'NAKA GO'],
    text: 'Born 1948 of the Akaishi line. The Shiba who saved the breed — now living on-chain as $NAKA.',
  },
  {
    badge: 'Legacy',
    icon: '血',
    title: ['Loyalty Never ', 'Dies'],
    text: '80% of every Shiba Inu alive today carries his bloodline. The legend never left.',
  },
  {
    badge: 'Ecosystem',
    icon: '中号',
    title: ['Enter The ', 'Ecosystem'],
    text: 'Claim drops, browse the gallery, and stream DDERGO Radio — all in one place.',
  },
];

export default function IntroScreen() {
  // Starts false to match the server-rendered markup exactly (sessionStorage
  // doesn't exist during SSR). useLayoutEffect corrects it client-side before
  // the browser paints, so a returning visitor never sees the intro flash —
  // and React never has to discard a mismatched hydration tree.
  const [skip, setSkip] = useState(false);
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useLayoutEffect(() => {
    // Must run synchronously before paint — deferring this to a microtask
    // would let the intro flash for returning visitors for one frame.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (sessionStorage.getItem('naka_intro_done')) setSkip(true);
  }, []);

  // Hide the always-mounted AuroraBackground while the intro covers the screen.
  // It's invisible behind the opaque overlay but still burns GPU otherwise.
  useEffect(() => {
    const active = !skip && !dismissed;
    document.body.classList.toggle('intro-active', active);
    return () => document.body.classList.remove('intro-active');
  }, [skip, dismissed]);

  const finish = () => {
    sessionStorage.setItem('naka_intro_done', '1');
    window.dispatchEvent(new Event('naka:intro-done'));
    setDismissed(true);
  };

  const next = () => {
    if (step === STEPS.length - 1) finish();
    else setStep((s) => s + 1);
  };

  if (skip || dismissed) return null;

  const current = STEPS[step];

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
        style={{ background: '#050505' }}
      >
        {/* Single static glow — no infinite-loop particles or blur filters,
            both costly on low-power mobile webviews. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(255,77,0,0.18) 0%, transparent 60%)' }}
        />

        {/* Card + skip, stacked and centered so Skip sits just below the frame */}
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        {/* Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full rounded-3xl p-6"
          style={{ background: 'rgba(17,17,17,0.85)', border: '1px solid rgba(255,77,0,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
        >
          <div className="mb-5 flex items-center justify-between">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#FF4D00]"
              style={{ background: 'rgba(255,77,0,0.12)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF4D00]" /> {current.badge}
            </span>
            <span className="text-xs font-bold tabular-nums text-white/30">
              {step + 1} / {STEPS.length}
            </span>
          </div>

          <div
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold"
            style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', fontFamily: "'Noto Serif JP', serif", color: '#FFD700' }}
          >
            {current.icon}
          </div>

          <h2
            className="mb-3 text-3xl font-black leading-tight"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.02em' }}
          >
            <span className="text-white">{current.title[0]}</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #FF4D00, #FFD700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {current.title[1]}
            </span>
          </h2>

          <p className="mb-6 text-sm leading-relaxed text-white/55">{current.text}</p>

          {/* Step dots */}
          <div className="mb-5 flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full transition-colors"
                style={{ background: i <= step ? '#FF4D00' : 'rgba(255,255,255,0.12)' }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                aria-label="Previous"
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              onClick={next}
              className="flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-sm font-black uppercase tracking-[0.15em] text-black"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FF4D00)', boxShadow: '0 0 24px rgba(255,77,0,0.35)' }}
            >
              {step === STEPS.length - 1 ? 'Enter Site' : 'Continue'} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Skip — always available, never gated behind the last step; sits just
            below the card frame. */}
        <button
          type="button"
          onClick={finish}
          className="mt-4 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-white/45 transition-colors hover:text-white"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          Skip Intro <X className="h-3 w-3" />
        </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
