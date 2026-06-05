'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ParticleField from '@/components/shared/ParticleField';

interface Artwork {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  description: string;
  emoji: string;
  bg: string;
  accent: string;
  tags: string[];
}

const ARTWORKS: Artwork[] = [
  {
    id: 'moon-kimono',
    title: 'Naka Go',
    subtitle: 'Moonrise at Akaishi',
    year: '1948',
    description: 'The legendary Shiba Inu in ceremonial kimono, gazing at the full moon. Rockets streak the sky, moon cheese drifts past. Born in the mountains of Akaishi, Naka Go transcended his time to become the genetic foundation of an entire breed.',
    emoji: '🌕',
    bg: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a0a 100%)',
    accent: '#FFD700',
    tags: ['Kimono', 'Moon', 'Akaishi', 'Legacy'],
  },
  {
    id: 'temple-kimono',
    title: 'Naka Go',
    subtitle: 'Guardian of the Temple',
    year: '1963',
    description: 'Standing before ancient stone torii gates, Naka Go in his ceremonial kimono guards the heritage of the Shiba Inu. The temple behind him represents the lineage secured, the legacy preserved across generations.',
    emoji: '⛩️',
    bg: 'linear-gradient(135deg, #1a0a0a 0%, #2e0a0a 50%, #0a0a0a 100%)',
    accent: '#FF4D00',
    tags: ['Temple', 'Torii', 'Heritage', 'Guardian'],
  },
  {
    id: 'warrior',
    title: 'Naka Go',
    subtitle: 'The Survivor',
    year: '1945',
    description: 'When WWII devastated Japan, only a handful of Shiba Inus survived near-extinction. Naka Go emerged from the ashes stronger. This piece honors that survival spirit, the will to endure, to persist, to rebuild.',
    emoji: '⚔️',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a00 50%, #0a0a0a 100%)',
    accent: '#FFD700',
    tags: ['Warrior', 'Survival', 'WWII', 'Strength'],
  },
  {
    id: 'genesis',
    title: 'Naka Go',
    subtitle: 'The Genesis',
    year: '1950s',
    description: '80% of all modern Shiba Inus trace their lineage directly back to Naka Go of Akaishi-so. One dog. One bloodline. The genesis of a breed. This is that beginning, rendered in fire and gold.',
    emoji: '🔥',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #2e1a0a 50%, #0a0a0a 100%)',
    accent: '#FF4D00',
    tags: ['Genesis', 'Bloodline', 'Origin', 'Fire'],
  },
  {
    id: 'doge-legend',
    title: 'Naka Go',
    subtitle: 'The Legend Lives On',
    year: '2025',
    description: 'The $NAKA token carries the spirit of Naka Go into the blockchain era. The first Shiba to survive extinction now lives on as a cultural icon, memorialized forever on-chain. This is digital immortality.',
    emoji: '💎',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #0a1a2e 50%, #0a0a0a 100%)',
    accent: '#00ffff',
    tags: ['Digital', 'Immortal', 'Blockchain', '$NAKA'],
  },
  {
    id: 'full-moon',
    title: 'Naka Go',
    subtitle: 'Full Moon Ritual',
    year: 'Every 18th',
    description: 'The 18th of every month. A full moon rises. The community gathers. Cookies are passed. Messages shared. The ritual of the $NAKA holders, honoring the legacy with every cycle of the moon.',
    emoji: '🍪',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%)',
    accent: '#FF4D00',
    tags: ['Full Moon', 'Ritual', 'Community', 'Cookies'],
  },
];

function ArtCard({ art, index, onOpen }: { art: Artwork; index: number; onOpen: (art: Artwork) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => onOpen(art)}
      className="rounded-3xl overflow-hidden cursor-pointer group relative"
      style={{
        background: art.bg,
        border: `1px solid ${art.accent}30`,
        boxShadow: `0 0 30px ${art.accent}10`,
      }}
    >
      {/* Art canvas */}
      <div className="relative h-72 flex items-center justify-center overflow-hidden">
        {/* Dynamic background shapes */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute w-48 h-48 rounded-full opacity-20"
          style={{ background: `radial-gradient(circle, ${art.accent}, transparent)`, filter: 'blur(30px)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 3 + index * 0.5, repeat: Infinity }}
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at center, ${art.accent}20 0%, transparent 70%)` }}
        />

        {/* Main artwork emoji (massive) */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 4 + index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10"
          style={{ fontSize: 100, lineHeight: 1, filter: `drop-shadow(0 0 30px ${art.accent}80)` }}
        >
          {art.emoji}
        </motion.div>

        {/* Floating accent particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: art.accent,
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              opacity: 0.4,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        {/* Zoom hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl"
        >
          <ZoomIn className="w-8 h-8 text-white" />
        </motion.div>

        {/* Year badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black"
          style={{
            background: `${art.accent}20`,
            border: `1px solid ${art.accent}50`,
            color: art.accent,
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            letterSpacing: '0.1em',
          }}
        >
          {art.year}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.2em' }}>
          {art.subtitle}
        </p>
        <h3
          className="text-white font-black text-2xl leading-none mb-3"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}
        >
          {art.title}
        </h3>
        <p className="text-white/40 text-xs leading-relaxed mb-4 line-clamp-2">{art.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {art.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{ background: `${art.accent}15`, color: art.accent, border: `1px solid ${art.accent}30` }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function LightboxModal({ art, onClose }: { art: Artwork; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="relative max-w-2xl w-full rounded-3xl overflow-hidden"
        style={{
          background: art.bg,
          border: `1px solid ${art.accent}40`,
          boxShadow: `0 0 100px ${art.accent}30`,
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Art display */}
        <div className="relative h-80 flex items-center justify-center overflow-hidden">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute w-64 h-64 rounded-full opacity-20"
            style={{ background: `radial-gradient(circle, ${art.accent}, transparent)`, filter: 'blur(40px)' }}
          />
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 3, -3, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: 130, lineHeight: 1, filter: `drop-shadow(0 0 50px ${art.accent})` }}
          >
            {art.emoji}
          </motion.div>

          <div
            className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-sm font-black"
            style={{
              background: `${art.accent}20`,
              border: `1px solid ${art.accent}50`,
              color: art.accent,
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              letterSpacing: '0.15em',
            }}
          >
            {art.year}
          </div>
        </div>

        {/* Info */}
        <div className="p-8">
          <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-2" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
            {art.subtitle}
          </p>
          <h2
            className="text-4xl font-black text-white mb-4"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}
          >
            {art.title}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-6">{art.description}</p>
          <div className="flex flex-wrap gap-2">
            {art.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full font-bold"
                style={{ background: `${art.accent}20`, color: art.accent, border: `1px solid ${art.accent}40` }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [selected, setSelected] = useState<Artwork | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="relative overflow-hidden">
        <ParticleField density={40} color="#FF4D00" />
        <Header />

        <div className="relative z-10 container mx-auto px-4 py-28 max-w-6xl">
          {/* Back */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-10 transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Home
            </motion.div>
          </Link>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl mb-6"
              style={{ filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.6))' }}
            >
              🐕
            </motion.div>
            <span
              className="text-[#FF4D00] text-sm font-black uppercase tracking-[0.4em] mb-4 block"
              style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
            >
              The Naka Go Collection
            </span>
            <h1
              className="text-6xl md:text-8xl font-black text-white mb-4 leading-none"
              style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #FF4D00, #FFD700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(255,77,0,0.4))',
                }}
              >
                GALLERY
              </span>
            </h1>
            <p className="text-white/40 text-base max-w-xl mx-auto leading-relaxed">
              The visual legacy of Naka Go. Born 1948. Survived WWII. Saved his breed. Now immortalized in art and on-chain forever.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {ARTWORKS.map((art, i) => (
              <ArtCard key={art.id} art={art} index={i} onOpen={setSelected} />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-white/30 text-sm mb-4">
              More artwork and exclusive NFT drops coming with the M4NGA collection
            </p>
            <Link href="/m4nga">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-black text-sm cursor-pointer"
                style={{
                  fontFamily: 'Bebas Neue, Impact, sans-serif',
                  letterSpacing: '0.1em',
                  background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
                  boxShadow: '0 0 30px rgba(255,77,0,0.4)',
                }}
              >
                EXPLORE M4NGA
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {selected && <LightboxModal art={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
