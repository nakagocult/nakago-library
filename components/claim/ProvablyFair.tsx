'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Copy, Check } from 'lucide-react';

interface ProvablyFairProps {
  hash: string;
  accent: [string, string];
  /** Optional note rendered under the hash. */
  note?: string;
}

export default function ProvablyFair({ hash, accent, note }: ProvablyFairProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the hash stays visible to copy by hand */
    }
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: '#0d0d0d', border: `1px solid ${accent[1]}33` }}
    >
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4" style={{ color: accent[1] }} />
        <span
          className="text-sm font-black uppercase tracking-[0.2em]"
          style={{ color: accent[1], fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          Provably Fair
        </span>
      </div>

      <button
        onClick={copy}
        className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <span className="min-w-0 flex-1 break-all font-mono text-[11px] leading-relaxed text-white/70">
          {hash}
        </span>
        <span className="flex-shrink-0 text-white/40 group-hover:text-white/80">
          {copied ? <Check className="h-4 w-4 text-[#00FF88]" /> : <Copy className="h-4 w-4" />}
        </span>
      </button>

      <motion.p
        initial={false}
        animate={{ opacity: copied ? 1 : 0.45 }}
        className="mt-2 text-[11px] text-white/45"
      >
        {copied ? 'Copied to clipboard' : note ?? 'Randomized-order proof. Hashed before mint, verifiable after reveal.'}
      </motion.p>
    </div>
  );
}
