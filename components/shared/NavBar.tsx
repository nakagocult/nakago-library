'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MASCOT_URL, NAV_LINKS, SOCIAL_LINKS } from '@/lib/site';
import CopyAddress from '@/components/shared/CopyAddress';
import TelegramIcon from '@/components/shared/TelegramIcon';

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/** Contract + Buy $NAKA + socials — the promoted primary actions. Desktop only;
    the mobile bar uses the condensed inline controls instead. */
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

/** Square, icon-only wallet button for the condensed mobile bar. Wraps RainbowKit's
    headless ConnectButton so it still opens the connect/account modals. */
function CompactConnect() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openAccountModal, openChainModal, mounted }) => {
        const connected = mounted && !!account && !!chain;
        const onClick = !connected
          ? openConnectModal
          : chain?.unsupported
            ? openChainModal
            : openAccountModal;
        return (
          <button
            type="button"
            onClick={onClick}
            aria-label={connected ? 'Wallet account' : 'Connect wallet'}
            title={connected ? account?.displayName : 'Connect wallet'}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
            style={{
              background: connected ? 'rgba(255,77,0,0.12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${connected ? 'rgba(255,77,0,0.4)' : 'rgba(255,255,255,0.12)'}`,
              color: connected ? '#FF4D00' : 'rgba(255,255,255,0.7)',
              opacity: mounted ? 1 : 0,
            }}
          >
            <Wallet className="h-4 w-4" />
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const [imgError, setImgError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

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
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile: condensed one-line controls (contract + buy + square connect) */}
          <div className="flex items-center gap-1.5 md:hidden">
            <CopyAddress compact />
            <a
              href={SOCIAL_LINKS.uniswap}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-3 py-2 text-[11px] font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
                boxShadow: '0 0 14px rgba(255,77,0,0.5)',
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                letterSpacing: '0.06em',
              }}
            >
              Buy $NAKA
            </a>
            <CompactConnect />
          </div>

          {/* Desktop: full wallet button */}
          <div className="hidden shrink-0 md:block">
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
                  {NAV_LINKS.map((link) => {
                    const active = pathname === link.href;
                    const hot = hovered === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        onMouseEnter={() => setHovered(link.href)}
                        onMouseLeave={() => setHovered((h) => (h === link.href ? null : h))}
                        className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-black uppercase tracking-[0.2em] transition-colors"
                        style={{
                          color: active ? '#FF4D00' : hot ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                          background: active
                            ? 'rgba(255,77,0,0.1)'
                            : hot
                              ? 'rgba(255,255,255,0.08)'
                              : 'transparent',
                          fontFamily: 'Bebas Neue, Impact, sans-serif',
                        }}
                      >
                        {link.label}
                      </Link>
                    );
                  })}

                  {/* Socials — mobile only; desktop shows them in the centered bar */}
                  <div
                    className="mt-1.5 flex items-center gap-1.5 border-t px-1 pt-2 md:hidden"
                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <a
                      href={SOCIAL_LINKS.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Telegram"
                      className="flex flex-1 items-center justify-center rounded-lg py-2 text-white/60 transition-colors hover:bg-[#0088cc]/20 hover:text-[#0088cc]"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <TelegramIcon />
                    </a>
                    <a
                      href={SOCIAL_LINKS.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="X / Twitter"
                      className="flex flex-1 items-center justify-center rounded-lg py-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <XIcon />
                    </a>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
