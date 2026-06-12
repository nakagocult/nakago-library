'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Images, Loader2, Wallet } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Insight } from 'thirdweb';
import { client, chain } from '@/lib/thirdweb/client';
import { NIPPO, FOUNDER_PASS, type DropConfig } from '@/lib/thirdweb/drops';
import { resolveCard } from '@/lib/nftCard';

const DROPS = [NIPPO, FOUNDER_PASS];

export default function ViewPage() {
  const { address } = useAccount();

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: '#111', border: '1px solid rgba(255,77,0,0.3)', boxShadow: '0 0 30px rgba(255,77,0,0.2)' }}
        >
          <Images className="h-8 w-8 text-[#FF4D00]" />
        </motion.div>
        <h1
          className="text-5xl font-black leading-none text-white md:text-6xl"
          style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
        >
<span className="text-gradient-fire">HOLDINGS</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/45">
          Everything the connected wallet holds across the Naka Go drops, read live from the
          contracts.
        </p>
      </div>

      {!address ? (
        <div className="flex flex-col items-center gap-5 py-10">
          <p className="text-sm text-white/50">Connect your wallet to see what you hold.</p>
          <div className="claim-connect">
            <ConnectButton label="Connect Wallet" />
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {DROPS.map((drop) => (
            <DropCollection key={drop.slug} drop={drop} owner={address} />
          ))}
        </div>
      )}
    </main>
  );
}

function DropCollection({ drop, owner }: { drop: DropConfig; owner: string }) {
  const { data: tokenIds, isLoading, isError, isFetching, error, refetch } = useQuery({
    queryKey: ['ownedTokenIds', drop.slug, owner],
    queryFn: async () => {
      // Insight indexer: returns the NFTs this wallet holds for the contract.
      // We only use the token id — name + artwork come from local nftMaps.
      const nfts = await Insight.getOwnedNFTs({
        client,
        chains: [chain],
        ownerAddress: owner,
        contractAddresses: [drop.contract.address],
      });
      return nfts.map((nft) => Number(nft.id)).sort((a, b) => a - b);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <h2
          className="text-2xl font-black text-white"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.03em' }}
        >
          {drop.title}
        </h2>
        {tokenIds && tokenIds.length > 0 && (
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-black"
            style={{ background: `${drop.accent[0]}1a`, border: `1px solid ${drop.accent[0]}40`, color: drop.accent[0] }}
          >
            {tokenIds.length} held
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-white/40">
          <Loader2 className="h-4 w-4 animate-spin" /> Reading your tokens…
        </div>
      ) : isError ? (
        <div className="py-6">
          <div className="flex items-center gap-3">
            <p className="text-sm text-white/40">Couldn’t load this collection.</p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-[#FF4D00] disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,77,0,0.25)', fontFamily: 'Bebas Neue, Impact, sans-serif' }}
            >
              {isFetching ? 'Retrying…' : 'Retry'}
            </button>
          </div>
          {error instanceof Error && (
            <p className="mt-2 max-w-lg break-words text-[11px] leading-relaxed text-white/25">
              {error.message}
            </p>
          )}
        </div>
      ) : !tokenIds || tokenIds.length === 0 ? (
        <div
          className="flex flex-col items-center gap-2 rounded-2xl py-10 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Wallet className="h-5 w-5 text-white/25" />
          <p className="text-sm text-white/40">None held yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {tokenIds.map((id) => (
            <OwnedCard key={id} tokenId={id} slug={drop.slug} accent={drop.accent} />
          ))}
        </div>
      )}
    </section>
  );
}

function OwnedCard({
  tokenId,
  slug,
  accent,
}: {
  tokenId: number;
  slug: DropConfig['slug'];
  accent: [string, string];
}) {
  const { label, sublabel, imgSrc } = resolveCard(slug, tokenId);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl"
      style={{ border: `1px solid ${accent[0]}40`, background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="relative aspect-square w-full">
        {imgSrc ? (
          <Image src={imgSrc} alt={label} fill className="object-cover" sizes="(max-width: 768px) 50vw, 220px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/20">#{tokenId}</div>
        )}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${accent[0]}55 0%, transparent 55%)` }}
        />
      </div>
      <div className="px-3 py-2.5">
        <p
          className="truncate text-sm font-black leading-tight text-white"
          style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
        >
          {label}
        </p>
        <div className="mt-1 flex items-center justify-between gap-1">
          <p className="truncate text-[10px] text-white/45">{sublabel}</p>
          <p className="shrink-0 text-[10px] text-white/25">#{tokenId}</p>
        </div>
      </div>
    </motion.div>
  );
}
