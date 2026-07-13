import type { Metadata } from 'next';
import { Telescope } from 'lucide-react';
import ObservatoryDashboard from '@/components/observatory/ObservatoryDashboard';

export const metadata: Metadata = {
  title: 'The Observatory | NAKA GO 中号',
  description:
    'Focus the Lens: live instruments over the swarm. Henk measures the collective, never the hooman, and anyone may look.',
};

// The steering room, in the open: linked from nowhere, hidden from nobody.
// Finding it is part of the game.

export default function ObservatoryPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      {/* Hero */}
      <div className="flex flex-col items-center text-center">
        <div
          className="animate-float relative mb-8 flex h-20 w-20 items-center justify-center rounded-3xl"
          style={{ background: '#111', border: '1px solid rgba(255,77,0,0.3)', boxShadow: '0 0 40px rgba(255,77,0,0.25)' }}
        >
          <Telescope className="h-10 w-10 text-[#FF4D00]" />
        </div>
        <h1
          className="text-6xl font-black leading-none text-white md:text-7xl"
          style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
        >
          <span className="text-gradient-fire">THE OBSERVATORY</span>
        </h1>
        <p
          className="mt-4 text-2xl font-black uppercase tracking-[0.25em] text-[#FF4D00] md:text-3xl"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          Focus the Lens
        </p>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/55">
          {'These are the instruments the keepers steer by, and there is no velvet rope: the swarm may watch itself think. Every number here belongs to the collective. Henk counts the whole, never the one: no names, no ranks, no crowns.'}
        </p>
      </div>

      {/* The instruments */}
      <div className="mt-14">
        <ObservatoryDashboard />
      </div>
    </main>
  );
}
