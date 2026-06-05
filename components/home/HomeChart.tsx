'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, TrendingUp, TrendingDown, Droplets, Coins, DollarSign, BarChart2 } from 'lucide-react';
import { SOCIAL_LINKS, NAKA_TOKEN_ADDRESS } from '@/lib/utils/constants';
import BuyModal from '@/components/shared/BuyModal';

const DEXSCREENER_API = `https://api.dexscreener.com/latest/dex/tokens/${NAKA_TOKEN_ADDRESS}`;

interface LiveStats {
  price: string;
  priceChange24h: number;
  volume24h: string;
  liquidity: string;
  marketCap: string;
  fdv: string;
}

function fmt(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

export default function HomeChart() {
  const [buyOpen, setBuyOpen] = useState(false);
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(DEXSCREENER_API);
        const data = await res.json();
        const pair = data?.pairs?.[0];
        if (!pair) return;
        setStats({
          price: Number(pair.priceUsd || 0).toFixed(8),
          priceChange24h: pair.priceChange?.h24 ?? 0,
          volume24h: fmt(pair.volume?.h24 || 0),
          liquidity: fmt(pair.liquidity?.usd || 0),
          marketCap: fmt(pair.marketCap || pair.fdv || 0),
          fdv: fmt(pair.fdv || 0),
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    const id = setInterval(fetchStats, 30000);
    return () => clearInterval(id);
  }, []);

  const liveStatCards = [
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Price',
      value: loading ? '...' : stats ? `$${stats.price}` : 'N/A',
      sub: stats ? (
        <span style={{ color: stats.priceChange24h >= 0 ? '#00FF88' : '#FF4040' }} className="flex items-center gap-1">
          {stats.priceChange24h >= 0
            ? <TrendingUp className="w-3 h-3 inline" />
            : <TrendingDown className="w-3 h-3 inline" />}
          {stats.priceChange24h >= 0 ? '+' : ''}{stats.priceChange24h.toFixed(1)}% 24h
        </span>
      ) : <span className="text-white/30">Live</span>,
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      label: 'Volume 24h',
      value: loading ? '...' : stats?.volume24h ?? 'N/A',
      sub: <span className="text-white/30">Trading Volume</span>,
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: 'Liquidity',
      value: loading ? '...' : stats?.liquidity ?? 'Burned',
      sub: <span className="text-[#FF4D00]/70">Locked Forever</span>,
    },
    {
      icon: <Coins className="w-5 h-5" />,
      label: 'Market Cap',
      value: loading ? '...' : stats?.marketCap ?? 'N/A',
      sub: <span className="text-white/30">0% Tax</span>,
    },
  ];

  return (
    <section id="chart" className="py-24 relative overflow-hidden">
      <BuyModal isOpen={buyOpen} onClose={() => setBuyOpen(false)} />

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,77,0,0.04) 0%, transparent 70%)' }}
      />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span
            className="text-[#FF4D00] text-sm font-black uppercase tracking-widest mb-3 block"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.3em' }}
          >
            Live Market Data
          </span>
          <h2
            className="text-5xl md:text-6xl text-white mb-4"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #FF4D00, #FFD700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              $NAKA
            </span>{' '}
            CHART
          </h2>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <p className="text-white/30 text-xs font-mono">{NAKA_TOKEN_ADDRESS}</p>
            <a
              href={SOCIAL_LINKS.etherscan}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF4D00] hover:text-[#FF4D00]/80 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Live stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {liveStatCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: '0 0 30px rgba(255,77,0,0.15)' }}
              className="rounded-2xl p-5 text-center transition-all"
              style={{ background: '#111', border: '1px solid rgba(255,77,0,0.15)' }}
            >
              <div className="flex items-center justify-center text-[#FF4D00] mb-3">
                {stat.icon}
              </div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{stat.label}</p>
              <p
                className="text-white font-black text-lg leading-none mb-1 font-mono"
                style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.1rem' }}
              >
                {loading ? (
                  <span className="inline-block w-16 h-4 rounded skeleton" />
                ) : stat.value}
              </p>
              <div className="text-xs">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Chart embed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 overflow-hidden rounded-2xl"
          style={{ height: 500, border: '1px solid rgba(255,77,0,0.15)' }}
        >
          <iframe
            src={`https://dexscreener.com/ethereum/${NAKA_TOKEN_ADDRESS}?embed=1&theme=dark&trades=0&info=0`}
            width="100%"
            height="500"
            style={{ border: 'none' }}
            title="NAKA GO Price Chart"
            loading="lazy"
          />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(255,77,0,0.7)' }}
            whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: ['0 0 25px rgba(255,77,0,0.4)', '0 0 50px rgba(255,77,0,0.65)', '0 0 25px rgba(255,77,0,0.4)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => setBuyOpen(true)}
            className="px-12 py-4 rounded-full text-white font-black text-lg text-center cursor-pointer"
            style={{
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
              letterSpacing: '0.08em',
            }}
          >
            BUY $NAKA NOW
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href={SOCIAL_LINKS.dexscreener}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 rounded-full text-[#FF4D00] font-black text-lg border-2 border-[#FF4D00]/40 hover:border-[#FF4D00] hover:bg-[#FF4D00]/10 transition-all text-center flex items-center justify-center gap-2"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}
          >
            <ExternalLink className="w-5 h-5" />
            DEXSCREENER
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
