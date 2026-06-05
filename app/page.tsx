'use client';

import ClaimConsole from '@/components/claim/ClaimConsole';
import MintProgress from '@/components/claim/MintProgress';
import { FOUNDER_PASS, NIPPO, type DropConfig } from '@/lib/thirdweb/drops';
import { useDropStats } from '@/lib/thirdweb/useDropStats';

const DROPS: Array<{ drop: DropConfig; maxPerTx: number }> = [
  { drop: NIPPO, maxPerTx: 10 },
  { drop: FOUNDER_PASS, maxPerTx: 5 },
];

export default function MintPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#ff4d00]">
            Naka Cult Mint
          </p>
          <h1 className="mt-2 text-4xl font-black leading-none tracking-normal text-white sm:text-6xl">
            Claim the drops
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-6 text-white/55">
          Connect wallet, choose quantity, mint. Live supply and price are read from the contracts.
        </p>
      </header>

      <section className="grid flex-1 gap-5 lg:grid-cols-2">
        {DROPS.map(({ drop, maxPerTx }) => (
          <MintDrop key={drop.slug} drop={drop} maxPerTx={maxPerTx} />
        ))}
      </section>
    </main>
  );
}

function MintDrop({ drop, maxPerTx }: { drop: DropConfig; maxPerTx: number }) {
  const stats = useDropStats(drop);

  return (
    <article
      className="flex min-h-[540px] flex-col rounded-lg border p-5 sm:p-6"
      style={{
        background: 'rgba(14, 14, 14, 0.94)',
        borderColor: `${drop.accent[0]}40`,
      }}
    >
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: drop.accent[0] }}>
          {drop.name}
        </p>
        <h2 className="mt-2 text-3xl font-black leading-tight tracking-normal text-white">
          {drop.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/55">{drop.tagline}</p>
      </div>

      <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <MintProgress
          claimed={stats.claimed}
          total={stats.total}
          rareBois={drop.rareBois}
          accent={drop.accent}
          loading={stats.loading}
        />
      </div>

      <div className="mt-auto">
        <ClaimConsole drop={drop} maxPerTx={maxPerTx} />
      </div>
    </article>
  );
}
