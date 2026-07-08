import type { Metadata } from 'next';
import Link from 'next/link';
import { Bot, MessageCircle } from 'lucide-react';
import TelegramIcon from '@/components/shared/TelegramIcon';
import { SOCIAL_LINKS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Henk | NAKA GO 中号',
  description: "Meet Henk, the Cult's AI. He pays hoomans to show up, runs Make It Rain, and shapes the swarm.",
};

export default function HenkPage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      {/* Floating bot tile with a little chat badge. CSS-animated so this stays a
          server component that can export metadata. */}
      <div
        className="animate-float relative mb-8 flex h-20 w-20 items-center justify-center rounded-3xl"
        style={{ background: '#111', border: '1px solid rgba(255,77,0,0.3)', boxShadow: '0 0 40px rgba(255,77,0,0.25)' }}
      >
        <Bot className="h-10 w-10 text-[#FF4D00]" />
        <span
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full"
          style={{ background: '#FF4D00', boxShadow: '0 0 16px rgba(255,77,0,0.6)' }}
        >
          <MessageCircle className="h-3.5 w-3.5 text-black" />
        </span>
      </div>

      <span
        className="block text-xs font-black uppercase tracking-[0.35em] text-[#FF4D00]"
        style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
      >
        AI · Telegram
      </span>
      <h1
        className="mt-3 text-6xl font-black leading-none text-white md:text-7xl"
        style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
      >
        <span className="text-gradient-fire">HENK</span>
      </h1>

      <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/55">
        Henk is our AI bot, the one paying hoomans to show up, running{' '}
        <Link href="/rain" className="font-bold text-[#FF4D00] underline-offset-2 hover:underline">
          Make It Rain
        </Link>
        , and shaping the swarm. A full Henk page is on the way. For now, he lives in the chat.
      </p>

      <span
        className="mt-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white/50"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,77,0,0.2)' }}
      >
        Coming Soon
      </span>

      <div className="mt-8">
        <a
          href={SOCIAL_LINKS.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-black uppercase tracking-[0.15em] text-black transition-transform hover:scale-105"
          style={{ background: '#FF4D00', boxShadow: '0 0 30px rgba(255,77,0,0.35)' }}
        >
          <TelegramIcon className="h-4 w-4" /> Meet Henk in Telegram
        </a>
      </div>
    </main>
  );
}
