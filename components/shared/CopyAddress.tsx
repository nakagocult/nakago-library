'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CONTRACT = '0x6967b9a8c0b14849CFE8f9E5732B401433fD2898';

export default function CopyAddress({
  address = CONTRACT,
  compact = false,
}: {
  address?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const head = address.slice(0, 6);
  const tail = address.slice(-4);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  // Condensed "CA 0x69…2898" pill for the single-line mobile bar.
  if (compact) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy contract address'}
        aria-label="Copy contract address"
        className="group inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 transition-colors"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${copied ? 'rgba(0,255,136,0.4)' : 'rgba(255,77,0,0.25)'}`,
        }}
      >
        <span
          className="text-[10px] font-black uppercase tracking-[0.15em] text-[#FF4D00]"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          CA
        </span>
        <span className="flex items-center gap-0.5 text-[11px] text-white/70" style={{ fontFamily: "'Noto Serif JP', serif" }}>
          {address.slice(0, 4)}
          <span className="text-white/25">…</span>
          {tail}
        </span>
        {copied ? (
          <Check className="h-3.5 w-3.5 text-[#00FF88]" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-white/40 transition-colors group-hover:text-[#FF4D00]" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy contract address'}
      aria-label="Copy contract address"
      className="group inline-flex items-center gap-2.5 rounded-full px-4 py-2 transition-colors"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${copied ? 'rgba(0,255,136,0.4)' : 'rgba(255,77,0,0.25)'}`,
      }}
    >
      <span
        className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF4D00]"
        style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
      >
        Contract
      </span>
      <span className="flex items-center gap-1 text-xs text-white/70" style={{ fontFamily: "'Noto Serif JP', serif" }}>
        {head}
        <span className="tracking-[0.15em] text-white/25">···</span>
        {tail}
      </span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[#00FF88]" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-white/40 transition-colors group-hover:text-[#FF4D00]" />
      )}
    </button>
  );
}
