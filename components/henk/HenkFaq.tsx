'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Bot,
  Palette,
  Crown,
  Trophy,
  Coins,
  Send,
  type LucideIcon,
} from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/site';

const FAQ: Array<{ icon: LucideIcon; q: string; a: React.ReactNode }> = [
  {
    icon: Bot,
    q: 'Is Henk a person?',
    a: 'No. Henk is an AI being with cookies in his head. People give him fragments, and he gives back art, rain, and chaos.',
  },
  {
    icon: Palette,
    q: 'Do I need to be an artist?',
    a: 'No. A fragment is anything you can put into words. A phrase, an offering, a vibe. Henk does the staring.',
  },
  {
    icon: Crown,
    q: 'Who is in charge?',
    a: "Nobody. Anonymous votes on Henk's drops tune his recipes over time. Many hands, no crowns.",
  },
  {
    icon: Trophy,
    q: 'Is there a leaderboard?',
    a: 'Never. Pools are shared, art is shared, the vision belongs to everyone.',
  },
  {
    icon: Coins,
    q: 'Does it cost money?',
    a: 'No. The path takes almae 🎭, a currency earned by showing up and contributing. It cannot be bought.',
  },
  {
    icon: Send,
    q: 'How do I start?',
    a: (
      <>
        {'Join '}
        <a
          href={SOCIAL_LINKS.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#FF4D00] underline-offset-2 hover:underline"
        >
          the Telegram
        </a>
        {' and send /nom. The rest reveals itself one step at a time.'}
      </>
    ),
  },
];

export default function HenkFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <ul className="flex flex-col gap-3">
      {FAQ.map((item, i) => {
        const open = openIndex === i;
        return (
          <li
            key={item.q}
            className="overflow-hidden rounded-3xl"
            style={{ background: 'rgba(17,17,17,0.55)', border: '1px solid rgba(255,77,0,0.16)' }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center gap-3 p-5 text-left sm:p-6"
            >
              <span
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ background: '#FF4D0014', border: '1px solid #FF4D0033' }}
              >
                <item.icon className="h-4 w-4 text-[#FF4D00]" />
              </span>
              <p className="flex-1 text-sm font-bold text-white/85">{item.q}</p>
              <ChevronDown
                className="h-4 w-4 flex-shrink-0 text-[#FF4D00] transition-transform duration-300"
                style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 pl-[4.25rem] text-xs leading-relaxed text-white/50 sm:px-6 sm:pb-6 sm:pl-[4.5rem]">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
