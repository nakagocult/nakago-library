'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Image as ImageIcon, Cookie, Sword, Ticket, Music, User, BookOpen, Wallet, Vault, Gem } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/utils/constants';
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import MiniPlayer from '@/components/shared/MiniPlayer';

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.01 9.47c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.617l-2.95-.924c-.643-.203-.655-.643.136-.953l11.521-4.443c.535-.194 1.002.13.831.82l.544-.869z"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'History', href: '#history' },
  { label: 'Tokenomics', href: '#tokenomics' },
  { label: 'Community', href: '#community' },
];

const appLinks = [
  { label: 'Claim',     href: '/claim',     icon: Gem },
  { label: 'Gallery',   href: '/gallery',   icon: ImageIcon },
  { label: 'Cookies',   href: '/cookies',   icon: Cookie },
  { label: 'M4nga',     href: '/m4nga',     icon: Sword },
  { label: 'Vault',     href: '/vault',     icon: Vault },
  { label: 'Lottery',   href: '/lottery',   icon: Ticket },
  { label: 'Ddergo',    href: '/ddergo',    icon: Music },
  { label: 'PFP',       href: '/pfp',       icon: User },
  { label: 'Lore Lab',  href: '/lore-lab',  icon: BookOpen },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

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
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#FF4D00]/10 shadow-[0_4px_30px_rgba(255,77,0,0.12)]'
          : 'bg-transparent'
      }`}
      style={{ top: 36 }}
    >
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo + MiniPlayer */}
        <div className="flex items-center gap-2">
        <MiniPlayer />
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#FF4D00]/60 group-hover:border-[#FF4D00] transition-all shadow-[0_0_15px_rgba(255,77,0,0.4)] flex-shrink-0"
          >
            {!imgError ? (
              <Image
                src="https://i.ibb.co/B8zQgxk/IMG-7857.jpg"
                alt="Naka Go"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#FF4D00] to-[#FF0000] flex items-center justify-center text-white text-sm font-bold">
                中
              </div>
            )}
          </motion.div>
          <div className="flex flex-col leading-none">
            <span
              className="text-white text-lg font-bold tracking-wider"
              style={{ fontFamily: 'var(--font-permanent-marker)' }}
            >
              NAKA GO
            </span>
            <span
              className="text-[#FF4D00] text-xs"
              style={{ fontFamily: 'var(--font-noto-sans-jp)' }}
            >
              中号 · The Shiba Who Saved His Breed
            </span>
          </div>
        </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/60 hover:text-[#FF4D00] transition-colors text-sm font-semibold tracking-wide"
            >
              {link.label}
            </a>
          ))}
          <div className="w-px h-4 bg-white/20" />
          {appLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/50 hover:text-[#FF4D00] transition-colors text-sm font-semibold tracking-wide flex items-center gap-1.5"
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Social icons */}
          <div className="hidden md:flex items-center gap-1 mr-2">
            <motion.a
              whileHover={{ scale: 1.1, y: -1 }}
              href={SOCIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-[#0088cc]/20 text-white/60 hover:text-[#0088cc] transition-all"
              title="Telegram"
            >
              <TelegramIcon />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, y: -1 }}
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
              title="X / Twitter"
            >
              <XIcon />
            </motion.a>
          </div>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={SOCIAL_LINKS.uniswap}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center px-3 py-1.5 rounded-full text-white font-bold text-xs"
            style={{
              background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
              boxShadow: '0 0 12px rgba(255,77,0,0.4)',
              fontFamily: 'var(--font-permanent-marker)',
            }}
          >
            Buy $NAKA
          </motion.a>

          {/* Compact wallet button */}
          {isConnected && address ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => disconnect()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all"
              style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00FF88', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.08em' }}
              title="Click to disconnect"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" style={{ animation: 'pulse 2s infinite' }} />
              {address.slice(0, 4)}...{address.slice(-4)}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={openConnectModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.08em' }}
            >
              <Wallet className="w-3 h-3" />
              Connect
            </motion.button>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0a0a0a]/98 backdrop-blur-xl border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-1">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Main</p>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white/70 hover:text-[#FF4D00] transition-colors font-semibold py-4 border-b border-white/5 text-base"
                >
                  {link.label}
                </a>
              ))}
              <p className="text-white/30 text-xs uppercase tracking-widest mt-4 mb-1">Tools</p>
              {appLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-white/70 hover:text-[#FF4D00] transition-colors font-semibold py-4 border-b border-white/5 flex items-center gap-3 text-base"
                  >
                    <Icon className="w-5 h-5 text-[#FF4D00] flex-shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex items-center gap-3 mt-4">
                <a
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-[#0088cc] transition-colors text-sm py-2"
                >
                  <TelegramIcon /> Telegram
                </a>
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm py-2"
                >
                  <XIcon /> X
                </a>
              </div>
              <a
                href={SOCIAL_LINKS.uniswap}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-center py-3 rounded-full text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #FF4D00, #FF0000)', fontFamily: 'var(--font-permanent-marker)' }}
              >
                Buy $NAKA
              </a>
              {isConnected && address ? (
                <button
                  onClick={() => disconnect()}
                  className="text-center py-3 rounded-full font-black text-sm"
                  style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00FF88', fontFamily: 'Bebas Neue, Impact, sans-serif' }}
                >
                  Connected: {address.slice(0, 6)}...{address.slice(-4)} (tap to disconnect)
                </button>
              ) : (
                <button
                  onClick={openConnectModal}
                  className="text-center py-3 rounded-full font-black text-sm flex items-center justify-center gap-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontFamily: 'Bebas Neue, Impact, sans-serif' }}
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
