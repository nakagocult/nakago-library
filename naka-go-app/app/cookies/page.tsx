'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Users, ArrowRight } from 'lucide-react';
import ParticleField from '@/components/shared/ParticleField';
import Header from '@/components/layout/Header';
import { isFullMoon, daysUntilFullMoon } from '@/lib/cookies/fullMoon';

function FullMoonIndicator() {
  const isFull = isFullMoon();
  const daysLeft = daysUntilFullMoon();

  if (!isFull && daysLeft > 7) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 text-center"
    >
      {isFull ? (
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full shadow-lg shadow-purple-500/50">
          <span className="text-3xl animate-pulse">🌕</span>
          <span className="text-white font-bold" style={{ fontFamily: 'var(--font-permanent-marker)' }}>
            FULL MOON EVENT ACTIVE!
          </span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur border border-purple-500/30 rounded-full">
          <span className="text-2xl">🌙</span>
          <span className="text-purple-300 font-semibold">Full Moon in {daysLeft} days</span>
        </div>
      )}
    </motion.div>
  );
}

export default function CookiesPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      <ParticleField density={100} color="#FF4D00" />
      <Header />

      <div className="relative z-10 container mx-auto px-4 py-32 max-w-3xl">
        {/* Header badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-3">
            <span className="text-white/50 text-sm">@nakago</span>
            <span className="text-white/30 text-sm">·</span>
            <span className="text-white/30 text-sm">{new Date().toLocaleDateString()}</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full text-white text-sm font-semibold shadow-lg shadow-purple-500/30"
          >
            VoV
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl mb-12 text-center"
          style={{
            fontFamily: 'var(--font-permanent-marker)',
            background: 'linear-gradient(135deg, #FF4D00 0%, #FF0000 50%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          This story is called
          <br />
          Cookies &apos;n&apos; Cream
        </motion.h1>

        {/* Cookie Frame Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 group"
        >
          <div className="relative overflow-hidden rounded-3xl bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/10 p-8 shadow-2xl hover:shadow-[0_0_50px_rgba(255,77,0,0.2)] transition-all duration-500">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <h2 className="text-2xl text-white" style={{ fontFamily: 'var(--font-permanent-marker)' }}>
                Frame
              </h2>
            </div>
            <div className="space-y-4 text-lg">
              {[
                { emoji: '🍪', text: 'Create one message that counts, for yourself', accent: false },
                { emoji: '🍦', text: '[Add your message here]', accent: true },
                { emoji: '🍪', text: 'Copy the cookies, and fill in your cream', accent: false },
              ].map((item, i) => (
                <motion.p
                  key={i}
                  whileHover={{ x: 4 }}
                  className={`flex items-start gap-3 ${item.accent ? 'text-[#FF4D00] font-semibold italic' : 'text-white/90'}`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span>{item.text}</span>
                </motion.p>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/40 text-sm">#NAKAGO</p>
            </div>
          </div>
        </motion.div>

        {/* Rules Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12 group"
        >
          <div className="relative overflow-hidden rounded-3xl bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/10 p-8 shadow-2xl hover:shadow-[0_0_50px_rgba(0,245,255,0.15)] transition-all duration-500">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-cyan-400" />
              <h2 className="text-2xl text-white" style={{ fontFamily: 'var(--font-permanent-marker)' }}>
                Tend to the Thread
              </h2>
            </div>
            <ol className="space-y-4 text-white/80">
              {[
                'Gather links to your favorite posts',
                'Send a Frame only if more than an hour has passed',
                'Send only one Frame each',
              ].map((rule, i) => (
                <motion.li key={i} whileHover={{ x: 4 }} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-cyan-500/30">
                    {i + 1}
                  </span>
                  <span className="pt-1">{rule}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/cookies/create')}
          className="w-full py-6 rounded-full text-xl text-white font-bold flex items-center justify-center gap-3"
          style={{
            fontFamily: 'var(--font-permanent-marker)',
            background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
            boxShadow: '0 0 30px rgba(255,77,0,0.5)',
          }}
        >
          <Sparkles className="w-6 h-6" />
          Create Your Cookie
          <ArrowRight className="w-6 h-6" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-6 text-center"
        >
          <Link
            href="/cookies/gallery"
            className="text-white/40 hover:text-white/70 text-sm transition-colors underline underline-offset-4"
          >
            Browse the Cookie Gallery →
          </Link>
        </motion.div>

        <FullMoonIndicator />
      </div>
    </div>
  );
}
