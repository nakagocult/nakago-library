'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X } from 'lucide-react';
import ShibaMascot from '@/components/shared/ShibaMascot';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Tokenomics', href: '#tokenomics' },
  { label: 'Community', href: '#community' },
];

const appLinks = [
  { label: 'Cookies', href: '/cookies' },
  { label: 'M4nga', href: '/m4nga' },
  { label: 'Lottery', href: '/lottery' },
  { label: 'Ddergo', href: '/ddergo' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(255,77,0,0.1)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#FF4D00]/50 group-hover:border-[#FF4D00] transition-colors shadow-[0_0_10px_rgba(255,77,0,0.3)]">
            <div className="w-full h-full bg-gradient-to-br from-[#FF4D00] to-[#FF0000] flex items-center justify-center">
              <span className="text-white text-xs font-bold">🐕</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-white text-xl font-bold tracking-wider"
              style={{ fontFamily: 'var(--font-permanent-marker)' }}
            >
              NAKA GO
            </span>
            <span
              className="text-white/70 text-sm"
              style={{ fontFamily: 'var(--font-noto-sans-jp)' }}
            >
              中号
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/70 hover:text-white transition-colors text-sm font-semibold tracking-wide hover:text-[#FF4D00]"
            >
              {link.label}
            </a>
          ))}
          <div className="w-px h-4 bg-white/20" />
          {appLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/50 hover:text-white transition-colors text-sm font-semibold tracking-wide hover:text-[#FF4D00]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#tokenomics"
            className="hidden sm:flex items-center px-5 py-2 rounded-full text-white font-bold text-sm"
            style={{
              background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
              boxShadow: '0 0 15px rgba(255,77,0,0.5)',
              fontFamily: 'var(--font-permanent-marker)',
            }}
          >
            Buy $NAKA
          </motion.a>

          <ConnectButton chainStatus="icon" showBalance={false} />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10"
        >
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {[...navLinks, ...appLinks].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-white/80 hover:text-[#FF4D00] transition-colors font-semibold py-2 border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#tokenomics"
              className="mt-2 text-center py-4 rounded-full text-white font-bold"
              style={{
                background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
                fontFamily: 'var(--font-permanent-marker)',
              }}
            >
              Buy $NAKA
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
