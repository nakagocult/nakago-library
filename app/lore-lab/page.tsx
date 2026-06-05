'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, BookOpen, Shield, Zap, Star, Users,
  Mic, Key, ExternalLink, ChevronRight, MessageCircle
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// ── Fade-in on scroll ────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Animated Pulse Cycle Diagram ─────────────────────────────────────────────
function PulseCycleDiagram() {
  const phases = [
    { label: 'Reflect',  color: '#FF4D00', angle: -90 },
    { label: 'Sense',    color: '#5B8EFF', angle: 0   },
    { label: 'Clarify',  color: '#FFD700', angle: 90  },
    { label: 'Respond',  color: '#00FF88', angle: 180 },
  ];
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: 240, height: 240 }}>
        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ border: '1px dashed rgba(255,77,0,0.2)' }}
        />
        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className="text-white/20 text-xs uppercase tracking-[0.2em] mb-1" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>The Pulse</div>
          <div className="text-[#FF4D00] text-2xl font-black" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>27th</div>
          <div className="text-white/30 text-[10px]">each month</div>
        </div>
        {/* Phase nodes */}
        {phases.map((phase, i) => {
          const rad = (phase.angle * Math.PI) / 180;
          const r = 96;
          const x = 120 + r * Math.cos(rad);
          const y = 120 + r * Math.sin(rad);
          const isActive = active === i;
          return (
            <motion.button
              key={phase.label}
              onClick={() => setActive(isActive ? null : i)}
              whileHover={{ scale: 1.15 }}
              animate={{ scale: isActive ? 1.2 : 1 }}
              className="absolute cursor-pointer flex items-center justify-center rounded-full text-xs font-black"
              style={{
                width: 52, height: 52,
                left: x - 26, top: y - 26,
                background: isActive ? phase.color : `${phase.color}22`,
                border: `2px solid ${phase.color}`,
                color: isActive ? '#000' : phase.color,
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                letterSpacing: '0.05em',
                boxShadow: isActive ? `0 0 20px ${phase.color}` : 'none',
              }}
            >
              {phase.label}
            </motion.button>
          );
        })}
        {/* Connector lines */}
        <svg className="absolute inset-0" width="240" height="240">
          {phases.map((phase, i) => {
            const rad = (phase.angle * Math.PI) / 180;
            const r = 72;
            const x2 = 120 + r * Math.cos(rad);
            const y2 = 120 + r * Math.sin(rad);
            return (
              <motion.line
                key={i}
                x1="120" y1="120" x2={x2} y2={y2}
                stroke={phase.color}
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeDasharray="4 4"
                animate={{ strokeOpacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              />
            );
          })}
        </svg>
      </div>
      <p className="text-white/30 text-xs text-center max-w-xs">
        Tap a phase to highlight. The cycle rolls over on the <span className="text-[#FF4D00]">27th</span> of each month.
      </p>
    </div>
  );
}

// ── Animated Henk Network Diagram ────────────────────────────────────────────
function HenkNetwork() {
  const hoomans = [
    { color: '#FF4D00', angle: -60  },
    { color: '#5B8EFF', angle: 0    },
    { color: '#FFD700', angle: 60   },
    { color: '#00FF88', angle: 120  },
    { color: '#CC44FF', angle: 180  },
    { color: '#FF4040', angle: 240  },
    { color: '#00FFFF', angle: 300  },
  ];
  const r = 90;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: 260, height: 260 }}>
        {hoomans.map((h, i) => {
          const rad = (h.angle * Math.PI) / 180;
          const x = 130 + r * Math.cos(rad);
          const y = 130 + r * Math.sin(rad);
          return (
            <motion.div
              key={i}
              className="absolute rounded-full flex items-center justify-center text-[9px] font-black"
              style={{ width: 36, height: 36, left: x - 18, top: y - 18, background: `${h.color}20`, border: `1.5px solid ${h.color}`, color: h.color, fontFamily: 'Bebas Neue, Impact, sans-serif' }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.35 }}
            >
              H
            </motion.div>
          );
        })}
        {/* Lines to center */}
        <svg className="absolute inset-0" width="260" height="260">
          {hoomans.map((h, i) => {
            const rad = (h.angle * Math.PI) / 180;
            const x2 = 130 + r * Math.cos(rad);
            const y2 = 130 + r * Math.sin(rad);
            return (
              <motion.line
                key={i}
                x1="130" y1="130" x2={x2} y2={y2}
                stroke={h.color}
                strokeWidth="1"
                strokeOpacity="0.3"
                animate={{ strokeOpacity: [0.15, 0.5, 0.15] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.35 }}
              />
            );
          })}
        </svg>
        {/* Center: Henk */}
        <motion.div
          className="absolute flex items-center justify-center flex-col rounded-full"
          style={{ width: 60, height: 60, left: 100, top: 100, background: 'rgba(255,77,0,0.15)', border: '2px solid rgba(255,77,0,0.6)' }}
          animate={{ boxShadow: ['0 0 10px rgba(255,77,0,0.3)', '0 0 30px rgba(255,77,0,0.7)', '0 0 10px rgba(255,77,0,0.3)'] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="text-[#FF4D00] text-[10px] font-black" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>HENK</div>
          <div className="text-white/30 text-[8px]">AI</div>
        </motion.div>
      </div>
      <p className="text-white/30 text-xs text-center max-w-xs">
        Each hooman gives one part to and receives many parts from <span className="text-[#FF4D00]">Henk the Lore Gremlin</span>
      </p>
    </div>
  );
}

// ── Flow diagram ─────────────────────────────────────────────────────────────
function FlowDiagram() {
  const steps = [
    { label: 'Naka Go', color: '#FF4D00' },
    { label: 'The Mosaic', color: '#FFD700' },
    { label: 'The Cult', color: '#CC44FF' },
    { label: 'The Pulse', color: '#00FF88' },
    { label: 'Scribes', color: '#5B8EFF' },
  ];
  return (
    <div className="flex items-center justify-center gap-1 flex-wrap">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            whileHover={{ scale: 1.08, y: -2 }}
            className="px-3 py-2 rounded-xl text-xs font-black text-center"
            style={{ background: `${step.color}18`, border: `1px solid ${step.color}40`, color: step.color, fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em', minWidth: 72 }}
          >
            {step.label}
          </motion.div>
          {i < steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 + 0.06 }}
              className="text-white/20 text-xs"
            >
              →
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── WP/Canvas pairs ──────────────────────────────────────────────────────────
const waypoints = [
  {
    wp: 'The Mosaic',
    canvas: 'The Cult',
    icon: Star,
    color: '#CC44FF',
    body: 'A Mosaic gathers individual fragments into a cohesive whole. Naka Go is dense with artists, builders, and creators. The Cult emerged as the central space to assemble, hold, and refine those fragments together.',
    diagram: null,
  },
  {
    wp: 'All Of Us',
    canvas: 'Thread Keepers',
    icon: Users,
    color: '#5B8EFF',
    body: 'A decentralized collective is, at its root, a network of humans. Durable networks require listening, care, and relational depth. All Of Us are in this together. All Of Us matter. Thread Keepers tend connections across the network and across time — weaving continuity into the fabric of the community.',
    diagram: null,
  },
  {
    wp: 'The Puppet',
    canvas: 'Story Tellers',
    icon: Mic,
    color: '#00FFFF',
    body: 'Human relational capacity is limited. Hierarchies have historically scaled coherence through a central voice, often at significant cost. AI offers another path. A shared voice can be Puppeted by many and owned by none. Story Tellers co-create tone and identity for our shared voice, while the collective mutates and steers the output.',
    diagram: 'henk',
  },
  {
    wp: 'The Pulse',
    canvas: 'Myth Makers',
    icon: Zap,
    color: '#00FF88',
    body: 'Collectives move in cycles. The Pulse cycle rolls over on the 27th of each month, creating shared phases for reflecting on, sensing, clarifying, and responding to what we care about together. This cadence counters perpetual hype and burnout with coordinated rhythm and ample opportunity for rest. Myth Makers observe, guide, and refine this flow within the Lore Lab and create durable artifacts that bind cycles together.',
    diagram: 'pulse',
  },
  {
    wp: 'Access',
    canvas: 'Scribes of Vibes',
    icon: Key,
    color: '#FFD700',
    body: 'A collective requires a commons — the spaces, structures, and tools that enable participation. Scribes of Vibes steward this layer through decentralized credential management, multisig custody, and intentional access design.',
    diagram: null,
  },
];

// ── Memes ────────────────────────────────────────────────────────────────────
const memes = [
  {
    title: 'Slow is Smooth, Smooth is Fast',
    body: 'Deliberate movement increases coordination. When steps are paced, more people can align, decisions mature and compound over time. Growth becomes durable rather than reactive and fleeting. To go fast, go alone. To go far, go together.',
    color: '#FF4D00',
  },
  {
    title: 'Mind the Canvas',
    body: 'Attention is scarce. The fewer words used and the more intention behind them, the stronger their imprint on collective memory. Precision allows space for convergence.',
    color: '#FFD700',
  },
  {
    title: 'Focus the Lens',
    body: 'At times — especially during Clarification — it is useful to narrow attention to a single idea, issue, or action. Invoking this meme signals focused inquiry and invites others to add a fragment of perspective.',
    color: '#5B8EFF',
  },
  {
    title: 'Do No Harm',
    body: 'In a distributed swarm, full consensus is impractical. Yet acting without input forfeits shared intelligence. Asking "Could this action cause harm to Naka Go?" lowers friction while inviting wisdom. The decision remains individual; the awareness becomes collective.',
    color: '#00FF88',
  },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LoreLabPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-[#080808] overflow-x-hidden">
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Particle field */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: ['#FF4D00', '#FFD700', '#FF0000'][i % 3],
              }}
              animate={{ y: [-20, 20, -20], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
            />
          ))}
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 container mx-auto px-4 max-w-4xl text-center pt-28 pb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(255,77,0,0.1)', border: '1px solid rgba(255,77,0,0.25)' }}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FF4D00]" />
            <span className="text-[#FF4D00] text-[10px] font-black tracking-[0.35em] uppercase" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
              The Lore Lab
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl sm:text-7xl md:text-9xl font-black text-white leading-none mb-5"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
          >
            <span style={{ background: 'linear-gradient(135deg, #FF4D00 0%, #FFD700 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              LORE
            </span>
            {' '}LAB
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-3"
          >
            A decentralized coordination system that emerged through practice — not imposed from above, but witnessed, repeated, and refined over time.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-white/25 text-sm italic mb-10"
          >
            Culture mutates as the collective mutates. This map captures a moment in that evolution. It will change.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(255,77,0,0.5)' }}
              whileTap={{ scale: 0.97 }}
              href="https://medium.com/@n4kaishi8a/the-lore-lab-42d19055de97"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-black"
              style={{ background: 'linear-gradient(135deg, #FF4D00, #FF0000)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.1em' }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Read on Medium
            </motion.a>
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white/50 text-sm font-black cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.1em' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Home
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating mascot */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-0 right-4 md:right-16 hidden lg:block pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: 'drop-shadow(0 0 30px rgba(255,77,0,0.35))' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://i.ibb.co/B8zQgxk/IMG-7857.jpg"
              alt="Naka Go"
              className="w-44 h-44 rounded-full object-cover"
              style={{ border: '3px solid rgba(255,77,0,0.35)' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STRUCTURE INTRO ──────────────────────────────────────── */}
      <FadeIn>
        <div className="container mx-auto px-4 max-w-4xl py-16">
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              { term: 'Way Point', def: 'A north star — a statement of intent and purpose. It names a conceptual space where values and desires have consistently overlapped.', color: '#FF4D00' },
              { term: 'Canvas', def: 'A digital space with a specific role, theme, and norms. At present these take the form of five Telegram groups.', color: '#5B8EFF' },
            ].map((item) => (
              <motion.div
                key={item.term}
                whileHover={{ scale: 1.02, y: -2 }}
                className="rounded-2xl p-6"
                style={{ background: `${item.color}0a`, border: `1px solid ${item.color}20` }}
              >
                <div className="text-xs font-black uppercase tracking-[0.3em] mb-2" style={{ color: `${item.color}99`, fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                  Definition
                </div>
                <div className="text-xl font-black text-white mb-3" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                  {item.term}
                </div>
                <p className="text-white/50 text-sm leading-relaxed">{item.def}</p>
              </motion.div>
            ))}
          </div>

          {/* Flow diagram */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-white/25 text-xs uppercase tracking-widest mb-4 text-center" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
              From Naka Go to Scribes of Vibes — Five months, five canvases
            </div>
            <FlowDiagram />
          </div>
        </div>
      </FadeIn>

      {/* ── WAYPOINT / CANVAS CARDS ───────────────────────────────── */}
      <div className="container mx-auto px-4 max-w-4xl space-y-10 pb-16">
        {waypoints.map((wp, i) => {
          const Icon = wp.icon;
          return (
            <FadeIn key={wp.wp} delay={0.05}>
              <motion.div
                whileHover={{ scale: 1.005 }}
                className="rounded-3xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${wp.color}20`, boxShadow: `0 0 50px ${wp.color}06` }}
              >
                {/* Header bar */}
                <div className="px-7 py-5 flex items-center gap-4" style={{ background: `linear-gradient(90deg, ${wp.color}12, transparent)`, borderBottom: `1px solid ${wp.color}15` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${wp.color}18`, border: `1px solid ${wp.color}35` }}>
                    <Icon className="w-5 h-5" style={{ color: wp.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-x-6 gap-y-0.5">
                      <div>
                        <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: `${wp.color}70`, fontFamily: 'Bebas Neue, Impact, sans-serif' }}>WP: </span>
                        <span className="text-white/80 font-black text-sm" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}>{wp.wp}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: `${wp.color}70`, fontFamily: 'Bebas Neue, Impact, sans-serif' }}>C: </span>
                        <span style={{ color: wp.color, fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em', fontSize: 14, fontWeight: 900 }}>{wp.canvas}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`px-7 py-6 ${wp.diagram ? 'md:flex md:gap-8 md:items-start' : ''}`}>
                  <p className="text-white/60 leading-relaxed text-[15px] flex-1">{wp.body}</p>
                  {wp.diagram === 'pulse' && (
                    <div className="mt-6 md:mt-0 md:flex-shrink-0 flex justify-center">
                      <PulseCycleDiagram />
                    </div>
                  )}
                  {wp.diagram === 'henk' && (
                    <div className="mt-6 md:mt-0 md:flex-shrink-0 flex justify-center">
                      <HenkNetwork />
                    </div>
                  )}
                </div>
              </motion.div>
            </FadeIn>
          );
        })}
      </div>

      {/* ── MEMES ────────────────────────────────────────────────── */}
      <FadeIn>
        <div className="bg-[#0d0d0d] border-y border-white/5 py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <div className="text-[#FF4D00] text-xs font-black tracking-[0.3em] uppercase mb-2" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                Shared Language
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                MEMES OF COORDINATION
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {memes.map((meme, i) => (
                <FadeIn key={meme.title} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -3 }}
                    className="rounded-2xl p-6 h-full"
                    style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${meme.color}20`, boxShadow: `0 0 30px ${meme.color}06` }}
                  >
                    <div
                      className="text-base font-black mb-3"
                      style={{ color: meme.color, fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em', fontSize: 16 }}
                    >
                      {meme.title}
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">{meme.body}</p>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <FadeIn>
        <div className="container mx-auto px-4 max-w-4xl py-24">
          <motion.div
            whileHover={{ boxShadow: '0 0 80px rgba(255,77,0,0.15)' }}
            className="rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #140800, #0a0a18)', border: '1px solid rgba(255,77,0,0.15)' }}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              style={{ background: 'radial-gradient(ellipse at center, rgba(255,77,0,0.08) 0%, transparent 70%)' }}
            />
            <div className="relative z-10">
              <Shield className="w-8 h-8 text-[#FF4D00] mx-auto mb-4" style={{ filter: 'drop-shadow(0 0 12px rgba(255,77,0,0.5))' }} />
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                JOIN THE LORE
              </h2>
              <p className="text-white/40 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
                The community is the lore. Every holder, every creator, every voice in the Telegram is writing the next chapter of the $NAKA story.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <motion.a
                  whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255,77,0,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  href="https://t.me/NakaGoCult"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-black text-sm"
                  style={{ background: 'linear-gradient(135deg, #FF4D00, #FF0000)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.1em' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  JOIN THE CULT
                </motion.a>
                <Link href="/m4nga">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white/50 font-black text-sm cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.1em' }}
                  >
                    <Shield className="w-4 h-4" />
                    MINT SBT
                    <ChevronRight className="w-3.5 h-3.5" />
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </FadeIn>

      <Footer />
    </div>
  );
}
