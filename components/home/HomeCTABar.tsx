'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Wallet, ShoppingCart } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import BuyModal from '@/components/shared/BuyModal';

export default function HomeCTABar() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [buyOpen, setBuyOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="sticky top-9 z-40 flex items-center justify-center gap-3 py-3 px-4"
        style={{
          background: 'rgba(10,10,10,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,77,0,0.1)',
        }}
      >
        {/* Buy $NAKA */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setBuyOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white font-black text-xs"
          style={{
            background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
            boxShadow: '0 0 14px rgba(255,77,0,0.4)',
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            letterSpacing: '0.1em',
          }}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Buy $NAKA
        </motion.button>

        {/* Lore Lab */}
        <Link href="/lore-lab">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white/70 hover:text-white font-black text-xs transition-colors"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              letterSpacing: '0.1em',
            }}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FF4D00]" />
            Lore Lab
          </motion.div>
        </Link>

        {/* Wallet */}
        {isConnected && address ? (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => disconnect()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-xs"
            style={{
              background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.25)',
              color: '#00FF88',
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              letterSpacing: '0.08em',
            }}
            title="Click to disconnect"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            {address.slice(0, 4)}...{address.slice(-4)}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={openConnectModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white/60 hover:text-white font-black text-xs transition-colors"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              letterSpacing: '0.08em',
            }}
          >
            <Wallet className="w-3.5 h-3.5" />
            Connect Wallet
          </motion.button>
        )}
      </motion.div>

      <BuyModal isOpen={buyOpen} onClose={() => setBuyOpen(false)} />
    </>
  );
}
