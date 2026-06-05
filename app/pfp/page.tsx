'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Shuffle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const BACKGROUNDS = [
  { id: 'naka-dark',   label: 'Naka Dark',    colors: ['#0a0a0a', '#1a0800'] },
  { id: 'tokyo-night', label: 'Tokyo Night',  colors: ['#0a0018', '#001a40'] },
  { id: 'sakura',      label: 'Sakura Dawn',  colors: ['#1a0010', '#3a0030'] },
  { id: 'cyber-grid',  label: 'Cyber Grid',   colors: ['#000a0a', '#003030'] },
  { id: 'moon-night',  label: 'Moon Night',   colors: ['#05050f', '#0f0f2a'] },
  { id: 'akaishi-red', label: 'Akaishi Red',  colors: ['#100000', '#300808'] },
];

const FRAMES = [
  { id: 'naka-glow', label: 'Naka Glow',  color: '#FF4D00' },
  { id: 'cyan-neon', label: 'Cyan Neon',  color: '#00FFFF' },
  { id: 'gold',      label: 'Gold',       color: '#FFD700' },
  { id: 'purple',    label: 'Purple',     color: '#CC44FF' },
  { id: 'green',     label: 'Green',      color: '#00FF88' },
  { id: 'none',      label: 'None',       color: 'transparent' },
];

const BADGES = [
  { id: 'nakago',    label: '#NAKAGO',   text: '#NAKAGO',  color: '#FF4D00' },
  { id: 'kanji',     label: '中号',       text: '中号',     color: '#FFD700' },
  { id: 'hodl',      label: 'HODL',      text: 'HODL',     color: '#00FF88' },
  { id: 'the-cult',  label: 'THE CULT',  text: 'THE CULT', color: '#CC44FF' },
  { id: 'vov',       label: 'VoV',       text: 'VoV',      color: '#00FFFF' },
  { id: 'none',      label: 'None',      text: '',         color: 'transparent' },
];

const MOODS = [
  { id: 'noble',   label: 'Noble' },
  { id: 'happy',   label: 'Happy' },
  { id: 'cool',    label: 'Cool' },
  { id: 'angry',   label: 'Fierce' },
];

const SIZE = 400;

// ─── CANVAS DRAWING ───────────────────────────────────────────────────────────
function drawBackground(ctx: CanvasRenderingContext2D, bg: typeof BACKGROUNDS[0]) {
  const grad = ctx.createRadialGradient(SIZE / 2, SIZE / 2, 30, SIZE / 2, SIZE / 2, SIZE * 0.75);
  grad.addColorStop(0, bg.colors[1]);
  grad.addColorStop(1, bg.colors[0]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Dot grid overlay
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let x = 20; x < SIZE; x += 30) {
    for (let y = 20; y < SIZE; y += 30) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawFrame(ctx: CanvasRenderingContext2D, frame: typeof FRAMES[0]) {
  if (frame.id === 'none') return;
  const pad = 8;
  ctx.save();
  ctx.strokeStyle = frame.color;
  ctx.lineWidth = 6;
  ctx.shadowColor = frame.color;
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.roundRect(pad, pad, SIZE - pad * 2, SIZE - pad * 2, 24);
  ctx.stroke();
  // Inner thin line
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.roundRect(pad + 8, pad + 8, SIZE - (pad + 8) * 2, SIZE - (pad + 8) * 2, 18);
  ctx.stroke();
  ctx.restore();
}

function drawShibaFace(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  mood: string,
  frameColor: string
) {
  // Head glow
  ctx.save();
  ctx.shadowColor = frameColor !== 'transparent' ? frameColor : '#FF4D00';
  ctx.shadowBlur = 30;

  // Ears
  const earOffX = r * 0.55, earOffY = r * 0.55;
  const earRx = r * 0.28, earRy = r * 0.38;
  ctx.fillStyle = '#B88C00';
  ctx.save(); ctx.translate(cx - earOffX, cy - earOffY); ctx.rotate(-0.3);
  ctx.beginPath(); ctx.ellipse(0, 0, earRx, earRy, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.translate(cx + earOffX, cy - earOffY); ctx.rotate(0.3);
  ctx.beginPath(); ctx.ellipse(0, 0, earRx, earRy, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Inner ears
  ctx.fillStyle = '#FF8C00';
  ctx.globalAlpha = 0.65;
  ctx.save(); ctx.translate(cx - earOffX, cy - earOffY); ctx.rotate(-0.3);
  ctx.beginPath(); ctx.ellipse(0, 0, earRx * 0.6, earRy * 0.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.translate(cx + earOffX, cy - earOffY); ctx.rotate(0.3);
  ctx.beginPath(); ctx.ellipse(0, 0, earRx * 0.6, earRy * 0.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 1;

  // Head
  const headGrad = ctx.createRadialGradient(cx - r * 0.15, cy - r * 0.15, r * 0.1, cx, cy, r);
  headGrad.addColorStop(0, '#D4A800');
  headGrad.addColorStop(1, '#A07800');
  ctx.fillStyle = headGrad;
  ctx.shadowBlur = 25;
  ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.95, 0, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  // Face patch
  ctx.fillStyle = '#C8A800';
  ctx.globalAlpha = 0.7;
  ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.15, r * 0.65, r * 0.52, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // Eyes
  const eyeOffX = r * 0.32, eyeOffY = r * 0.1;
  const eyeRx = r * 0.14, eyeRy = mood === 'angry' ? r * 0.1 : r * 0.18;

  if (mood === 'happy') {
    // Arc eyes
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = r * 0.07;
    ctx.beginPath(); ctx.arc(cx - eyeOffX, cy - eyeOffY + r * 0.05, eyeRy, Math.PI, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + eyeOffX, cy - eyeOffY + r * 0.05, eyeRy, Math.PI, Math.PI * 2); ctx.stroke();
  } else if (mood === 'cool') {
    // Sunglasses
    const sg = r * 0.2;
    ctx.fillStyle = '#0a0a0a'; ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(cx - eyeOffX, cy - eyeOffY, sg, sg * 0.7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx + eyeOffX, cy - eyeOffY, sg, sg * 0.7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - eyeOffX + sg, cy - eyeOffY); ctx.lineTo(cx + eyeOffX - sg, cy - eyeOffY); ctx.stroke();
    // Lens glare
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath(); ctx.ellipse(cx - eyeOffX - sg * 0.2, cy - eyeOffY - sg * 0.2, sg * 0.3, sg * 0.2, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + eyeOffX - sg * 0.2, cy - eyeOffY - sg * 0.2, sg * 0.3, sg * 0.2, -0.5, 0, Math.PI * 2); ctx.fill();
  } else if (mood === 'angry') {
    // Slanted angry brows + eyes
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.ellipse(cx - eyeOffX, cy - eyeOffY, eyeRx, eyeRy, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + eyeOffX, cy - eyeOffY, eyeRx, eyeRy, -0.4, 0, Math.PI * 2); ctx.fill();
    // Angry brows
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = r * 0.06;
    ctx.beginPath(); ctx.moveTo(cx - eyeOffX - eyeRx, cy - eyeOffY - eyeRy * 1.8); ctx.lineTo(cx - eyeOffX + eyeRx, cy - eyeOffY - eyeRy * 1.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + eyeOffX + eyeRx, cy - eyeOffY - eyeRy * 1.8); ctx.lineTo(cx + eyeOffX - eyeRx, cy - eyeOffY - eyeRy * 1.2); ctx.stroke();
  } else {
    // Noble default eyes
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.ellipse(cx - eyeOffX, cy - eyeOffY, eyeRx, eyeRy, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + eyeOffX, cy - eyeOffY, eyeRx, eyeRy, 0, 0, Math.PI * 2); ctx.fill();
    // Shine
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(cx - eyeOffX + eyeRx * 0.4, cy - eyeOffY - eyeRy * 0.3, r * 0.045, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + eyeOffX + eyeRx * 0.4, cy - eyeOffY - eyeRy * 0.3, r * 0.045, 0, Math.PI * 2); ctx.fill();
  }

  // Snout
  ctx.fillStyle = '#B89800';
  ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.3, r * 0.42, r * 0.3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#FF6B35';
  ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.18, r * 0.2, r * 0.13, 0, 0, Math.PI * 2); ctx.fill();

  // Nose
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.2, r * 0.12, r * 0.08, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3a3a3a';
  ctx.beginPath(); ctx.arc(cx - r * 0.04, cy + r * 0.17, r * 0.025, 0, Math.PI * 2); ctx.fill();

  // Mouth
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = r * 0.045;
  ctx.lineCap = 'round';
  if (mood === 'happy') {
    ctx.beginPath(); ctx.arc(cx, cy + r * 0.42, r * 0.22, 0.2, Math.PI - 0.2); ctx.stroke();
  } else if (mood === 'angry') {
    ctx.beginPath(); ctx.arc(cx, cy + r * 0.52, r * 0.22, Math.PI + 0.3, -0.3, true); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(cx - r * 0.22, cy + r * 0.42); ctx.quadraticCurveTo(cx, cy + r * 0.5, cx + r * 0.22, cy + r * 0.42); ctx.stroke();
  }

  // Cheeks
  ctx.fillStyle = '#FF9090'; ctx.globalAlpha = 0.55;
  ctx.beginPath(); ctx.ellipse(cx - r * 0.62, cy + r * 0.28, r * 0.2, r * 0.15, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + r * 0.62, cy + r * 0.28, r * 0.2, r * 0.15, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // Medal
  const mx = cx + r * 0.55, my = cy + r * 0.62, mr = r * 0.22;
  const medalGrad = ctx.createRadialGradient(mx - mr * 0.2, my - mr * 0.2, mr * 0.1, mx, my, mr);
  medalGrad.addColorStop(0, '#FFE066'); medalGrad.addColorStop(1, '#CC8800');
  ctx.fillStyle = medalGrad;
  ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#CC8800'; ctx.lineWidth = r * 0.03;
  ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.stroke();
  // Medal ribbon
  ctx.strokeStyle = '#FF4D00'; ctx.lineWidth = r * 0.07;
  ctx.beginPath(); ctx.moveTo(mx - mr * 0.4, my - mr * 1.1); ctx.lineTo(mx - mr * 0.2, my - mr * 0.4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(mx + mr * 0.4, my - mr * 1.1); ctx.lineTo(mx + mr * 0.2, my - mr * 0.4); ctx.stroke();
  // Medal kanji
  ctx.fillStyle = '#8B5E00';
  ctx.font = `bold ${Math.round(mr * 1.1)}px sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('中', mx, my + mr * 0.05);
}

function drawBadge(ctx: CanvasRenderingContext2D, badge: typeof BADGES[0]) {
  if (badge.id === 'none') return;
  const pad = 16, h = 32, radius = 10;
  ctx.font = `bold 14px "Bebas Neue", Impact, sans-serif`;
  const tw = ctx.measureText(badge.text).width;
  const bw = tw + pad * 2;
  const bx = SIZE / 2 - bw / 2, by = SIZE - 52;

  // Pill background
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.strokeStyle = badge.color;
  ctx.lineWidth = 2;
  ctx.shadowColor = badge.color; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.roundRect(bx, by, bw, h, radius); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = badge.color;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(badge.text, SIZE / 2, by + h / 2);
}

function renderCanvas(
  canvas: HTMLCanvasElement,
  bg: typeof BACKGROUNDS[0],
  frame: typeof FRAMES[0],
  badge: typeof BADGES[0],
  mood: string,
  mascotImg?: HTMLImageElement | null
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, SIZE, SIZE);
  drawBackground(ctx, bg);

  if (mascotImg && mascotImg.complete && mascotImg.naturalWidth > 0) {
    // Draw real mascot image as circular crop centered
    const cx = SIZE / 2, cy = SIZE * 0.46;
    const r = SIZE * 0.34;
    ctx.save();
    // Glow behind mascot
    ctx.shadowColor = frame.color !== 'transparent' ? frame.color : '#FF4D00';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(mascotImg, cx - r, cy - r, r * 2, r * 2);
    ctx.restore();
    // Circle border
    ctx.save();
    ctx.strokeStyle = frame.color !== 'transparent' ? frame.color : 'rgba(255,77,0,0.7)';
    ctx.lineWidth = 4;
    ctx.shadowColor = frame.color !== 'transparent' ? frame.color : '#FF4D00';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else {
    drawShibaFace(ctx, SIZE / 2, SIZE * 0.48, SIZE * 0.29, mood, frame.color);
  }

  drawFrame(ctx, frame);
  drawBadge(ctx, badge);
}

// ─── OPTION BUTTON ────────────────────────────────────────────────────────────
function OptionBtn({
  label, active, color, onClick,
}: { label: string; active: boolean; color?: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
      style={{
        fontFamily: 'Bebas Neue, Impact, sans-serif',
        letterSpacing: '0.08em',
        background: active ? (color ?? '#FF4D00') + '22' : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${active ? (color ?? '#FF4D00') : 'rgba(255,255,255,0.1)'}`,
        color: active ? (color ?? '#FF4D00') : 'rgba(255,255,255,0.5)',
        boxShadow: active ? `0 0 12px ${(color ?? '#FF4D00')}40` : 'none',
      }}
    >
      {color && color !== 'transparent' && (
        <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: color, verticalAlign: 'middle' }} />
      )}
      {label}
    </motion.button>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function PfpPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mascotRef = useRef<HTMLImageElement | null>(null);
  const [bg, setBg] = useState(BACKGROUNDS[0]);
  const [frame, setFrame] = useState(FRAMES[0]);
  const [badge, setBadge] = useState(BADGES[0]);
  const [mood, setMood] = useState('noble');
  const [downloading, setDownloading] = useState(false);
  const [mascotLoaded, setMascotLoaded] = useState(false);

  // Load mascot image once
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { mascotRef.current = img; setMascotLoaded(true); };
    img.onerror = () => {
      // Fallback: load without CORS header (canvas will be tainted but still displays)
      const img2 = new window.Image();
      img2.onload = () => { mascotRef.current = img2; setMascotLoaded(true); };
      img2.onerror = () => { mascotRef.current = null; setMascotLoaded(true); };
      img2.src = 'https://i.ibb.co/B8zQgxk/IMG-7857.jpg';
    };
    img.src = 'https://i.ibb.co/B8zQgxk/IMG-7857.jpg';
  }, []);

  const redraw = useCallback(() => {
    if (canvasRef.current) renderCanvas(canvasRef.current, bg, frame, badge, mood, mascotRef.current);
  }, [bg, frame, badge, mood, mascotLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { redraw(); }, [redraw]);

  const download = () => {
    setDownloading(true);
    setTimeout(() => {
      const a = document.createElement('a');
      a.download = 'naka-go-pfp.png';
      a.href = canvasRef.current?.toDataURL('image/png') ?? '';
      a.click();
      setDownloading(false);
    }, 200);
  };

  const randomize = useCallback(() => {
    setBg(BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]);
    setFrame(FRAMES[Math.floor(Math.random() * (FRAMES.length - 1))]);
    setBadge(BADGES[Math.floor(Math.random() * (BADGES.length - 1))]);
    setMood(MOODS[Math.floor(Math.random() * MOODS.length)].id);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="container mx-auto px-4 py-28 max-w-5xl">
        <Link href="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-10 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Home
          </motion.div>
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span
            className="text-[#FF4D00] text-sm font-black uppercase tracking-[0.4em] mb-3 block"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
          >
            Naka Go Customizer
          </span>
          <h1
            className="text-6xl md:text-8xl font-black text-white leading-none"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
          >
            <span style={{
              background: 'linear-gradient(135deg, #FF4D00, #FFD700)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>PFP</span> CREATOR
          </h1>
          <p className="text-white/40 text-sm mt-3">Build your Naka Go identity. Download. Flex.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
          {/* Canvas Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-5 flex-shrink-0"
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{ boxShadow: `0 0 60px ${frame.color !== 'transparent' ? frame.color + '40' : 'rgba(255,77,0,0.3)'}` }}
            >
              <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ display: 'block', maxWidth: 340, height: 'auto' }} />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={randomize}
                className="flex items-center gap-2 px-5 py-3 rounded-full text-white font-black text-sm cursor-pointer"
                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.1em' }}
              >
                <Shuffle className="w-4 h-4" /> RANDOMIZE
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,77,0,0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={download}
                disabled={downloading}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-black text-sm cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
                  boxShadow: '0 0 25px rgba(255,77,0,0.4)',
                  fontFamily: 'Bebas Neue, Impact, sans-serif',
                  letterSpacing: '0.1em',
                }}
              >
                {downloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                DOWNLOAD PNG
              </motion.button>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-7 w-full"
          >
            {/* Background */}
            <div>
              <div className="text-white/60 text-xs uppercase tracking-[0.25em] mb-3 font-bold" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                Background
              </div>
              <div className="flex flex-wrap gap-2">
                {BACKGROUNDS.map((b) => (
                  <OptionBtn key={b.id} label={b.label} active={bg.id === b.id} color="#FF4D00" onClick={() => setBg(b)} />
                ))}
              </div>
            </div>

            {/* Frame */}
            <div>
              <div className="text-white/60 text-xs uppercase tracking-[0.25em] mb-3 font-bold" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                Frame
              </div>
              <div className="flex flex-wrap gap-2">
                {FRAMES.map((f) => (
                  <OptionBtn key={f.id} label={f.label} active={frame.id === f.id} color={f.color !== 'transparent' ? f.color : undefined} onClick={() => setFrame(f)} />
                ))}
              </div>
            </div>

            {/* Badge */}
            <div>
              <div className="text-white/60 text-xs uppercase tracking-[0.25em] mb-3 font-bold" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                Badge
              </div>
              <div className="flex flex-wrap gap-2">
                {BADGES.map((b) => (
                  <OptionBtn key={b.id} label={b.label} active={badge.id === b.id} color={b.color !== 'transparent' ? b.color : undefined} onClick={() => setBadge(b)} />
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <div className="text-white/60 text-xs uppercase tracking-[0.25em] mb-3 font-bold" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                Mood
              </div>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <OptionBtn key={m.id} label={m.label} active={mood === m.id} color="#FFD700" onClick={() => setMood(m.id)} />
                ))}
              </div>
            </div>

            {/* Tips */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,77,0,0.05)', border: '1px solid rgba(255,77,0,0.12)' }}
            >
              <div className="text-[#FF4D00] text-xs font-black uppercase tracking-widest mb-3" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                How To Use
              </div>
              <div className="space-y-2 text-white/40 text-xs">
                <div>1. Customize your Naka Go PFP using the options above</div>
                <div>2. Hit RANDOMIZE for instant inspiration</div>
                <div>3. Download your 400x400 PNG</div>
                <div>4. Set it as your X/Twitter profile picture</div>
                <div>5. Tag <span className="text-[#FF4D00]">@NakaGoInu</span> and spread the legacy</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
