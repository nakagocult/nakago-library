'use client';

import { motion } from 'framer-motion';
import GradientButton from '@/components/shared/GradientButton';
import ParticleField from '@/components/shared/ParticleField';
import ShibaMascot from '@/components/shared/ShibaMascot';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticleField density={150} color="#FF4D00" />
      </div>

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.8) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 flex flex-col items-center text-center max-w-5xl">
        {/* Logo badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FF4D00]/30 bg-[#FF4D00]/10 backdrop-blur"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
          <span className="text-[#FF4D00] text-sm font-semibold tracking-widest uppercase">
            $NAKA on Ethereum
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
          style={{ fontFamily: 'var(--font-permanent-marker)' }}
        >
          <span className="text-5xl sm:text-7xl md:text-8xl text-white block">
            NAKA GO
          </span>
          <span
            className="text-3xl sm:text-4xl md:text-5xl text-white/80 block mt-1"
            style={{ fontFamily: 'var(--font-noto-sans-jp)' }}
          >
            中号
          </span>
        </motion.h1>

        {/* Shiba Mascot */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="my-8"
          style={{ animation: 'float 4s ease-in-out infinite' }}
        >
          <ShibaMascot size={280} className="mx-auto sm:hidden" />
          <ShibaMascot size={340} className="mx-auto hidden sm:block md:hidden" />
          <ShibaMascot size={400} className="mx-auto hidden md:block" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6"
          style={{
            fontFamily: 'var(--font-permanent-marker)',
            background: 'linear-gradient(135deg, #FF4D00 0%, #FF0000 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 15px rgba(255,77,0,0.5))',
          }}
        >
          The Shiba Who Saved His Breed
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Born 1948. Survived WWII. Became the genetic foundation of{' '}
          <span className="text-[#FF4D00] font-semibold">80%</span> of modern Shiba Inus.
          This is his story.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <GradientButton href="#tokenomics" size="lg" variant="primary">
            Buy $NAKA
          </GradientButton>
          <GradientButton href="#about" size="lg" variant="outline">
            Read the Story
          </GradientButton>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { value: '80%+', label: 'Shibas Influenced' },
            { value: '1948', label: 'Year Born' },
            { value: '0/0', label: 'Tax' },
            { value: '1B', label: 'Total Supply' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl md:text-3xl font-bold"
                style={{
                  fontFamily: 'var(--font-permanent-marker)',
                  background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </div>
              <div className="text-white/40 text-xs uppercase tracking-widest mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{
          y: [0, 10, 0],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          y: { duration: 1.5, repeat: Infinity },
          opacity: { duration: 1.5, repeat: Infinity },
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-[#FF4D00] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
