'use client';

import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface StatItem {
  icon: string;
  value: string;
  numericValue?: number;
  suffix?: string;
  label: string;
  description: string;
}

const stats: StatItem[] = [
  {
    icon: '🧬',
    value: '80%+',
    numericValue: 80,
    suffix: '%+',
    label: 'Influenced',
    description: "Modern Shibas trace back to Naka Go's bloodline — the most genetically significant Shiba in history",
  },
  {
    icon: '📅',
    value: '1948',
    numericValue: 1948,
    suffix: '',
    label: 'Born',
    description: 'Post-WWII Japan, when Shiba Inus faced extinction from disease, famine, and air raids',
  },
  {
    icon: '🏅',
    value: 'NIPPO',
    label: 'Recognized',
    description: 'Nihon Ken Hozonkai — Japan\'s official breed preservation society recognized Naka Go\'s exceptional qualities',
  },
  {
    icon: '🐕',
    value: '$NAKA',
    label: 'Symbol',
    description: 'Honoring the legend on Ethereum — the first meme coin with real historical DNA',
  },
];

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const duration = 2000;
    const start = performance.now();
    const startVal = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startVal + (value - startVal) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [started, value]);

  return (
    <div ref={ref}>
      {display}
      {suffix}
    </div>
  );
}

export default function StatsBlock() {
  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#FF4D00] text-sm font-bold uppercase tracking-widest mb-3 block">
            The Numbers
          </span>
          <h2
            className="text-4xl md:text-5xl text-white mb-4"
            style={{
              fontFamily: 'var(--font-permanent-marker)',
              background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Legacy by the Numbers
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{
                scale: 1.03,
                boxShadow: '0 0 40px rgba(255,77,0,0.5)',
              }}
              className="bg-[#111] rounded-3xl p-8 border border-white/5 cursor-default"
              style={{ boxShadow: '0 0 25px rgba(255,77,0,0.2)' }}
            >
              {/* Icon */}
              <div className="text-4xl mb-4">{stat.icon}</div>

              {/* Value */}
              <div
                className="text-4xl md:text-5xl font-bold mb-1"
                style={{
                  fontFamily: 'var(--font-permanent-marker)',
                  background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.numericValue !== undefined ? (
                  <AnimatedNumber value={stat.numericValue} suffix={stat.suffix ?? ''} />
                ) : (
                  stat.value
                )}
              </div>

              {/* Label */}
              <div
                className="text-white/60 text-sm uppercase tracking-widest mb-3"
                style={{ fontFamily: 'var(--font-permanent-marker)' }}
              >
                {stat.label}
              </div>

              {/* Description */}
              <p className="text-white/40 text-xs leading-relaxed">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
