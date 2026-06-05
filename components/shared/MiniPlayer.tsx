'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music2, X, ExternalLink } from 'lucide-react';
import { SPOTIFY_EMBED } from '@/lib/utils/constants';

const PLAYLIST_URL = 'https://open.spotify.com/playlist/3PGFWI7Ms2PHZXbadbfhh4?si=AivBt82gSl-XGV70EFFQlQ';

// Static bar heights to avoid Math.random() during render (ESLint purity)
const BAR_HEIGHTS = [55, 30, 75, 45, 90, 35, 65, 50, 80, 40, 70, 38];
const BAR_DURATIONS = [0.5, 0.7, 0.45, 0.6, 0.55, 0.75, 0.5, 0.65, 0.48, 0.7, 0.52, 0.68];
const BAR_DELAYS = [0, 0.1, 0.05, 0.15, 0.08, 0.12, 0.03, 0.18, 0.06, 0.14, 0.02, 0.1];

export default function MiniPlayer() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((o) => !o);

  return (
    <div className="relative">
      {/* Circle button */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        className="relative flex items-center justify-center rounded-full overflow-hidden"
        style={{
          width: 36,
          height: 36,
          background: open ? '#1DB954' : 'rgba(29,185,84,0.15)',
          border: `2px solid ${open ? '#1DB954' : 'rgba(29,185,84,0.4)'}`,
          boxShadow: open ? '0 0 14px rgba(29,185,84,0.6)' : '0 0 6px rgba(29,185,84,0.2)',
          transition: 'all 0.2s ease',
        }}
        title="DDERGO Vibes"
      >
        {open ? (
          // Animated equalizer bars when open
          <div className="flex items-end gap-[2px] h-4 px-1">
            {BAR_HEIGHTS.slice(0, 5).map((h, i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-t"
                style={{ background: '#000', minHeight: 3 }}
                animate={{ height: [`${20 + h * 0.4}%`, `${50 + h * 0.5}%`, `${20 + h * 0.3}%`] }}
                transition={{ duration: BAR_DURATIONS[i], repeat: Infinity, delay: BAR_DELAYS[i], repeatType: 'reverse' }}
              />
            ))}
          </div>
        ) : (
          <Music2 className="w-4 h-4 text-[#1DB954]" />
        )}

        {/* Pulse ring when open */}
        {open && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: '2px solid #1DB954' }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Mini player popup */}
      {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute top-12 left-0 z-[300] rounded-2xl overflow-hidden"
            style={{
              width: 280,
              background: '#0a0a0a',
              border: '1px solid rgba(29,185,84,0.3)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.8), 0 0 24px rgba(29,185,84,0.15)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                {/* Animated bars */}
                <div className="flex items-end gap-[2px] h-4">
                  {BAR_HEIGHTS.slice(0, 8).map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-[3px] rounded-t bg-[#1DB954]"
                      style={{ minHeight: 2 }}
                      animate={{ height: [`${15 + h * 0.3}%`, `${40 + h * 0.6}%`, `${15 + h * 0.2}%`] }}
                      transition={{ duration: BAR_DURATIONS[i], repeat: Infinity, delay: BAR_DELAYS[i], repeatType: 'reverse' }}
                    />
                  ))}
                </div>
                <span className="text-[#1DB954] text-[11px] font-black tracking-widest" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                  DDERGO VIBES
                </span>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded text-white/30 hover:text-white/70 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded text-white/30 hover:text-white/70 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Spotify iframe */}
            <iframe
              src={SPOTIFY_EMBED}
              width="280"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ border: 'none', display: 'block' }}
              title="Ddergo Mini Player"
            />
          </motion.div>
        )}
    </div>
  );
}
