'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Loader2, Check, AlertCircle, ExternalLink } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ParticleField from '@/components/shared/ParticleField';
import SBT_ABI from '@/lib/contracts/abis/SBT.json';

const SBT_ADDRESS = (process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS ?? '0x9AA41B74F3D87c3A27D49736692e70F175eFD420') as `0x${string}`;

const sbtArtworks = [
  { id: 1, name: 'Naka Origin', rarity: 'Legendary', emoji: '🐕', mintCount: 48, desc: 'The founding spirit of Naka Go — born 1948.' },
  { id: 2, name: 'Akaishi Soul', rarity: 'Rare', emoji: '🔴', mintCount: 124, desc: 'The Akaishi bloodline that shaped 80%+ of Shibas.' },
  { id: 3, name: 'NIPPO Seal', rarity: 'Uncommon', emoji: '🏅', mintCount: 312, desc: 'Recognized by Nihon Ken Hozonkai.' },
  { id: 4, name: 'Ice Cream 🍦', rarity: 'Common', emoji: '🍦', mintCount: 888, desc: 'Community vibes. We make art now.' },
];

const rarityColors: Record<string, { color: string; glow: string }> = {
  Legendary: { color: '#FFD700', glow: 'rgba(255,215,0,0.4)' },
  Rare:       { color: '#00b4ff', glow: 'rgba(0,180,255,0.3)' },
  Uncommon:   { color: '#00ff88', glow: 'rgba(0,255,136,0.3)' },
  Common:     { color: '#FF4D00', glow: 'rgba(255,77,0,0.3)' },
};

type TxStatus = 'idle' | 'pending' | 'success' | 'error';

export default function M4ngaPage() {
  const { address, isConnected } = useAccount();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [txHash, setTxHash] = useState('');

  const { data: balance } = useReadContract({
    address: SBT_ADDRESS,
    abi: SBT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { writeContract } = useWriteContract({
    mutation: {
      onMutate: () => setTxStatus('pending'),
      onSuccess: (hash: string) => {
        setTxStatus('success');
        setTxHash(hash);
      },
      onError: () => setTxStatus('error'),
    },
  });

  const handleMint = () => {
    if (!address || selectedId === null) return;
    writeContract({
      address: SBT_ADDRESS,
      abi: SBT_ABI,
      functionName: 'mint',
      args: [address],
    });
  };

  const selectedArt = sbtArtworks.find((a) => a.id === selectedId);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="relative overflow-hidden">
        <ParticleField density={60} color="#FF4D00" />
        <Header />

        <div className="relative z-10 container mx-auto px-4 py-32 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-[#FF4D00] text-sm font-bold uppercase tracking-widest mb-3 block">
              Soul-Bound Tokens
            </span>
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
              M4nga SBT
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Mint a Soul-Bound Token honoring Naka Go&apos;s legacy. Non-transferable. Eternal.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="text-white/50 text-xs font-mono">Contract:</span>
              <a
                href={`https://etherscan.io/address/${SBT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF4D00] text-xs font-mono hover:underline flex items-center gap-1"
              >
                {SBT_ADDRESS.slice(0, 10)}…{SBT_ADDRESS.slice(-6)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>

          {/* SBT Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {sbtArtworks.map((art, i) => {
              const rc = rarityColors[art.rarity];
              const isSelected = selectedId === art.id;
              return (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.04, y: -4 }}
                  onClick={() => setSelectedId(art.id)}
                  className="rounded-2xl p-6 cursor-pointer transition-all duration-300"
                  style={{
                    background: '#111',
                    border: `2px solid ${isSelected ? rc.color : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: isSelected ? `0 0 30px ${rc.glow}` : `0 0 15px rgba(0,0,0,0.3)`,
                  }}
                >
                  <div className="text-6xl mb-4 text-center">{art.emoji}</div>
                  <h3
                    className="text-lg text-white text-center mb-1"
                    style={{ fontFamily: 'var(--font-permanent-marker)' }}
                  >
                    {art.name}
                  </h3>
                  <div
                    className="text-xs font-bold text-center mb-3 uppercase tracking-widest"
                    style={{ color: rc.color }}
                  >
                    {art.rarity}
                  </div>
                  <p className="text-white/40 text-xs text-center leading-relaxed mb-3">{art.desc}</p>
                  <div className="text-white/30 text-xs text-center">{art.mintCount} minted</div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-3 flex items-center justify-center gap-1"
                      style={{ color: rc.color }}
                    >
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-bold">Selected</span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Mint Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <div
              className="rounded-3xl p-8 text-center"
              style={{ background: '#111', border: '1px solid rgba(255,77,0,0.2)', boxShadow: '0 0 30px rgba(255,77,0,0.1)' }}
            >
              {selectedArt ? (
                <>
                  <div className="text-5xl mb-3">{selectedArt.emoji}</div>
                  <h3
                    className="text-2xl text-white mb-1"
                    style={{ fontFamily: 'var(--font-permanent-marker)' }}
                  >
                    {selectedArt.name}
                  </h3>
                  <div
                    className="text-sm font-bold mb-6 uppercase tracking-widest"
                    style={{ color: rarityColors[selectedArt.rarity].color }}
                  >
                    {selectedArt.rarity}
                  </div>
                </>
              ) : (
                <div className="text-white/30 mb-6 py-4">
                  <div className="text-4xl mb-2">👆</div>
                  <p>Select an SBT above to mint</p>
                </div>
              )}

              {!isConnected ? (
                <div className="flex justify-center">
                  <ConnectButton />
                </div>
              ) : txStatus === 'pending' ? (
                <div className="flex items-center justify-center gap-3 py-4 text-white/70">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Loader2 className="w-6 h-6 text-[#FF4D00]" />
                  </motion.div>
                  <span>Transaction pending…</span>
                </div>
              ) : txStatus === 'success' ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-2 text-green-400 text-lg font-bold">
                    <Check className="w-6 h-6" /> SBT Minted! 🎉
                  </div>
                  {txHash && (
                    <a
                      href={`https://etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF4D00] text-sm hover:underline flex items-center justify-center gap-1"
                    >
                      View on Etherscan <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    onClick={() => { setTxStatus('idle'); setSelectedId(null); }}
                    className="text-white/50 text-sm hover:text-white transition-colors"
                  >
                    Mint another
                  </button>
                </motion.div>
              ) : txStatus === 'error' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" /> Transaction failed
                  </div>
                  <button
                    onClick={() => setTxStatus('idle')}
                    className="text-white/50 text-sm hover:text-white transition-colors"
                  >
                    Try again
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={selectedId ? { scale: 1.05 } : {}}
                  whileTap={selectedId ? { scale: 0.97 } : {}}
                  onClick={handleMint}
                  disabled={!selectedId}
                  className="w-full py-4 rounded-full text-white font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'var(--font-permanent-marker)',
                    background: selectedId ? 'linear-gradient(135deg, #FF4D00, #FF0000)' : '#333',
                    boxShadow: selectedId ? '0 0 25px rgba(255,77,0,0.5)' : 'none',
                  }}
                >
                  Mint SBT — Free
                </motion.button>
              )}

              {isConnected && balance != null && (
                <p className="text-white/30 text-xs mt-4">
                  You own {String(balance)} SBT{Number(balance) !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
