import { Suspense } from 'react';
import { Loader2, CloudRain, TrendingUp, Gem } from 'lucide-react';
import VerifyConsole from '@/components/verify/VerifyConsole';

export const metadata = {
  title: 'Verify Wallet | NAKA GO 中号',
  description: 'Link a wallet to your SOTH by signing a single use challenge.',
  robots: { index: false, follow: false },
};

const PERKS = [
  {
    icon: CloudRain,
    title: 'Redeem Naka through Make It Rain',
    text: 'Make It Rain is the faucet that rewards you for showing up and staying active.',
  },
  {
    icon: TrendingUp,
    title: 'Boost your Make It Rain multiplier',
    text: 'A linked wallet raises the multiplier on every Make It Rain payout you earn.',
  },
  {
    icon: Gem,
    title: 'Unlock NFT holder perks',
    text: 'Hold a Naka relic and your linked wallet flips on the holder only rewards.',
  },
];

export default function VerifyPage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-xl flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <span
          className="block text-xs font-black uppercase tracking-[0.35em] text-[#FF4D00]"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          Wallet · Verification
        </span>
        <h1
          className="mt-3 text-5xl font-black leading-none text-white md:text-6xl"
          style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
        >
          <span className="text-gradient-fire">LINK</span> YOUR WALLET
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/45">
          Linking ties this wallet to your SOTH (State of the Hooman), the Henk profile system.
          Prove you control it by signing a single use message. No funds move and nothing is spent.
          A signature is all it takes.
        </p>
      </div>

      <div
        className="mb-8 rounded-3xl p-5 sm:p-6"
        style={{
          background: 'rgba(17,17,17,0.55)',
          border: '1px solid rgba(255,77,0,0.16)',
        }}
      >
        <span className="mb-4 block text-[11px] font-black uppercase tracking-[0.25em] text-white/40">
          Why link your wallet
        </span>
        <ul className="flex flex-col gap-4">
          {PERKS.map((perk) => (
            <li key={perk.title} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ background: '#FF4D0014', border: '1px solid #FF4D0033' }}
              >
                <perk.icon className="h-4 w-4 text-[#FF4D00]" />
              </span>
              <div>
                <p className="text-sm font-bold text-white/85">{perk.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/45">{perk.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-12 text-white/40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        }
      >
        <VerifyConsole />
      </Suspense>
    </main>
  );
}
