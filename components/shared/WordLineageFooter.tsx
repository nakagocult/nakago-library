'use client';

import { motion } from 'framer-motion';

const LINEAGE = [
  { word: 'Colere', def: 'To tend to a field of crops.' },
  { word: 'Cultivate', def: 'To acquire or develop skills or habits.' },
  { word: 'Culture', def: 'The collective habits and rituals of a group.' },
  {
    word: 'Cult',
    def: 'A group where the development of specific habits and rituals is tended to in a focused, concentrated, and intentional manner.',
  },
];

export default function WordLineageFooter() {
  return (
    <footer className="px-4 pb-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-16 max-w-2xl"
      >
        <div
          className="h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,77,0,0.25), transparent)' }}
        />

        {/* Colere, Cultivate, Culture */}
        <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:items-stretch sm:justify-between sm:gap-3">
          {LINEAGE.slice(0, 3).map((entry) => (
            <div key={entry.word} className="flex flex-1 flex-col items-center text-center">
              <span
                className="text-xl font-black leading-none sm:text-2xl"
                style={{
                  fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif',
                  letterSpacing: '0.06em',
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                {entry.word}
              </span>
              <p className="mt-1 max-w-[14rem] text-[11px] leading-relaxed text-white/30">
                {entry.def}
              </p>
            </div>
          ))}
        </div>

        {/* Cult — the destination */}
        <div className="mt-10 flex flex-col items-center text-center">
          <span
            className="text-4xl font-black leading-none sm:text-5xl"
            style={{
              fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif',
              letterSpacing: '0.08em',
              color: '#FF4D00',
              textShadow: '0 0 32px rgba(255,77,0,0.55)',
            }}
          >
            {LINEAGE[3].word}
          </span>
          <p className="mx-auto mt-3 max-w-sm text-[11px] leading-relaxed text-white/35">
            {LINEAGE[3].def}
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
