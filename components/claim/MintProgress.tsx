'use client';

interface MintProgressProps {
  claimed: number;
  total: number;
  rareBois: number;
  accent: [string, string];
  loading: boolean;
}

export default function MintProgress({ claimed, total, rareBois, accent, loading }: MintProgressProps) {
  const pct = total > 0 ? Math.min(100, (claimed / total) * 100) : 0;
  const remaining = Math.max(0, total - claimed);

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">Minted</p>
          <p className="mt-1 text-3xl font-black text-white">
            {loading ? '...' : claimed.toLocaleString()}
            <span className="text-base font-semibold text-white/35"> / {total.toLocaleString()}</span>
          </p>
        </div>
        <p className="text-right text-sm font-bold text-white/45">
          {loading ? 'Reading chain...' : `${remaining.toLocaleString()} left`}
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${accent[0]}, ${accent[1]})`,
          }}
        />
      </div>

      <p className="mt-3 text-xs text-white/40">{rareBois} rare tier tokens in this drop.</p>
    </div>
  );
}
