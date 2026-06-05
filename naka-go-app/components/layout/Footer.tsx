import Link from 'next/link';
import { SOCIAL_LINKS } from '@/lib/utils/constants';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 py-16 px-4">
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
            <p className="text-2xl mt-4">🍦</p>
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
              {[
                { label: 'Telegram', href: SOCIAL_LINKS.telegram, icon: '📱' },
                { label: 'X / Twitter', href: SOCIAL_LINKS.twitter, icon: '🐦' },
                { label: 'Medium', href: SOCIAL_LINKS.medium, icon: '📝' },
                { label: 'Etherscan', href: SOCIAL_LINKS.etherscan, icon: '🔍' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-[#FF4D00] transition-colors text-sm flex items-center gap-2"
                  >
                    <span>{link.icon}</span>
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
            © 2025 Naka Go. Built with ❤️ for Naka Go of Akaishi-so.
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
