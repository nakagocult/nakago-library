'use client';

import { useEffect, useRef } from 'react';

/**
 * Cinematic aurora field rendered behind the whole app. Transform-based CSS
 * animation (GPU-friendly), fixed behind content, fully disabled under
 * prefers-reduced-motion via the global stylesheet. On pointer-capable, non-
 * touch screens the blob layer parallaxes subtly with the cursor; the heavier
 * blobs are trimmed on small screens so it never costs framerate on mobile.
 */

interface Blob {
  color: string;
  size: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
  mobile: boolean;
}

const BLOBS: Blob[] = [
  { color: 'rgba(255,77,0,0.26)', size: 560, top: '-10%', left: '-8%', duration: 22, delay: 0, mobile: true },
  { color: 'rgba(255,0,0,0.16)', size: 460, top: '14%', left: '64%', duration: 26, delay: -6, mobile: true },
  { color: 'rgba(255,215,0,0.12)', size: 400, top: '56%', left: '6%', duration: 30, delay: -12, mobile: false },
  { color: 'rgba(155,48,255,0.14)', size: 500, top: '66%', left: '60%', duration: 28, delay: -3, mobile: false },
  { color: 'rgba(0,180,255,0.08)', size: 340, top: '34%', left: '32%', duration: 34, delay: -9, mobile: false },
];

export default function AuroraBackground() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 26;
        const y = (e.clientY / window.innerHeight - 0.5) * 26;
        layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="aurora-field" style={{ position: 'fixed', inset: 0, zIndex: -10, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#060606' }} />

      {/* slow conic sheen */}
      <div
        className="animate-spin-slow"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '160vmax',
          height: '160vmax',
          marginLeft: '-80vmax',
          marginTop: '-80vmax',
          background:
            'conic-gradient(from 0deg, rgba(255,77,0,0.06), transparent 25%, rgba(155,48,255,0.05) 50%, transparent 75%, rgba(255,77,0,0.06))',
          animationDuration: '60s',
          willChange: 'transform',
        }}
      />

      {/* parallax blob layer */}
      <div ref={layerRef} style={{ position: 'absolute', inset: 0, transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)', willChange: 'transform' }}>
        {BLOBS.map((blob, i) => (
          <div
            key={i}
            className={`animate-orb-float ${blob.mobile ? '' : 'hidden sm:block'}`}
            style={{
              position: 'absolute',
              top: blob.top,
              left: blob.left,
              width: blob.size,
              height: blob.size,
              background: `radial-gradient(circle at center, ${blob.color} 0%, transparent 70%)`,
              filter: 'blur(44px)',
              animationDuration: `${blob.duration}s`,
              animationDelay: `${blob.delay}s`,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* fine grain + vignette for depth and contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
          mixBlendMode: 'overlay',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, transparent 38%, rgba(0,0,0,0.6) 100%)' }} />
    </div>
  );
}
