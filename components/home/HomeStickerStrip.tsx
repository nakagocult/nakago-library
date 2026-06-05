'use client';

import { motion } from 'framer-motion';
import {
  NakaGoSticker, NakaGoIPSticker, MoonSticker, RocketSticker,
  HodlSticker, GmFrensSticker, KanjiSticker, WagmiSticker,
  DiamondHandsSticker, CultSticker, KimonoSticker, BasedSticker,
  FireSticker, CookieSticker,
} from '@/components/shared/AnimatedStickers';

const row1 = [
  { C: NakaGoIPSticker,    size: 170, label: 'NAKA GO UP!',     delay: 0    },
  { C: MoonSticker,        size: 155, label: 'NAKA MOON',       delay: 0.07 },
  { C: HodlSticker,        size: 150, label: 'HODL',            delay: 0.14 },
  { C: GmFrensSticker,     size: 150, label: 'GM FRENS',        delay: 0.21 },
  { C: NakaGoSticker,      size: 165, label: 'NAKA GO',         delay: 0.28 },
  { C: WagmiSticker,       size: 145, label: 'WAGMI',           delay: 0.35 },
  { C: DiamondHandsSticker,size: 145, label: 'DIAMOND HANDS',   delay: 0.42 },
];

const row2 = [
  { C: CultSticker,        size: 150, label: 'THE CULT',        delay: 0.08 },
  { C: KimonoSticker,      size: 150, label: 'BORN 1948',       delay: 0.16 },
  { C: RocketSticker,      size: 145, label: 'TO THE MOON',     delay: 0.24 },
  { C: KanjiSticker,       size: 155, label: '中号',            delay: 0.32 },
  { C: BasedSticker,       size: 145, label: 'BASED',           delay: 0.40 },
  { C: FireSticker,        size: 145, label: 'ON FIRE',         delay: 0.48 },
  { C: CookieSticker,      size: 145, label: 'COOKIES & CREAM', delay: 0.56 },
];

// Pre-computed static values — no Math.random() during render (ESLint react-hooks/purity)
const STICKER_ROTATIONS = [8, -12, 6, -15, 10, -8, 14, -6, 12, -10, 7, -13, 9, -7];

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  width:    [3, 5, 2, 4, 6, 3, 5, 2, 4, 3, 5, 2, 4, 6, 3, 5, 2, 4, 3, 5][i],
  height:   [2, 4, 5, 3, 2, 4, 5, 3, 4, 2, 4, 5, 3, 2, 4, 5, 3, 4, 2, 4][i],
  left:     [5, 15, 25, 35, 45, 55, 65, 75, 85, 92, 8, 22, 38, 52, 68, 78, 88, 12, 42, 72][i],
  top:      [10, 25, 40, 55, 70, 85, 15, 30, 50, 65, 80, 20, 35, 60, 75, 90, 5, 45, 62, 95][i],
  duration: [4, 5, 6, 7, 5, 4, 6, 8, 5, 4, 7, 6, 5, 4, 8, 5, 6, 4, 7, 5][i],
  delay:    [0, 1, 2, 3, 0.5, 1.5, 2.5, 0.8, 1.8, 2.8, 0.3, 1.3, 2.3, 0.6, 1.6, 2.6, 0.2, 1.2, 2.2, 0.9][i],
}));

function StickerItem({ C, size, label, delay, index }: { C: React.ComponentType<{size?: number}>; size: number; label: string; delay: number; index: number }) {
  const rotate = STICKER_ROTATIONS[index % STICKER_ROTATIONS.length] ?? 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.7, rotate }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, type: 'spring', damping: 14, stiffness: 180 }}
      className="flex flex-col items-center gap-2 flex-shrink-0"
    >
      <C size={size} />
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.25 }}
        className="text-white/30 text-[9px] font-black tracking-[0.25em] uppercase text-center"
        style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

export default function HomeStickerStrip() {
  return (
    <section className="py-20 overflow-hidden relative" style={{ background: '#070707' }}>
      {/* bg glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,77,0,0.05) 0%, transparent 70%)' }} />

      {/* floating bg particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.width,
              height: p.height,
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: i % 2 === 0 ? '#FF4D00' : '#FFD700',
              opacity: 0.2,
            }}
            animate={{ y: [-20, 20, -20], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14 relative z-10 px-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
          style={{ background: 'rgba(255,77,0,0.1)', border: '1px solid rgba(255,77,0,0.25)' }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-[#FF4D00]"
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[#FF4D00] text-[10px] font-black tracking-[0.35em] uppercase" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
            Community Sticker Pack
          </span>
        </motion.div>

        <h2 className="text-5xl sm:text-6xl md:text-7xl font-black leading-none mb-3" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
          <span style={{ background: 'linear-gradient(135deg, #FF4D00 0%, #FFD700 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            THE CULTURE
          </span>
        </h2>
        <p className="text-white/30 text-sm">Hover. Tap. Screenshot. Spread the legacy.</p>
      </motion.div>

      {/* Row 1 */}
      <div className="relative z-10 mb-8 px-4">
        <div className="flex justify-start md:justify-center items-end gap-6 md:gap-8 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
          {row1.map((s, i) => (
            <div key={s.label} style={{ scrollSnapAlign: 'center' }}>
              <StickerItem C={s.C} size={s.size} label={s.label} delay={s.delay} index={i} />
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mx-auto mb-8 h-px max-w-sm"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,77,0,0.4), transparent)' }}
      />

      {/* Row 2 */}
      <div className="relative z-10 px-4">
        <div className="flex justify-start md:justify-center items-end gap-6 md:gap-8 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
          {row2.map((s, i) => (
            <div key={s.label} style={{ scrollSnapAlign: 'center' }}>
              <StickerItem C={s.C} size={s.size} label={s.label} delay={s.delay} index={row1.length + i} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center mt-12 relative z-10 px-4"
      >
        <p className="text-white/20 text-xs tracking-[0.3em] uppercase" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
          14 stickers · more coming · screenshot & share
        </p>
      </motion.div>
    </section>
  );
}
