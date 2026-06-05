'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Flame, Eye } from 'lucide-react';
import { isFullMoon } from '@/lib/cookies/fullMoon';

function MutateCanvas({ fullMoon }: { fullMoon: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const mazeColor = fullMoon ? '#7B2FFF' : '#00F5FF';
    const glowColor = fullMoon ? 'rgba(123,47,255,0.3)' : 'rgba(0,245,255,0.3)';
    const cat1Color = fullMoon ? '#9D50FF' : '#00F5FF';
    const cat2Color = fullMoon ? '#FF0066' : '#FF00FF';
    const cellSize = 40;

    let cat1 = { x: 100, y: 100, vx: 2, vy: 1.5 };
    let cat2 = { x: canvas.width - 100, y: canvas.height - 100, vx: -1.5, vy: -2 };

    const foods = Array.from({ length: 5 }, () => ({
      emoji: ['🍕', '🍔', '🍩', fullMoon ? '🌙' : '🍦', '🐕'][Math.floor(Math.random() * 5)],
      x: Math.random() * (canvas.width - 60) + 30,
      y: Math.random() * (canvas.height - 60) + 30,
    }));

    function drawCat(x: number, y: number, color: string) {
      if (!ctx) return;
      ctx.fillStyle = color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.beginPath();
      ctx.moveTo(x - 8, y - 8); ctx.lineTo(x - 13, y - 18); ctx.lineTo(x - 3, y - 12);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 8, y - 8); ctx.lineTo(x + 13, y - 18); ctx.lineTo(x + 3, y - 12);
      ctx.fill();
    }

    function drawMazeLine(x1: number, y1: number, x2: number, y2: number) {
      if (!ctx) return;
      ctx.strokeStyle = mazeColor;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = glowColor;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Pre-generate maze (static seed)
    const hLines: boolean[][] = [];
    const vLines: boolean[][] = [];
    const cols = Math.ceil(canvas.width / cellSize) + 1;
    const rows = Math.ceil(canvas.height / cellSize) + 1;
    for (let y = 0; y < rows; y++) {
      hLines[y] = Array.from({ length: cols }, () => Math.random() > 0.35);
      vLines[y] = Array.from({ length: cols }, () => Math.random() > 0.35);
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw maze
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (hLines[y]?.[x]) drawMazeLine(x * cellSize, y * cellSize, (x + 1) * cellSize, y * cellSize);
          if (vLines[y]?.[x]) drawMazeLine(x * cellSize, y * cellSize, x * cellSize, (y + 1) * cellSize);
        }
      }

      // Draw foods
      ctx.font = '24px Arial';
      ctx.shadowBlur = 12;
      ctx.shadowColor = fullMoon ? '#7B2FFF' : '#FF4D00';
      foods.forEach((f) => ctx!.fillText(f.emoji, f.x, f.y));

      // Move cats
      cat1.x += cat1.vx; cat1.y += cat1.vy;
      cat2.x += cat2.vx; cat2.y += cat2.vy;
      if (cat1.x < 20 || cat1.x > canvas.width - 20) cat1.vx *= -1;
      if (cat1.y < 20 || cat1.y > canvas.height - 20) cat1.vy *= -1;
      if (cat2.x < 20 || cat2.x > canvas.width - 20) cat2.vx *= -1;
      if (cat2.y < 20 || cat2.y > canvas.height - 20) cat2.vy *= -1;

      drawCat(cat1.x, cat1.y, cat1Color);
      drawCat(cat2.x, cat2.y, cat2Color);

      animId = requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [fullMoon]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function MutatePage() {
  const router = useRouter();
  const fullMoon = isFullMoon();
  const accentColor = fullMoon ? '#7B2FFF' : '#00F5FF';
  const accentGlow = fullMoon ? 'rgba(123,47,255,0.5)' : 'rgba(0,245,255,0.5)';

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <MutateCanvas fullMoon={fullMoon} />

      {/* MUTATE! Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.7, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        className="absolute top-16 left-1/2 -translate-x-1/2 z-20 text-6xl md:text-8xl font-black tracking-wider select-none"
        style={{
          fontFamily: 'var(--font-permanent-marker)',
          color: accentColor,
          textShadow: `0 0 20px ${accentColor}, 0 0 50px ${accentColor}, 0 0 80px ${accentColor}`,
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        MUTATE!
      </motion.h1>

      {/* Rules Card */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-20"
      >
        <div
          className="rounded-3xl p-8 backdrop-blur-xl"
          style={{
            background: 'rgba(0,0,0,0.88)',
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 40px ${accentGlow}`,
          }}
        >
          <h3
            className="text-2xl font-bold mb-4 flex items-center gap-2"
            style={{ color: accentColor, fontFamily: 'var(--font-permanent-marker)' }}
          >
            <span className="text-3xl">🧬</span> Seed Mutations
          </h3>
          <p className="text-white/80 mb-3">Quote-repost with these mutations:</p>
          <ul className="space-y-2 text-white/70 mb-6">
            {['Change five characters', 'Remove or add a word', 'Swap an emoji'].map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <span style={{ color: accentColor }}>•</span>
                {rule}
              </li>
            ))}
          </ul>
          {fullMoon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 rounded-xl bg-purple-900/30 border border-purple-500/30"
            >
              <p className="text-purple-300 text-sm">
                <span className="text-xl">🌕</span>{' '}
                <span className="font-semibold">Full Moon Special:</span>
              </p>
              <p className="text-purple-200 text-xs mt-1">
                Add moon-themed words (lunar, silver, night) for bonus energy!
              </p>
            </motion.div>
          )}
          <div
            className="text-xs pt-4 border-t"
            style={{ borderColor: `${accentColor}33`, color: accentColor }}
          >
            <p className="font-semibold mb-1">Examples:</p>
            <p className="text-white/50">&ldquo;Cream&rdquo; → &ldquo;Dream&rdquo; | 🍪 → 🌙 | &ldquo;one message&rdquo; → &ldquo;two messages&rdquo;</p>
          </div>
        </div>
      </motion.div>

      {/* Reaction counters */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 right-6 flex gap-4 z-20"
      >
        {[{ icon: <Flame className="w-5 h-5 text-orange-400" />, count: 5, border: 'rgba(251,146,60,0.4)' },
          { icon: <Eye className="w-5 h-5 text-cyan-400" />, count: 12, border: 'rgba(34,211,238,0.4)' }].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.15 }}
            className="flex items-center gap-2 bg-black/60 backdrop-blur px-4 py-2 rounded-full border"
            style={{ borderColor: item.border }}
          >
            {item.icon}
            <span className="text-white font-bold text-sm">{item.count}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="absolute top-8 left-8 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-lg rounded-full text-white transition-all z-20 flex items-center gap-2 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold text-sm">Back</span>
      </motion.button>
    </div>
  );
}
