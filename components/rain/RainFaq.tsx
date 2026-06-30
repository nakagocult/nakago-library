'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Droplets,
  Sparkles,
  Coins,
  Send,
  Gauge,
  Moon,
  Heart,
  type LucideIcon,
} from 'lucide-react';

const FAQ: Array<{ icon: LucideIcon; q: string; a: string }> = [
  {
    icon: Droplets,
    q: 'What is Naka Rain?',
    a: 'Points you earn just by connecting with the Cult, playing with Henk, and making art. Rain accrues daily and redeems for real Naka tokens.',
  },
  {
    icon: Sparkles,
    q: 'Can I earn right now?',
    a: 'Yes, Rain is live today. Up to thousands per day as your 💧x multiplier climbs. Every /nom you roll earns one Rain, other factors push the rest.',
  },
  {
    icon: Coins,
    q: 'When do I get it?',
    a: 'Rain vests for two weeks. In mid July the 10,000,000 Naka pool opens to redeem.',
  },
  {
    icon: Send,
    q: 'How do I start?',
    a: 'Join the Naka Telegram and send a /nom into chat. Henk walks you through the rest.',
  },
  {
    icon: Gauge,
    q: 'How do I increase my 💧x multiplier?',
    a: "There are many ways to interact with Henk. Varying your actions, showing up together in bursts, and sticking around all boost your 💧x. Henk's recipe is always changing, but real presence beats everything. Grinding gets you nothing.",
  },
  {
    icon: Moon,
    q: 'What if I need a day off?',
    a: 'Rest is productive. A quiet day here and there pays out your daily average. You deserve it, hooman.',
  },
  {
    icon: Coins,
    q: 'How much is Rain worth?',
    a: 'One Rain = One Naka.',
  },
  {
    icon: Heart,
    q: "What's the catch?",
    a: 'No catch. Connection and creation are valuable, we reward them.',
  },
];

export default function RainFaq() {
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
