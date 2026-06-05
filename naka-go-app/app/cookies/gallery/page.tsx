'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Sparkles, Moon } from 'lucide-react';
import Header from '@/components/layout/Header';
import ParticleField from '@/components/shared/ParticleField';

const mockCookies = [
  { id: 1, creator: '@n4kaishi8a', message: 'Building in public, one block at a time 🍦', likes: 42, event: 'Full Moon', date: '2025-03-18' },
  { id: 2, creator: '@nakago_cult', message: 'Honoring the legend, creating the future', likes: 28, event: 'Regular', date: '2025-03-20' },
  { id: 3, creator: '@shibalov3r', message: 'GM to everyone building the future 🌅', likes: 55, event: 'Regular', date: '2025-03-21' },
  { id: 4, creator: '@web3_doge', message: 'The journey of a thousand miles begins with one block', likes: 33, event: 'Regular', date: '2025-03-22' },
  { id: 5, creator: '@moonwalker', message: 'We make art now 🍦🍦🍦', likes: 71, event: 'Full Moon', date: '2025-02-18' },
  { id: 6, creator: '@naka_rider', message: 'Born from the ashes of WWII, born again on-chain', likes: 19, event: 'Regular', date: '2025-03-23' },
  { id: 7, creator: '@cult_member', message: 'Every cookie is a story. Every story is a legacy.', likes: 44, event: 'Regular', date: '2025-03-24' },
  { id: 8, creator: '@ddergo_fan', message: 'Play the music. Feel the mutation.', likes: 26, event: 'Regular', date: '2025-03-25' },
];

type Filter = 'All' | 'Recent' | 'Popular' | 'Full Moon';

export default function CookieGalleryPage() {
  const [filter, setFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');

  const filtered = mockCookies
    .filter((c) => {
      if (filter === 'Popular') return c.likes >= 40;
      if (filter === 'Full Moon') return c.event === 'Full Moon';
      return true;
    })
    .filter((c) =>
      search === '' ||
      c.message.toLowerCase().includes(search.toLowerCase()) ||
      c.creator.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (filter === 'Popular') return b.likes - a.likes;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      <ParticleField density={60} color="#FF4D00" />
      <Header />

      <div className="relative z-10 container mx-auto px-4 py-32 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className="text-5xl md:text-6xl mb-4"
            style={{
              fontFamily: 'var(--font-permanent-marker)',
              background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🍪 Cookie Gallery
          </h1>
          <p className="text-white/50 text-lg">Community-crafted cookies from the NakaGo cult</p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search cookies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#FF4D00]/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(['All', 'Recent', 'Popular', 'Full Moon'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1 ${
                  filter === f
                    ? 'text-white'
                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                }`}
                style={
                  filter === f
                    ? { background: 'linear-gradient(135deg, #FF4D00, #FF0000)', boxShadow: '0 0 15px rgba(255,77,0,0.4)' }
                    : {}
                }
              >
                {f === 'Full Moon' && <Moon className="w-3 h-3" />}
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((cookie, i) => (
            <motion.div
              key={cookie.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="rounded-2xl bg-[#1a1a1a]/80 border border-white/10 p-6 cursor-pointer"
              style={{
                boxShadow: cookie.event === 'Full Moon'
                  ? '0 0 20px rgba(123,47,255,0.25)'
                  : '0 0 15px rgba(255,77,0,0.1)',
                borderColor: cookie.event === 'Full Moon' ? 'rgba(123,47,255,0.3)' : undefined,
              }}
            >
              {cookie.event === 'Full Moon' && (
                <div className="flex items-center gap-1 mb-3">
                  <Moon className="w-3 h-3 text-purple-400" />
                  <span className="text-purple-400 text-xs font-semibold">Full Moon</span>
                </div>
              )}
              <div className="space-y-2 mb-4">
                <p className="text-white/60 text-sm flex items-center gap-1">
                  <span>🍪</span> One message that counts
                </p>
                <p className="text-[#FF4D00] font-semibold text-sm flex items-start gap-1">
                  <span>{cookie.event === 'Full Moon' ? '🌕' : '🍦'}</span>
                  <span className="line-clamp-2">{cookie.message}</span>
                </p>
                <p className="text-white/60 text-sm flex items-center gap-1">
                  <span>🍪</span> Fill in your cream
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-white/40 text-xs">{cookie.creator}</span>
                <span className="text-white/40 text-xs flex items-center gap-1">
                  🔥 {cookie.likes}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">🍪</div>
            <p>No cookies found. Be the first!</p>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link
            href="/cookies/create"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold"
            style={{
              fontFamily: 'var(--font-permanent-marker)',
              background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
              boxShadow: '0 0 25px rgba(255,77,0,0.4)',
            }}
          >
            <Sparkles className="w-5 h-5" />
            Create Your Cookie
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
