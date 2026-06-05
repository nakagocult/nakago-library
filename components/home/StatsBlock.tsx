'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Dna, Calendar, Coins } from 'lucide-react';
import { NAKA_TOKEN_ADDRESS } from '@/lib/utils/constants';

const API = `https://api.dexscreener.com/latest/dex/tokens/${NAKA_TOKEN_ADDRESS}`;

interface TokenStats {
  price: string;
  priceChange5m: number;
  priceChange1h: number;
  priceChange24h: number;
  liquidity: string;
  mcap: string;
  fdv: string;
  supply: string;
  vol5m: string;
  vol24h: string;
  buys24h: number;
  sells24h: number;
}

function fmtUsd(n: number): string {
  if (!n || isNaN(n)) return '$0';
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function fmtNum(n: number): string {
  if (!n || isNaN(n)) return '0';
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toFixed(2);
}

function ChangeTag({ value }: { value: number }) {
  const pos = value >= 0;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-xs font-bold"
      style={{ color: pos ? '#00FF88' : '#FF4040' }}
    >
      {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {pos ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
}

function Skeleton() {
  return (
    <div className="h-6 w-20 rounded-md animate-pulse" style={{ background: 'rgba(255,255,255,0.07)' }} />
  );
}

export default function StatsBlock() {
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(API);
        const data = await res.json();
        const p = data?.pairs?.[0];
        if (!p) return;
        const supply = 1_000_000_000;
        setStats({
          price: Number(p.priceUsd || 0).toFixed(8),
          priceChange5m: p.priceChange?.m5 ?? 0,
          priceChange1h: p.priceChange?.h1 ?? 0,
          priceChange24h: p.priceChange?.h24 ?? 0,
          liquidity: fmtUsd(p.liquidity?.usd ?? 0),
          mcap: fmtUsd(p.marketCap ?? p.fdv ?? 0),
          fdv: fmtUsd(p.fdv ?? 0),
          supply: `${fmtNum(supply)}`,
          vol5m: fmtUsd(p.volume?.m5 ?? 0),
          vol24h: fmtUsd(p.volume?.h24 ?? 0),
          buys24h: p.txns?.h24?.buys ?? 0,
          sells24h: p.txns?.h24?.sells ?? 0,
        });
      } catch { /* silent */ } finally {
        setLoading(false);
      }
    };
    fetch_();
    const id = setInterval(fetch_, 30_000);
    return () => clearInterval(id);
  }, []);

  const keyStats = [
    { label: 'Price', value: loading ? null : `$${stats?.price ?? '0'}`, sub: stats ? <ChangeTag value={stats.priceChange24h} /> : null },
    { label: 'Liquidity', value: loading ? null : (stats?.liquidity ?? '$0'), sub: <span className="text-[#FF4D00]/70 text-[10px]">Locked forever</span> },
    { label: 'Mcap', value: loading ? null : (stats?.mcap ?? '$0'), sub: null },
    { label: 'FDV', value: loading ? null : (stats?.fdv ?? '$0'), sub: null },
    { label: 'Supply', value: loading ? null : (stats?.supply ? `${stats.supply}` : '1B'), sub: <span className="text-white/30 text-[10px]">$NAKA</span> },
    { label: 'Vol 5m', value: loading ? null : (stats?.vol5m ?? '$0'), sub: null },
    { label: 'Vol 24h', value: loading ? null : (stats?.vol24h ?? '$0'), sub: null },
    { label: '24h %', value: loading ? null : null, sub: stats ? <ChangeTag value={stats.priceChange24h} /> : null, big: true },
    { label: 'Buys 24h', value: loading ? null : String(stats?.buys24h ?? 0), sub: <span className="text-[#00FF88]/70 text-[10px]">transactions</span> },
    { label: 'Sells 24h', value: loading ? null : String(stats?.sells24h ?? 0), sub: <span className="text-[#FF4040]/70 text-[10px]">transactions</span> },
    { label: 'Tax', value: '0% / 0%', sub: <span className="text-[#00FF88]/70 text-[10px]">Buy / Sell</span> },
    { label: 'Ownership', value: 'Renounced', sub: <span className="text-[#FF4D00]/70 text-[10px]">Community</span> },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[#00FF88]"
            />
            <span
              className="text-white/50 text-xs uppercase tracking-[0.3em]"
              style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
            >
              KEY STATS
            </span>
            <span className="text-white/20 text-[10px] ml-auto font-mono">Updates every 30s</span>
          </div>
          <div className="h-px" style={{ background: 'linear-gradient(90deg, rgba(255,77,0,0.3), transparent)' }} />
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {keyStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3, borderColor: 'rgba(255,77,0,0.4)' }}
              className="rounded-2xl px-4 py-4 transition-all"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div
                className="text-white/35 text-[10px] uppercase tracking-widest mb-1.5"
                style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.2em' }}
              >
                {stat.label}
              </div>
              {loading && !stat.value ? (
                <Skeleton />
              ) : stat.big ? (
                <div className="text-lg font-black">{stat.sub}</div>
              ) : (
                <div
                  className="text-white font-black text-base md:text-lg leading-none mb-1 font-mono"
                  style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.02em' }}
                >
                  {stat.value}
                </div>
              )}
              {!stat.big && stat.sub && <div className="mt-1">{stat.sub}</div>}
            </motion.div>
          ))}
        </div>

        {/* Lore stats row */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { Icon: Dna, value: '80%+', label: 'Modern Shibas' },
            { Icon: Calendar, value: '1948', label: 'Birth Year' },
            { Icon: Coins, value: '1B', label: 'Total Supply' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl px-4 py-5 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255,77,0,0.08), rgba(255,0,0,0.04))',
                border: '1px solid rgba(255,77,0,0.18)',
              }}
            >
              <div className="flex justify-center mb-2">
                <item.Icon className="w-6 h-6 text-[#FF4D00]" />
              </div>
              <div
                className="text-2xl font-black"
                style={{
                  fontFamily: 'Bebas Neue, Impact, sans-serif',
                  background: 'linear-gradient(135deg, #FF4D00, #FFD700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {item.value}
              </div>
              <div className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
