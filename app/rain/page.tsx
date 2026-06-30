import type { Metadata } from 'next';
import { CloudRain, Send } from 'lucide-react';
import RainFaq from '@/components/rain/RainFaq';
import TelegramIcon from '@/components/shared/TelegramIcon';

export const metadata: Metadata = {
  title: 'Make It Rain | NAKA GO 中号',
  description: 'Henk is paying hoomans to show up. Vibe, earn rain, redeem for real naka.',
};

const TELEGRAM = 'https://t.me/NakaGoInu';

const STEPS = [
  { n: '1', title: 'Join the Telegram', text: 'Tap in to the cult chat.' },
  { n: '2', title: 'Send /nom', text: 'Drop it straight into the chat.' },
  { n: '3', title: 'Henk shows you the way', text: "That's it. You're earning rain." },
];

export default function RainPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      {/* Hero */}
      <div className="flex flex-col items-center text-center">
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
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.25em' }}
        >
          VIBE · EARN · REDEEM
        </p>

        <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-white/55">
          Henk is paying hoomans to show up. Every day you play in the cult you earn{' '}
          <span className="font-bold text-[#FF4D00]">💧rain</span>. In mid July a pool of{' '}
          <span className="font-bold text-white/85">10,000,000 Naka</span> opens to redeem rain for
          real Naka tokens.
        </p>
      </div>

      {/* Start earning */}
      <section className="mt-14">
        <h2 className="mb-5 text-center text-sm font-black uppercase tracking-[0.25em] text-white/40">
          ⚡ Start Earning Today
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="rounded-2xl p-5"
              style={{ background: 'rgba(17,17,17,0.55)', border: '1px solid rgba(255,77,0,0.16)' }}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-black text-[#FF4D00]"
                style={{ background: '#FF4D0014', border: '1px solid #FF4D0033' }}
              >
                {step.n}
              </span>
              <p className="mt-3 text-sm font-bold text-white/85">{step.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/45">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href={TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-black uppercase tracking-[0.15em] text-black transition-transform hover:scale-105"
            style={{ background: '#FF4D00', boxShadow: '0 0 30px rgba(255,77,0,0.35)' }}
          >
            <Send className="h-4 w-4" />
            Join Telegram &amp; Send /nom
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2
          className="mb-6 text-center text-3xl font-black text-white md:text-4xl"
          style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
        >
          <span className="text-gradient-fire">FAQ</span>
        </h2>
        <RainFaq />
      </section>

      {/* Closing CTA */}
      <div className="mt-16 text-center">
        <p
          className="text-2xl font-black text-white md:text-3xl"
          style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
        >
          The Rain Is Falling Now 🌧️
        </p>
        <a
          href={TELEGRAM}
          target="_blank"
          rel="noopener noreferrer"
          title="Telegram"
          aria-label="Join the Naka Telegram"
          className="mt-4 inline-flex h-11 w-11 items-center justify-center rounded-full text-[#FF4D00] transition-colors hover:bg-[#0088cc]/20 hover:text-[#0088cc]"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <TelegramIcon className="h-5 w-5" />
        </a>
      </div>
    </main>
  );
}
