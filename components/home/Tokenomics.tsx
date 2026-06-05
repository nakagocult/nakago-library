'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, Lock, Flame, Users, Percent } from 'lucide-react';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS ?? '0x9AA41B74F3D87c3A27D49736692e70F175eFD420';

const trustBadges = [
  {
    Icon: Lock,
    title: 'Renounced',
    desc: 'Contract ownership renounced forever',
    glow: 'rgba(255,237,78,0.3)',
    border: 'rgba(255,237,78,0.4)',
    color: '#FFed4e',
  },
  {
    Icon: Percent,
    title: '0/0 Tax',
    desc: 'Zero buy tax. Zero sell tax. Ever.',
    glow: 'rgba(0,255,136,0.3)',
    border: 'rgba(0,255,136,0.4)',
    color: '#00FF88',
  },
  {
    Icon: Flame,
    title: 'LP Burnt',
    desc: '100% liquidity burned. Rug-proof.',
    glow: 'rgba(0,180,255,0.3)',
    border: 'rgba(0,180,255,0.4)',
    color: '#00B4FF',
  },
  {
    Icon: Users,
    title: 'Fair Launch',
    desc: 'No presale. No team allocation. Pure community.',
    glow: 'rgba(255,77,0,0.3)',
    border: 'rgba(255,77,0,0.4)',
    color: '#FF4D00',
  },
];

export default function Tokenomics() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="tokenomics" className="py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl mb-4"
            style={{
              fontFamily: 'var(--font-permanent-marker)',
              background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Fair Launch. Zero Tax. 100% Community.
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Total Supply: 1,000,000,000 $NAKA
          </p>
        </motion.div>

        {/* Contract Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 max-w-2xl mx-auto"
        >
          <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Contract Address</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-[#FF4D00] text-sm font-mono break-all">
                {CONTRACT_ADDRESS}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={`https://etherscan.io/token/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustBadges.map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.04 }}
              className="bg-[#1a1a1a] rounded-2xl p-6 cursor-default transition-all duration-300"
              style={{
                border: `1px solid ${badge.border}`,
                boxShadow: `0 0 20px ${badge.glow}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 35px ${badge.glow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${badge.glow}`;
              }}
            >
              <div className="mb-3" style={{ color: badge.color }}>
                <badge.Icon className="w-8 h-8" />
              </div>
              <h3
                className="text-xl text-white mb-2"
                style={{ fontFamily: 'var(--font-permanent-marker)' }}
              >
                {badge.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
