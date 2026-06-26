'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MASCOT_URL, SOCIAL_LINKS } from '@/lib/site';
import CopyAddress from '@/components/shared/CopyAddress';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/claim', label: 'Claim' },
  { href: '/view', label: 'View' },
  { href: '/mosaic', label: 'Mosaic' },
  { href: '/cawf', label: 'CAWF' },
];

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.01 9.47c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.617l-2.95-.924c-.643-.203-.655-.643.136-.953l11.521-4.443c.535-.194 1.002.13.831.82l.544-.869z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/** Contract + Buy $NAKA + socials — the promoted primary actions. */
function PrimaryFeatures() {
  return (
    <div
      className="flex items-center gap-2 rounded-full p-1"
      style={{ background: 'rgba(255,77,0,0.07)', boxShadow: '0 0 24px rgba(255,77,0,0.14)' }}
    >
      <CopyAddress />
      <a
        href={SOCIAL_LINKS.uniswap}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-[1.04]"
        style={{
          background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
          boxShadow: '0 0 16px rgba(255,77,0,0.55)',
          fontFamily: 'Bebas Neue, Impact, sans-serif',
          letterSpacing: '0.08em',
        }}
      >
        Buy $NAKA
      </a>
      <a
        href={SOCIAL_LINKS.telegram}
        target="_blank"
        rel="noopener noreferrer"
        title="Telegram"
        className="rounded-full p-2 text-white/60 transition-colors hover:bg-[#0088cc]/20 hover:text-[#0088cc]"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <TelegramIcon />
      </a>
      <a
        href={SOCIAL_LINKS.twitter}
        target="_blank"
        rel="noopener noreferrer"
        title="X / Twitter"
        className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <XIcon />
      </a>
    </div>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const [imgError, setImgError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{ background: 'rgba(10,10,10,0.92)', borderBottom: '1px solid rgba(255,77,0,0.12)' }}
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div
            className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full transition-all"
            style={{ border: '2px solid rgba(255,77,0,0.6)', boxShadow: '0 0 14px rgba(255,77,0,0.35)' }}
          >
            {!imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={MASCOT_URL}
                alt="Naka Go"
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FF4D00] to-[#FF0000] text-sm font-bold text-white">
                中
              </div>
            )}
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <span
              className="text-base font-black tracking-[0.14em] text-white"
              style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif' }}
            >
              NAKA GO <span className="text-[#FF4D00]" style={{ fontFamily: "'Noto Serif JP', serif" }}>中号</span>
            </span>
          </div>
        </Link>

        {/* Primary features — centered on desktop */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <PrimaryFeatures />
        </div>

        {/* Right side: wallet + menu */}
        <div className="flex items-center gap-2">
          <div className="shrink-0">
            <ConnectButton accountStatus="address" chainStatus="none" showBalance={false} />
          </div>

          {/* Menu */}
          <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Navigation menu"
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-white/70 transition-colors hover:text-[#FF4D00]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span
              className="hidden text-xs font-black uppercase tracking-[0.2em] sm:inline"
              style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
            >
              Menu
            </span>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                {/* Click-away backdrop */}
                <button
                  type="button"
                  aria-hidden
                  tabIndex={-1}
                  onClick={() => setMenuOpen(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl p-1.5 backdrop-blur-xl"
                  style={{ background: 'rgba(17,17,17,0.92)', border: '1px solid rgba(255,77,0,0.2)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}
                >
                  {LINKS.map((link) => {
                    const active = 'href' in link && pathname === link.href;
                    const className =
                      'block w-full rounded-lg px-3 py-2.5 text-left text-sm font-black uppercase tracking-[0.2em] transition-colors';
                    const style = {
                      color: active ? '#FF4D00' : 'rgba(255,255,255,0.6)',
                      background: active ? 'rgba(255,77,0,0.1)' : 'transparent',
                      fontFamily: 'Bebas Neue, Impact, sans-serif',
                    } as const;

                    return (
                      <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={className} style={style}>
                        {link.label}
                      </Link>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Primary features — second row on small screens */}
      <div
        className="flex items-center justify-center border-t px-4 py-2 md:hidden"
        style={{ borderColor: 'rgba(255,77,0,0.1)' }}
      >
        <PrimaryFeatures />
      </div>
    </nav>
  );
}
