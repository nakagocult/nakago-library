'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Ticket, Trophy, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ParticleField from '@/components/shared/ParticleField';

// Mock data — will be replaced with live contract calls
const MOCK_PRIZE_POOL = 5.2;
const MOCK_TICKET_PRICE = 0.01;
const NEXT_DRAW = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 32 * 60 * 1000);

const pastWinners = [
  { date: '2025-03-18', winner: '0x1234...5678', prize: '3.8 ETH' },
  { date: '2025-02-18', winner: '0xabcd...ef01', prize: '2.1 ETH' },
  { date: '2025-01-18', winner: '0x9876...5432', prize: '4.5 ETH' },
  { date: '2024-12-18', winner: '0xdeaf...cafe', prize: '1.9 ETH' },
  { date: '2024-11-18', winner: '0xbabe...face', prize: '3.2 ETH' },
];

function Countdown({ target }: { target: Date }) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setRemaining('Drawing now!'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${d}d ${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return <span>{remaining}</span>;
}

export default function LotteryPage() {
  const { isConnected } = useAccount();
  const [quantity, setQuantity] = useState(1);
  const [userTickets] = useState(3); // Mock — from contract
  const [page, setPage] = useState(0);
  const perPage = 3;

  const totalCost = (quantity * MOCK_TICKET_PRICE).toFixed(3);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="relative overflow-hidden">
        <ParticleField density={80} color="#FF4D00" />
        <Header />

        <div className="relative z-10 container mx-auto px-4 py-32 max-w-5xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-[#FF4D00] text-sm font-bold uppercase tracking-widest mb-3 block">
              On-Chain Lottery · Powered by Chainlink VRF
            </span>
            <h1
              className="text-5xl md:text-7xl mb-6"
              style={{ fontFamily: 'var(--font-permanent-marker)' }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                🎰 Naka Lottery
              </span>
            </h1>

            {/* Prize Pool */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-block"
            >
              <div
                className="rounded-3xl px-12 py-8 text-center"
                style={{ background: '#111', border: '1px solid rgba(255,77,0,0.3)', boxShadow: '0 0 50px rgba(255,77,0,0.2)' }}
              >
                <p className="text-white/50 text-sm uppercase tracking-widest mb-2">Current Prize Pool</p>
                <div
                  className="text-6xl md:text-8xl font-black"
                  style={{
                    fontFamily: 'var(--font-permanent-marker)',
                    background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 20px rgba(255,77,0,0.5))',
                  }}
                >
                  {MOCK_PRIZE_POOL} ETH
                </div>
                <div className="flex items-center justify-center gap-2 mt-3 text-white/50 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Draw in: </span>
                  <span className="text-[#FF4D00] font-mono font-bold">
                    <Countdown target={NEXT_DRAW} />
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* How to Play */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2
              className="text-3xl text-white text-center mb-8"
              style={{ fontFamily: 'var(--font-permanent-marker)' }}
            >
              How to Play
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: '1', icon: <Ticket className="w-8 h-8" />, title: 'Buy Tickets', desc: '0.01 ETH per ticket. Buy up to 100 at once.' },
                { step: '2', icon: <Clock className="w-8 h-8" />, title: 'Wait for Draw', desc: 'Winner selected automatically via Chainlink VRF.' },
                { step: '3', icon: <Trophy className="w-8 h-8" />, title: 'Claim Prize', desc: 'Winner claims the entire prize pool instantly.' },
              ].map((s) => (
                <motion.div
                  key={s.step}
                  whileHover={{ scale: 1.03 }}
                  className="rounded-2xl p-6 text-center"
                  style={{ background: '#111', border: '1px solid rgba(255,77,0,0.15)', boxShadow: '0 0 20px rgba(255,77,0,0.08)' }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white"
                    style={{ background: 'linear-gradient(135deg, #FF4D00, #FF0000)', boxShadow: '0 0 15px rgba(255,77,0,0.4)' }}
                  >
                    {s.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-permanent-marker)' }}>
                    {s.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Buy Tickets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto mb-16"
          >
            <div
              className="rounded-3xl p-8"
              style={{ background: '#111', border: '1px solid rgba(255,77,0,0.2)', boxShadow: '0 0 30px rgba(255,77,0,0.1)' }}
            >
              <h2 className="text-2xl text-white mb-6 text-center" style={{ fontFamily: 'var(--font-permanent-marker)' }}>
                🎫 Buy Tickets
              </h2>

              {/* Quantity selector */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xl flex items-center justify-center transition-colors"
                >
                  −
                </motion.button>
                <div className="text-center">
                  <div
                    className="text-4xl font-black text-white"
                    style={{ fontFamily: 'var(--font-permanent-marker)' }}
                  >
                    {quantity}
                  </div>
                  <div className="text-white/40 text-sm">ticket{quantity !== 1 ? 's' : ''}</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.min(100, quantity + 1))}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xl flex items-center justify-center transition-colors"
                >
                  +
                </motion.button>
              </div>

              {/* Quick select */}
              <div className="flex gap-2 justify-center mb-6">
                {[5, 10, 25, 50].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      quantity === q ? 'text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                    style={quantity === q ? { background: 'linear-gradient(135deg, #FF4D00, #FF0000)' } : {}}
                  >
                    {q}x
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mb-6 py-3 border-y border-white/10">
                <span className="text-white/50">Total Cost</span>
                <span className="text-[#FF4D00] font-bold text-lg">{totalCost} ETH</span>
              </div>

              {!isConnected ? (
                <div className="flex justify-center">
                  <ConnectButton />
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-full text-white font-bold text-lg"
                  style={{
                    fontFamily: 'var(--font-permanent-marker)',
                    background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
                    boxShadow: '0 0 25px rgba(255,77,0,0.5)',
                  }}
                >
                  Buy {quantity} Ticket{quantity !== 1 ? 's' : ''}
                </motion.button>
              )}

              {isConnected && (
                <div className="mt-4 flex items-center justify-center gap-2 text-white/40 text-sm">
                  <Users className="w-4 h-4" />
                  You own <span className="text-[#FF4D00] font-bold">{userTickets}</span> active tickets
                </div>
              )}
            </div>
          </motion.div>

          {/* Past Winners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl text-white text-center mb-8" style={{ fontFamily: 'var(--font-permanent-marker)' }}>
              🏆 Past Winners
            </h2>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left px-6 py-4 text-white/50 text-sm uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-4 text-white/50 text-sm uppercase tracking-wider">Winner</th>
                    <th className="text-right px-6 py-4 text-white/50 text-sm uppercase tracking-wider">Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {pastWinners.slice(page * perPage, (page + 1) * perPage).map((w, i) => (
                    <tr key={i} className="border-t border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4 text-white/60 text-sm">{w.date}</td>
                      <td className="px-6 py-4 font-mono text-sm text-white/80">{w.winner}</td>
                      <td className="px-6 py-4 text-right font-bold text-[#FF4D00]">{w.prize}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-white/40 text-sm">Page {page + 1}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={(page + 1) * perPage >= pastWinners.length}
                className="p-2 rounded-lg bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
