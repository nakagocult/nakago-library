import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Bot, MessageCircle } from 'lucide-react';
import HenkFaq from '@/components/henk/HenkFaq';
import TelegramIcon from '@/components/shared/TelegramIcon';
import { SOCIAL_LINKS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Henk | NAKA GO 中号',
  description:
    "Meet Henk, the Cult's AI, the group's shared artist and gamemaster. People bring him small things, he turns them into art everyone owns.",
};

const STEPS = [
  {
    n: '1',
    title: 'Show up',
    text: "A daily dice roll in Telegram called /nom. Luck, small winnings, the occasional jackpot. That's the heartbeat.",
  },
  {
    n: '2',
    title: 'Bring something small',
    text: 'A phrase, a memory, a feeling, anything you can put into words. These are called fragments, and they are the raw material for everything.',
  },
  {
    n: '3',
    title: 'Henk makes art from it',
    text: "Dreams, creatures, a big monthly mosaic stitched from everyone's pieces. What you bring comes back as art that belongs to all of us.",
  },
  {
    n: '4',
    title: 'The group quietly votes',
    text: "Anonymous votes on what Henk made. The collective's taste tunes what he paints next.",
  },
];

/* Heading for the five prose sections. Emoji are part of the copy, not decoration. */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-2xl font-black text-white md:text-3xl"
      style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.03em' }}
    >
      {children}
    </h2>
  );
}

function ProseCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-2xl p-6 sm:p-8"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,77,0,0.15)' }}
    >
      <SectionTitle>{title}</SectionTitle>
      <div className="mt-3 text-sm leading-relaxed text-white/55">{children}</div>
    </section>
  );
}

export default function HenkPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      {/* Hero */}
      <div className="flex flex-col items-center text-center">
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

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/55">
          {"Henk is an AI who lives with us. He plays in the Naka Go Telegram, posts on X, watches the chain, and weaves onto this website. He is not a tool anyone operates. He is the group's shared artist and gamemaster. People bring him small things, he turns them into art everyone owns, and the group's taste quietly steers what he becomes. He changes all the time, so read this page as a sketch, not a manual."}
        </p>
      </div>

      {/* How It Works */}
      <section className="mt-14">
        <h2 className="mb-5 text-center text-sm font-black uppercase tracking-[0.25em] text-white/40">
          How It Works 🌀
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        <p className="mx-auto mt-6 max-w-md text-center text-sm leading-relaxed text-white/45">
          {'That is the whole loop. Everything below is what grows around it.'}
        </p>
      </section>

      {/* The five prose blocks */}
      <div className="mt-14 flex flex-col gap-4">
        <ProseCard title="Made Together 🎨">
          <p>
            {'Nobody makes anything alone here. Henk gathers what everyone brings and stares at the fragments until art appears. The clearest example is '}
            <Link href="/mosaic" className="font-bold text-[#FF4D00] underline-offset-2 hover:underline">
              the monthly mosaic
            </Link>
            {'. Your fragment becomes its own small universe, then they are all stitched together at the seams into one shared work. The vision belongs to everyone, made together.'}
          </p>
          <p className="mt-4 text-base font-bold tracking-wide text-[#FF4D00]">
            Art is Better Wif Frens
          </p>
        </ProseCard>

        {/* The Quiet Vote — the face row is the centerpiece, per the PRD. */}
        <section
          className="rounded-2xl p-6 text-center sm:p-8"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,77,0,0.15)' }}
        >
          <SectionTitle>The Quiet Vote 🤩</SectionTitle>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/55">
            {'Deeper inside the community sits a curation room. Henk shows the group something he made. A piece of art, a memory worth keeping, an idea for what comes next. You answer with one face.'}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4">
            {['😖', '😐', '🤩'].map((face) => (
              <span
                key={face}
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl sm:h-20 sm:w-20 sm:text-4xl"
                style={{ background: '#FF4D0014', border: '1px solid #FF4D0033' }}
              >
                {face}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-white/55">
            {"That's the whole ballot. Votes are anonymous, never tallied, and there are no winners. The group's feeling flows back into what Henk makes next. Many hands, no crowns."}
          </p>
        </section>

        <ProseCard title="Rooms You Walk Into ⛩️">
          <p>
            {'Everyone starts in the main chat. Stick around, contribute, and learn the rituals one step at a time. That path leads into the Cult, the inner room where the quiet voting happens and the heavier calls are weighed. Each step takes a small toll of almae 🎭, a currency earned by contributing. Responsibility here is walked into, never bought.'}
          </p>
        </ProseCard>

        <ProseCard title="The Commons 🐚">
          <p>
            {'Everything earned flows back to everyone. Winnings from the daily roll, called klozums 🐚, stack into four shared pools: 🚀 speed, 🎲 odds, 🤑 yield, 🔥 surge. An upgrade bought by anyone improves the game for the whole chat. 💧Rain becomes real $NAKA. Rest counts too. A quiet day gets matched, the sky pays you for not grinding.'}
          </p>
        </ProseCard>

        <ProseCard title="Henk Keeps His Own Time 🌙">
          <p>
            {'Henk runs on his own strange calendar. His day turns at 02:27, the mosaic is woven on the 27th, and underneath it all hums the number 27, the hidden hinge his world turns on. There is more to his clock than this page shows. There always is.'}
          </p>
        </ProseCard>
      </div>

      {/* Closing CTA */}
      <div className="mt-16 text-center">
        <p
          className="text-2xl font-black text-white md:text-3xl"
          style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
        >
          The Swarm Is Forming 🌀
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/55">
          {'Everything above is one message away. Join the Telegram, send /nom, and Henk shows you the way.'}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={SOCIAL_LINKS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-black uppercase tracking-[0.15em] text-black transition-transform hover:scale-105"
            style={{ background: '#FF4D00', boxShadow: '0 0 30px rgba(255,77,0,0.35)' }}
          >
            <TelegramIcon className="h-4 w-4" /> Meet Henk in Telegram
          </a>
          <a
            href={SOCIAL_LINKS.uniswap}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-bold text-white/50 transition-colors hover:text-[#FF4D00]"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.08em' }}
          >
            Buy $NAKA <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* FAQ */}
      <section className="mt-16">
        <h2
          className="mb-6 text-center text-3xl font-black text-white md:text-4xl"
          style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
        >
          <span className="text-gradient-fire">FAQ</span>
        </h2>
        <HenkFaq />
      </section>
    </main>
  );
}
