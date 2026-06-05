'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Activity } from 'lucide-react';

const NAKA_CA = '0x6967b9a8c0b14849cfe8f9e5732b401433fd2898';
const DEXSCREENER_URL = `https://api.dexscreener.com/latest/dex/tokens/${NAKA_CA}`;

export default function LiveTicker() {
  const [price, setPrice] = useState<string | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [mcap, setMcap] = useState<string | null>(null);
  const [vol24h, setVol24h] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${n.toFixed(0)}`;
  };

  const fetchData = async () => {
    try {
      const res = await fetch(DEXSCREENER_URL);
      if (!res.ok) return;
      const data = await res.json();
      const pair = data?.pairs?.[0];
      if (!pair) return;
      if (pair.priceUsd) setPrice(Number(pair.priceUsd).toFixed(8));
      if (pair.priceChange?.h24 != null) setPriceChange(pair.priceChange.h24);
      if (pair.marketCap) setMcap(fmt(pair.marketCap));
      if (pair.volume?.h24) setVol24h(fmt(pair.volume.h24));
    } catch { /* silently ignore */ }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const isUp = priceChange != null && priceChange >= 0;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 gap-4"
      style={{
        height: 36,
        background: 'linear-gradient(90deg, #0a0a0a 0%, #110800 50%, #0a0a0a 100%)',
        borderBottom: '1px solid rgba(255,77,0,0.2)',
      }}
    >
      {/* LEFT: LIVE badge */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-[#FF4D00] flex-shrink-0"
        />
        <span
          className="text-[#FF4D00] text-[10px] font-black tracking-[0.2em]"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          LIVE
        </span>
        <Activity className="w-3 h-3 text-[#FF4D00]" />
      </div>

      {/* CENTER: price stats */}
      <div className="flex items-center gap-4 md:gap-6 overflow-hidden">
        {price && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-white/40 text-[10px] uppercase tracking-widest hidden sm:block">$NAKA</span>
            <span className="text-white text-[12px] font-bold font-mono">${price}</span>
            {priceChange != null && (
              <span
                className="text-[11px] font-bold flex items-center gap-0.5 flex-shrink-0"
                style={{ color: isUp ? '#00FF88' : '#FF4040' }}
              >
                {isUp
                  ? <TrendingUp className="w-3 h-3" />
                  : <TrendingDown className="w-3 h-3" />}
                {isUp ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            )}
          </div>
        )}
        {mcap && (
          <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
            <span className="text-white/30 text-[10px] uppercase tracking-widest">Mcap</span>
            <span className="text-white/80 text-[11px] font-semibold font-mono">{mcap}</span>
          </div>
        )}
        {vol24h && (
          <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
            <span className="text-white/30 text-[10px] uppercase tracking-widest">Vol 24h</span>
            <span className="text-white/80 text-[11px] font-semibold font-mono">{vol24h}</span>
          </div>
        )}
      </div>

      {/* RIGHT: $NAKA badge */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Zap className="w-3 h-3 text-[#FF4D00]" />
        <span className="text-[#FF4D00] text-[10px] font-black tracking-widest hidden sm:block" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
          $NAKA
        </span>
      </div>
    </div>
  );
}
