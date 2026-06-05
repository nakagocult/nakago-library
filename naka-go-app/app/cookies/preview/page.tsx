'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MessageSquare, Share2, Copy, Sparkles, Check, ArrowLeft } from 'lucide-react';
import ParticleField from '@/components/shared/ParticleField';
import Header from '@/components/layout/Header';
import { extractTweetId, formatCookieText } from '@/lib/cookies/cookieUtils';
import { isFullMoon } from '@/lib/cookies/fullMoon';

function CookiePreviewCard({ message }: { message: string }) {
  const fullMoon = isFullMoon();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
      style={{
        background: '#000',
        border: `2px solid ${fullMoon ? '#7B2FFF' : '#FF4D00'}`,
        boxShadow: fullMoon ? '0 0 40px rgba(123,47,255,0.4)' : '0 0 40px rgba(255,77,0,0.4)',
      }}
    >
      <div className="space-y-4 text-lg">
        <p className="text-white/90 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🍪</span>
          <span>Create one message that counts, for yourself</span>
        </p>
        <p className="flex items-start gap-3 font-semibold">
          <span className="text-2xl flex-shrink-0">{fullMoon ? '🌕' : '🍦'}</span>
          <span style={{ color: fullMoon ? '#9D50FF' : '#FF4D00' }}>
            {message || 'Your message here...'}
          </span>
        </p>
        <p className="text-white/90 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🍪</span>
          <span>Copy the cookies, and fill in your cream</span>
        </p>
        <div className="pt-4 border-t border-white/20">
          <p className="text-white/50 text-sm">#{fullMoon ? 'FullMoon ' : ''}NAKAGO</p>
          <p className="text-green-400 text-sm mt-1 flex items-center gap-2">
            <Check className="w-4 h-4" /> Ready to share!
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function PreviewCookiePage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessage = localStorage.getItem('cookieMessage');
      const savedUrl = localStorage.getItem('cookiePostUrl');
      if (!savedMessage || !savedUrl) {
        router.push('/cookies/create');
        return;
      }
      setMessage(savedMessage);
      setPostUrl(savedUrl);
    }
  }, [router]);

  const cookieText = formatCookieText(message, isFullMoon());

  const handleXReply = () => {
    const tweetId = extractTweetId(postUrl);
    if (!tweetId) return;
    window.open(`https://twitter.com/intent/tweet?in_reply_to=${tweetId}&text=${encodeURIComponent(cookieText)}`, '_blank');
  };

  const handleQuoteRepost = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(cookieText)}&url=${encodeURIComponent(postUrl)}`, '_blank');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cookieText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actionButtons = [
    {
      label: 'X Reply',
      icon: <MessageSquare className="w-5 h-5" />,
      onClick: handleXReply,
      from: '#FF4D00',
      to: '#FF0000',
      glow: 'rgba(255,77,0,0.35)',
    },
    {
      label: 'X Quote Repost',
      icon: <Share2 className="w-5 h-5" />,
      onClick: handleQuoteRepost,
      from: '#EAB308',
      to: '#F97316',
      glow: 'rgba(234,179,8,0.35)',
    },
    {
      label: copied ? 'Copied! ✓' : 'Copy Cookie',
      icon: copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />,
      onClick: handleCopy,
      from: '#92400E',
      to: '#B45309',
      glow: 'rgba(146,64,14,0.4)',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      <ParticleField density={60} color="#FF4D00" />
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

        {/* Share Buttons */}
        <div className="space-y-4 mb-10">
          {actionButtons.map((btn, i) => (
            <motion.button
              key={btn.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={btn.onClick}
              className="w-full py-5 rounded-full text-white text-lg font-bold flex items-center justify-center gap-3"
              style={{
                fontFamily: 'var(--font-permanent-marker)',
                background: `linear-gradient(135deg, ${btn.from}, ${btn.to})`,
                boxShadow: `0 0 25px ${btn.glow}`,
              }}
            >
              {btn.icon}
              {btn.label}
            </motion.button>
          ))}
        </div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <h3 className="text-2xl text-white" style={{ fontFamily: 'var(--font-permanent-marker)' }}>
              Preview
            </h3>
          </div>
          <CookiePreviewCard message={message} />
        </motion.div>

        {/* MUTATE Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/cookies/mutate')}
          className="w-full py-6 rounded-full text-xl text-white font-bold flex items-center justify-center gap-3"
          style={{
            fontFamily: 'var(--font-permanent-marker)',
            background: 'linear-gradient(135deg, #00F5FF, #FF0066)',
            boxShadow: '0 0 40px rgba(0,245,255,0.4)',
          }}
        >
          <span className="text-2xl">🎮</span>
          MUTATE!
        </motion.button>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex items-center justify-center gap-3 text-white/40 text-sm"
        >
          <span className="text-[#FF4D00] font-bold" style={{ fontFamily: 'var(--font-permanent-marker)' }}>
            NakaGo Community
          </span>
          <span style={{ fontFamily: 'var(--font-noto-sans-jp)' }}>中号</span>
          <span>🍦</span>
        </motion.footer>
      </div>
    </div>
  );
}
