import type { Metadata } from 'next';
import { CloudRain } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Make It Rain | NAKA GO 中号',
  description: 'Pool opens soon.',
};

export default function RainPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      {/* Floating tile — matches the header tiles on /view and /mosaic. CSS-animated
          (not framer-motion) so this stays a server component that can export metadata. */}
      <div
        className="animate-float mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: '#111', border: '1px solid rgba(255,77,0,0.3)', boxShadow: '0 0 30px rgba(255,77,0,0.2)' }}
      >
        <CloudRain className="h-8 w-8 text-[#FF4D00]" />
      </div>

      <h1
        className="text-5xl font-black leading-none text-white md:text-7xl"
        style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
      >
        <span className="text-gradient-fire">Make It Rain</span>
      </h1>

      <p
        className="mt-5 text-xl text-white/70 md:text-2xl"
        style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
      >
        Pool Opens Soon 🌧️💧
      </p>

      <p className="mt-12 text-base italic text-white/40">the clouds are gathering</p>
    </main>
  );
}
