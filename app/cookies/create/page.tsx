'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lightbulb, Hash, LinkIcon, ArrowRight, Wand2, ArrowLeft } from 'lucide-react';
import ParticleField from '@/components/shared/ParticleField';
import Header from '@/components/layout/Header';
import { validateXUrl } from '@/lib/cookies/cookieUtils';

const suggestions = [
  'Building in public, one step at a time',
  'The journey of a thousand miles begins with one block',
  'GM to everyone building the future',
  'Honoring the legacy, creating the future',
  'One cookie, infinite possibilities',
  'We make art now 🍦',
  'Born from the ashes, built for the future',
];

export default function CreateCookiePage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);

  const MAX_LENGTH = 200;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPostUrl(url);
    setIsValidUrl(validateXUrl(url));
  };

  const handleSuggest = () => {
    setMessage(suggestions[Math.floor(Math.random() * suggestions.length)]);
  };

  const handleNext = () => {
    if (!isValid) return;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieMessage', message);
      localStorage.setItem('cookiePostUrl', postUrl);
    }
    router.push('/cookies/preview');
  };

  const isValid = message.length > 0 && message.length <= MAX_LENGTH && isValidUrl;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      <ParticleField density={80} color="#FF4D00" />
      <Header />

      <div className="relative z-10 container mx-auto px-4 py-32 max-w-2xl">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl mb-8 text-center"
          style={{ fontFamily: 'var(--font-permanent-marker)' }}
        >
          <span className="text-3xl">🍪</span>{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Create Your Cookie
          </span>{' '}
          <span className="text-3xl">🍦</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/10 p-8 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Wand2 className="w-6 h-6 text-orange-400" />
            <h3 className="text-2xl text-white" style={{ fontFamily: 'var(--font-permanent-marker)' }}>
              Compose
            </h3>
          </div>

          {/* Message Input */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-white/60 mb-3 text-sm font-semibold">
              <span className="text-xl">🍦</span> Your Message
            </label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your meaningful message here..."
                maxLength={MAX_LENGTH}
                rows={4}
                className="w-full bg-[#0a0a0a]/80 border-2 border-white/10 focus:border-[#FF4D00]/50 rounded-2xl p-4 text-white placeholder:text-white/20 resize-none transition-all duration-300 focus:shadow-[0_0_25px_rgba(255,77,0,0.2)] outline-none text-base leading-relaxed"
              />
              <div className="absolute bottom-3 right-4">
                <span className={`text-sm font-mono ${message.length > MAX_LENGTH * 0.9 ? 'text-[#FF4D00]' : 'text-white/30'}`}>
                  {message.length}/{MAX_LENGTH}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSuggest}
              className="py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white font-semibold shadow-blue-500/20 shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <Lightbulb className="w-4 h-4" />
              Suggest
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const searchUrl = `https://x.com/search?q=%23NAKAGO&src=hashtag_click`;
                window.open(searchUrl, '_blank');
              }}
              className="py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white font-semibold shadow-purple-500/20 shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <Hash className="w-4 h-4" />
              Find #NAKAGO
            </motion.button>
          </div>

          {/* URL Input */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-white/60 mb-3 text-sm font-semibold">
              <LinkIcon className="w-4 h-4" />
              Post URL to Reply To
            </label>
            <div className="relative">
              <input
                type="url"
                value={postUrl}
                onChange={handleUrlChange}
                placeholder="https://x.com/user/status/123..."
                className="w-full bg-[#0a0a0a]/80 border-2 border-white/10 focus:border-cyan-500/50 rounded-2xl p-4 pr-12 text-white placeholder:text-white/20 transition-all duration-300 focus:shadow-[0_0_25px_rgba(0,245,255,0.15)] outline-none text-sm"
              />
              {postUrl && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
                >
                  {isValidUrl ? '✅' : '❌'}
                </motion.div>
              )}
            </div>
            <p className="text-white/30 text-xs mt-2">Must be a valid X/Twitter post URL</p>
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
            onClick={handleNext}
            disabled={!isValid}
            className="w-full py-5 rounded-full text-white text-lg font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontFamily: 'var(--font-permanent-marker)',
              background: isValid ? 'linear-gradient(135deg, #FF4D00, #FF0000)' : '#333',
              boxShadow: isValid ? '0 0 25px rgba(255,77,0,0.4)' : 'none',
            }}
          >
            Preview Cookie
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
