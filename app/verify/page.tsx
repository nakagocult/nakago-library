import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import VerifyConsole from '@/components/verify/VerifyConsole';

export const metadata = {
  title: 'Verify Wallet | NAKA GO 中号',
  description: 'Link a wallet to your Naka profile by signing a one-time challenge.',
  robots: { index: false, follow: false },
};

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
          Prove you control a wallet by signing a one-time message. No funds move, nothing is spent —
          a signature is all it takes.
        </p>
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
