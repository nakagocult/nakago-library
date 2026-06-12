'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHASES = [
  { id: 'kanji', duration: 1800 },
  { id: 'year', duration: 1500 },
  { id: 'tagline', duration: 2000 },
  { id: 'story', duration: 2500 },
  { id: 'enter', duration: 99999 },
];

// Pre-computed static values — no Math.random() during render
const PARTICLE_LEFT  = [8,15,23,31,42,54,63,71,79,87,93,5,18,28,38,48,58,68,76,84,91,11,21,35,47,59,72,82,89,96];
const PARTICLE_TOP   = [5,18,32,47,61,73,85,12,26,40,55,68,80,92,7,22,37,52,66,78,90,14,29,44,57,70,83,95,20,48];
const PARTICLE_DUR   = [2,3,4,2.5,3.5,2,4,3,2.5,3.5,2,4,2.5,3,4,2,3.5,2.5,4,3,2,3.5,2.5,4,3,2,4,2.5,3.5,2];
const PARTICLE_DELAY = [0,0.3,0.7,1.1,0.5,0.9,0.2,1.4,0.6,1.0,0.4,0.8,1.2,0.1,0.7,1.5,0.3,0.9,0.5,1.3,0.2,0.8,1.0,0.4,1.6,0.6,0.1,1.2,0.7,0.3];

export default function IntroScreen() {
  const [skip] = useState(() =>
    typeof window !== 'undefined' && !!sessionStorage.getItem('naka_intro_done')
  );
  const [phase, setPhase] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (skip) return;
    let elapsed = 0;
    const ids: ReturnType<typeof setTimeout>[] = [];
    PHASES.forEach((p, i) => {
      if (i === PHASES.length - 1) return;
      const t = setTimeout(() => setPhase(i + 1), elapsed + p.duration);
      ids.push(t);
      elapsed += p.duration;
    });
    timeoutsRef.current = ids;
    return () => ids.forEach(clearTimeout);
  }, [skip]);

  const handleEnter = () => {
    sessionStorage.setItem('naka_intro_done', '1');
    setDismissed(true);
  };

  if (skip || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{ background: '#000' }}
      >
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
          }}
        />

        {/* Animated orbs */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,77,0,0.25) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,77,0,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <motion.div
          animate={{ x: [0, -40, 30, 0], y: [0, 20, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)', filter: 'blur(50px)' }}
        />

        {/* Particle dots */}
        {PARTICLE_LEFT.map((left, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${left}%`,
              top: `${PARTICLE_TOP[i]}%`,
              background: i % 3 === 0 ? '#FF4D00' : i % 3 === 1 ? '#FFD700' : '#fff',
              opacity: 0.4,
            }}
            animate={{ opacity: [0.1, 0.6, 0.1], scale: [0.8, 1.4, 0.8] }}
            transition={{ duration: PARTICLE_DUR[i], repeat: Infinity, delay: PARTICLE_DELAY[i] }}
          />
        ))}

        {/* Content */}
        <div className="relative z-30 text-center px-6 max-w-2xl w-full">

          {/* Phase 0: Kanji */}
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.div
                key="kanji"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <motion.div
                  animate={{ filter: ['drop-shadow(0 0 10px #FFD700)', 'drop-shadow(0 0 40px #FF4D00)', 'drop-shadow(0 0 10px #FFD700)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[120px] leading-none font-bold"
                  style={{ fontFamily: "'Noto Serif JP', serif", color: '#FFD700' }}
                >
                  中号
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/40 text-sm mt-2 tracking-widest uppercase"
                  style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.5em' }}
                >
                  Naka Go
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 1: Year */}
          <AnimatePresence mode="wait">
            {phase === 1 && (
              <motion.div
                key="year"
                initial={{ opacity: 0, y: 40, letterSpacing: '0.5em' }}
                animate={{ opacity: 1, y: 0, letterSpacing: '0.15em' }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.7 }}
              >
                <div
                  className="text-[100px] md:text-[140px] leading-none font-black"
                  style={{
                    fontFamily: 'Bebas Neue, Impact, sans-serif',
                    background: 'linear-gradient(135deg, #FF4D00, #FFD700)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 20px rgba(255,77,0,0.6))',
                  }}
                >
                  1948
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.5 }}
                  className="text-white text-sm mt-3 tracking-[0.4em] uppercase"
                  style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
                >
                  The legend was born
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 2: Tagline */}
          <AnimatePresence mode="wait">
            {phase === 2 && (
              <motion.div
                key="tagline"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-px mx-auto"
                  style={{ background: 'linear-gradient(90deg, transparent, #FF4D00, transparent)', maxWidth: 300 }}
                />
                <div
                  className="text-4xl md:text-6xl font-black leading-tight"
                  style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.08em' }}
                >
                  {['LOYALTY', 'NEVER', 'DIES'].map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.15 }}
                      className="block"
                      style={{
                        background: i === 1 ? 'linear-gradient(135deg, #FF4D00, #FFD700)' : undefined,
                        WebkitBackgroundClip: i === 1 ? 'text' : undefined,
                        WebkitTextFillColor: i === 1 ? 'transparent' : 'white',
                        backgroundClip: i === 1 ? 'text' : undefined,
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="h-px mx-auto"
                  style={{ background: 'linear-gradient(90deg, transparent, #FFD700, transparent)', maxWidth: 300 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 3: Story */}
          <AnimatePresence mode="wait">
            {phase === 3 && (
              <motion.div
                key="story"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-5"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-white/30 text-xs uppercase tracking-[0.4em]"
                  style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
                >
                  One Shiba Changed Everything
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-black leading-tight"
                  style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', color: 'white' }}
                >
                  Guardian of the breed.
                  <br />
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #FF4D00, #FFD700)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    He saved the entire breed.
                  </span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.7 }}
                  className="text-white text-sm leading-relaxed max-w-sm mx-auto"
                >
                  80% of all modern Shiba Inus trace their lineage to one dog. Born 1948. Akaishi line. The $NAKA token honors that legacy.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 4: Enter */}
          <AnimatePresence mode="wait">
            {phase === 4 && (
              <motion.div
                key="enter"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                className="space-y-8"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex justify-center"
                >
                  <motion.div
                    animate={{ boxShadow: ['0 0 20px rgba(255,77,0,0.5)', '0 0 50px rgba(255,215,0,0.8)', '0 0 20px rgba(255,77,0,0.5)'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-28 h-28 rounded-full overflow-hidden"
                    style={{ border: '3px solid rgba(255,215,0,0.6)' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://i.ibb.co/B8zQgxk/IMG-7857.jpg"
                      alt="Naka Go"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </motion.div>

                <div>
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-white/40 text-xs uppercase tracking-[0.5em] mb-3"
                    style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
                  >
                    Are you worthy of the legacy?
                  </motion.div>
                  <div
                    className="text-5xl md:text-7xl font-black leading-none mb-2"
                    style={{
                      fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif',
                      letterSpacing: '0.04em',
                      background: 'linear-gradient(135deg, #FF4D00, #FFD700)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 30px rgba(255,77,0,0.5))',
                    }}
                  >
                    ENTER THE
                    <br />
                    ECOSYSTEM
                  </div>
                </div>

                <motion.button
                  onClick={handleEnter}
                  whileHover={{ scale: 1.06, boxShadow: '0 0 60px rgba(255,77,0,0.8)' }}
                  whileTap={{ scale: 0.96 }}
                  animate={{ boxShadow: ['0 0 25px rgba(255,77,0,0.4)', '0 0 50px rgba(255,77,0,0.7)', '0 0 25px rgba(255,77,0,0.4)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-14 py-5 rounded-full text-white font-black text-xl tracking-widest uppercase cursor-pointer"
                  style={{
                    fontFamily: 'Bebas Neue, Impact, sans-serif',
                    background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
                    letterSpacing: '0.2em',
                    border: '2px solid rgba(255,215,0,0.3)',
                  }}
                >
                  I Am Worthy
                </motion.button>

                <motion.button
                  onClick={handleEnter}
                  className="block mx-auto text-white/25 text-xs tracking-widest uppercase mt-2 hover:text-white/50 transition-colors cursor-pointer"
                  style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.3em' }}
                >
                  Skip Intro
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Phase indicator dots */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center z-30">
          <div className="flex gap-2">
            {PHASES.map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: phase === i ? 1 : 0.2, scale: phase === i ? 1.4 : 1 }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: phase === i ? '#FF4D00' : '#fff' }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
