'use client';

import { useEffect, useRef } from 'react';

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
  const rootRef = useRef<HTMLDivElement>(null);

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

  // Background tabs keep every infinite CSS animation below running forever.
  // On Chromium mobile webviews (Brave Android, Trust Wallet's in-app browser)
  // that unbounded compositor work eventually corrupts paint tiles into the
  // blocky artifacts users see — pausing while hidden keeps the GPU load bounded.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onVisibility = () => {
      root.style.animationPlayState = document.hidden ? 'paused' : 'running';
      root.querySelectorAll<HTMLElement>('.animate-orb-float, .animate-spin-slow').forEach((el) => {
        el.style.animationPlayState = document.hidden ? 'paused' : 'running';
      });
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <div ref={rootRef} aria-hidden className="aurora-field" style={{ position: 'fixed', inset: 0, zIndex: -10, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#060606' }} />

      {/* slow conic sheen — desktop only. A 160vmax layer spinning forever on
          top of the blob layer below is pure extra compositor work that mobile
          Chromium webviews (Brave Android, Trust Wallet) can't sustain. */}
      <div
        className="animate-spin-slow hidden sm:block"
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

      {/* parallax blob layer — radial-gradient already feathers softly to
          transparent at the 70% stop, so a real-time blur() filter was never
          needed here. Stacking blur() on several large elements that are each
          animating transform every frame is exactly the load that triggers
          tile-corruption glitches on mobile Chromium webviews; dropping the
          filter removes the single most expensive op without changing the look. */}
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
              animationDuration: `${blob.duration}s`,
              animationDelay: `${blob.delay}s`,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* fine grain + vignette — blend-mode compositing is also costly on weak
          mobile GPUs, so skip the grain layer below the sm breakpoint. */}
      <div
        className="hidden sm:block"
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
