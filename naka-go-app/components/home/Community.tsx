'use client';

import { motion } from 'framer-motion';
import { SOCIAL_LINKS } from '@/lib/utils/constants';

const socialLinks = [
  {
    name: 'Telegram',
    href: SOCIAL_LINKS.telegram,
    icon: '📱',
    label: '@NakaGoCult',
    color: '#0088cc',
    glow: 'rgba(0,136,204,0.3)',
  },
  {
    name: 'X / Twitter',
    href: SOCIAL_LINKS.twitter,
    icon: '🐦',
    label: '@NakaGoInu',
    color: '#1DA1F2',
    glow: 'rgba(29,161,242,0.3)',
  },
  {
    name: 'Medium',
    href: SOCIAL_LINKS.medium,
    icon: '📝',
    label: '@NakaGo',
    color: '#02b875',
    glow: 'rgba(2,184,117,0.3)',
  },
  {
    name: 'Etherscan',
    href: SOCIAL_LINKS.etherscan,
    icon: '🔍',
    label: 'View Contract',
    color: '#21325b',
    glow: 'rgba(33,50,91,0.5)',
  },
];

export default function Community() {
  return (
    <section id="community" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="text-5xl mb-4">🍦</div>
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
            We make art now. The community is the lore. 🍦
          </p>
        </motion.div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {socialLinks.map((link, i) => (
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
              style={{ boxShadow: `0 0 20px ${link.glow}`, transition: 'box-shadow 0.3s' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${link.glow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${link.glow}`;
              }}
            >
              <span className="text-5xl">{link.icon}</span>
              <span
                className="text-white text-lg font-bold"
                style={{ fontFamily: 'var(--font-permanent-marker)' }}
              >
                {link.name}
              </span>
              <span className="text-white/40 text-sm">{link.label}</span>
            </motion.a>
          ))}
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
            <div className="text-3xl mb-3">🍦 📝 🍪</div>
            <h3
              className="text-2xl text-white mb-3"
              style={{ fontFamily: 'var(--font-permanent-marker)' }}
            >
              Read the Lore Lab
            </h3>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Dive deep into the Pulse Cycle, the Cookies 'n' Cream tradition, and the history of the NakaGo cult.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={SOCIAL_LINKS.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold"
              style={{
                background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
                fontFamily: 'var(--font-permanent-marker)',
                boxShadow: '0 0 20px rgba(255,77,0,0.5)',
              }}
            >
              <span>🍦</span>
              Read the Lore Lab
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
