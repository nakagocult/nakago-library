'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Send, ExternalLink } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ParticleField from '@/components/shared/ParticleField';
import { SPOTIFY_EMBED } from '@/lib/utils/constants';

const PLAYLIST_URL = 'https://open.spotify.com/playlist/3PGFWI7Ms2PHZXbadbfhh4?si=AivBt82gSl-XGV70EFFQlQ';

const mockTracks = [
  { title: 'Shiba Spirit', artist: 'Ddergo', duration: '3:42', emoji: '🐕' },
  { title: 'Midnight Mutation', artist: 'Naka Collective', duration: '4:11', emoji: '🌙' },
  { title: 'Ice Cream Dreams', artist: 'VoV', duration: '2:58', emoji: '🍦' },
  { title: 'Akaishi Sunrise', artist: 'Ddergo', duration: '5:03', emoji: '🌅' },
  { title: 'Cookie Cult', artist: 'n4kaishi8a', duration: '3:27', emoji: '🍪' },
  { title: 'Pulse Cycle', artist: 'Naka Collective', duration: '6:14', emoji: '🔴' },
  { title: 'NIPPO Anthem', artist: 'Ddergo feat. VoV', duration: '4:45', emoji: '🏅' },
  { title: 'Born 1948', artist: 'Naka Go Records', duration: '3:55', emoji: '🎌' },
];

export default function DdergoPage() {
  const [suggestion, setSuggestion] = useState({ name: '', url: '', why: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setSuggestion({ name: '', url: '', why: '' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="relative overflow-hidden">
        <ParticleField density={50} color="#FF4D00" />
        <Header />

        <div className="relative z-10 container mx-auto px-4 py-32 max-w-5xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="text-6xl mb-4">🍦</div>
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
              Ddergo Records
            </h1>
            <p className="text-white/50 text-xl mb-2">The official Naka Go playlist</p>
            <p className="text-white/30 text-sm">Curated vibes from the cult 🍦</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {/* Spotify Embed */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-5 h-5 text-[#FF4D00]" />
                <h2 className="text-xl text-white font-bold" style={{ fontFamily: 'var(--font-permanent-marker)' }}>
                  Now Playing
                </h2>
                <a
                  href={PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-white/30 hover:text-[#FF4D00] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 0 30px rgba(255,77,0,0.2)' }}
              >
                <iframe
                  src={SPOTIFY_EMBED}
                  width="100%"
                  height="450"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Ddergo Records Playlist"
                />
              </div>
            </motion.div>

            {/* Track Listing */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl text-white font-bold mb-4" style={{ fontFamily: 'var(--font-permanent-marker)' }}>
                Tracklist
              </h2>
              <div className="space-y-2">
                {mockTracks.map((track, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    whileHover={{ x: 4, backgroundColor: 'rgba(255,77,0,0.08)' }}
                    className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <span className="text-2xl w-8 text-center">{track.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{track.title}</p>
                      <p className="text-white/40 text-xs truncate">{track.artist}</p>
                    </div>
                    <span className="text-white/30 text-xs font-mono flex-shrink-0">{track.duration}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Visualizer placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 rounded-3xl overflow-hidden"
            style={{ border: '1px solid rgba(255,77,0,0.15)', background: '#111' }}
          >
            <div className="p-8 text-center">
              <div className="flex items-end justify-center gap-1 h-16 mb-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 rounded-t-sm"
                    style={{ background: 'linear-gradient(135deg, #FF4D00, #FF0000)' }}
                    animate={{
                      height: [
                        `${Math.random() * 40 + 10}px`,
                        `${Math.random() * 60 + 10}px`,
                        `${Math.random() * 20 + 10}px`,
                      ],
                    }}
                    transition={{
                      duration: 0.8 + Math.random() * 0.4,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
              <p className="text-white/40 text-sm">🎵 Audio visualizer — plays along with the music</p>
            </div>
          </motion.div>

          {/* Suggest a Track */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <div
              className="rounded-3xl p-8"
              style={{ background: '#111', border: '1px solid rgba(255,77,0,0.2)', boxShadow: '0 0 25px rgba(255,77,0,0.08)' }}
            >
              <h2
                className="text-2xl text-white mb-6 text-center"
                style={{ fontFamily: 'var(--font-permanent-marker)' }}
              >
                🎵 Suggest a Track
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-4"
                >
                  <div className="text-4xl mb-2">🍦</div>
                  <p className="text-green-400 font-bold">Track submitted! Thanks fren.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-white/50 text-sm mb-1.5 block">Your Name / Handle</label>
                    <input
                      type="text"
                      placeholder="@yourhandle"
                      value={suggestion.name}
                      onChange={(e) => setSuggestion((p) => ({ ...p, name: e.target.value }))}
                      required
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 outline-none focus:border-[#FF4D00]/50 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-1.5 block">Spotify / SoundCloud URL</label>
                    <input
                      type="url"
                      placeholder="https://open.spotify.com/track/..."
                      value={suggestion.url}
                      onChange={(e) => setSuggestion((p) => ({ ...p, url: e.target.value }))}
                      required
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 outline-none focus:border-[#FF4D00]/50 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-1.5 block">Why does it fit the Naka vibe?</label>
                    <textarea
                      rows={3}
                      placeholder="It goes hard and feels like 1948 Japan..."
                      value={suggestion.why}
                      onChange={(e) => setSuggestion((p) => ({ ...p, why: e.target.value }))}
                      required
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 outline-none focus:border-[#FF4D00]/50 transition-colors text-sm resize-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full py-4 rounded-full text-white font-bold flex items-center justify-center gap-2"
                    style={{
                      fontFamily: 'var(--font-permanent-marker)',
                      background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
                      boxShadow: '0 0 20px rgba(255,77,0,0.4)',
                    }}
                  >
                    <Send className="w-4 h-4" />
                    Submit Track
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
