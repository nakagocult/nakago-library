'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, Loader2, CheckCircle2, AlertTriangle, Wallet } from 'lucide-react';
import { ClaimButton } from 'thirdweb/react';
import { toEther } from 'thirdweb';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { client, chain } from '@/lib/thirdweb/client';
import type { DropConfig } from '@/lib/thirdweb/drops';
import { useDropStats } from '@/lib/thirdweb/useDropStats';
import SuccessBurst from './SuccessBurst';
import MintReveal from './MintReveal';

// ERC-721 Transfer(address,address,uint256) topic
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const ZERO_PAD = '0x0000000000000000000000000000000000000000000000000000000000000000';

function parseMintedIds(
  logs: readonly { topics: readonly string[]; address: string }[],
  contractAddress: string,
): number[] {
  return logs
    .filter(
      (log) =>
        log.address.toLowerCase() === contractAddress.toLowerCase() &&
        log.topics[0] === TRANSFER_TOPIC &&
        log.topics[1] === ZERO_PAD,
    )
    .map((log) => Number(BigInt(log.topics[3])));
}

type Status = 'idle' | 'pending' | 'success' | 'error';

interface ClaimConsoleProps {
  drop: DropConfig;
  maxPerTx: number;
}

export default function ClaimConsole({ drop, maxPerTx }: ClaimConsoleProps) {
  const { address } = useAccount();
  const stats = useDropStats(drop);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [mintedIds, setMintedIds] = useState<number[]>([]);

  const soldOut = !stats.loading && stats.claimed >= stats.total;
  const totalLabel =
    stats.priceWei != null
      ? `${trim(toEther(stats.priceWei * BigInt(quantity)))} ${stats.currencySymbol}`
      : null;

  const setQty = (next: number) => setQuantity(Math.max(1, Math.min(maxPerTx, next)));

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6"
      style={{
        background: 'rgba(17,17,17,0.72)',
        backdropFilter: 'blur(24px) saturate(160%)',
        border: `1px solid ${drop.accent[0]}33`,
        boxShadow: `0 0 40px ${drop.accent[0]}12, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {status === 'success' && <SuccessBurst colors={drop.accent} />}

      {/* Price row */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Price</p>
          <p
            className="text-3xl font-black leading-tight"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', color: '#fff' }}
          >
            {stats.priceLabel ?? '—'}
            <span className="ml-1 text-sm font-bold text-white/35">/ each</span>
          </p>
        </div>
        <p className="text-right text-[11px] text-white/35">≈ ${drop.referenceUsd} each<br />paid on-chain</p>
      </div>

      {/* Quantity */}
      <div className="mb-5">
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/40">Quantity</p>
        <div className="flex items-center justify-between rounded-2xl px-2 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <QtyBtn onClick={() => setQty(quantity - 1)} disabled={quantity <= 1} accent={drop.accent[0]}>
            <Minus className="h-4 w-4" />
          </QtyBtn>
          <div className="text-center">
            <span className="text-2xl font-black text-white" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
              {quantity}
            </span>
            {totalLabel && <p className="text-[11px] text-white/40">{totalLabel} total</p>}
          </div>
          <QtyBtn onClick={() => setQty(quantity + 1)} disabled={quantity >= maxPerTx} accent={drop.accent[0]}>
            <Plus className="h-4 w-4" />
          </QtyBtn>
        </div>
        <p className="mt-1.5 text-right text-[10px] text-white/30">Max {maxPerTx} per transaction</p>
      </div>

      {/* Action */}
      <div className="relative z-20">
        {soldOut ? (
          <div className="rounded-2xl py-4 text-center text-sm font-black uppercase tracking-[0.2em] text-white/50" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            Fully Claimed
          </div>
        ) : !address ? (
          <div className="claim-connect flex justify-center">
            <ConnectButton label="Connect Wallet to Claim" />
          </div>
        ) : (
          <ClaimButton
            contractAddress={drop.contract.address}
            chain={chain}
            client={client}
            claimParams={{ type: 'ERC721', quantity: BigInt(quantity) }}
            unstyled
            className="claim-action"
            disabled={status === 'pending'}
            onClick={() => {
              setStatus('pending');
              setErrorMsg('');
              setMintedIds([]);
            }}
            onTransactionConfirmed={(receipt) => {
              setStatus('success');
              setMintedIds(parseMintedIds(receipt.logs, drop.contract.address));
            }}
            onError={(err) => {
              setStatus('error');
              setErrorMsg(humanizeError(err.message));
            }}
          >
            {status === 'pending' ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Confirming…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Wallet className="h-4 w-4" /> Claim {quantity > 1 ? `${quantity} NFTs` : 'NFT'}
              </span>
            )}
          </ClaimButton>
        )}
      </div>

      {/* Status messages */}
      <AnimatePresence mode="wait">
        {status === 'success' && (
          <>
            <StatusNote key="ok" tone="ok">
              <CheckCircle2 className="h-4 w-4" /> Mint confirmed — welcome to the swarm.
            </StatusNote>
            <MintReveal drop={drop} tokenIds={mintedIds} />
          </>
        )}
        {status === 'error' && (
          <StatusNote key="err" tone="err">
            <AlertTriangle className="h-4 w-4" /> {errorMsg || 'Transaction failed. Try again.'}
          </StatusNote>
        )}
      </AnimatePresence>

      {address && (
        <p className="mt-3 text-center text-[10px] text-white/25">
          Connected {address.slice(0, 6)}…{address.slice(-4)}
        </p>
      )}
    </div>
  );
}

function QtyBtn({ children, onClick, disabled, accent }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; accent: string }) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors disabled:opacity-30"
      style={{ background: disabled ? 'rgba(255,255,255,0.04)' : `${accent}1f`, border: `1px solid ${disabled ? 'rgba(255,255,255,0.08)' : accent + '55'}` }}
    >
      {children}
    </motion.button>
  );
}

function StatusNote({ children, tone }: { children: React.ReactNode; tone: 'ok' | 'err' }) {
  const color = tone === 'ok' ? '#00FF88' : '#FF5555';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="mt-3 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-center text-xs font-bold"
      style={{ background: `${color}12`, border: `1px solid ${color}40`, color }}
    >
      {children}
    </motion.div>
  );
}

function trim(value: string): string {
  if (!value.includes('.')) return value;
  return value.replace(/\.?0+$/, '');
}

function humanizeError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('insufficient')) return 'Insufficient funds for this claim.';
  if (m.includes('user rejected') || m.includes('denied')) return 'Transaction rejected in wallet.';
  if (m.includes('exceed') || m.includes('limit')) return 'Claim limit reached for this wallet.';
  return message.length > 120 ? `${message.slice(0, 117)}…` : message;
}
