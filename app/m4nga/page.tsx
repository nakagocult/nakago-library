'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ExternalLink, CheckCircle2, Loader2,
  ShieldCheck, Info, Sparkles, BookOpen, Users, Lock,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAccount, useChainId, useSwitchChain, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { parseAbi } from 'viem';

// ─── CONTRACT ─────────────────────────────────────────────────────────────────
const SBT_ADDRESS = '0x4e6eb6Ea74943a5d29C539974F518827C06eAcdE' as const;
const SBT_ABI = parseAbi([
  'function mint() external',
  'function balanceOf(address owner) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
]);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function shortAddr(addr: string) { return `${addr.slice(0, 6)}…${addr.slice(-4)}`; }

// ─── RELEASES ─────────────────────────────────────────────────────────────────
const RELEASES = [
  {
    id: 1,
    name: 'Genesis SBT',
    edition: 'Edition #001',
    description: 'The original Naka Go Soulbound Token. A permanent on-chain mark of being among the founding cult. Non-transferable, non-sellable — permanently yours.',
    image: 'https://i.ibb.co/B8zQgxk/IMG-7857.jpg',
    accent: '#FF4D00',
    tag: 'Open Mint',
    live: true,
  },
  {
    id: 2,
    name: 'Ddergo Records Pass',
    edition: 'Edition #002',
    description: 'For the cultured ear. Holders of this SBT carry eternal recognition as supporters of the Ddergo sound. Vibe credentials permanently on-chain.',
    image: 'https://i.ibb.co/B8zQgxk/IMG-7857.jpg',
    accent: '#1DB954',
    tag: 'Coming Soon',
    live: false,
  },
  {
    id: 3,
    name: 'Lore Keeper Seal',
    edition: 'Edition #003',
    description: 'Granted to those who carry the story. The Lore Keeper SBT is for scholars of Naka Go history — those who read, study, and spread the lore.',
    image: 'https://i.ibb.co/B8zQgxk/IMG-7857.jpg',
    accent: '#FFD700',
    tag: 'Coming Soon',
    live: false,
  },
] as const;

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function M4ngaPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const isMainnet = chainId === 1;
  const { openConnectModal } = useConnectModal();
  const { switchChain } = useSwitchChain();

  const { data: balanceData } = useReadContract({
    address: SBT_ADDRESS,
    abi: SBT_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address },
  });
  const alreadyMinted = balanceData ? balanceData > 0n : false;

  const { data: totalData } = useReadContract({
    address: SBT_ADDRESS,
    abi: SBT_ABI,
    functionName: 'totalSupply',
  });
  const totalMinted = totalData ? Number(totalData) : null;

  const { writeContractAsync, isPending } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [errorMsg, setErrorMsg] = useState('');
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const handleMint = async () => {
    setErrorMsg('');
    try {
      const hash = await writeContractAsync({
        address: SBT_ADDRESS,
        abi: SBT_ABI,
        functionName: 'mint',
      });
      setTxHash(hash);
    } catch (e: unknown) {
      const err = e as { code?: number | string; shortMessage?: string; message?: string };
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        setErrorMsg('Transaction rejected. Please confirm in your wallet.');
      } else {
        setErrorMsg(err.shortMessage ?? err.message ?? 'Mint failed. Please try again.');
      }
    }
  };

  const canMint = isConnected && isMainnet && !alreadyMinted && !isPending && !isConfirming && !isSuccess;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="container mx-auto px-4 py-28 max-w-4xl">

        {/* Back */}
        <Link href="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Home
          </motion.div>
        </Link>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="mb-5 flex justify-center">
            <div className="p-4 rounded-full" style={{ background: 'rgba(255,77,0,0.1)', border: '1px solid rgba(255,77,0,0.2)' }}>
              <ShieldCheck className="w-14 h-14 text-[#FF4D00]" style={{ filter: 'drop-shadow(0 0 20px rgba(255,77,0,0.5))' }} />
            </div>
          </motion.div>
          <span className="text-[#FF4D00] text-sm font-black uppercase tracking-[0.3em] mb-3 block" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
            Naka Go Soulbound Tokens
          </span>
          <h1 className="text-6xl md:text-7xl font-black text-white leading-none mb-4" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}>
            <span style={{ background: 'linear-gradient(135deg, #FF4D00, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>M4NGA</span> SBT
          </h1>
          <p className="text-white/40 text-base max-w-lg mx-auto leading-relaxed mb-4">
            Soulbound Tokens are non-transferable NFTs permanently tied to your wallet. They cannot be sold, traded, or transferred — only earned.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-white/30 text-xs font-mono">Contract:</span>
            <a href={`https://etherscan.io/address/${SBT_ADDRESS}`} target="_blank" rel="noopener noreferrer"
              className="text-[#FF4D00] text-xs font-mono hover:underline flex items-center gap-1">
              {shortAddr(SBT_ADDRESS)} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>

        {/* Explainer strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {[
            { Icon: ShieldCheck, label: 'Non-Transferable', desc: 'Tied to your wallet forever', color: '#FF4D00' },
            { Icon: Lock,        label: 'One Per Wallet',   desc: 'Each wallet mints once',    color: '#FFD700' },
            { Icon: Users,       label: 'Open Mint',        desc: 'No whitelist required',      color: '#00FF88' },
            { Icon: BookOpen,    label: 'On-Chain Forever', desc: 'Permanently on Ethereum',    color: '#00BFFF' },
          ].map(({ Icon, label, desc, color }) => (
            <div key={label} className="rounded-2xl p-4 text-center" style={{ background: '#111', border: `1px solid ${color}22` }}>
              <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} />
              <p className="text-white text-xs font-bold mb-1" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}>{label}</p>
              <p className="text-white/30 text-[10px] leading-snug">{desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Wallet bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: '#111', border: '1px solid rgba(255,77,0,0.2)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: isConnected && isMainnet ? '#00FF88' : isConnected ? '#FFD700' : '#555' }} />
            <span className="text-white text-sm font-bold">
              {isConnected && address
                ? `${shortAddr(address)}${!isMainnet ? ' · Wrong Network' : ''}`
                : 'Wallet not connected'}
            </span>
            {totalMinted != null && isConnected && (
              <span className="text-white/30 text-xs">· {totalMinted} minted</span>
            )}
          </div>

          {!isConnected && (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openConnectModal}
              className="px-6 py-2.5 rounded-full text-black text-sm font-black"
              style={{ background: 'linear-gradient(135deg, #FF4D00, #FFD700)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.1em' }}>
              Connect Wallet
            </motion.button>
          )}
          {isConnected && !isMainnet && (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => switchChain({ chainId: 1 })}
              className="px-6 py-2.5 rounded-full text-white text-sm font-black"
              style={{ background: '#FF4D00', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.1em' }}>
              Switch to Mainnet
            </motion.button>
          )}
          {isConnected && isMainnet && (
            <span className="text-[#00FF88] text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Connected
            </span>
          )}
        </motion.div>

        {/* Error */}
        {errorMsg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-6 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
            style={{ background: 'rgba(255,77,0,0.1)', border: '1px solid rgba(255,77,0,0.3)', color: '#FF6B6B' }}>
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" /> {errorMsg}
          </motion.div>
        )}

        {/* Releases */}
        <div className="space-y-6">
          {RELEASES.map((release, i) => (
            <motion.div
              key={release.id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-3xl overflow-hidden"
              style={{ background: '#0f0f0f', border: `1px solid ${release.accent}22`, boxShadow: `0 0 40px ${release.accent}08` }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-60 h-48 md:h-auto flex-shrink-0 relative overflow-hidden flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${release.accent}15, #0a0a1a)` }}>
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={release.image} alt={release.name}
                      className="w-32 h-32 rounded-full object-cover"
                      style={{ border: `3px solid ${release.accent}80`, filter: `drop-shadow(0 0 20px ${release.accent}60)` }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </motion.div>
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black"
                    style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${release.accent}50`, color: release.accent, fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
                    {release.edition}
                  </div>
                  <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${release.accent}10 0%, transparent 70%)` }} />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}>{release.name}</h2>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
                        style={{ background: release.live ? `${release.accent}22` : 'rgba(255,255,255,0.05)', color: release.live ? release.accent : '#555', border: `1px solid ${release.live ? release.accent + '44' : 'rgba(255,255,255,0.08)'}` }}>
                        {release.tag}
                      </span>
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed">{release.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Already minted */}
                    {release.live && alreadyMinted && (
                      <div className="flex items-center gap-2 text-[#00FF88] text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Already minted!
                        {txHash && <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white"><ExternalLink className="w-3.5 h-3.5" /></a>}
                      </div>
                    )}

                    {/* Success */}
                    {release.live && isSuccess && !alreadyMinted && (
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2 text-[#00FF88] text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Minted! It&apos;s yours forever.
                        {txHash && <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white"><ExternalLink className="w-3.5 h-3.5" /></a>}
                      </motion.div>
                    )}

                    {/* Mint button */}
                    {release.live && !alreadyMinted && !isSuccess && (
                      <motion.button
                        whileHover={canMint ? { scale: 1.04 } : {}}
                        whileTap={canMint ? { scale: 0.97 } : {}}
                        onClick={canMint ? handleMint : !isConnected ? openConnectModal : undefined}
                        disabled={isConnected && !canMint}
                        className="px-6 py-3 rounded-full text-sm font-black flex items-center gap-2 transition-all"
                        style={{
                          background: canMint || !isConnected ? `linear-gradient(135deg, ${release.accent}, ${release.accent}CC)` : 'rgba(255,255,255,0.06)',
                          color: canMint || !isConnected ? '#000' : '#555',
                          fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.12em',
                          cursor: isConnected && !canMint ? 'not-allowed' : 'pointer',
                          boxShadow: canMint || !isConnected ? `0 0 20px ${release.accent}40` : 'none',
                        }}
                      >
                        {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Confirm in Wallet…</>
                          : isConfirming ? <><Loader2 className="w-4 h-4 animate-spin" /> Confirming…</>
                          : !isConnected ? 'Connect to Mint'
                          : !isMainnet ? 'Switch to Mainnet'
                          : <><Sparkles className="w-4 h-4" /> Mint Free</>}
                      </motion.button>
                    )}

                    {/* Coming soon */}
                    {!release.live && (
                      <div className="px-6 py-3 rounded-full text-sm font-black text-white/20"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.12em' }}>
                        Coming Soon
                      </div>
                    )}

                    <a href={`https://etherscan.io/address/${SBT_ADDRESS}`} target="_blank" rel="noopener noreferrer"
                      className="text-white/20 hover:text-white/50 transition-colors ml-auto">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-12 rounded-2xl p-5 text-center" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Info className="w-4 h-4 text-white/20 mx-auto mb-2" />
          <p className="text-white/25 text-xs leading-relaxed max-w-md mx-auto">
            Naka Go SBTs are fully on-chain, permanently non-transferable ERC-721 tokens. Minting only requires ETH for gas.{' '}
            <a href={`https://etherscan.io/address/${SBT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-[#FF4D00] hover:underline">Verify on Etherscan</a>.
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
