import Link from 'next/link';
import { BookOpen, ExternalLink } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/utils/constants';

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.01 9.47c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.617l-2.95-.924c-.643-.203-.655-.643.136-.953l11.521-4.443c.535-.194 1.002.13.831.82l.544-.869z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-2 mb-4">
              <span
                className="text-2xl text-white font-bold"
                style={{ fontFamily: 'var(--font-permanent-marker)' }}
              >
                NAKA GO
              </span>
              <span
                className="text-white/60"
                style={{ fontFamily: 'var(--font-noto-sans-jp)' }}
              >
                中号
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Honoring the legacy of Naka Go of Akaishi-so — the Shiba Inu who saved his breed from extinction after WWII.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Navigate</h3>
            <ul className="space-y-2">
              {[
                { label: 'About', href: '#about' },
                { label: 'Tokenomics', href: '#tokenomics' },
                { label: 'Community', href: '#community' },
                { label: 'Cookies', href: '/cookies' },
                { label: 'Lottery', href: '/lottery' },
                { label: 'M4nga SBT', href: '/m4nga' },
                { label: 'Ddergo Records', href: '/ddergo' },
                { label: 'Lore Lab', href: '/lore-lab' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-[#FF4D00] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Community</h3>
            <ul className="space-y-3">
              {([
                { label: 'Telegram', href: SOCIAL_LINKS.telegram, Icon: TelegramIcon },
                { label: 'X / Twitter', href: SOCIAL_LINKS.twitter, Icon: XIcon },
                { label: 'Lore Lab', href: SOCIAL_LINKS.medium, Icon: BookOpen },
                { label: 'Etherscan', href: SOCIAL_LINKS.etherscan, Icon: ExternalLink },
              ] as const).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-[#FF4D00] transition-colors text-sm flex items-center gap-2"
                  >
                    <link.Icon />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © 2025 Naka Go. Built for Naka Go of Akaishi-so.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/30 hover:text-white/50 text-sm transition-colors">Terms</a>
            <a href="#" className="text-white/30 hover:text-white/50 text-sm transition-colors">Privacy</a>
            <span className="text-white/30 text-sm">$NAKA on Ethereum</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
