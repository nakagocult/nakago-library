'use client';

import { motion } from 'framer-motion';
import { BookOpen, Search, Users } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/utils/constants';

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.01 9.47c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.617l-2.95-.924c-.643-.203-.655-.643.136-.953l11.521-4.443c.535-.194 1.002.13.831.82l.544-.869z"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const socialLinks = [
  {
    name: 'Telegram',
    href: SOCIAL_LINKS.telegram,
    Icon: TelegramIcon,
    label: '@NakaGoCult',
    color: '#0088cc',
    glow: 'rgba(0,136,204,0.3)',
  },
  {
    name: 'X / Twitter',
    href: SOCIAL_LINKS.twitter,
    Icon: XIcon,
    label: '@NakaGoInu',
    color: '#1DA1F2',
    glow: 'rgba(29,161,242,0.3)',
  },
  {
    name: 'Lore Lab',
    href: SOCIAL_LINKS.medium,
    Icon: BookOpen,
    label: 'Read the Lore',
    color: '#02b875',
    glow: 'rgba(2,184,117,0.3)',
  },
  {
    name: 'Etherscan',
    href: SOCIAL_LINKS.etherscan,
    Icon: Search,
    label: 'View Contract',
    color: '#6B8AFF',
    glow: 'rgba(107,138,255,0.3)',
  },
];

export default function Community() {
  return (
    <section id="community" className="py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full" style={{ background: 'rgba(255,77,0,0.1)', border: '1px solid rgba(255,77,0,0.2)' }}>
              <Users className="w-10 h-10 text-[#FF4D00]" />
            </div>
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl mb-4"
            style={{
              fontFamily: 'var(--font-permanent-marker)',
              background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Join the Cult
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            We make art now. The community is the lore.
          </p>
        </motion.div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {socialLinks.map((link, i) => {
            const Icon = link.Icon;
            return (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="flex flex-col items-center gap-3 p-8 rounded-3xl bg-[#111] border border-white/5 cursor-pointer"
                style={{ boxShadow: `0 0 20px ${link.glow}`, transition: 'box-shadow 0.3s', color: link.color }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${link.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${link.glow}`;
                }}
              >
                <Icon />
                <span
                  className="text-white text-lg font-bold"
                  style={{ fontFamily: 'var(--font-permanent-marker)' }}
                >
                  {link.name}
                </span>
                <span className="text-white/40 text-sm">{link.label}</span>
              </motion.a>
            );
          })}
        </div>

        {/* Lore Lab CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div
            className="bg-[#1a1a1a] rounded-3xl p-8 border border-[#FF4D00]/20"
            style={{ boxShadow: '0 0 30px rgba(255,77,0,0.15)' }}
          >
            <div className="flex justify-center gap-3 mb-3">
              <BookOpen className="w-8 h-8 text-[#FF4D00]" />
            </div>
            <h3
              className="text-2xl text-white mb-3"
              style={{ fontFamily: 'var(--font-permanent-marker)' }}
            >
              Read the Lore Lab
            </h3>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Dive deep into the Pulse Cycle, the Cookies {'n'} Cream tradition, and the history of the NakaGo cult.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/lore-lab"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold"
              style={{
                background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
                fontFamily: 'var(--font-permanent-marker)',
                boxShadow: '0 0 20px rgba(255,77,0,0.5)',
              }}
            >
              <BookOpen className="w-4 h-4" />
              Read the Lore Lab
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
