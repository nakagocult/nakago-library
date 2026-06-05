'use client';

import { useState } from 'react';
import { ClaimButton, ConnectButton, useActiveAccount } from 'thirdweb/react';
import { toEther } from 'thirdweb';
import { chain, client } from '@/lib/thirdweb/client';
import type { DropConfig } from '@/lib/thirdweb/drops';
import { useDropStats } from '@/lib/thirdweb/useDropStats';

type Status = 'idle' | 'pending' | 'success' | 'error';

interface ClaimConsoleProps {
  drop: DropConfig;
  maxPerTx: number;
}

export default function ClaimConsole({ drop, maxPerTx }: ClaimConsoleProps) {
  const account = useActiveAccount();
  const stats = useDropStats(drop);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const soldOut = !stats.loading && stats.claimed >= stats.total;
  const totalLabel =
    stats.priceWei != null
      ? `${trim(toEther(stats.priceWei * BigInt(quantity)))} ${stats.currencySymbol}`
      : null;

  const setQty = (next: number) => setQuantity(Math.max(1, Math.min(maxPerTx, next)));

  return (
    <div className="rounded-lg border border-white/10 bg-black/35 p-4">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Price</p>
          <p className="mt-1 text-2xl font-black text-white">
            {stats.priceLabel ?? 'Reading...'}
            <span className="ml-1 text-sm font-medium text-white/35">each</span>
          </p>
        </div>
        <p className="text-right text-xs leading-5 text-white/40">Ref. ${drop.referenceUsd}</p>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Quantity</p>
          <p className="text-xs text-white/35">Max {maxPerTx}</p>
        </div>
        <div className="grid grid-cols-[52px_1fr_52px] overflow-hidden rounded-lg border border-white/10">
          <QtyButton onClick={() => setQty(quantity - 1)} disabled={quantity <= 1}>
            -
          </QtyButton>
          <div className="flex min-h-[52px] flex-col items-center justify-center bg-white/[0.03]">
            <span className="text-xl font-black text-white">{quantity}</span>
            {totalLabel && <span className="text-xs text-white/40">{totalLabel} total</span>}
          </div>
          <QtyButton onClick={() => setQty(quantity + 1)} disabled={quantity >= maxPerTx}>
            +
          </QtyButton>
        </div>
      </div>

      {soldOut ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-white/50">
          Fully claimed
        </div>
      ) : !account ? (
        <div className="claim-connect">
          <ConnectButton
            client={client}
            chain={chain}
            connectButton={{ label: 'Connect Wallet' }}
          />
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
          }}
          onTransactionConfirmed={() => setStatus('success')}
          onError={(err) => {
            setStatus('error');
            setErrorMsg(humanizeError(err.message));
          }}
        >
          {status === 'pending' ? 'Confirming...' : `Mint ${quantity}`}
        </ClaimButton>
      )}

      {status === 'success' && (
        <p className="mt-3 rounded-lg border border-[#00ff88]/30 bg-[#00ff88]/10 px-3 py-2 text-center text-sm font-bold text-[#00ff88]">
          Mint confirmed.
        </p>
      )}
      {status === 'error' && (
        <p className="mt-3 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-center text-sm font-bold text-red-200">
          {errorMsg || 'Transaction failed. Try again.'}
        </p>
      )}
      {account && (
        <p className="mt-3 text-center text-xs text-white/35">
          Connected {account.address.slice(0, 6)}...{account.address.slice(-4)}
        </p>
      )}
    </div>
  );
}

function QtyButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="min-h-[52px] bg-white/[0.06] text-xl font-black text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function trim(value: string): string {
  if (!value.includes('.')) return value;
  return value.replace(/\.?0+$/, '');
}

function humanizeError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('insufficient')) return 'Insufficient funds for this mint.';
  if (m.includes('user rejected') || m.includes('denied')) return 'Transaction rejected in wallet.';
  if (m.includes('exceed') || m.includes('limit')) return 'Mint limit reached for this wallet.';
  return message.length > 120 ? `${message.slice(0, 117)}...` : message;
}
